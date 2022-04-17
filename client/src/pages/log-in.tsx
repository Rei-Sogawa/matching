import { Box, Container, HStack, Stack } from "@chakra-ui/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { AppLink } from "../components/base/AppLink";
import { LogInForm } from "../components/domain/LogInForm";
import { routes } from "../routes";

export const LogInPage: FC = () => {
  const navigate = useNavigate();

  const logIn = async ({ email, password }: { email: string; password: string }) => {
    console.log(email, password);
    await signInWithEmailAndPassword(getAuth(), email, password);
    navigate(routes["/"].path());
  };

  return (
    <Box h="full" py="20" bg="gray.50">
      <Container>
        <Stack>
          <Box alignSelf="center" fontWeight="bold" fontSize="2xl">
            Matching!
          </Box>
          <LogInForm onSubmit={logIn} />
          <HStack>
            <AppLink to={routes["/sign-up"].path()}>Sign Up</AppLink>
            <AppLink to={routes["/"].path()}>Back</AppLink>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
};
