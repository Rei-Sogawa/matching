import { FireDocument, FireDocumentInput } from "@rei-sogawa/unfireorm";
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
  senderId!: string;
  receiverId!: string;
  status!: LikeStatus;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(snap: FireDocumentInput<LikeData>) {
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

  match() {
    return this.edit({ status: "MATCHED", updatedAt: getNow() });
  }
}
