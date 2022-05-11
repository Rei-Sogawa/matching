import { authorize } from "../../authorize";
import { Context } from "../../context";
import { MessageDoc } from "../../fire/docs/message";
import { MessageRoomEventDoc } from "../../fire/docs/message-room-event";
import { CreateMessageInput } from "../../graphql/generated";

export const createMessageMutation = async (_: unknown, args: { input: CreateMessageInput }, context: Context) => {
  authorize(context);

  const { messageRoomId, content } = args.input;
  const { uid } = context.auth;
  const { messageRoomsCollection, messageRoomEventsCollection } = context.collections;

  const messageRoom = await messageRoomsCollection.findOne(messageRoomId);
  if (!messageRoom.isMember(uid)) throw new Error("not messageRoom member");

  const message = await MessageDoc.create(messageRoom.messages, { userId: uid, content }).save();

  await messageRoom.touch().save();
  await MessageRoomEventDoc.create(messageRoomEventsCollection, {
    messageRoomId: messageRoom.id,
    messageId: message.id,
    action: "CREATE",
  }).save();

  return message;
};
