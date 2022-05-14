import { Timestamp } from "firebase-admin/firestore";
import { filter, map, orderBy, take } from "lodash";

import { LikeStatus } from "../../graphql/generated";
import { assertDefined } from "../../utils/assert-defined";
import { FireIndex } from "../lib/fire-index";

export type LikeIndexData = {
  id: string;
  status: LikeStatus;
  createdAt: Timestamp;
  senderId: string;
  receiverId: string;
};

export class LikeIndexCollection extends FireIndex<LikeIndexData> {
  docIds = ["0", "1", "2"];

  get userId() {
    assertDefined(this.ref.parent);
    return this.ref.parent.id;
  }

  async sendLikeUserIds() {
    return this.get()
      .then((ary) => orderBy(ary, (e) => e.createdAt, "desc"))
      .then((ary) => filter(ary, (e) => e.senderId === this.userId))
      .then((ary) => map(ary, (e) => e.receiverId));
  }

  async receiveLikeUserIds() {
    return this.get()
      .then((ary) => orderBy(ary, (e) => e.createdAt, "desc"))
      .then((ary) => filter(ary, (e) => e.receiverId === this.userId))
      .then((ary) => map(ary, (e) => e.senderId));
  }

  async pendingReceiveLikeUserIds() {
    return this.get()
      .then((ary) => orderBy(ary, (e) => e.createdAt, "desc"))
      .then((ary) => filter(ary, (e) => e.receiverId === this.userId))
      .then((ary) => filter(ary, (e) => e.status === "PENDING"))
      .then((ary) => map(ary, (e) => e.senderId));
  }

  async paginatedPendingSendLikeUserIds({ first, after }: { first: number; after: Timestamp | null | undefined }) {
    return this.get()
      .then((ary) => orderBy(ary, (e) => e.createdAt, "desc"))
      .then((ary) => filter(ary, (e) => e.senderId === this.userId))
      .then((ary) => filter(ary, (e) => e.status === "PENDING"))
      .then((ary) => filter(ary, (e) => (after ? e.createdAt < after : true)))
      .then((ary) => take(ary, first))
      .then((ary) => map(ary, (e) => e.receiverId));
  }

  async paginatedSkipLikeUserIds({ first, after }: { first: number; after: Timestamp | null | undefined }) {
    return this.get()
      .then((ary) => orderBy(ary, (e) => e.createdAt, "desc"))
      .then((ary) => filter(ary, (e) => e.receiverId === this.userId))
      .then((ary) => filter(ary, (e) => e.status === "SKIPPED"))
      .then((ary) => filter(ary, (e) => (after ? e.createdAt < after : true)))
      .then((ary) => take(ary, first))
      .then((ary) => map(ary, (e) => e.senderId));
  }
}
