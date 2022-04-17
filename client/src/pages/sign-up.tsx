import { gql } from "@apollo/client";
import { Box, Container, HStack, Stack } from "@chakra-ui/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { AppLink } from "../components/base/AppLink";
import { SignUpForm } from "../components/domain/SignUpForm";
import { SignUpInput, useSignUpMutation } from "../graphql/generated";
import { routes } from "../routes";

gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      id
      ...UserForMe
    }
  }
`;

export const SignUpPage: FC = () => {
  const navigate = useNavigate();

  const [mutate] = useSignUpMutation();
  const signUp = async ({ displayName, email, password }: SignUpInput) => {
    await mutate({ variables: { input: { displayName, email, password } } });
    await signInWithEmailAndPassword(getAuth(), email, password);
    navigate(routes["/"].path());
  };

  return (
    <Box minH="full" bg="gray.50">
      <Container minH="full" py="10">
        <Stack>
          <Box alignSelf="center" fontWeight="bold" fontSize="2xl">
            Matching!
          </Box>
          <SignUpForm onSubmit={signUp} />
          <HStack>
            <AppLink to={routes["/log-in"].path()}>Log In</AppLink>
            <AppLink to={routes["/"].path()}>Back</AppLink>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
};
