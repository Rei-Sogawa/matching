import { FireCollection } from "@rei-sogawa/unfireorm";
import { CollectionReference } from "firebase-admin/firestore";

import { allUsersStatConverter, AllUsersStatDoc } from "../docs/all-users-stat";

export type AllUsersStatData = {
  userIds: string[];
};

export class AllUsersStatsCollection extends FireCollection<AllUsersStatData, AllUsersStatDoc> {
  docId = "0";

  constructor(ref: CollectionReference) {
    super(ref, (snap) => new AllUsersStatDoc(snap), allUsersStatConverter);
  }

  get() {
    return this.findOneById(this.docId);
  }
}
