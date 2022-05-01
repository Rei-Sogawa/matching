import { FireDocument, FireDocumentInput } from "@rei-sogawa/unfireorm";
import { z } from "zod";

import { createConverter } from "../helpers/create-converter";

const UsersStatSchema = z.object({
  userIds: z.array(z.string()),
});

export type UsersStatData = z.infer<typeof UsersStatSchema>;

export const usersStatConverter = createConverter<UsersStat>();

export class UsersStat extends FireDocument<UsersStatData> implements UsersStat {
  userIds!: string[];

  constructor(snap: FireDocumentInput<UsersStatData>) {
    super(snap, usersStatConverter);
  }

  toData() {
    const { id, ref, ...data } = this;
    return UsersStatSchema.parse(data);
  }
}
