import { gql } from "@apollo/client";
import { Box, Flex, Stack, useToast } from "@chakra-ui/react";
import { FC } from "react";

import { BackButton } from "../../../components/common/BackButton";
import { UserProfileUpdateForm, UserProfileUpdateFormProps } from "../../../components/domain/UserProfileUpdateForm";
import { useMe } from "../../../contexts/Me";
import { useUpdateUserMutation } from "../../../graphql/generated";
import { AppLayout } from "../../../layouts/AppLayout";
import { routes } from "../../../routes";

gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      ...MeForMe
    }
  }
`;

export const MyPageProfileEditPage: FC = () => {
  const toast = useToast();

  const { me } = useMe();

  const [updateUserMutation] = useUpdateUserMutation();

  const updateUser: UserProfileUpdateFormProps["onSubmit"] = async (values) => {
    await updateUserMutation({ variables: { input: values } });
    toast({ title: "更新しました。", status: "success", position: "top-right", duration: 2_500 });
  };

  return (
    <AppLayout header={null} footer={null}>
      <Stack spacing="6">
        <Flex w="full" position="relative" justifyContent="center" alignItems="center">
          <Box position="absolute" left="0">
            <BackButton path={routes["/my-page"].path()} />
          </Box>
          <Box alignSelf="center" fontWeight="bold" fontSize="2xl">
            プロフィール編集
          </Box>
        </Flex>

        <UserProfileUpdateForm initialValues={me} onSubmit={updateUser} />
      </Stack>
    </AppLayout>
  );
};
