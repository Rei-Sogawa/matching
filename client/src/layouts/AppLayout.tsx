import { Flex, FlexProps } from "@chakra-ui/react";
import { FC } from "react";

import { AppMain } from "./AppMain";
import { AppMenu } from "./AppMenu";

export type AppLayoutProps = {
  footer: boolean;
} & FlexProps;

export const AppLayout: FC<AppLayoutProps> = ({ children, footer, ...rest }) => {
  return (
    <Flex direction="column" h="full" {...rest}>
      <AppMain>{children}</AppMain>
      {footer && <AppMenu />}
    </Flex>
  );
};
