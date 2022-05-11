import { Timestamp } from "firebase-admin/firestore";

import { LikeStatus } from "../../graphql/generated";
import { LikeIndexData } from "../collections/like-index";
import { LikesCollection } from "../collections/likes";
import { FireDocument } from "../lib/fire-document";

export type LikeData = {
  senderId: string;
  receiverId: string;
  status: "PENDING" | "MATCHED" | "SKIPPED";
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export class LikeDoc extends FireDocument<LikeData> implements LikeData {
  senderId!: string;
  receiverId!: string;
  status!: LikeStatus;
  createdAt!: Timestamp;
  updatedAt!: Timestamp;

  get toIndex() {
    const { id, ref, ...data } = this;
    const { senderId, receiverId, status, createdAt } = data;
    const index: LikeIndexData = { id, senderId, receiverId, status, createdAt };
    return index;
  }

  skip() {
    if (this.status !== "PENDING") throw new Error("this.status is not PENDING");
    return this.edit({ status: "SKIPPED", updatedAt: Timestamp.now() });
  }

  match() {
    if (this.status !== "PENDING") throw new Error("this.status is not PENDING");
    return this.edit({ status: "MATCHED", updatedAt: Timestamp.now() });
  }

  static create(collection: LikesCollection, { senderId, receiverId }: Pick<LikeData, "senderId" | "receiverId">) {
    const createdAt = Timestamp.now();
    const data: LikeData = {
      senderId,
      receiverId,
      status: "PENDING",
      createdAt,
      updatedAt: createdAt,
    };
    return new LikeDoc(this.createInput(collection, null, data));
  }
}
