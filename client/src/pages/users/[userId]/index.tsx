import { gql, useApolloClient } from "@apollo/client";
import { Box, BoxProps, Center, HStack, IconButton, Stack, VStack } from "@chakra-ui/react";
import { FC, useState } from "react";
import { BiLike, BiShare } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { animated, useSpring } from "react-spring";

import { Loading } from "../../../components/case/Loading";
import { BackButton } from "../../../components/common/BackButton";
import { useGlobal } from "../../../contexts/Global";
import {
  RandomUsersDocument,
  useLikeMutation,
  UserForUserPageFragment,
  useUserQuery,
} from "../../../graphql/generated";
import { AppLayout } from "../../../layouts/AppLayout";
import { routes } from "../../../routes";
import { assertDefined } from "../../../utils/assert-defined";

const Card: FC<BoxProps> = (props) => {
  return <Box w={{ base: "full", md: "lg" }} p="4" rounded="md" boxShadow="md" bg="white" {...props} />;
};

gql`
  mutation Like($userId: ID!) {
    like(userId: $userId) {
      id
      ...UserForUserPage
    }
  }
`;

gql`
  fragment UserForUserPage on User {
    id
    gender
    nickName
    age
    livingPref
    photoUrls
  }
`;

type UserPageTemplateProps = { user: UserForUserPageFragment };

const UserPageTemplate: FC<UserPageTemplateProps> = ({ user }) => {
  const navigate = useNavigate();
  const { searchedUsers } = useGlobal();

  const redirect = () => {
    const currIndex = searchedUsers.findIndex((u) => u.id === user.id);
    const nextUser = searchedUsers[currIndex + 1];
    if (nextUser) {
      navigate(routes["/users/:userId"].path({ userId: nextUser.id }));
    } else {
      navigate(routes["/users"].path());
    }
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const onClickRight = () => {
    if (activeImageIndex < user.photoUrls.length - 1) {
      setActiveImageIndex((prev) => prev + 1);
    }
  };
  const onClickLeft = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex((prev) => prev - 1);
    }
  };

  const client = useApolloClient();
  const [like] = useLikeMutation({
    variables: { userId: user.id },
  });

  const [imageStyles, imageStylesApi] = useSpring(() => ({ opacity: 0 }));
  const [liked, setLiked] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const resetAnimation = () => {
    setLiked(false);
    setSkipped(false);
    imageStylesApi.start({ opacity: 0 });
  };

  const onLike = async () => {
    client.cache.updateQuery({ query: RandomUsersDocument }, (data) => {
      return { randomUsers: data.randomUsers.filter((u: { id: string }) => u.id !== user.id) };
    });

    setLiked(true);
    imageStylesApi.start({ opacity: 0.85, config: { duration: 1_000 } });
    await like();

    setTimeout(() => {
      resetAnimation();
      redirect();
    }, 1_500);
  };

  const onSkip = () => {
    setSkipped(true);
    imageStylesApi.start({ opacity: 0.85, config: { duration: 1_000 } });

    setTimeout(() => {
      resetAnimation();
      redirect();
    }, 1_500);
  };

  return (
    <AppLayout footer={false} bg="gray.50">
      <VStack>
        <BackButton alignSelf="start" path={routes["/users"].path()} />

        <Card>
          <Stack spacing="4">
            <Box
              sx={{ aspectRatio: "1 / 1 " }}
              backgroundImage={`url(${user.photoUrls[activeImageIndex]})`}
              backgroundSize="cover"
              backgroundRepeat="no-repeat"
              position="relative"
            >
              <animated.div style={{ height: "100%", ...imageStyles }}>
                {liked && (
                  <Center position="absolute" h="full" w="full" bg="pink.50">
                    <VStack color="red.400">
                      <BiLike fontSize="64px" />
                      <Box fontWeight="bold" fontSize="2xl">
                        いいね！
                      </Box>
                    </VStack>
                  </Center>
                )}

                {skipped && (
                  <Center position="absolute" h="full" w="full" bg="gray.50">
                    <VStack color="gray.400">
                      <BiShare fontSize="64px" />
                      <Box fontWeight="bold" fontSize="2xl">
                        スキップ
                      </Box>
                    </VStack>
                  </Center>
                )}
              </animated.div>

              <HStack position="absolute" bottom="2" w="full" px="2">
                {user.photoUrls.map((_, i) => (
                  <Box key={i} flex="1" h="1" bg={i === activeImageIndex ? "white" : "gray.500"} />
                ))}
              </HStack>

              <Box position="absolute" top="0" left="0" w="50%" h="100%" cursor="pointer" onClick={onClickLeft} />
              <Box position="absolute" top="0" left="50%" w="50%" h="100%" cursor="pointer" onClick={onClickRight} />
            </Box>

            <Box>
              <Box fontWeight="bold" fontSize="2xl">
                {user.nickName}
              </Box>
              <HStack>
                <Box color="gray" fontWeight="bold">
                  {user.age}歳
                </Box>
                <Box color="gray" fontWeight="bold">
                  {user.livingPref}
                </Box>
                <Box color="gray" fontWeight="bold">
                  {user.gender === "MALE" ? "男性" : "女性"}
                </Box>
              </HStack>
            </Box>
          </Stack>
        </Card>
      </VStack>

      <HStack spacing="8" position="absolute" bottom="10" left="50%" transform="translateX(-50%)">
        <IconButton
          h="20"
          w="20"
          isRound
          boxShadow="md"
          aria-label="skip"
          icon={<BiShare fontSize="28px" />}
          onClick={onSkip}
          disabled={liked || skipped}
        />
        <IconButton
          colorScheme="secondary"
          h="20"
          w="20"
          isRound
          boxShadow="md"
          aria-label="like"
          icon={<BiLike fontSize="28px" />}
          onClick={onLike}
          disabled={liked || skipped}
        />
      </HStack>
    </AppLayout>
  );
};

gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      ...UserForUserPage
    }
  }
`;

export const UserPage: FC = () => {
  const { userId } = useParams();
  assertDefined(userId);
  const { data } = useUserQuery({ variables: { id: userId } });

  return data ? <UserPageTemplate user={data.user} /> : <Loading />;
};
