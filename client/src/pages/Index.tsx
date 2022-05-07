import { FC } from "react";
import { Navigate } from "react-router-dom";

import { routes } from "../routes";

export const IndexPage: FC = () => {
  return <Navigate to={routes["/users"].path()} />;
};
