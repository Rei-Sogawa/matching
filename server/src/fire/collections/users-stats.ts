import { CollectionReference } from "firebase-admin/firestore";

import { ShardsCollection } from "../helpers/shards-collection";

export type UsersStatData = {
  userIds: string[];
};

export class UsersStatShardsCollection extends ShardsCollection<UsersStatData> {
  constructor(ref: CollectionReference) {
    super(ref, 3);
  }
}
