import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

import { MessageRoomsCollection } from "../collections/message-rooms";
import { MessagesCollection } from "../collections/messages";
import { FireDocument } from "../lib/fire-document";

const MessageRoomDataSchema = z.object({
  likeId: z.string().min(1),
  userIds: z.array(z.string().min(1)).length(2),
  open: z.boolean(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});

export type MessageRoomData = z.infer<typeof MessageRoomDataSchema>;

export class MessageRoomDoc extends FireDocument<MessageRoomData> implements MessageRoomData {
  static create(
    collection: MessageRoomsCollection,
    { likeId, userIds }: { likeId: string; userIds: [string, string] }
  ) {
    const createdAt = Timestamp.now();
    const data: MessageRoomData = {
      likeId,
      userIds,
      open: false,
      createdAt,
      updatedAt: createdAt,
    };
    return new MessageRoomDoc(this.createInput(collection, null, data));
  }

  likeId!: string;
  userIds!: string[];
  open!: boolean;
  createdAt!: Timestamp;
  updatedAt!: Timestamp;

  messages = new MessagesCollection(this.ref.collection("messages"));

  toData() {
    const { id, ref, messages, ...data } = this;
    return data;
  }

  touch() {
    return this.edit({ open: true, updatedAt: Timestamp.now() });
  }

  partnerId(userId: string) {
    return this.userIds.filter((id) => id !== userId)[0];
  }

  isMember(userId: string) {
    return this.userIds.includes(userId);
  }
}
