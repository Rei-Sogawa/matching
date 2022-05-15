import { Box, BoxProps } from "@chakra-ui/react";
import { FC } from "react";

export const AppHeading: FC<BoxProps> = (props) => {
  return <Box fontWeight="bold" fontSize="xl" {...props} />;
};
