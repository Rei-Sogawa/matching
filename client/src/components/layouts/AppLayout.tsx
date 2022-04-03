import { FC } from "react";

export const AppLayout: FC = ({ children }) => {
  return <div className="h-full bg-white">{children}</div>;
};
