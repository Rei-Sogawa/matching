import { FC } from "react";
import { Navigate, useParams } from "react-router-dom";

import { useMe } from "../contexts/Me";
import { routes } from "../routes";

export const AuthorizeUser: FC = ({ children }) => {
  const { userId } = useParams();
  const me = useMe();
  if (userId !== me.id) return <Navigate to={routes["/"].path()} />;
  return <>{children}</>;
};
