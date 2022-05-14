import { MessageRoomEventsCollection } from "../../fire/collections/message-room-events";
import { MessageDoc } from "../../fire/docs/message";
import { MessageRoomEventDoc } from "../../fire/docs/message-room-event";

export const onCreateMessage = async (
  message: MessageDoc,
  collections: { messageRoomEventsCollection: MessageRoomEventsCollection }
) => {
  await MessageRoomEventDoc.create(collections.messageRoomEventsCollection, {
    action: "CREATE",
    messageRoomId: message.messageRoomId,
    messageId: message.id,
  }).save();
};
