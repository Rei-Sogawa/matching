import { Flex } from "@chakra-ui/react";
import { FC } from "react";

import { AppMain } from "./AppMain";
import { AppMenu } from "./AppMenu";

export type AppLayoutProps = {
  footer: boolean;
};

export const AppLayout: FC<AppLayoutProps> = ({ children, footer }) => {
  return (
    <Flex direction="column" h="full">
      <AppMain>{children}</AppMain>
      {footer && <AppMenu />}
    </Flex>
  );
};
