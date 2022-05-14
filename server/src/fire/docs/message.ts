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

export interface MessageDoc extends MessageData {}
export class MessageDoc extends FireDocument<MessageData> {
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
    return new MessageDoc(this.makeCreateInput(collection, data.__id, data));
  }

  static createLatestMessageAlternative(
    collection: MessagesCollection,
    { userId, createdAt }: Pick<MessageData, "userId" | "createdAt">
  ) {
    const docRef = collection.ref.doc();
    return new MessageDoc({
      id: docRef.id,
      ref: docRef,
      data: () => ({
        __id: docRef.id,
        content: "メッセージを送信してみましょう！",
        createdAt,
        userId,
      }),
    });
  }
}
