import { Box, BoxProps } from "@chakra-ui/react";
import { FC } from "react";
import { animated } from "react-spring";

const _SwipeCardItem: FC<BoxProps> = (props) => (
  <Box h="full" willChange="transform" sx={{ touchAction: "none" }} {...props} />
);

export const SwipeCardItem = animated(_SwipeCardItem);
