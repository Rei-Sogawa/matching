import deepmerge from "deepmerge";
import { CollectionReference } from "firebase-admin/firestore";

export type AllUsersStatData = {
  userIds: string[];
};

export class AllUsersStatsCollection {
  docId = "0";
  ref: CollectionReference<AllUsersStatData>;

  constructor(ref: CollectionReference) {
    this.ref = ref as CollectionReference<AllUsersStatData>;
  }

  async merge(data: AllUsersStatData) {
    const doc = await this.ref.doc(this.docId).get();
    const prevData = doc.data();
    if (!prevData) {
      await doc.ref.set(data);
      return data;
    }
    const merged = deepmerge(prevData, data);
    await doc.ref.set(merged);
    return merged;
  }

  async get() {
    return this.ref
      .doc(this.docId)
      .get()
      .then((v) => v.data() ?? { userIds: [] });
  }
}
