import { FireCollection } from "@rei-sogawa/unfireorm";
import { CollectionReference } from "firebase-admin/firestore";

import { UserData, UserDoc } from "../docs/user";
import { createConverter } from "./../helpers/create-converter";

export class UsersCollection extends FireCollection<UserData, UserDoc> {
  constructor(ref: CollectionReference) {
    super(ref, (snap) => new UserDoc(snap), createConverter<UserData>());
  }
}
