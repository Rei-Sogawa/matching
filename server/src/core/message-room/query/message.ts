import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { MessageDoc } from "../../../fire/docs/message";
import { QueryMessageArgs } from "../../../graphql/generated";

export const messageQuery = async (
  _: unknown,
  { messageId }: QueryMessageArgs,
  { auth, collections: { messageRoomsCollection, messagesCollectionGroup } }: Context
): Promise<MessageDoc> => {
  authorize(auth);

  const message = await messagesCollectionGroup.findOne(messageId);
  const messageRoom = await messageRoomsCollection.findOne(message.messageRoomId);
  if (!messageRoom.isMember(auth.uid)) throw new Error("can't get message, because not a messageRoom member");

  return message;
};
