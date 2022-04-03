import { FC } from "react";

export const AppLayout: FC = ({ children }) => {
  return <div className="h-screen bg-white">{children}</div>;
};
