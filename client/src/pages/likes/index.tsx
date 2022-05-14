import { Box, Stack } from "@chakra-ui/react";
import { head } from "lodash-es";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useReceiveLikeUsers } from "../../hooks/domain/useUser";
import { AppFooter } from "../../layouts/AppFooter";
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

  const footer = (
    <AppFooter>
      <AppMenu />
    </AppFooter>
  );

  return (
    <AppLayout header={null} footer={footer}>
      <AppMain>
        <Stack spacing="8">
          <Box fontWeight="bold" fontSize="2xl">
            いいね！
          </Box>
        </Stack>
      </AppMain>
    </AppLayout>
  );
};
