import { Button, Flex, IconButton, Stack, Wrap, WrapItem } from "@chakra-ui/react";
import { FC } from "react";
import { BiSearch } from "react-icons/bi";

import { UserSmallCard } from "../../components/domain/UserSmallCard";
import { useUsers } from "../../hooks/domain/useLike";
import { AppFooter } from "../../layouts/AppFooter";
import { AppLayout } from "../../layouts/AppLayout";
import { AppMain } from "../../layouts/AppMain";
import { AppMenu } from "../../layouts/AppMenu";

export const UsersPage: FC = () => {
  const { data, onLoadMore } = useUsers();

  const users = data?.viewer.users.edges.map((v) => v.node) ?? [];
  const hasMore = data?.viewer.users.pageInfo.hasNextPage ?? false;

  const footer = (
    <AppFooter>
      <AppMenu />
    </AppFooter>
  );

  return (
    <AppLayout header={null} footer={footer}>
      <AppMain>
        <Stack spacing="8">
          <Flex justifyContent="end" px={{ base: "6", md: "12" }}>
            <IconButton isRound boxShadow="md" aria-label="search" icon={<BiSearch fontSize="20px" />} />
          </Flex>

          <Wrap justify="center" spacing="6">
            {users.map((user) => (
              <WrapItem key={user.id}>
                <UserSmallCard user={user} />
              </WrapItem>
            ))}
          </Wrap>

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
