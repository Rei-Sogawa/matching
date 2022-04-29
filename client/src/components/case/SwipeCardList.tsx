import { Box, BoxProps } from "@chakra-ui/react";
import { FC } from "react";
import { animated } from "react-spring";

const _SwipeCardList: FC<BoxProps> = (props) => (
  <Box
    position="absolute"
    h="full"
    w="full"
    display="flex"
    alignItems="center"
    justifyContent="center"
    willChange="transform"
    sx={{ touchAction: "none" }}
    {...props}
  />
);

export const SwipeCardList = animated(_SwipeCardList);
