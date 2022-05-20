import { Box, Button, Divider, Flex, Stack } from "@chakra-ui/react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { AppHeading } from "../../components/base/AppHeading";
import { AppLoading } from "../../components/base/AppLoading";
import { BackButton } from "../../components/case/BackButton";
import { UserSkippedItem } from "../../components/UserSkippedItem";
import { useSkipLikeUsers } from "../../hooks/domain/user";
import { AppHeader } from "../../layouts/AppHeader";
import { AppLayout } from "../../layouts/AppLayout";
import { AppMain } from "../../layouts/AppMain";
import { routes } from "../../routes";

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
        <AppHeading alignSelf="center">スキップしたお相手</AppHeading>
      </Flex>
    </AppHeader>
  );

  if (!data) return <AppLoading />;

  return (
    <AppLayout header={header} footer={null}>
      <AppMain>
        <Stack spacing="6">
          {users.map((u) => (
            <Stack key={u.id} alignSelf="center" spacing="6">
              <UserSkippedItem user={u} />
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
