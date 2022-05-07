import { gql, Reference } from "@apollo/client";
import { Box, Button, Divider, Flex, Stack } from "@chakra-ui/react";
import { FC } from "react";

import { Loading } from "../../components/case/Loading";
import { BackButton } from "../../components/common/BackButton";
import { UserActionCard } from "../../components/domain/UserActionCard";
import { SendLikeUserItemFragment, useSendLikeUsersQuery, useUnlikeMutation } from "../../graphql/generated";
import { AppHeader } from "../../layouts/AppHeader";
import { AppLayout } from "../../layouts/AppLayout";
import { routes } from "../../routes";

gql`
  mutation Unlike($userId: ID!) {
    unlike(userId: $userId) {
      id
      ...SendLikeUserItem
    }
  }
`;

const useUnlike = (userId: string) => {
  const [mutate] = useUnlikeMutation({
    variables: { userId },
    update(cache) {
      cache.modify({
        fields: {
          sendLikeUsers(existing, { readField }) {
            return {
              ...existing,
              edges: existing.edges.filter(({ node }: { node: Reference }) => readField("id", node) !== userId),
            };
          },
        },
      });
    },
  });

  const unlike = () => mutate();

  return { unlike };
};

gql`
  fragment SendLikeUserItem on User {
    id
    ...UserActionCard
  }
`;

type SendLikeUserItemProps = {
  user: SendLikeUserItemFragment;
};

const SendLikeUserItem: FC<SendLikeUserItemProps> = ({ user }) => {
  const { unlike } = useUnlike(user.id);

  const actionButton = <Button onClick={unlike}>いいねを取り消す</Button>;

  return <UserActionCard user={user} actionButton={actionButton} />;
};

gql`
  query SendLikeUsers($input: PageInput!) {
    sendLikeUsers(input: $input) {
      edges {
        node {
          id
          ...SendLikeUserItem
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const QUERY_SIZE = 6;

export const MyPageLikesPage: FC = () => {
  const { data, fetchMore } = useSendLikeUsersQuery({ variables: { input: { first: QUERY_SIZE } } });

  const users = data?.sendLikeUsers.edges.map((v) => v.node) ?? [];
  const hasMore = data?.sendLikeUsers.pageInfo.hasNextPage ?? false;

  const onLoadMore = async () => {
    await fetchMore({
      variables: { input: { first: QUERY_SIZE, after: data?.sendLikeUsers.pageInfo.endCursor } },
    });
  };

  const header = (
    <AppHeader>
      <Flex w="full" position="relative" justifyContent="center" alignItems="center">
        <Box position="absolute" left="0">
          <BackButton path={routes["/my-page"].path()} />
        </Box>
        <Box alignSelf="center" fontWeight="bold" fontSize="2xl">
          あなたから
        </Box>
      </Flex>
    </AppHeader>
  );

  if (!data) return <Loading />;
  return (
    <AppLayout header={header} footer={null}>
      <Stack spacing="6">
        {users.map((u) => (
          <Stack key={u.id} alignSelf="center" spacing="6">
            <SendLikeUserItem user={u} />
            <Divider />
          </Stack>
        ))}

        {hasMore && (
          <Button alignSelf="center" variant="ghost" colorScheme="primary" onClick={onLoadMore}>
            もっと見る
          </Button>
        )}
      </Stack>
    </AppLayout>
  );
};
