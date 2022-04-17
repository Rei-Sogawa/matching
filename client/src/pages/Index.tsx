import { Box, HStack, Stack } from "@chakra-ui/react";
import { getAuth, signOut } from "firebase/auth";
import { FC } from "react";

import { AppLink } from "../components/base/AppLink";
import { useAuth } from "../contexts/Auth";
import { useMeQuery } from "../graphql/generated";
import { routes } from "../routes";

export const IndexPage: FC = () => {
  const { uid } = useAuth();
  const { data, loading } = useMeQuery({ skip: !uid });

  const logOut = async () => {
    await signOut(getAuth());
  };

  return loading ? null : (
    <Stack h="full" bg="gray.50" justifyContent="center" alignItems="center">
      <Box fontWeight="bold" fontSize="2xl">
        {data?.me.displayName || "Not Logged In"}
      </Box>
      {uid ? (
        <HStack>
          <AppLink to={routes["/likes"].path()}>Likes</AppLink>
          <AppLink
            to="#"
            onClick={async (e) => {
              e.preventDefault();
              await logOut();
            }}
          >
            LogOut
          </AppLink>
        </HStack>
      ) : (
        <HStack>
          <AppLink to={routes["/sign-up"].path()}>SignUp</AppLink>
          <AppLink to={routes["/log-in"].path()}>LogIn</AppLink>
        </HStack>
      )}
    </Stack>
  );
};
