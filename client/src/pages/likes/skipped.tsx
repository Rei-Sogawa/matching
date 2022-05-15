import { gql } from "@apollo/client";
import { Box, Button, Divider, Flex, HStack, Stack, useToast } from "@chakra-ui/react";
import { FC } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { Loading } from "../../components/base/Loading";
import { BackButton } from "../../components/case/BackButton";
import { UserActionCard } from "../../components/domain/UserActionCard";
import { SkipLikeUserItemFragment } from "../../graphql/generated";
import { useMatchSkippedLike } from "../../hooks/domain/like";
import { useSkipLikeUsers } from "../../hooks/domain/user";
import { AppHeader } from "../../layouts/AppHeader";
import { AppLayout } from "../../layouts/AppLayout";
import { AppMain } from "../../layouts/AppMain";
import { routes } from "../../routes";

gql`
  fragment SkipLikeUserItem on User {
    id
    ...UserActionCard
  }
`;

type SkipLikeUserItemProps = {
  user: SkipLikeUserItemFragment;
};

const SkipLikeUserItem: FC<SkipLikeUserItemProps> = ({ user }) => {
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
            マッチングしました！
          </Box>
        </HStack>
      ),
    });
  };

  const actionButton = (
    <Button onClick={onClick} colorScheme="secondary">
      いいね！ありがとう
    </Button>
  );

  return <UserActionCard user={user} actionButton={actionButton} />;
};

export const LikesSkippedPage: FC = () => {
  const navigate = useNavigate();

  const { data, onLoadMore } = useSkipLikeUsers();

  const users = data?.viewer.skipLikeUsers.edges.map((v) => v.node) ?? [];
  const hasMore = data?.viewer.skipLikeUsers.pageInfo.hasNextPage ?? false;

  const header = (
    <AppHeader>
      <Flex w="full" position="relative" justifyContent="center" alignItems="center">
        <Box position="absolute" left="0">
          <BackButton onClick={() => navigate(routes["/likes"].path())} />
        </Box>
        <Box alignSelf="center" fontWeight="bold" fontSize="2xl">
          スキップしたお相手
        </Box>
      </Flex>
    </AppHeader>
  );

  if (!data) return <Loading />;

  return (
    <AppLayout header={header} footer={null}>
      <AppMain>
        <Stack spacing="6">
          {users.map((u) => (
            <Stack key={u.id} alignSelf="center" spacing="6">
              <SkipLikeUserItem user={u} />
              <Divider />
            </Stack>
          ))}

          {hasMore && (
            <Button alignSelf="center" variant="ghost" colorScheme="primary" onClick={onLoadMore}>
              もっと見る
            </Button>
          )}
        </Stack>
      </AppMain>
    </AppLayout>
  );
};
