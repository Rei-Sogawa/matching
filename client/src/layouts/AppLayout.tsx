import { Box } from "@chakra-ui/react";
import { FC } from "react";

export const AppLayout: FC = ({ children }) => {
  return (
    <Box h="full" bg="white">
      {children}
    </Box>
  );
};
