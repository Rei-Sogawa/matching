import { gql } from "@apollo/client";
import { Avatar, Box, Button, HStack, Stack, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import { head } from "lodash-es";
import { FC, useState } from "react";

import { useRandomUsersQuery, UserForUserCardFragment } from "../../graphql/generated";
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

type UserCardProps = {
  user: UserForUserCardFragment;
};

const UserCard: FC<UserCardProps> = ({ user }) => {
  return (
    <VStack cursor="pointer">
      <Avatar src={head(user.photoUrls)} w="36" h="36" />
      <HStack>
        <Box fontWeight="bold">{user.age}歳</Box>
        <Box fontWeight="bold">{user.livingPref}</Box>
      </HStack>
    </VStack>
  );
};

gql`
  query RandomUsers($input: RandomUsersInput!) {
    randomUsers(input: $input) {
      id
      ...UserForUserCard
    }
  }
`;

const SIZE = 6;

export const UsersPage: FC = () => {
  const [hasMore, setHasMore] = useState(true);

  const { data, fetchMore } = useRandomUsersQuery({ variables: { input: { size: SIZE, excludeIds: [] } } });

  const users = data?.randomUsers ?? [];

  const onLoadMore = async () => {
    const res = await fetchMore({
      variables: { input: { size: SIZE, excludeIds: users.map((user) => user.id) } },
    });
    if (res.data.randomUsers.length < SIZE) setHasMore(false);
  };

  return (
    <AppLayout>
      <Stack spacing="8">
        <Box fontWeight="bold" fontSize="2xl">
          さがす
        </Box>

        <Wrap justify="center" spacing="6">
          {users.map((user) => (
            <WrapItem key={user.id}>
              <UserCard user={user} />
            </WrapItem>
          ))}
        </Wrap>

        {hasMore && (
          <Button alignSelf="center" variant="ghost" colorScheme="primary" onClick={onLoadMore}>
            もっと見る
          </Button>
        )}
      </Stack>
    </AppLayout>
  );
};
