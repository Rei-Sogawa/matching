import { gql } from "@apollo/client";
import { Box, Button, HStack, Image, Stack, useToast } from "@chakra-ui/react";
import { FC } from "react";
import { FaHeart } from "react-icons/fa";

import { UserSkippedItemFragment } from "../graphql/generated";
import { useMatchSkippedLike } from "../hooks/domain/like";
import { AppHeading } from "./base/AppHeading";

gql`
  fragment UserSkippedItem on User {
    id
    gender
    nickName
    age
    livingPref
    topPhotoUrl
  }
`;

type UserSkippedItemProps = { user: UserSkippedItemFragment };

export const UserSkippedItem: FC<UserSkippedItemProps> = ({ user }) => {
  const toast = useToast();

  const { matchSkippedLike } = useMatchSkippedLike(user.id);

  const onClick = async () => {
    await matchSkippedLike();
    toast({
      position: "top-right",
      render: () => (
        <HStack px="4" py="3" rounded="md" bg="secondary.500">
          <FaHeart color="white" fontSize="20px" />
          <Box fontWeight="bold" color="white">
            マッチング成立しました！
          </Box>
        </HStack>
      ),
    });
  };

  return (
    <Stack spacing="4" w={{ base: "full", md: "lg" }} p="4">
      <Image src={user.topPhotoUrl ?? undefined} rounded="md" />

      <Box>
        <AppHeading>{user.nickName}</AppHeading>
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

      <Button onClick={onClick} colorScheme="secondary">
        いいね！ありがとう
      </Button>
    </Stack>
  );
};
