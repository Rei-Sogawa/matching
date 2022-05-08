import { Flex, FlexProps } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

export type AppLayoutProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
} & FlexProps;

// eslint-disable-next-line react/display-name
export const AppLayout: FC<AppLayoutProps> = ({ children, header, footer, ...rest }) => {
  return (
    <Flex direction="column" h="full" {...rest}>
      {header}
      {children}
      {footer}
    </Flex>
  );
};
