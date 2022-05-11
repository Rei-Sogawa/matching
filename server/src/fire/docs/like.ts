import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

import { LikeStatus } from "../../graphql/generated";
import { LikeIndexData } from "../collections/like-index";
import { LikesCollection } from "../collections/likes";
import { FireDocument, FireDocumentInput } from "../lib/fire-document";

const LikeDataSchema = z
  .object({
    senderId: z.string().min(1),
    receiverId: z.string().min(1),
    status: z.enum(["PENDING", "MATCHED", "SKIPPED"]),
    createdAt: z.instanceof(Timestamp),
    updatedAt: z.instanceof(Timestamp),
  })
  .strict();

export type LikeData = z.infer<typeof LikeDataSchema>;

export class LikeDoc extends FireDocument<LikeData> implements LikeData {
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

  senderId!: string;
  receiverId!: string;
  status!: LikeStatus;
  createdAt!: Timestamp;
  updatedAt!: Timestamp;

  constructor(snap: FireDocumentInput<LikeData>) {
    super(snap);
  }

  toData() {
    const { id, ref, ...data } = this;
    return data;
  }

  toIndex() {
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
}
