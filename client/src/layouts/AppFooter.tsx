import { Box, Container } from "@chakra-ui/react";
import { FC } from "react";

export const AppFooter: FC = ({ children }) => {
  return (
    <Box py={{ base: "2", md: "4" }} borderTopWidth="1px" borderColor="gray.200">
      <Container>{children}</Container>
    </Box>
  );
};
