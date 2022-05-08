import { CollectionReference, Timestamp } from "firebase-admin/firestore";

import { FireDocument } from "../lib/fire-document";

export type MessageRoomEventData = {
  messageRoomId: string;
  messageId: string;
  action: "CREATE";
  createdAt: Timestamp;
};

export class MessageRoomEventDoc extends FireDocument<MessageRoomEventData> implements MessageRoomEventData {
  static create(
    collection: CollectionReference<MessageRoomEventData>,
    { messageRoomId, messageId, action }: Pick<MessageRoomEventData, "messageRoomId" | "messageId" | "action">
  ) {
    const docRef = collection.doc();
    const createdAt = Timestamp.now();
    return new MessageRoomEventDoc({
      id: docRef.id,
      ref: docRef,
      data: () => ({
        messageRoomId,
        messageId,
        action,
        createdAt,
      }),
    });
  }

  messageRoomId!: string;
  messageId!: string;
  action!: "CREATE";
  createdAt!: Timestamp;

  toData() {
    const { id, ref, ...data } = this;
    return data;
  }
}
