import { Timestamp } from "firebase-admin/firestore";
import { filter, map, orderBy, take } from "lodash";

import { assertDefined } from "../../utils/assert-defined";
import { FireIndex } from "../lib/fire-index";

export type LikeIndexData = {
  id: string;
  status: "PENDING" | "MATCHED" | "SKIPPED";
  createdAt: Timestamp;
  senderId: string;
  receiverId: string;
};

export class LikeIndexCollection extends FireIndex<LikeIndexData> {
  docIds = ["0", "1", "2"];

  get userId() {
    assertDefined(this.ref.parent);
    return this.ref.parent.parent.id;
  }

  async sendLikeUserIds(userId: string) {
    return this.get()
      .then((ary) => orderBy(ary, (e) => e.createdAt, "desc"))
      .then((ary) => filter(ary, (e) => e.senderId === userId))
      .then((ary) => map(ary, (e) => e.receiverId));
  }

  async receiveLikeUserIds(userId: string) {
    return this.get()
      .then((ary) => orderBy(ary, (e) => e.createdAt, "desc"))
      .then((ary) => filter(ary, (e) => e.receiverId === userId))
      .then((ary) => map(ary, (e) => e.senderId));
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
