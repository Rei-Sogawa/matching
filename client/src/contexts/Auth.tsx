import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";

type State = { initialized: boolean; uid: string | undefined; token: string | undefined };

const useAuthContainer = () => {
  const [state, setState] = useState<State>({
    initialized: false,
    uid: undefined,
    token: undefined,
  });

  useEffect(() => {
    onAuthStateChanged(getAuth(), async (authUser) => {
      if (authUser) {
        const token = await getIdToken(authUser, true);
        setState({ initialized: true, uid: authUser.uid, token });
      } else {
        setState({ initialized: true, uid: undefined, token: undefined });
      }
    });
  }, []);

  return state;
};

const AuthContainer = createContainer(useAuthContainer);
export const AuthProvider = AuthContainer.Provider;
export const useAuth = AuthContainer.useContainer;
