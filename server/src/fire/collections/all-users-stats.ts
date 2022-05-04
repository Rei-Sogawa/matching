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
    return this.ref
      .doc(this.docId)
      .get()
      .then((snap) => {
        const data = snap.data() ?? { userIds: [] };
        return new AllUsersStatDoc({ id: snap.id, ref: snap.ref, data: () => data });
      });
  }
}
