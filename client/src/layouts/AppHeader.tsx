import { Container, Flex } from "@chakra-ui/react";
import { FC } from "react";

export const AppHeader: FC = ({ children }) => {
  return (
    <Flex h="16" alignItems="center" borderBottomWidth="1px" borderColor="gray.200">
      <Container>{children}</Container>
    </Flex>
  );
};
