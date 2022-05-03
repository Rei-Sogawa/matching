import { FireDocument, FireDocumentInput } from "@rei-sogawa/unfireorm";
import { z } from "zod";

import { createConverter } from "../helpers/create-converter";

const UserStatSchema = z
  .object({
    sendLikeUserIds: z.array(z.string().min(1)),
    receiveLikeUserIds: z.array(z.string().min(1)),
    skipLikeUserIds: z.array(z.string().min(1)),
    matchUserIds: z.array(z.string().min(1)),
  })
  .strict();

export type UserStatData = z.infer<typeof UserStatSchema>;

export const userStatConverter = createConverter<UserStatData>();

export class UserStatDoc extends FireDocument<UserStatData> implements UserStatData {
  sendLikeUserIds!: string[];
  receiveLikeUserIds!: string[];
  skipLikeUserIds!: string[];
  matchUserIds!: string[];

  constructor(snap: FireDocumentInput<UserStatData>) {
    super(snap, userStatConverter);
  }

  toData() {
    const { id, ref, ...data } = this;
    return UserStatSchema.parse(data);
  }

  static create(data: UserStatData) {
    return UserStatSchema.parse(data);
  }

  edit(data: Partial<UserStatData>) {
    Object.assign(this, data);
    UserStatSchema.parse(this.toData());
    return this;
  }
}
