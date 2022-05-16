import { MessageRoomEventsCollection } from "../../fire/collections/message-room-events";
import { MessageDoc } from "../../fire/docs/message";
import { MessageRoomDoc } from "../../fire/docs/message-room";
import { MessageRoomEventDoc } from "../../fire/docs/message-room-event";

export const onCreateMessage = async (
  messageRoom: MessageRoomDoc,
  message: MessageDoc,
  { messageRoomEventsCollection }: { messageRoomEventsCollection: MessageRoomEventsCollection }
) => {
  await MessageRoomEventDoc.create(messageRoomEventsCollection, {
    action: "CREATE",
    messageRoomId: messageRoom.id,
    messageId: message.id,
    userIds: messageRoom.userIds,
  }).save();
};
