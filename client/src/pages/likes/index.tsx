import { gql } from "@apollo/client";
import { Box, Stack } from "@chakra-ui/react";
import { FC } from "react";

import { useReceiveLikeUsersQuery } from "../../graphql/generated";
import { AppLayout } from "../../layouts/AppLayout";

gql`
  query ReceiveLikeUsers {
    receiveLikeUsers {
      id
      ...UserForLikePage
    }
  }
`;

export const LikesPage: FC = () => {
  const { data } = useReceiveLikeUsersQuery();

  const users = data?.receiveLikeUsers ?? [];

  console.log(users);

  return (
    <AppLayout footer={true}>
      <Stack spacing="8">
        <Box fontWeight="bold" fontSize="2xl">
          いいね！
        </Box>
      </Stack>
    </AppLayout>
  );
};
