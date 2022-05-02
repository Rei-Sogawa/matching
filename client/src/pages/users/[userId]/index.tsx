import { gql } from "@apollo/client";
import { Box, BoxProps, Center, HStack, IconButton, Stack, VStack } from "@chakra-ui/react";
import { FC, useState } from "react";
import { BiLike, BiShare } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { animated, useSpring } from "react-spring";

import { BackButton } from "../../../components/common/BackButton";
import { UserForUserPageFragment, useUserQuery } from "../../../graphql/generated";
import { AppLayout } from "../../../layouts/AppLayout";
import { routes } from "../../../routes";
import { assertDefined } from "../../../utils/assert-defined";

const Card: FC<BoxProps> = (props) => {
  return <Box w={{ base: "full", md: "lg" }} p="4" rounded="md" boxShadow="md" bg="white" {...props} />;
};

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

  const [imageStyles, imageStylesApi] = useSpring(() => ({ opacity: 0 }));

  const onLike = () => {
    imageStylesApi.start({ opacity: 0.85, config: { duration: 1_000 } });
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
                <Center h="full" bg="pink.50">
                  <VStack color="red.400">
                    <BiLike fontSize="64px" />
                    <Box fontWeight="bold" fontSize="2xl">
                      いいね！
                    </Box>
                  </VStack>
                </Center>
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

      <HStack spacing="8" position="absolute" bottom="16" left="50%" transform="translateX(-50%)">
        <IconButton h="16" w="16" isRound boxShadow="md" aria-label="skip" icon={<BiShare fontSize="28px" />} />
        <IconButton
          colorScheme="secondary"
          h="16"
          w="16"
          isRound
          boxShadow="md"
          aria-label="like"
          icon={<BiLike fontSize="28px" />}
          onClick={onLike}
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

  return data ? <UserPageTemplate user={data.user} /> : null;
};
