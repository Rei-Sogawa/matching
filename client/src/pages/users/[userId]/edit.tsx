import { gql } from "@apollo/client";
import { Box, Container, Stack, useToast } from "@chakra-ui/react";
import { FC } from "react";

import { AppLink } from "../../../components/base/AppLink";
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

export const UserEditPage: FC = () => {
  const toast = useToast();

  const me = useMe();

  const [updateUserMutation] = useUpdateUserMutation();

  const updateUser: UserProfileUpdateFormProps["onSubmit"] = async (values) => {
    await updateUserMutation({ variables: { input: values } });
    toast({ title: "更新しました。", status: "success", position: "top-right", duration: 2_500 });
  };

  return (
    <AppLayout>
      <Container>
        <Stack>
          <Box alignSelf="center" fontWeight="bold" fontSize="2xl">
            プロフィール編集
          </Box>

          <UserProfileUpdateForm initialValues={me} onSubmit={updateUser} />
        </Stack>
      </Container>
    </AppLayout>
  );
};
