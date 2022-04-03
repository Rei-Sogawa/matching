import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Apollo } from "./contexts/Apollo";
import { AuthProvider, useAuth } from "./contexts/Auth";
import { Me } from "./contexts/Me";
import { paths, routes } from "./routes";

const AuthInitialized: FC = ({ children }) => {
  const { initialized } = useAuth();
  return initialized ? <>{children}</> : null;
};

const Pages: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {paths.map((path) => {
          const { Component } = routes[path];
          return <Route key={path} path={path} element={<Component />} />;
        })}
      </Routes>
    </BrowserRouter>
  );
};

export const App: FC = () => {
  return (
    <AuthProvider>
      <AuthInitialized>
        <Apollo>
          <Me>
            <Pages />
          </Me>
        </Apollo>
      </AuthInitialized>
    </AuthProvider>
  );
};
