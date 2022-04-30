import { gql } from "@apollo/client";
import { Box, Container, HStack, Stack } from "@chakra-ui/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FC } from "react";

import { AppLink } from "../components/base/AppLink";
import { SignUpForm, SignUpFormProps } from "../components/common/SignUpForm";
import { useGlobal } from "../contexts/Global";
import { useSignUpMutation } from "../graphql/generated";
import { routes } from "../routes";
import { assertIsDefined } from "../utils/assert-is-defined";

gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      id
      ...MeForMe
    }
  }
`;

export const SignUpPage: FC = () => {
  const { setRedirect } = useGlobal();

  const [signUpMutate] = useSignUpMutation();

  const signUp: SignUpFormProps["onSubmit"] = async ({ email, password }) => {
    const { data } = await signUpMutate({
      variables: { input: { email, password } },
    });

    assertIsDefined(data);
    const redirect = routes["/my-page/profile/edit"].path();
    setRedirect(redirect);

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

          <AppLink to={routes["/log-in"].path()}>ログインはこちら</AppLink>
        </Stack>
      </Container>
    </Box>
  );
};
