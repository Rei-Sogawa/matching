import { FireDocument, FireDocumentInput } from "@rei-sogawa/unfireorm";
import { z } from "zod";

import { now } from "../../utils/now";
import { createConverter } from "../helpers/create-converter";

const UserSchema = z.object({
  gender: z.enum(["MALE", "FEMALE"]),
  nickName: z.string().min(1),
  age: z.number().int().min(18),
  livingPref: z.string().min(1),
  photoPaths: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserData = z.infer<typeof UserSchema>;

export const userConverter = createConverter<UserData>();

export class UserDoc extends FireDocument<UserData> implements UserData {
  gender!: "MALE" | "FEMALE";
  nickName!: string;
  age!: number;
  livingPref!: string;
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

  static create(newData: Omit<UserData, "createdAt" | "updatedAt">): UserData {
    const createdAt = now();
    return UserSchema.parse({ ...newData, createdAt, updatedAt: createdAt });
  }

  edit(editData: Omit<UserData, "createdAt" | "updatedAt">) {
    const updatedAt = now();
    UserSchema.parse(this.toData());
    Object.assign(this, { ...editData, updatedAt });
  }
}
