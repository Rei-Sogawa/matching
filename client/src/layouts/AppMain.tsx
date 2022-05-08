import { Box, BoxProps, Container } from "@chakra-ui/react";
import { forwardRef, ReactNode } from "react";

type AppMain = {
  children: ReactNode;
} & BoxProps;

// eslint-disable-next-line react/display-name
export const AppMain = forwardRef<HTMLDivElement, AppMain>(({ children, ...rest }, ref) => {
  return (
    <Box flex="1" overflow="auto" py="6" {...rest} ref={ref}>
      <Container>{children}</Container>
    </Box>
  );
});
