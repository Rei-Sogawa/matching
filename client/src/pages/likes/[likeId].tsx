import { gql, Reference, useApolloClient } from "@apollo/client";
import { Box, Center, HStack, VStack } from "@chakra-ui/react";
import { FC, useState } from "react";
import { BiHeart, BiShare } from "react-icons/bi";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { animated, useSpring } from "react-spring";

import { LikeButton } from "../../components/case/LikeButton";
import { SkipButton } from "../../components/case/SkipButton";
import { UserTopCard } from "../../components/domain/UserTopCard";
import {
  ReceiveLikeUsersDocument,
  ReceiveLikeUsersQueryResult,
  useMatchMutation,
  UserForLikePageFragment,
  useSkipMutation,
} from "../../graphql/generated";
import { AppFooter } from "../../layouts/AppFooter";
import { AppHeader } from "../../layouts/AppHeader";
import { AppLayout } from "../../layouts/AppLayout";
import { AppMenu } from "../../layouts/AppMenu";
import { routes } from "../../routes";

gql`
  mutation Match($userId: ID!) {
    like(userId: $userId) {
      id
      ...UserForLikePage
    }
  }
`;

const useMatch = (userId: string) => {
  const [mutate] = useMatchMutation({
    variables: { userId },
    update(cache) {
      cache.modify({
        fields: {
          receiveLikeUsers(existing, { readField }) {
            return existing.filter((u: Reference) => readField("id", u) !== userId);
          },
        },
      });
    },
  });

  const match = () => mutate();

  return { match };
};

gql`
  mutation Skip($userId: ID!) {
    skip(userId: $userId) {
      id
      ...UserForLikePage
    }
  }
`;

const useSkip = (userId: string) => {
  const [mutate] = useSkipMutation({
    variables: { userId },
    update(cache) {
      cache.modify({
        fields: {
          receiveLikeUsers(existing, { readField }) {
            return existing.filter((u: Reference) => readField("id", u) !== userId);
          },
        },
      });
    },
  });

  const skip = () => mutate();

  return { skip };
};

gql`
  fragment UserForLikePage on User {
    id
    ...UserTopCard
  }
`;

type LikePageTemplateProps = { user: UserForLikePageFragment };

const LikePageTemplate: FC<LikePageTemplateProps> = ({ user }) => {
  const navigate = useNavigate();

  const client = useApolloClient();

  const getRedirectPath = () => {
    const data = client.cache.readQuery({ query: ReceiveLikeUsersDocument }) as ReceiveLikeUsersQueryResult["data"];
    const users = data?.receiveLikeUsers ?? [];

    const currIndex = users.findIndex((u) => u.id === user.id);
    const nextUser = users[currIndex + 1];

    if (nextUser) {
      return routes["/likes/:userId"].path({ userId: nextUser.id });
    } else {
      return routes["/likes"].path();
    }
  };

  const { match } = useMatch(user.id);
  const { skip } = useSkip(user.id);

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

  const onMatch = async () => {
    likeAnimation();
    const redirectPath = getRedirectPath();
    await match();

    setTimeout(() => {
      resetAnimation();
      navigate(redirectPath);
    }, 1_500);
  };

  const onSkip = async () => {
    skipAnimation();
    const redirectPath = getRedirectPath();
    await skip();

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
            <BiHeart fontSize="64px" />
            <Box fontWeight="bold" fontSize="2xl">
              マッチング！
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

  const footer = (
    <AppFooter>
      <AppMenu />
    </AppFooter>
  );

  return (
    <AppLayout header={null} footer={footer}>
      <VStack spacing="6">
        <UserTopCard user={user} imageForeground={imageForeground} />
        <HStack spacing="8">
          <SkipButton onClick={onSkip} disabled={liked || skipped} />
          <LikeButton onClick={onMatch} disabled={liked || skipped} />
        </HStack>
      </VStack>
    </AppLayout>
  );
};

export const LikePage: FC = () => {
  const { userId } = useParams();
  const client = useApolloClient();
  const data = client.cache.readQuery({ query: ReceiveLikeUsersDocument }) as ReceiveLikeUsersQueryResult["data"];
  const users = data?.receiveLikeUsers ?? [];
  const user = users.find((u) => u.id === userId);
  return user ? <LikePageTemplate user={user} /> : <Navigate to={routes["/likes"].path()} />;
};
