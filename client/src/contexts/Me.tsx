import { gql } from "@apollo/client";
import { createContext, ReactNode, useContext, VFC } from "react";

import { useMeQuery, UserForMeFragment } from "../graphql/generated";
import { assertIsDefined } from "../utils/assert-is-defined";
import { useAuth } from "./Auth";

gql`
  fragment UserForMe on User {
    id
    displayName
  }
`;

gql`
  query me {
    me {
      id
      ...UserForMe
    }
  }
`;

const MeContext = createContext<UserForMeFragment | undefined>(undefined);

type MeProps = {
  children: ReactNode;
};

export const Me: VFC<MeProps> = ({ children }) => {
  const { uid } = useAuth();
  const { data, loading } = useMeQuery({ skip: !uid });
  if (!uid || loading) return <>{children}</>;
  if (!data) throw new Error("Not found me");
  return <MeContext.Provider value={data.me}>{children}</MeContext.Provider>;
};

export const useMe = () => {
  const me = useContext(MeContext);
  assertIsDefined(me);
  return me;
};
