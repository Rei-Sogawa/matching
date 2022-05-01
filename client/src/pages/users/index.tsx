import { gql } from "@apollo/client";
import { Box, Button, Flex, Stack } from "@chakra-ui/react";
import { shuffle } from "lodash-es";
import { FC, useEffect, useMemo, useState } from "react";

import { useUsersForUsersPageLazyQuery, useUsersStatForUsersPageQuery } from "../../graphql/generated";
import { AppLayout } from "../../layouts/AppLayout";

gql`
  fragment UserForUserCard on User {
    id
    gender
    age
    livingPref
    photoUrls
  }
`;

gql`
  query UsersStatForUsersPage {
    usersStat {
      userIds
    }
  }
`;

gql`
  query UsersForUsersPage($input: UsersInput!) {
    users(input: $input) {
      id
      ...UserForUserCard
    }
  }
`;

const LENGTH = 4;

export const UsersPage: FC = () => {
  const { data: _usersStat } = useUsersStatForUsersPageQuery();
  const userIds = useMemo(() => shuffle(_usersStat?.usersStat.userIds), [_usersStat]);

  const [cursor, setCursor] = useState<number>(0);

  const [fetchUsers, { data: users, fetchMore: fetchMoreUsers }] = useUsersForUsersPageLazyQuery();

  useEffect(() => {
    if (!userIds) return;
    if (userIds.length < 1) return;

    fetchUsers({ variables: { input: { ids: userIds.slice(cursor, cursor + LENGTH) } } });
    setCursor((prev) => prev + LENGTH);
  }, [userIds]);

  const onClickMore = () => {
    if (!userIds) return;
    if (userIds.length < 1) return;
    if (userIds.length < cursor) return;

    fetchMoreUsers({ variables: { input: { ids: userIds.slice(cursor, cursor + LENGTH) } } });
    setCursor((prev) => prev + LENGTH);
  };

  useEffect(() => console.log(users), [users]);

  return (
    <AppLayout>
      <Stack>
        <Box>UsersPage</Box>
        <Box>{JSON.stringify(users?.users.map((user) => user.id))}</Box>
        <Flex justifyContent="center">
          <Button onClick={onClickMore}>More</Button>
        </Flex>
      </Stack>
    </AppLayout>
  );
};
