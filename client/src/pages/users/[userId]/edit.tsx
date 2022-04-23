import { Box, Container, Stack } from "@chakra-ui/react";
import { FC } from "react";

import { UserProfileUpdateForm } from "../../../components/domain/UserProfileUpdateForm";

export const UserEditPage: FC = () => {
  return (
    <Box h="full" bg="white">
      <Container h="full" py="10">
        <Stack>
          <Box alignSelf="center" fontWeight="bold" fontSize="2xl">
            Update Profile
          </Box>
          <UserProfileUpdateForm
            onSubmit={(v) => {
              console.log(v);
              return Promise.resolve();
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
};
