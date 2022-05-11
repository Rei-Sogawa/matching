import { Timestamp } from "firebase-admin/firestore";

import { LikeStatus } from "../../graphql/generated";
import { LikeIndexData } from "../collections/like-index";
import { LikesCollection } from "../collections/likes";
import { FireDocument } from "../lib/fire-document";

export type LikeData = {
  status: "PENDING" | "MATCHED" | "SKIPPED";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  senderId: string;
  receiverId: string;
};

export class LikeDoc extends FireDocument<LikeData> implements LikeData {
  status!: LikeStatus;
  createdAt!: Timestamp;
  updatedAt!: Timestamp;
  senderId!: string;
  receiverId!: string;

  get toIndex() {
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
    return new LikeDoc(this.createInput(collection, null, data));
  }

  skip() {
    if (this.status !== "PENDING") throw new Error("this.status is not PENDING");
    return this.edit({ status: "SKIPPED", updatedAt: Timestamp.now() });
  }

  match() {
    if (this.status !== "PENDING") throw new Error("this.status is not PENDING");
    return this.edit({ status: "MATCHED", updatedAt: Timestamp.now() });
  }
}
