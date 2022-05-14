import { Box, Container, Stack } from "@chakra-ui/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FC } from "react";

import { AppLink } from "../components/base/AppLink";
import { SignUpForm, SignUpFormProps } from "../components/common/SignUpForm";
import { useGlobal } from "../contexts/Global";
import { useSignUp } from "../hooks/domain/useUser";
import { routes } from "../routes";

export const SignUpPage: FC = () => {
  const { setRedirect } = useGlobal();

  const { signUp } = useSignUp();

  const onSubmit: SignUpFormProps["onSubmit"] = async ({ email, password }) => {
    await signUp({ email, password });

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

          <SignUpForm onSubmit={onSubmit} />

          <AppLink to={routes["/log-in"].path()}>ログインはこちら</AppLink>
        </Stack>
      </Container>
    </Box>
  );
};
