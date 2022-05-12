import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { MessageRoomDoc } from "../../../fire/docs/message-room";
import { QueryMessageRoomArgs } from "../../../graphql/generated";

export const messageRoomQuery = async (
  _: unknown,
  { messageRoomId }: QueryMessageRoomArgs,
  { auth, collections: { messageRoomsCollection } }: Context
): Promise<MessageRoomDoc> => {
  authorize(auth);

  const messageRoom = await messageRoomsCollection.findOne(messageRoomId);
  if (!messageRoom.isMember(auth.uid)) throw new Error("can't get messageRoom, because not a messageRoom member");

  return messageRoom;
};
