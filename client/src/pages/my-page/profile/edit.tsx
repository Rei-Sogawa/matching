import { Box, Flex, Stack, useToast } from "@chakra-ui/react";
import { FC } from "react";

import { BackButton } from "../../../components/case/BackButton";
import { UserProfileUpdateForm, UserProfileUpdateFormProps } from "../../../components/domain/UserProfileUpdateForm";
import { useMe } from "../../../contexts/Me";
import { useUpdateUserProfile } from "../../../hooks/domain/user";
import { AppHeader } from "../../../layouts/AppHeader";
import { AppLayout } from "../../../layouts/AppLayout";
import { AppMain } from "../../../layouts/AppMain";
import { routes } from "../../../routes";

export const MyPageProfileEditPage: FC = () => {
  const toast = useToast();

  const { me } = useMe();

  const { updateUserProfile } = useUpdateUserProfile();

  const onSubmit: UserProfileUpdateFormProps["onSubmit"] = async (values) => {
    await updateUserProfile(values);
    toast({ title: "更新しました。", status: "success", position: "top-right", duration: 2_500 });
  };

  const header = (
    <AppHeader>
      <Flex w="full" position="relative" justifyContent="center" alignItems="center">
        <Box position="absolute" left="0">
          <BackButton path={routes["/my-page"].path()} />
        </Box>
        <Box alignSelf="center" fontWeight="bold" fontSize="2xl">
          プロフィール編集
        </Box>
      </Flex>
    </AppHeader>
  );

  return (
    <AppLayout header={header} footer={null}>
      <AppMain>
        <Stack spacing="6">
          <UserProfileUpdateForm initialValues={me} onSubmit={onSubmit} />
        </Stack>
      </AppMain>
    </AppLayout>
  );
};
