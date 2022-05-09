import { authorize } from "../../authorize";
import { Context } from "../../context";
import { MessageInput } from "../../graphql/generated";

export const messageQuery = async (_: unknown, args: { input: MessageInput }, context: Context) => {
  authorize(context);

  const { input } = args;
  const { uid } = context.auth;
  const { messageRoomsCollection } = context.collections;

  const messageRoom = await messageRoomsCollection.get(input.messageRoomId);

  if (!messageRoom.isMember(uid)) throw new Error("not messageRoom member");

  return messageRoom.messages.get(input.messageId);
};
