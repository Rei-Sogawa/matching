import { gql } from "@apollo/client";
import { Box, Container, HStack, Stack } from "@chakra-ui/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FC } from "react";

import { AppLink } from "../components/base/AppLink";
import { SignUpForm, SignUpFormProps } from "../components/domain/SignUpForm";
import { useSignUpMutation } from "../graphql/generated";
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
  const [signUpMutate] = useSignUpMutation();

  const signUp: SignUpFormProps["onSubmit"] = async ({ email, password }) => {
    await signUpMutate({ variables: { input: { email, password } } });
    await signInWithEmailAndPassword(getAuth(), email, password);
  };

  return (
    <Box minH="full" bg="white">
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
