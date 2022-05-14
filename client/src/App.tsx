import { gql } from "@apollo/client";
import { FC, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Apollo } from "./contexts/Apollo";
import { AuthProvider } from "./contexts/Auth";
import { GlobalProvider } from "./contexts/Global";
import { MeProvider } from "./contexts/Me";
import { useUpdateUserLastAccessMutation } from "./graphql/generated";
import { Compose } from "./middleware/Compose";
import { paths, routes } from "./routes";

gql`
  mutation UpdateUserLastAccess {
    updateUserLastAccess {
      id
    }
  }
`;

const useUpdateUserLastAccess = () => {
  const [mutate] = useUpdateUserLastAccessMutation();

  useEffect(() => {
    (async () => {
      await mutate();
    })();
  }, []);
};

const Pages: FC = () => {
  useUpdateUserLastAccess();

  return (
    <Routes>
      {paths.map((path) => {
        const { Component, middleware } = routes[path];
        return (
          <Route
            key={path}
            path={path}
            element={
              <Compose components={middleware}>
                <Component />
              </Compose>
            }
          />
        );
      })}
    </Routes>
  );
};

export const App: FC = () => {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <AuthProvider>
          <Apollo>
            <MeProvider>
              <Pages />
            </MeProvider>
          </Apollo>
        </AuthProvider>
      </GlobalProvider>
    </BrowserRouter>
  );
};
