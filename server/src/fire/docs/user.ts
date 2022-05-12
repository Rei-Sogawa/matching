import { Timestamp } from "firebase-admin/firestore";

import { Gender } from "../../graphql/generated";
import { LikeIndexCollection } from "../collections/like-index";
import { UserIndexData } from "../collections/user-index";
import { UsersCollection } from "../collections/users";
import { FireDocument } from "../lib/fire-document";

export type UserData = {
  gender: Gender;
  nickName: string;
  age: number;
  livingPref: string;
  photoPaths: string[];
  lastAccessedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export interface UserDoc extends UserData {}
export class UserDoc extends FireDocument<UserData> {
  likeIndexCollection = new LikeIndexCollection(this.ref.collection("likeIndex"));

  get indexData() {
    const { id, ref, ...data } = this;
    const { gender, age, livingPref, lastAccessedAt } = data;
    const index: UserIndexData = { id, gender, age, livingPref, lastAccessedAt };
    return index;
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
    return new UserDoc(this.makeCreateInput(collection, id, data));
  }

  access() {
    return this.edit({ lastAccessedAt: Timestamp.now() });
  }
}
