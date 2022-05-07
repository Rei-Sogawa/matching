import { gql, Reference, useApolloClient } from "@apollo/client";
import { Box, Center, HStack, VStack } from "@chakra-ui/react";
import { FC, useState } from "react";
import { BiLike, BiShare } from "react-icons/bi";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { animated, useSpring } from "react-spring";

import { LikeButton } from "../../../components/case/LikeButton";
import { SkipButton } from "../../../components/case/SkipButton";
import { BackButton } from "../../../components/common/BackButton";
import { UserTopCard } from "../../../components/domain/UserTopCard";
import { useLikeMutation, UserForUserPageFragment, UsersDocument, UsersQueryResult } from "../../../graphql/generated";
import { AppLayout } from "../../../layouts/AppLayout";
import { routes } from "../../../routes";
import { assertDefined } from "../../../utils/assert-defined";

gql`
  mutation Like($userId: ID!) {
    like(userId: $userId) {
      id
      ...UserForUserPage
    }
  }
`;

const useLike = (userId: string) => {
  const [mutate] = useLikeMutation({
    variables: { userId },
    update(cache, { data }) {
      assertDefined(data);

      cache.modify({
        fields: {
          users(existing, { readField }) {
            return {
              ...existing,
              edges: existing.edges.filter(({ node }: { node: Reference }) => readField("id", node) !== userId),
            };
          },
        },
      });
    },
  });

  const like = () => mutate();

  return { like };
};

gql`
  fragment UserForUserPage on User {
    id
    ...UserTopCard
  }
`;

type UserPageTemplateProps = { user: UserForUserPageFragment };

const UserPageTemplate: FC<UserPageTemplateProps> = ({ user }) => {
  const navigate = useNavigate();

  const client = useApolloClient();

  const getRedirectPath = () => {
    const data = client.cache.readQuery({ query: UsersDocument }) as UsersQueryResult["data"];
    const users = data?.users.edges.map((e) => e.node) ?? [];

    const currIndex = users.findIndex((u) => u.id === user.id);
    const nextUser = users[currIndex + 1];

    if (nextUser) {
      return routes["/users/:userId"].path({ userId: nextUser.id });
    } else {
      return routes["/users"].path();
    }
  };

  const { like } = useLike(user.id);

  const [imageStyles, imageStylesApi] = useSpring(() => ({ opacity: 0 }));
  const [liked, setLiked] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const likeAnimation = () => {
    setLiked(true);
    imageStylesApi.start({ opacity: 0.85, config: { duration: 1_000 } });
  };

  const skipAnimation = () => {
    setSkipped(true);
    imageStylesApi.start({ opacity: 0.85, config: { duration: 1_000 } });
  };

  const resetAnimation = () => {
    setLiked(false);
    setSkipped(false);
    imageStylesApi.start({ opacity: 0 });
  };

  const onLike = async () => {
    likeAnimation();
    const redirectPath = getRedirectPath();
    await like();

    setTimeout(() => {
      resetAnimation();
      navigate(redirectPath);
    }, 1_500);
  };

  const onSkip = () => {
    skipAnimation();
    const redirectPath = getRedirectPath();

    setTimeout(() => {
      resetAnimation();
      navigate(redirectPath);
    }, 1_500);
  };

  const imageForeground = (
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
  );

  return (
    <AppLayout header={null} footer={null}>
      <VStack spacing="8">
        <BackButton alignSelf="start" path={routes["/users"].path()} />
        <UserTopCard user={user} imageForeground={imageForeground} />
        <HStack spacing="8">
          <SkipButton onClick={onSkip} disabled={liked || skipped} />
          <LikeButton onClick={onLike} disabled={liked || skipped} />
        </HStack>
      </VStack>
    </AppLayout>
  );
};

export const UserPage: FC = () => {
  const { userId } = useParams();
  const client = useApolloClient();
  const data = client.cache.readQuery({ query: UsersDocument }) as UsersQueryResult["data"];
  const users = data?.users.edges.map((e) => e.node) ?? [];
  const user = users.find((u) => u.id === userId);
  return user ? <UserPageTemplate user={user} /> : <Navigate to={routes["/users"].path()} />;
};
