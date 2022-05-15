import { Box, Center, Flex, Stack } from "@chakra-ui/react";
import { head } from "lodash-es";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AppHeading } from "../../components/base/AppHeading";
import { AppLink } from "../../components/base/AppLink";
import { Loading } from "../../components/base/Loading";
import { useReceiveLikeUsers } from "../../hooks/domain/user";
import { AppFooter } from "../../layouts/AppFooter";
import { AppHeader } from "../../layouts/AppHeader";
import { AppLayout } from "../../layouts/AppLayout";
import { AppMain } from "../../layouts/AppMain";
import { AppMenu } from "../../layouts/AppMenu";
import { routes } from "../../routes";

export const LikesPage: FC = () => {
  const navigate = useNavigate();

  const { data } = useReceiveLikeUsers();

  const users = data?.viewer.receiveLikeUsers ?? [];

  useEffect(() => {
    const user = head(users);
    if (user) {
      navigate(routes["/likes/:userId"].path({ userId: user.id }));
    }
  }, [users]);

  const header = (
    <AppHeader>
      <Flex justifyContent="center">
        <AppHeading>いいね！</AppHeading>
      </Flex>
    </AppHeader>
  );

  const footer = (
    <AppFooter>
      <AppMenu />
    </AppFooter>
  );

  if (!data) return <Loading />;
  if (users.length > 0) return <Loading />;

  return (
    <AppLayout header={header} footer={footer}>
      <AppMain>
        <Center h="full">
          <AppLink to={routes["/likes/skipped"].path()}>
            <Box fontWeight="bold" color="primary.500">
              スキップしたお相手を確認する
            </Box>
          </AppLink>
        </Center>
      </AppMain>
    </AppLayout>
  );
};
