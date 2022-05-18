import { FC, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Apollo } from "./contexts/Apollo";
import { AuthProvider } from "./contexts/Auth";
import { GlobalProvider } from "./contexts/Global";
import { GlobalSubscriber } from "./contexts/GlobalSubscriber";
import { MeProvider } from "./contexts/Me";
import { useUpdateUserLastAccess } from "./hooks/domain/user";
import { paths, routes } from "./routes";

const Pages: FC = () => {
  const { updateUserLastAccess } = useUpdateUserLastAccess();

  useEffect(() => {
    updateUserLastAccess();
  }, []);

  return (
    <Routes>
      {paths.map((path) => {
        const { Component } = routes[path];
        return <Route key={path} path={path} element={<Component />} />;
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
              <GlobalSubscriber>
                <Pages />
              </GlobalSubscriber>
            </MeProvider>
          </Apollo>
        </AuthProvider>
      </GlobalProvider>
    </BrowserRouter>
  );
};
