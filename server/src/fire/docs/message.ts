import { Timestamp } from "firebase-admin/firestore";
import { v4 } from "uuid";

import { assertDefined } from "../../utils/assert-defined";
import { MessagesCollection } from "../collections/messages";
import { FireDocument } from "../lib/fire-document";

export type MessageData = {
  __id: string;
  content: string;
  createdAt: Timestamp;
  userId: string;
};

export class MessageDoc extends FireDocument<MessageData> implements MessageData {
  __id!: string;
  content!: string;
  createdAt!: Timestamp;
  userId!: string;

  get messageRoomId() {
    assertDefined(this.ref.parent.parent);
    return this.ref.parent.parent.id;
  }

  static create(collection: MessagesCollection, { userId, content }: Pick<MessageData, "userId" | "content">) {
    const createdAt = Timestamp.now();
    const data: MessageData = {
      __id: v4(),
      content,
      createdAt,
      userId,
    };
    return new MessageDoc(this.createInput(collection, data.__id, data));
  }
}
