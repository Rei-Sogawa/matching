import { CollectionReference } from "firebase-admin/firestore";

import { UserIndexData } from "../docs/user";
import { FireIndex } from "../lib/fire-index";

export class UserIndexCollection extends FireIndex<UserIndexData> {
  docIds = ["0", "1", "2"];

  constructor(ref: CollectionReference) {
    super(ref);
  }
}
