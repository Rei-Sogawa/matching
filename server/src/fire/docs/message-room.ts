import { Timestamp } from "firebase-admin/firestore";

import { MessageRoomsCollection } from "../collections/message-rooms";
import { MessagesCollection } from "../collections/messages";
import { FireDocument } from "../lib/fire-document";

export type MessageRoomData = {
  open: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likeId: string;
  userIds: [string, string];
};

export class MessageRoomDoc extends FireDocument<MessageRoomData> implements MessageRoomData {
  open!: boolean;
  createdAt!: Timestamp;
  updatedAt!: Timestamp;
  likeId!: string;
  userIds!: [string, string];

  messages = new MessagesCollection(this.ref.collection("messages"));

  static create(collection: MessageRoomsCollection, { likeId, userIds }: Pick<MessageRoomData, "likeId" | "userIds">) {
    const createdAt = Timestamp.now();
    const data: MessageRoomData = {
      open: false,
      createdAt,
      updatedAt: createdAt,
      likeId,
      userIds,
    };
    return new MessageRoomDoc(this.createInput(collection, null, data));
  }

  partnerId(userId: string) {
    return this.userIds.filter((id) => id !== userId)[0];
  }

  isMember(userId: string) {
    return this.userIds.includes(userId);
  }

  touch() {
    return this.edit({ open: true, updatedAt: Timestamp.now() });
  }
}
