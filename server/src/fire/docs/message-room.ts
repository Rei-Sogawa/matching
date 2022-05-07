import { CollectionReference, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

import { MessagesCollection } from "../collections/messages";
import { FireDocument } from "../lib/fire-document";

const MessageRoomSchema = z.object({
  likeId: z.string().min(1),
  userIds: z.array(z.string().min(1)).length(2),
  open: z.boolean(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});

export type MessageRoomData = z.infer<typeof MessageRoomSchema>;

export class MessageRoomDoc extends FireDocument<MessageRoomData> implements MessageRoomData {
  static create(
    collection: CollectionReference<MessageRoomData>,
    { likeId, userIds }: { likeId: string; userIds: string[] }
  ) {
    const docRef = collection.doc();
    const createdAt = Timestamp.now();
    return new MessageRoomDoc({
      id: docRef.id,
      ref: docRef,
      data: () => ({
        likeId,
        userIds,
        open: false,
        createdAt,
        updatedAt: createdAt,
      }),
    });
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

  toBatch() {
    const { id, ref, messages, ...data } = this;
    return [ref, data] as const;
  }

  touch() {
    return this.edit({ open: true, updatedAt: Timestamp.now() });
  }

  partnerId(userId: string) {
    return this.userIds.filter((id) => id !== userId)[0];
  }
}
