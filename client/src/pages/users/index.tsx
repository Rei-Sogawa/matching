import { gql } from "@apollo/client";
import { Button, Stack, Wrap, WrapItem } from "@chakra-ui/react";
import { FC } from "react";

import { UserSmallCard } from "../../components/domain/UserSmallCard";
import { useUsersQuery } from "../../graphql/generated";
import { AppHeader } from "../../layouts/AppHeader";
import { AppLayout } from "../../layouts/AppLayout";
import { AppMenu } from "../../layouts/AppMenu";

gql`
  query Users($input: PageInput!) {
    users(input: $input) {
      edges {
        node {
          id
          ...UserSmallCard
          ...UserForUserPage
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

export const UsersPage: FC = () => {
  const { data, fetchMore } = useUsersQuery({ variables: { input: { first: QUERY_SIZE } } });

  const users = data?.users.edges.map((v) => v.node) ?? [];
  const hasMore = data?.users.pageInfo.hasNextPage ?? false;

  const onLoadMore = async () => {
    await fetchMore({
      variables: { input: { first: QUERY_SIZE, after: data?.users.pageInfo.endCursor } },
    });
  };

  return (
    <AppLayout header={null} footer={<AppMenu />}>
      <Stack spacing="8">
        <Wrap justify="center" spacing="6">
          {users.map((user) => (
            <WrapItem key={user.id}>
              <UserSmallCard user={user} />
            </WrapItem>
          ))}
        </Wrap>

        {hasMore && (
          <Button alignSelf="center" variant="ghost" colorScheme="primary" onClick={onLoadMore}>
            もっと見る
          </Button>
        )}
      </Stack>
    </AppLayout>
  );
};
