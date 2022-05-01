import { Flex } from "@chakra-ui/react";
import { FC } from "react";

import { AppMain } from "./AppMain";
import { AppMenu } from "./AppMenu";

export const AppLayout: FC = ({ children }) => {
  return (
    <Flex direction="column" h="full">
      <AppMain>{children}</AppMain>
      <AppMenu />
    </Flex>
  );
};
