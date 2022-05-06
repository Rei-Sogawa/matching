import { Box, Stack } from "@chakra-ui/react";
import { FC } from "react";

import { AppLayout } from "../../layouts/AppLayout";

export const LikesPage: FC = () => {
  return (
    <AppLayout footer={true}>
      <Stack spacing="8">
        <Box fontWeight="bold" fontSize="2xl">
          いいね！
        </Box>
      </Stack>
    </AppLayout>
  );
};
