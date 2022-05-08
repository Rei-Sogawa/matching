import { CollectionReference } from "firebase-admin/firestore";

import { MessageRoomEventData, MessageRoomEventDoc } from "../docs/message-room-event";
import { FireCollection } from "../lib/fire-collection";

export class MessageRoomEventsCollection extends FireCollection<MessageRoomEventData, MessageRoomEventDoc> {
  constructor(ref: CollectionReference) {
    super(ref, (snap) => new MessageRoomEventDoc(snap));
  }
}
