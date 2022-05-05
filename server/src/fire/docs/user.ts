import { FireDocument, FireDocumentInput } from "@rei-sogawa/unfireorm";
import { CollectionReference, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

import { Gender } from "../../graphql/generated";

const UserSchema = z
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

export type UserData = z.infer<typeof UserSchema>;

export class UserDoc extends FireDocument<UserData> implements UserData {
  static create(collection: CollectionReference<UserData>, { id }: { id: string }) {
    const docRef = collection.doc(id);
    const createdAt = Timestamp.now();
    return new UserDoc({
      id: docRef.id,
      ref: docRef,
      data: () => ({
        gender: "MALE",
        nickName: "ニックネーム",
        age: 30,
        livingPref: "東京都",
        photoPaths: [],
        lastAccessedAt: createdAt,
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
  lastAccessedAt!: Timestamp;
  createdAt!: Timestamp;
  updatedAt!: Timestamp;

  constructor(snap: FireDocumentInput) {
    super(snap);
  }

  toData() {
    const { id, ref, ...data } = this;
    return data;
  }

  toBatch() {
    const { id, ref, ...data } = this;
    return [ref, data] as const;
  }

  access() {
    return this.edit({ lastAccessedAt: Timestamp.now() });
  }
}
