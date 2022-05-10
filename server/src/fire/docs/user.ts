import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

import { Gender } from "../../graphql/generated";
import { UserIndexData } from "../collections/user-index";
import { UsersCollection } from "../collections/users";
import { FireDocument, FireDocumentInput } from "../lib/fire-document";

const UserDataSchema = z
  .object({
    gender: z.enum(["MALE", "FEMALE"]),
    nickName: z.string().min(1),
    age: z.number().int().min(18),
    livingPref: z.string().min(1),
    photoPaths: z.array(z.string()),
    lastAccessedAt: z.instanceof(Timestamp),
    createdAt: z.instanceof(Timestamp),
    updatedAt: z.instanceof(Timestamp),
  })
  .strict();

export type UserData = z.infer<typeof UserDataSchema>;

export class UserDoc extends FireDocument<UserData> implements UserData {
  static create(collection: UsersCollection, id: string) {
    const createdAt = Timestamp.now();
    const data: UserData = {
      gender: "MALE",
      nickName: "ニックネーム",
      age: 30,
      livingPref: "東京都",
      photoPaths: [],
      lastAccessedAt: createdAt,
      createdAt,
      updatedAt: createdAt,
    };
    return new UserDoc(this.createInput(collection, id, data));
  }

  gender!: Gender;
  nickName!: string;
  age!: number;
  livingPref!: string;
  photoPaths!: string[];
  lastAccessedAt!: Timestamp;
  createdAt!: Timestamp;
  updatedAt!: Timestamp;

  constructor(snap: FireDocumentInput<UserData>) {
    super(snap);
  }

  toData() {
    const { id, ref, ...data } = this;
    return data;
  }

  toIndex() {
    const { id, ref, ...data } = this;
    const { gender, age, livingPref, lastAccessedAt } = data;
    const index: UserIndexData = { id, gender, age, livingPref, lastAccessedAt };
    return index;
  }

  access() {
    return this.edit({ lastAccessedAt: Timestamp.now() });
  }
}
