import { CollectionReference, Timestamp } from "firebase-admin/firestore";
import { filter, orderBy, take } from "lodash";

import { FireIndex } from "../lib/fire-index";

export type LikeIndexData = {
  id: string;
  senderId: string;
  receiverId: string;
  status: "PENDING" | "MATCHED" | "SKIPPED";
  createdAt: Timestamp;
};

export class LikeIndexCollection extends FireIndex<LikeIndexData> {
  docIds = ["0", "1", "2"];

  constructor(ref: CollectionReference) {
    super(ref);
  }

  async sendLikes(userId: string) {
    return this.get()
      .then((ary) => orderBy(ary, (e) => e.createdAt, "desc"))
      .then((ary) => filter(ary, (e) => e.senderId === userId));
  }

  async receiveLikes(userId: string) {
    return this.get()
      .then((ary) => orderBy(ary, (e) => e.createdAt, "desc"))
      .then((ary) => filter(ary, (e) => e.receiverId === userId));
  }

  async pendingReceiveLikes(userId: string) {
    return this.get()
      .then((ary) => orderBy(ary, (e) => e.createdAt, "desc"))
      .then((ary) => filter(ary, (e) => e.receiverId === userId))
      .then((ary) => filter(ary, (e) => e.status === "PENDING"));
  }

  async paginatedPendingSendLikes({
    first,
    after,
    userId,
  }: {
    first: number;
    after: Timestamp | null | undefined;
    userId: string;
  }) {
    return this.get()
      .then((ary) => orderBy(ary, (e) => e.createdAt, "desc"))
      .then((ary) => filter(ary, (e) => e.senderId === userId))
      .then((ary) => filter(ary, (e) => e.status === "PENDING"))
      .then((ary) => filter(ary, (e) => (after ? e.createdAt < after : true)))
      .then((ary) => take(ary, first));
  }
}
