import { gql, Reference } from "@apollo/client";
import { Box, Button, Divider, Flex, HStack, Image, Stack } from "@chakra-ui/react";
import { head } from "lodash-es";
import { FC } from "react";

import { Loading } from "../../components/case/Loading";
import { BackButton } from "../../components/common/BackButton";
import { UserForSendLikeUserCardFragment, useSendLikeUsersQuery, useUnlikeMutation } from "../../graphql/generated";
import { AppLayout } from "../../layouts/AppLayout";
import { routes } from "../../routes";

gql`
  mutation Unlike($userId: ID!) {
    unlike(userId: $userId) {
      id
      ...UserForSendLikeUserCard
    }
  }
`;

gql`
  fragment UserForSendLikeUserCard on User {
    id
    gender
    nickName
    age
    livingPref
    photoUrls
  }
`;

type UserCardProps = {
  user: UserForSendLikeUserCardFragment;
};

const UserCard: FC<UserCardProps> = ({ user }) => {
  const [unlike] = useUnlikeMutation({
    variables: { userId: user.id },
    update(cache) {
      cache.modify({
        fields: {
          sendLikeUsers(existing, { readField }) {
            return existing.filter((u: Reference) => readField("id", u) !== user.id);
          },
        },
      });
    },
  });

  const onUnlike = async () => {
    await unlike();
  };

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

      <Button onClick={onUnlike}>いいねを取り消す</Button>
    </Stack>
  );
};

gql`
  query SendLikeUsers {
    sendLikeUsers {
      id
      ...UserForSendLikeUserCard
    }
  }
`;

type MyPageLikesPageTemplateProps = {
  users: UserForSendLikeUserCardFragment[];
};

const MyPageLikesPageTemplate: FC<MyPageLikesPageTemplateProps> = ({ users }) => {
  return (
    <AppLayout footer={false}>
      <Stack spacing="6">
        <Flex w="full" position="relative" justifyContent="center" alignItems="center">
          <Box position="absolute" left="0">
            <BackButton path={routes["/my-page"].path()} />
          </Box>
          <Box alignSelf="center" fontWeight="bold" fontSize="2xl">
            あなたから
          </Box>
        </Flex>

        {users.map((u) => (
          <Stack key={u.id} alignSelf="center" spacing="6">
            <UserCard user={u} />
            <Divider />
          </Stack>
        ))}
      </Stack>
    </AppLayout>
  );
};

export const MyPageLikesPage: FC = () => {
  const { data } = useSendLikeUsersQuery();

  return data ? <MyPageLikesPageTemplate users={data.sendLikeUsers} /> : <Loading />;
};
