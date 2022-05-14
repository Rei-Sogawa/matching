import { Timestamp } from "firebase-admin/firestore";

import { MessageRoomEventsCollection } from "../collections/message-room-events";
import { FireDocument } from "../lib/fire-document";

export type MessageRoomEventData = {
  action: "CREATE";
  createdAt: Timestamp;
  messageRoomId: string;
  messageId: string;
  userIds: [string, string];
};

export interface MessageRoomEventDoc extends MessageRoomEventData {}
export class MessageRoomEventDoc extends FireDocument<MessageRoomEventData> {
  static create(
    collection: MessageRoomEventsCollection,
    {
      action,
      messageRoomId,
      messageId,
      userIds,
    }: Pick<MessageRoomEventData, "action" | "messageRoomId" | "messageId" | "userIds">
  ) {
    const createdAt = Timestamp.now();
    const data: MessageRoomEventData = {
      action,
      createdAt,
      messageRoomId,
      messageId,
      userIds,
    };
    return new MessageRoomEventDoc(this.makeCreateInput(collection, null, data));
  }
}
