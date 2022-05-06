import { gql, Reference } from "@apollo/client";
import { Box, Stack } from "@chakra-ui/react";
import { FC } from "react";

import { useMatchMutation } from "../../graphql/generated";
import { AppLayout } from "../../layouts/AppLayout";

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
  fragment UserForLikePage on User {
    id
    ...UserTopCard
  }
`;

const LikePageTemplate: FC = () => {
  return (
    <AppLayout footer={true} bg="gray.50">
      <Stack spacing="8">
        <Box fontWeight="bold" fontSize="2xl">
          いいね！
        </Box>
      </Stack>
    </AppLayout>
  );
};

export const LikePage: FC = () => {
  return null;
};
