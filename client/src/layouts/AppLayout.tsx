import { Stack } from "@chakra-ui/react";
import { FC } from "react";

import { AppMain } from "./AppMain";
import { AppMenu } from "./AppMenu";

export const AppLayout: FC = ({ children }) => {
  return (
    <Stack h="full">
      <AppMain>{children}</AppMain>
      <AppMenu />
    </Stack>
  );
};
