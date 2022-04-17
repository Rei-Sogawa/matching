import { Box } from "@chakra-ui/react";
import { FC } from "react";

export const SwipeNopeBadge: FC = () => {
  return (
    <Box
      position="absolute"
      top="25%"
      left="10%"
      zIndex="10"
      transform="rotate(12deg)"
      px="2"
      borderWidth="4px"
      borderColor="red.400"
      rounded="md"
      fontWeight="bold"
      fontSize="5xl"
      color="red.400"
    >
      NOPE
    </Box>
  );
};
