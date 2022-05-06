import { CollectionReference } from "firebase-admin/firestore";

import { UserData, UserDoc } from "../docs/user";
import { FireCollection } from "../lib/fire-collection";

export class UsersCollection extends FireCollection<UserData, UserDoc> {
  constructor(ref: CollectionReference) {
    super(ref, (snap) => new UserDoc(snap));
  }
}
