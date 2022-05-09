import { authorize } from "../../authorize";
import { Context } from "../../context";

export const messageQuery = async (_: unknown, args: { id: string }, context: Context) => {
  authorize(context);

  const { uid } = context.auth;
  const { messageRoomsCollection, messagesGroupCollection } = context.collections;

  const message = await messagesGroupCollection.get(args.id);
  const messageRoom = await messageRoomsCollection.get(message.messageRoomId);

  if (!messageRoom.isMember(uid)) throw new Error("not messageRoom member");

  return message;
};
