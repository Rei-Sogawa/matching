import { gql } from "@apollo/client";
import { createContext, FC, useContext } from "react";

import { AppLoading } from "../components/base/AppLoading";
import { MeProviderFragment, useMeQuery } from "../graphql/generated";
import { assertDefined } from "../utils/assert-defined";
import { useAuth } from "./Auth";

gql`
  fragment MeProvider on Me {
    id
    gender
    nickName
    age
    livingPref
    photoPaths
    photoUrls
  }
`;

gql`
  query me {
    viewer {
      id
      me {
        id
        ...MeProvider
      }
    }
  }
`;

const MeContext = createContext<MeProviderFragment | undefined>(undefined);

export const MeProvider: FC = ({ children }) => {
  const { uid } = useAuth();
  const { data, loading } = useMeQuery({ skip: !uid });

  if (!uid) return <>{children}</>;
  if (loading) return <AppLoading />;
  if (!data) throw new Error("Not found me");

  return <MeContext.Provider value={data.viewer.me}>{children}</MeContext.Provider>;
};

export const useMe = () => {
  const me = useContext(MeContext);
  assertDefined(me);
  return { me };
};
