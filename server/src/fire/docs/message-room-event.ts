import { CollectionReference, Timestamp } from "firebase-admin/firestore";

import { FireDocument } from "../lib/fire-document";

export type MessageRoomEventData = {
  messageId: string;
  action: "CREATE";
  createdAt: Timestamp;
};

export class MessageRoomEventDoc extends FireDocument<MessageRoomEventData> implements MessageRoomEventData {
  static create(
    collection: CollectionReference<MessageRoomEventData>,
    { messageId, action }: Pick<MessageRoomEventData, "messageId" | "action">
  ) {
    const docRef = collection.doc();
    const createdAt = Timestamp.now();
    return new MessageRoomEventDoc({
      id: docRef.id,
      ref: docRef,
      data: () => ({
        messageId,
        action,
        createdAt,
      }),
    });
  }

  messageId!: string;
  action!: "CREATE";
  createdAt!: Timestamp;

  toData() {
    const { id, ref, ...data } = this;
    return data;
  }
}
