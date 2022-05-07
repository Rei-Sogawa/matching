import { Box, Container } from "@chakra-ui/react";
import { FC } from "react";

export const AppMain: FC = ({ children }) => {
  return (
    <Box flex="1" overflow="auto" py="6">
      <Container>{children}</Container>
    </Box>
  );
};
