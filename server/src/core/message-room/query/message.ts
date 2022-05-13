import { Context } from "../../../context";
import { MessageDoc } from "../../../fire/docs/message";
import { QueryMessageArgs } from "../../../graphql/generated";
import { ViewerType } from "../../../resolvers/query";

export const messageQuery = async (
  { uid }: ViewerType,
  { messageId }: QueryMessageArgs,
  { collections: { messageRoomsCollection, messagesCollectionGroup } }: Context
): Promise<MessageDoc> => {
  const message = await messagesCollectionGroup.findOne(messageId);
  const messageRoom = await messageRoomsCollection.findOne(message.messageRoomId);
  if (!messageRoom.isMember(uid)) throw new Error("can't get message, because not a messageRoom member");
  return message;
};
