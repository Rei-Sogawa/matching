import { gql } from "@apollo/client";
import { Box, Button, HStack, Image, Stack, useToast } from "@chakra-ui/react";
import { FC } from "react";

import { UserLikedItemFragment } from "../graphql/generated";
import { useCancelLike } from "../hooks/domain/like";
import { AppHeading } from "./base/AppHeading";

gql`
  fragment UserLikedItem on User {
    id
    gender
    nickName
    age
    livingPref
    topPhotoUrl
  }
`;

type UserLikedItemProps = { user: UserLikedItemFragment };

export const UserLikedItem: FC<UserLikedItemProps> = ({ user }) => {
  const toast = useToast();

  const { cancelLike } = useCancelLike(user.id);

  const onClick = async () => {
    await cancelLike();
    toast({ title: "いいねを取り消しました", status: "success", position: "top-right" });
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
      <Button onClick={onClick}>いいねを取り消す</Button>;
    </Stack>
  );
};
