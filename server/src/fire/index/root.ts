import { Firestore } from "firebase-admin/firestore";

import { UserIndexCollection } from "../collections/user-index";

export class RootIndex {
  userIndex = new UserIndexCollection(this.db.collection("userIndex"));

  constructor(public db: Firestore) {}
}
