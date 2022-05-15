import { FC } from "react";

import { useSubscribeMessageRooms } from "../hooks/domain/message-room";

export const GlobalSubscriber: FC = ({ children }) => {
  useSubscribeMessageRooms();
  return <>{children}</>;
};
