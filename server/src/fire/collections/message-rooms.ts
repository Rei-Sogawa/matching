import { CollectionReference, Timestamp } from "firebase-admin/firestore";

import { MessageRoomData, MessageRoomDoc } from "../docs/message-room";
import { FireCollection } from "../lib/fire-collection";

export class MessageRoomsCollection extends FireCollection<MessageRoomData, MessageRoomDoc> {
  constructor(ref: CollectionReference) {
    super(ref, (snap) => new MessageRoomDoc(snap));
  }

  async paginatedOpenedMessageRooms({
    first,
    after,
    userId,
  }: {
    first: number;
    after: Timestamp | null | undefined;
    userId: string;
  }) {
    return after
      ? this.findManyByQuery((ref) =>
          ref
            .orderBy("createdAt", "desc")
            .where("userIds", "array-contains", userId)
            .where("opened", "==", true)
            .startAfter(after)
            .limit(first)
        )
      : this.findManyByQuery((ref) =>
          ref
            .orderBy("createdAt", "desc")
            .where("userIds", "array-contains", userId)
            .where("opened", "==", true)
            .limit(first)
        );
  }

  async paginatedNewMessageRooms({
    first,
    after,
    userId,
  }: {
    first: number;
    after: Timestamp | null | undefined;
    userId: string;
  }) {
    return after
      ? this.findManyByQuery((ref) =>
          ref
            .orderBy("createdAt", "desc")
            .where("userIds", "array-contains", userId)
            .where("open", "==", false)
            .startAfter(after)
            .limit(first)
        )
      : this.findManyByQuery((ref) =>
          ref
            .orderBy("createdAt", "desc")
            .where("userIds", "array-contains", userId)
            .where("open", "==", false)
            .limit(first)
        );
  }
}
