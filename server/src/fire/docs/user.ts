import { FireDocument, FireDocumentInput } from "@rei-sogawa/unfireorm";
import { CollectionReference } from "firebase-admin/firestore";
import { z } from "zod";

import { Gender } from "../../graphql/generated";
import { getNow } from "../../utils/get-now";
import { createConverter } from "../helpers/create-converter";

const UserSchema = z
  .object({
    gender: z.enum(["MALE", "FEMALE"]),
    nickName: z.string().min(1),
    age: z.number().int().min(18),
    livingPref: z.string().min(1),
    photoPaths: z.array(z.string()),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type UserData = z.infer<typeof UserSchema>;

export const userConverter = createConverter<UserData>();

export class UserDoc extends FireDocument<UserData> implements UserData {
  static create(collection: CollectionReference<UserData>) {
    const docRef = collection.doc();
    const createdAt = getNow();
    return new UserDoc({
      id: docRef.id,
      ref: docRef,
      data: () => ({
        gender: "MALE",
        nickName: "ニックネーム",
        age: 30,
        livingPref: "東京都",
        photoPaths: [],
        createdAt,
        updatedAt: createdAt,
      }),
    });
  }

  gender!: Gender;
  nickName!: string;
  age!: number;
  livingPref!: string;
  photoPaths!: string[];
  createdAt!: Date;
  updatedAt!: Date;

  constructor(snap: FireDocumentInput) {
    super(snap, userConverter);
  }

  toData() {
    const { id, ref, ...data } = this;
    return data;
  }

  toBatch() {
    const { id, ref, ...data } = this;
    return [ref, data] as const;
  }
}
