import { Box } from "@chakra-ui/react";
import { FC } from "react";

export const AppLayout: FC = ({ children }) => {
  return (
    <Box h="full" py="10" overflow="auto" bg="white">
      {children}
    </Box>
  );
};
