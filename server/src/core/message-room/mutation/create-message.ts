import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { MessageDoc } from "../../../fire/docs/message";
import { MutationCreateMessageArgs } from "../../../graphql/generated";
import { onCreateMessage } from "../../../psuedo-trigger/message-room";

export const createMessageMutation = async (
  _: unknown,
  { input }: MutationCreateMessageArgs,
  { auth, collections: { messageRoomsCollection, messageRoomEventsCollection } }: Context
) => {
  authorize(auth);

  const messageRoom = await messageRoomsCollection.findOne(input.messageRoomId);
  if (!messageRoom.isMember(auth.uid)) throw new Error("can't createMessage, because not a messageRoom member");

  const message = MessageDoc.create(messageRoom.messagesCollection, { userId: auth.uid, content: input.content });

  await message.save();
  await messageRoom.touch().save();
  await onCreateMessage({ messageRoom, message }, { messageRoomEventsCollection });

  return message;
};
