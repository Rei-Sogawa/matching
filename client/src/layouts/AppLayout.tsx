import { Flex, FlexProps } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

import { AppMain } from "./AppMain";

export type AppLayoutProps = {
  header: ReactNode;
  footer: ReactNode;
} & FlexProps;

export const AppLayout: FC<AppLayoutProps> = ({ children, header, footer, ...rest }) => {
  return (
    <Flex direction="column" h="full" {...rest}>
      {header}
      <AppMain>{children}</AppMain>
      {footer}
    </Flex>
  );
};
