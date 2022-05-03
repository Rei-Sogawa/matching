import { FireCollection } from "@rei-sogawa/unfireorm";
import { CollectionReference } from "firebase-admin/firestore";

import { userConverter, UserData, UserDoc } from "../docs/user";

export class UsersCollection extends FireCollection<UserData, UserDoc> {
  constructor(ref: CollectionReference) {
    super(ref, (snap) => new UserDoc(snap), userConverter);
  }

  create(id: string) {
    return this.insert({ id, ...UserDoc.create() });
  }
}
