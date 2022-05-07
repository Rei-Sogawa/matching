import { CollectionReference, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

import { FireDocument } from "../lib/fire-document";

const MessageSchema = z.object({
  userId: z.string().min(1),
  content: z.string().min(1),
  createdAt: z.instanceof(Timestamp),
});

export type MessageData = z.infer<typeof MessageSchema>;

export class MessageDoc extends FireDocument<MessageData> implements MessageData {
  static create(
    collection: CollectionReference<MessageData>,
    { userId, content }: Pick<MessageData, "userId" | "content">
  ) {
    const docRef = collection.doc();
    const createdAt = Timestamp.now();
    return new MessageDoc({
      id: docRef.id,
      ref: docRef,
      data: () => ({
        userId,
        content,
        createdAt,
      }),
    });
  }

  userId!: string;
  content!: string;
  createdAt!: Timestamp;

  toData() {
    const { id, ref, ...data } = this;
    return data;
  }

  toBatch() {
    const { id, ref, ...data } = this;
    return [ref, data] as const;
  }
}
