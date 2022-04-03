import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ReactNode, useMemo, VFC } from "react";

import { useAuth } from "./Auth";

const getAuthLink = (token?: string) => {
  return setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });
};

const getClient = (token?: string) => {
  const httpLink = createHttpLink({ uri: import.meta.env.VITE_GRAPHQL_ENDPOINT });
  const cache = new InMemoryCache();

  return new ApolloClient({
    link: getAuthLink(token).concat(httpLink),
    cache,
  });
};

type ApolloProps = {
  children: ReactNode;
};

export const Apollo: VFC<ApolloProps> = ({ children }) => {
  const { token } = useAuth();
  const client = useMemo(() => {
    console.log("Apollo client initialized!");
    return getClient(token);
  }, [token]);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
