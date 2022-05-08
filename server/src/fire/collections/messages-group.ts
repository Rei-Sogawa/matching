import { CollectionGroup } from "firebase-admin/firestore";

import { MessageData, MessageDoc } from "../docs/message";
import { FireGroupCollection } from "../lib/fire-collection";

export class MessagesGroupCollection extends FireGroupCollection<MessageData, MessageDoc> {
  constructor(ref: CollectionGroup) {
    super(ref, "__id", (snap) => new MessageDoc(snap));
  }
}
