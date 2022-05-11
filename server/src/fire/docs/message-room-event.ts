import { Timestamp } from "firebase-admin/firestore";

import { MessageRoomEventsCollection } from "../collections/message-room-events";
import { FireDocument } from "../lib/fire-document";

export type MessageRoomEventData = {
  messageRoomId: string;
  messageId: string;
  action: "CREATE";
  createdAt: Timestamp;
};

export class MessageRoomEventDoc extends FireDocument<MessageRoomEventData> implements MessageRoomEventData {
  messageRoomId!: string;
  messageId!: string;
  action!: "CREATE";
  createdAt!: Timestamp;

  static create(
    collection: MessageRoomEventsCollection,
    { messageRoomId, messageId, action }: Pick<MessageRoomEventData, "messageRoomId" | "messageId" | "action">
  ) {
    const createdAt = Timestamp.now();
    const data: MessageRoomEventData = {
      messageRoomId,
      messageId,
      action,
      createdAt,
    };
    return new MessageRoomEventDoc(this.createInput(collection, null, data));
  }
}
