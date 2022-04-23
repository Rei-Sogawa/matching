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

  const updateUser: UserProfileUpdateFormProps["onSubmit"] = async ({ photoPaths, displayName }) => {
    await updateUserMutation({ variables: { input: { photoPaths, displayName } } });
  };

  return (
    <Box h="full" bg="white">
      <Container h="full" py="10">
        <Stack>
          <Box alignSelf="center" fontWeight="bold" fontSize="2xl">
            Update Profile
          </Box>

          <UserProfileUpdateForm
            initialValues={{ photoPaths: me.photoPaths, displayName: me.displayName }}
            onSubmit={updateUser}
          />

          <AppLink to={routes["/"].path()} maxW="max-content">
            Back
          </AppLink>
        </Stack>
      </Container>
    </Box>
  );
};
