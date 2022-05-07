import { CollectionReference, Timestamp } from "firebase-admin/firestore";

import { MessageData, MessageDoc } from "../docs/message";
import { FireCollection } from "../lib/fire-collection";

export class MessagesCollection extends FireCollection<MessageData, MessageDoc> {
  constructor(ref: CollectionReference) {
    super(ref, (snap) => new MessageDoc(snap));
  }

  async paginatedMessages({ first, after }: { first: number; after: Timestamp | null | undefined }) {
    return after
      ? this.query((ref) => ref.orderBy("createdAt", "desc").startAfter(after).limit(first))
      : this.query((ref) => ref.orderBy("createdAt", "desc").limit(first));
  }
}
