import { Center, Spinner } from "@chakra-ui/react";
import { FC } from "react";

export const AppLoading: FC = () => (
  <Center h="full">
    <Spinner size="lg" />
  </Center>
);
