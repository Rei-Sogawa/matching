import { ComponentType } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/Auth";
import { routes } from "../routes";

export const withAuthenticated =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => {
    const WithStateComponent = () => {
      const { uid } = useAuth();
      if (!uid) return <Navigate to={routes["/log-in"].path()} />;
      return <Component {...props} />;
    };

    return WithStateComponent();
  };
