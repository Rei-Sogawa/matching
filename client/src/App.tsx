import { gql } from "@apollo/client";
import { Swiper } from "antd-mobile";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Apollo } from "./contexts/Apollo";
import { AuthProvider } from "./contexts/Auth";
import { paths, routes } from "./routes";

export function App() {
  return (
    <AuthProvider>
      <Apollo>
        <BrowserRouter>
          <Routes>
            {paths.map((path) => {
              const { Component } = routes[path];
              return <Route key={path} path={path} element={<Component />} />;
            })}
          </Routes>
        </BrowserRouter>
      </Apollo>
    </AuthProvider>
  );
}
