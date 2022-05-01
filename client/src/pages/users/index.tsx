import { gql } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { FC } from "react";

import { useUsersStatForUsersPageQuery } from "../../graphql/generated";
import { AppLayout } from "../../layouts/AppLayout";

gql`
  query UsersStatForUsersPage {
    usersStat {
      userIds
    }
  }
`;

export const UsersPage: FC = () => {
  const { data } = useUsersStatForUsersPageQuery();

  return (
    <AppLayout>
      <Box>UsersPage</Box>
      <Box>{JSON.stringify(data)}</Box>
    </AppLayout>
  );
};
