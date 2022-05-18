import { Box, Container, Stack } from "@chakra-ui/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FC } from "react";

import { AppHeading } from "../components/base/AppHeading";
import { AppLink } from "../components/base/AppLink";
import { SignUpForm, SignUpFormProps } from "../components/common/SignUpForm";
import { useGlobal } from "../contexts/Global";
import { withNoAuthenticated } from "../hocs/withNoAuthenicated";
import { useSignUp } from "../hooks/domain/user";
import { routes } from "../routes";

const _SignUpPage: FC = () => {
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
          <AppHeading alignSelf="center">Matching!</AppHeading>

          <SignUpForm onSubmit={onSubmit} />

          <AppLink to={routes["/log-in"].path()}>ログインはこちら</AppLink>
        </Stack>
      </Container>
    </Box>
  );
};

export const SignUpPage: FC = withNoAuthenticated(_SignUpPage);
