import { Timestamp } from "firebase-admin/firestore";

import { MessageRoomsCollection } from "../collections/message-rooms";
import { MessagesCollection } from "../collections/messages";
import { FireDocument } from "../lib/fire-document";

export type MessageRoomData = {
  opened: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  likeId: string;
  userIds: [string, string];
};

export interface MessageRoomDoc extends MessageRoomData {}
export class MessageRoomDoc extends FireDocument<MessageRoomData> {
  messagesCollection = new MessagesCollection(this.ref.collection("messages"));

  static create(collection: MessageRoomsCollection, { likeId, userIds }: Pick<MessageRoomData, "likeId" | "userIds">) {
    const createdAt = Timestamp.now();
    const data: MessageRoomData = {
      opened: false,
      createdAt,
      updatedAt: createdAt,
      likeId,
      userIds,
    };
    return new MessageRoomDoc(this.makeCreateInput(collection, null, data));
  }

  partnerId(userId: string) {
    return this.userIds.filter((id) => id !== userId)[0];
  }

  isMember(userId: string) {
    return this.userIds.includes(userId);
  }

  touch() {
    return this.edit({ opened: true, updatedAt: Timestamp.now() });
  }
}
