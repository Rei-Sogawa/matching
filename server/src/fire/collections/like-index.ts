import { CollectionReference, Timestamp } from "firebase-admin/firestore";
import { filter, orderBy, take } from "lodash";

import { LikeIndexData } from "../docs/like";
import { FireIndex } from "../lib/fire-index";

export class LikeIndexCollection extends FireIndex<LikeIndexData> {
  docIds = ["0", "1", "2"];

  constructor(ref: CollectionReference) {
    super(ref);
  }

  async sendLikes(userId: string) {
    return this.get()
      .then((ary) => filter(ary, (e) => e.senderId === userId))
      .then((ary) => orderBy(ary, (e) => e.createdAt, "desc"));
  }

  async receiveLikes(userId: string) {
    return this.get()
      .then((ary) => filter(ary, (e) => e.receiverId === userId))
      .then((ary) => orderBy(ary, (e) => e.createdAt, "desc"));
  }

  async paginatedSendLikes({
    userId,
    first,
    after,
  }: {
    userId: string;
    first: number;
    after: Timestamp | null | undefined;
  }) {
    return this.get()
      .then((ary) => filter(ary, (e) => e.senderId === userId))
      .then((ary) => orderBy(ary, (e) => e.createdAt, "desc"))
      .then((ary) => filter(ary, (e) => (after ? e.createdAt < after : true)))
      .then((ary) => take(ary, first));
  }
}
