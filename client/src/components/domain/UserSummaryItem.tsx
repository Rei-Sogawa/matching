import { gql } from "@apollo/client";
import { Box, HStack, Image, Stack } from "@chakra-ui/react";
import { head } from "lodash-es";
import { FC, ReactNode } from "react";

import { UserSummaryItemFragment } from "../../graphql/generated";

gql`
  fragment UserSummaryItem on User {
    id
    gender
    nickName
    age
    livingPref
    photoUrls
  }
`;

type UserSummaryItemProps = { user: UserSummaryItemFragment; actionButton: ReactNode };

export const UserSummaryItem: FC<UserSummaryItemProps> = ({ user, actionButton }) => {
  return (
    <Stack spacing="4" w={{ base: "full", md: "lg" }} p="4">
      <Image src={head(user.photoUrls)} rounded="md" />

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
