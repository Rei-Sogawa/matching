import { Timestamp } from "firebase-admin/firestore";

import { LikeStatus } from "../../graphql/generated";
import { LikesCollection } from "../collections/likes";
import { LikeIndexData } from "../index/like-index";
import { FireDocument } from "../lib/fire-document";

export type LikeData = {
  status: LikeStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  senderId: string;
  receiverId: string;
};

export interface LikeDoc extends LikeData {}
export class LikeDoc extends FireDocument<LikeData> {
  get indexData() {
    const { id, ref, ...data } = this;
    const { status, createdAt, senderId, receiverId } = data;
    const index: LikeIndexData = { id, status, createdAt, senderId, receiverId };
    return index;
  }

  static create(collection: LikesCollection, { senderId, receiverId }: Pick<LikeData, "senderId" | "receiverId">) {
    const createdAt = Timestamp.now();
    const data: LikeData = {
      status: "PENDING",
      createdAt,
      updatedAt: createdAt,
      senderId,
      receiverId,
    };
    return new LikeDoc(this.makeCreateInput(collection, null, data));
  }

  skip() {
    if (this.status !== "PENDING") throw new Error("Can't skip, because status is not PENDING");
    return this.edit({ status: "SKIPPED", updatedAt: Timestamp.now() });
  }

  match() {
    if (this.status !== "PENDING") throw new Error("Can't match, because status is not PENDING");
    return this.edit({ status: "MATCHED", updatedAt: Timestamp.now() });
  }
}
