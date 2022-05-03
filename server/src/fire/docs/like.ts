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
  static createData(data: Omit<LikeData, "status" | "createdAt" | "updatedAt">) {
    const createdAt = getNow();
    return LikeSchema.parse({ ...data, status: "PENDING", createdAt, updatedAt: createdAt });
  }

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
    return LikeSchema.parse(data);
  }

  edit(data: Partial<Omit<LikeData, "createdAt" | "updatedAt">>) {
    const updatedAt = getNow();
    Object.assign(this, { ...data, updatedAt });
    LikeSchema.parse(this.toData());
    return this;
  }

  match() {
    this.edit({ status: "MATCHED" });
    return this.update();
  }

  matchData() {
    return { status: "MATCHED" };
  }
}
