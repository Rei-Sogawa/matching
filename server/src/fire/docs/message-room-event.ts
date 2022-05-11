import { Timestamp } from "firebase-admin/firestore";

import { MessageRoomEventsCollection } from "../collections/message-room-events";
import { FireDocument } from "../lib/fire-document";

export type MessageRoomEventData = {
  action: "CREATE";
  createdAt: Timestamp;
  messageRoomId: string;
  messageId: string;
};

export class MessageRoomEventDoc extends FireDocument<MessageRoomEventData> implements MessageRoomEventData {
  action!: "CREATE";
  createdAt!: Timestamp;
  messageRoomId!: string;
  messageId!: string;

  static create(
    collection: MessageRoomEventsCollection,
    { action, messageRoomId, messageId }: Pick<MessageRoomEventData, "action" | "messageRoomId" | "messageId">
  ) {
    const createdAt = Timestamp.now();
    const data: MessageRoomEventData = {
      action,
      createdAt,
      messageRoomId,
      messageId,
    };
    return new MessageRoomEventDoc(this.createInput(collection, null, data));
  }
}
