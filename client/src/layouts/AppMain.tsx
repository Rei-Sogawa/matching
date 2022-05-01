import { Box, Container } from "@chakra-ui/react";
import { FC } from "react";

export const AppMain: FC = ({ children }) => {
  return (
    <Box flex="1" py="8" overflow="auto">
      <Container>{children}</Container>
    </Box>
  );
};
