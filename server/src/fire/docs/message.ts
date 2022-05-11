import { Timestamp } from "firebase-admin/firestore";
import { v4 } from "uuid";
import { z } from "zod";

import { assertDefined } from "../../utils/assert-defined";
import { MessagesCollection } from "../collections/messages";
import { FireDocument } from "../lib/fire-document";

const MessageDataSchema = z.object({
  __id: z.string().min(1),
  userId: z.string().min(1),
  content: z.string().min(1),
  createdAt: z.instanceof(Timestamp),
});

export type MessageData = z.infer<typeof MessageDataSchema>;

export class MessageDoc extends FireDocument<MessageData> implements MessageData {
  __id!: string;
  userId!: string;
  content!: string;
  createdAt!: Timestamp;

  get messageRoomId() {
    assertDefined(this.ref.parent.parent);
    return this.ref.parent.parent.id;
  }

  static create(collection: MessagesCollection, { userId, content }: Pick<MessageData, "userId" | "content">) {
    const createdAt = Timestamp.now();
    const data: MessageData = {
      __id: v4(),
      userId,
      content,
      createdAt,
    };
    return new MessageDoc(this.createInput(collection, data.__id, data));
  }
}
