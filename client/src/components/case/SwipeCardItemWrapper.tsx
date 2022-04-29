import { Box, BoxProps } from "@chakra-ui/react";
import { FC } from "react";
import { animated } from "react-spring";

const _SwipeCardItemWrapper: FC<BoxProps> = (props) => (
  <Box
    position="absolute"
    display="flex"
    justifyContent="center"
    alignItems="center"
    h="full"
    w="full"
    willChange="transform"
    sx={{ touchAction: "none" }}
    {...props}
  />
);

export const SwipeCardItemWrapper = animated(_SwipeCardItemWrapper);
