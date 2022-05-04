import { FireDocument, FireDocumentInput } from "@rei-sogawa/unfireorm";
import { z } from "zod";

import { createConverter } from "../helpers/create-converter";

const AllUsersStatSchema = z.object({
  userIds: z.array(z.string().min(1)),
});

export type AllUsersStatData = z.infer<typeof AllUsersStatSchema>;

export const allUsersStatConverter = createConverter<AllUsersStatData>();

export class AllUsersStatDoc extends FireDocument<AllUsersStatData> implements AllUsersStatData {
  userIds!: string[];

  constructor(snap: FireDocumentInput) {
    super(snap, allUsersStatConverter);
  }

  toData() {
    const { id, ref, ...data } = this;
    return data;
  }

  toBatch() {
    const { id, ref, ...data } = this;
    return [ref, data] as const;
  }

  signUp(userId: string) {
    return this.edit({ userIds: [...this.userIds, userId] });
  }
}
