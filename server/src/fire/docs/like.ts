import { FireDocument, FireDocumentInput } from "@rei-sogawa/unfireorm";
import { CollectionReference } from "firebase-admin/firestore";
import { z } from "zod";

import { LikeStatus } from "../../graphql/generated";
import { getNow } from "../../utils/get-now";
import { createConverter } from "../helpers/create-converter";

const LikeSchema = z
  .object({
    senderId: z.string().min(1),
    receiverId: z.string().min(1),
    status: z.enum(["PENDING", "MATCHED", "SKIPPED"]),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type LikeData = z.infer<typeof LikeSchema>;

export const likeConverter = createConverter<LikeData>();

export class LikeDoc extends FireDocument<LikeData> implements LikeData {
  static create(
    collection: CollectionReference<LikeData>,
    { senderId, receiverId }: Pick<LikeData, "senderId" | "receiverId">
  ) {
    const docRef = collection.doc();
    const createdAt = getNow();
    return new LikeDoc({
      id: docRef.id,
      ref: docRef,
      data: () => ({
        senderId,
        receiverId,
        status: "PENDING",
        createdAt,
        updatedAt: createdAt,
      }),
    });
  }

  senderId!: string;
  receiverId!: string;
  status!: LikeStatus;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(snap: FireDocumentInput) {
    super(snap, likeConverter);
  }

  toData() {
    const { id, ref, ...data } = this;
    return data;
  }

  toBatch() {
    const { id, ref, ...data } = this;
    return [ref, data] as const;
  }

  skip() {
    return this.edit({ status: "SKIPPED", updatedAt: getNow() });
  }

  match() {
    return this.edit({ status: "MATCHED", updatedAt: getNow() });
  }
}
