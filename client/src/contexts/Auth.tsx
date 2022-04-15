import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";
import { createContext, FC, useContext, useEffect, useState } from "react";

import { assertIsDefined } from "../utils/assert-is-defined";

type State = { initialized: boolean; uid: string | undefined; token: string | undefined };

const useAuthProvider = () => {
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

const AuthContext = createContext<State | undefined>(undefined);

export const AuthProvider: FC = ({ children }) => {
  const state = useAuthProvider();
  return state.initialized ? <AuthContext.Provider value={state}>{children}</AuthContext.Provider> : null;
};

export const useAuth = () => {
  const state = useContext(AuthContext);
  assertIsDefined(state);
  return state;
};
