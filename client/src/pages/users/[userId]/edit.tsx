import { gql } from "@apollo/client";
import { Box, Container, Stack } from "@chakra-ui/react";
import { FC } from "react";

import { AppLink } from "../../../components/base/AppLink";
import { UserProfileUpdateForm, UserProfileUpdateFormProps } from "../../../components/domain/UserProfileUpdateForm";
import { useMe } from "../../../contexts/Me";
import { useUpdateUserMutation } from "../../../graphql/generated";
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
  const me = useMe();

  const [updateUserMutation] = useUpdateUserMutation();

  const updateUser: UserProfileUpdateFormProps["onSubmit"] = async (values) => {
    await updateUserMutation({ variables: { input: values } });
  };

  return (
    <Box h="full" bg="white">
      <Container h="full" py="10">
        <Stack>
          <Box alignSelf="center" fontWeight="bold" fontSize="2xl">
            プロフィール編集
          </Box>

          <UserProfileUpdateForm initialValues={me} onSubmit={updateUser} />

          <AppLink to={routes["/"].path()} maxW="max-content">
            戻る
          </AppLink>
        </Stack>
      </Container>
    </Box>
  );
};
