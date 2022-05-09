import { authorize } from "../../authorize";
import { Context } from "../../context";

export const messageRoomQuery = async (_: unknown, args: { id: string }, context: Context) => {
  authorize(context);

  const { id } = args;
  const { uid } = context.auth;
  const { messageRoomsCollection } = context.collections;

  const messageRoom = await messageRoomsCollection.get(id);

  if (!messageRoom.isMember(uid)) throw new Error("not messageRoom member");

  return messageRoom;
};
