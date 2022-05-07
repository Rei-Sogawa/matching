import { gql } from "@apollo/client";
import { Box, HStack, Image, Stack } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

import { UserActionCardFragment } from "../../graphql/generated";

gql`
  fragment UserActionCard on User {
    id
    gender
    nickName
    age
    livingPref
    topPhotoUrl
  }
`;

type UserActionCardProps = { user: UserActionCardFragment; actionButton: ReactNode };

export const UserActionCard: FC<UserActionCardProps> = ({ user, actionButton }) => {
  return (
    <Stack spacing="4" w={{ base: "full", md: "lg" }} p="4">
      <Image src={user.topPhotoUrl ?? undefined} rounded="md" />

      <Box>
        <Box fontWeight="bold" fontSize="2xl">
          {user.nickName}
        </Box>
        <HStack>
          <Box color="gray" fontWeight="bold">
            {user.age}歳
          </Box>
          <Box color="gray" fontWeight="bold">
            {user.livingPref}
          </Box>
          <Box color="gray" fontWeight="bold">
            {user.gender === "MALE" ? "男性" : "女性"}
          </Box>
        </HStack>
      </Box>

      {actionButton}
    </Stack>
  );
};
