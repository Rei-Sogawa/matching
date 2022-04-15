import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Apollo } from "./contexts/Apollo";
import { AuthProvider } from "./contexts/Auth";
import { Me } from "./contexts/Me";
import { Compose } from "./middleware/Compose";
import { paths, routes } from "./routes";

const Pages: FC = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export const App: FC = () => {
  return (
    <AuthProvider>
      <Apollo>
        <Me>
          <Pages />
        </Me>
      </Apollo>
    </AuthProvider>
  );
};
