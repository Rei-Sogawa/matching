import { Box } from "@chakra-ui/react";
import { FC } from "react";

export const SwipeLikeBadge: FC = () => {
  return (
    <Box
      position="absolute"
      top="25%"
      right="25%"
      zIndex="10"
      transform="rotate(-12deg)"
      px="2"
      borderWidth="4px"
      borderColor="green.400"
      rounded="md"
      fontWeight="bold"
      fontSize="5xl"
      color="green.400"
    >
      LIKE
    </Box>
  );
};
