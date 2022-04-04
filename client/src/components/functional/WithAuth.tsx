import { FC } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../contexts/Auth";
import { routes } from "../../routes";

export const WithAuth: FC = ({ children }) => {
  const { uid } = useAuth();
  if (!uid) return <Navigate to={routes["/log-in"].path()} />;
  return <>{children}</>;
};
