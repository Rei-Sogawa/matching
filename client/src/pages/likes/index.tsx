import { gql } from "@apollo/client";
import { Box, Stack } from "@chakra-ui/react";
import { head } from "lodash-es";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useReceiveLikeUsersQuery } from "../../graphql/generated";
import { AppLayout } from "../../layouts/AppLayout";
import { routes } from "../../routes";

gql`
  query ReceiveLikeUsers {
    receiveLikeUsers {
      id
      ...UserForLikePage
    }
  }
`;

export const LikesPage: FC = () => {
  const navigate = useNavigate();

  const { data } = useReceiveLikeUsersQuery();

  const users = data?.receiveLikeUsers ?? [];

  useEffect(() => {
    const user = head(users);
    if (user) {
      navigate(routes["/likes/:userId"].path({ userId: user.id }));
    }
  }, [users]);

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
