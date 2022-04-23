import { gql } from "@apollo/client";
import { createContext, FC, useContext } from "react";

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

export const MeProvider: FC = ({ children }) => {
  const { uid } = useAuth();
  const { data, loading } = useMeQuery({ skip: !uid });

  if (!uid) return <>{children}</>;
  if (loading) return null;
  if (!data) throw new Error("Not found me");

  return <MeContext.Provider value={data.me}>{children}</MeContext.Provider>;
};

export const useMe = () => {
  const me = useContext(MeContext);
  assertIsDefined(me);
  return me;
};
