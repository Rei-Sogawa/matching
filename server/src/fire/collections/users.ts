import { FireCollection } from "@rei-sogawa/unfireorm";
import { CollectionReference } from "firebase-admin/firestore";

import { getNow } from "../../utils/get-now";
import { userConverter, UserData, UserDoc } from "../docs/user";

export class UsersCollection extends FireCollection<UserData, UserDoc> {
  constructor(ref: CollectionReference) {
    super(ref, (snap) => new UserDoc(snap), userConverter);
  }

  create(id: string) {
    const createdAt = getNow();
    return this.insert({
      id,
      gender: "MALE",
      nickName: "ニックネーム",
      age: 30,
      livingPref: "東京都",
      photoPaths: [],
      createdAt,
      updatedAt: createdAt,
    });
  }
}
