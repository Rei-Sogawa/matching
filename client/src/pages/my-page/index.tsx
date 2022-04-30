import { Avatar, Box, Divider, HStack, Stack } from "@chakra-ui/react";
import { head } from "lodash-es";
import { FC } from "react";

import { AppLink } from "../../components/base/AppLink";
import { useMe } from "../../contexts/Me";
import { AppLayout } from "../../layouts/AppLayout";
import { routes } from "../../routes";

export const MyPagePage: FC = () => {
  const me = useMe();

  return (
    <AppLayout>
      <Stack spacing="6">
        <HStack spacing="8" px="10">
          <Avatar src={head(me.photoUrls)} size="xl" ring="4px" ringColor="primary.500" />
          <Box>
            <Box fontWeight="bold" fontSize="2xl">
              {me.nickName}
            </Box>
            <AppLink to={routes["/my-page/profile/edit"].path()} fontWeight="bold" color="primary.500">
              プロフィール確認
            </AppLink>
          </Box>
        </HStack>

        <Divider />
      </Stack>
    </AppLayout>
  );
};
