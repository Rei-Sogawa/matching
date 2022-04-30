import { Box, Container, Flex } from "@chakra-ui/react";
import { FC } from "react";

export const AppMenu: FC = () => {
  return (
    <Box h="16">
      <Box w="full" h="16" position="fixed" bottom="0" zIndex={100} borderTopWidth="1px" borderColor="gray.200">
        <Container h="full" bg="white">
          <Flex justifyContent="space-between">
            <Box>Matching!</Box>
            <Box>Manu</Box>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};
