import { Context } from "../../../context";
import { MessageRoomDoc } from "../../../fire/docs/message-room";
import { ViewerMessageRoomArgs } from "../../../graphql/generated";
import { ViewerType } from "../../../resolvers/query";

export const messageRoomQuery = async (
  { uid }: ViewerType,
  { messageRoomId }: ViewerMessageRoomArgs,
  { collections: { messageRoomsCollection } }: Context
): Promise<MessageRoomDoc> => {
  const messageRoom = await messageRoomsCollection.findOne(messageRoomId);
  if (!messageRoom.isMember(uid)) throw new Error("can't get messageRoom, because not a messageRoom member");
  return messageRoom;
};
