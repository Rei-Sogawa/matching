import { FireDocument, FireDocumentInput } from "@rei-sogawa/unfireorm";
import { z } from "zod";

import { now } from "../../utils/now";
import { createConverter } from "../helpers/create-converter";

const UserSchema = z.object({
  displayName: z.string().min(1),
  photoPaths: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserData = z.infer<typeof UserSchema>;

export const userConverter = createConverter<UserData>();

export class UserDoc extends FireDocument<UserData> implements UserData {
  displayName!: string;
  photoPaths!: string[];
  createdAt!: Date;
  updatedAt!: Date;

  constructor(snap: FireDocumentInput<UserData>) {
    super(snap, userConverter);
  }

  toData() {
    const { id, ref, ...data } = this;
    return UserSchema.parse(data);
  }

  static createData({ displayName, photoPaths }: Omit<UserData, "createdAt" | "updatedAt">): UserData {
    const createdAt = now();
    const userData = { displayName, photoPaths, createdAt, updatedAt: createdAt };
    UserSchema.parse(userData);
    return userData;
  }

  edit({ displayName, photoPaths }: Omit<UserData, "createdAt" | "updatedAt">) {
    const updatedAt = now();
    Object.assign(this, { displayName, photoPaths, updatedAt });
    UserSchema.parse(this.toData());
  }
}
