import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";
import { createContext, FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { assertDefined } from "../utils/assert-defined";
import { useGlobal } from "./Global";

type State = { initialized: boolean; uid: string | undefined; token: string | undefined };

const useAuthProvider = () => {
  const navigate = useNavigate();

  const { redirect, setRedirect } = useGlobal();

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

  useEffect(() => {
    if (!redirect) return;
    navigate(redirect);
    setRedirect(null);
  }, [state.uid]);

  return state;
};

const AuthContext = createContext<State | undefined>(undefined);

export const AuthProvider: FC = ({ children }) => {
  const state = useAuthProvider();
  return state.initialized ? <AuthContext.Provider value={state}>{children}</AuthContext.Provider> : null;
};

export const useAuth = () => {
  const state = useContext(AuthContext);
  assertDefined(state);
  return state;
};
