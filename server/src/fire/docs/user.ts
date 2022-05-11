import { Timestamp } from "firebase-admin/firestore";

import { Gender } from "../../graphql/generated";
import { UserIndexData } from "../collections/user-index";
import { UsersCollection } from "../collections/users";
import { FireDocument, FireDocumentInput } from "../lib/fire-document";

export type UserData = {
  gender: "MALE" | "FEMALE";
  nickName: string;
  age: number;
  livingPref: string;
  photoPaths: string[];
  lastAccessedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export class UserDoc extends FireDocument<UserData> implements UserData {
  gender!: Gender;
  nickName!: string;
  age!: number;
  livingPref!: string;
  photoPaths!: string[];
  lastAccessedAt!: Timestamp;
  createdAt!: Timestamp;
  updatedAt!: Timestamp;

  get toIndex() {
    const { id, ref, ...data } = this;
    const { gender, age, livingPref, lastAccessedAt } = data;
    const index: UserIndexData = { id, gender, age, livingPref, lastAccessedAt };
    return index;
  }

  access() {
    return this.edit({ lastAccessedAt: Timestamp.now() });
  }

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
}
