import { Avatar, Box, Divider, HStack, Stack } from "@chakra-ui/react";
import { getAuth, signOut } from "firebase/auth";
import { head } from "lodash-es";
import { FC } from "react";
import { BiLike, BiLogOut } from "react-icons/bi";

import { AppLink } from "../../components/base/AppLink";
import { useMe } from "../../contexts/Me";
import { AppFooter } from "../../layouts/AppFooter";
import { AppLayout } from "../../layouts/AppLayout";
import { AppMain } from "../../layouts/AppMain";
import { AppMenu } from "../../layouts/AppMenu";
import { routes } from "../../routes";

export const MyPagePage: FC = () => {
  const { me } = useMe();

  const logout = () => {
    signOut(getAuth());
  };

  const footer = (
    <AppFooter>
      <AppMenu />
    </AppFooter>
  );

  return (
    <AppLayout header={null} footer={footer}>
      <AppMain>
        <Stack spacing="6">
          <HStack spacing="8" px="10" py="4">
            <Avatar src={head(me.photoUrls)} size="xl" ring="4px" ringColor="primary.500" />
            <Box>
              <Box fontWeight="bold" fontSize="2xl">
                {me.nickName}
              </Box>
              <AppLink to={routes["/my-page/profile/edit"].path()} fontWeight="bold" color="primary.500">
                プロフィール編集
              </AppLink>
            </Box>
          </HStack>

          <Divider />

          <Stack>
            <AppLink to={routes["/my-page/likes"].path()}>
              <HStack px="6" py="4">
                <BiLike fontSize="28px" />
                <Box fontWeight="bold">あなたからのいいね！</Box>
              </HStack>
            </AppLink>

            <AppLink
              to="#"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            >
              <HStack px="6" py="4">
                <BiLogOut fontSize="28px" />
                <Box fontWeight="bold">ログアウト</Box>
              </HStack>
            </AppLink>
          </Stack>
        </Stack>
      </AppMain>
    </AppLayout>
  );
};
