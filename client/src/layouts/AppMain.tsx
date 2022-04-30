import { Box } from "@chakra-ui/react";
import { FC } from "react";

export const AppMain: FC = ({ children }) => {
  return (
    <Box py="6" overflow="auto">
      {children}
    </Box>
  );
};
