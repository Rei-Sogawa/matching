import { gql } from "@apollo/client";
import { Box, Button, Flex, Stack } from "@chakra-ui/react";
import { FC } from "react";

import { useRandomUsersQuery } from "../../graphql/generated";
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
  query RandomUsers($input: RandomUsersInput!) {
    randomUsers(input: $input) {
      id
      ...UserForUserCard
    }
  }
`;

const SIZE = 4;

export const UsersPage: FC = () => {
  const { data, fetchMore } = useRandomUsersQuery({ variables: { input: { size: SIZE, excludeIds: [] } } });

  const users = data?.randomUsers;

  return (
    <AppLayout>
      <Stack>
        <Box>UsersPage</Box>
        <Box>{JSON.stringify(users?.map((user) => user.livingPref))}</Box>
        <Flex justifyContent="center">
          <Button>More</Button>
        </Flex>
      </Stack>
    </AppLayout>
  );
};
