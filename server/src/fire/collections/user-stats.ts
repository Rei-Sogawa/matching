import { FireCollection } from "@rei-sogawa/unfireorm";
import { CollectionReference } from "firebase-admin/firestore";

import { userStatConverter, UserStatData, UserStatDoc } from "../docs";

export class UserStatsCollection extends FireCollection<UserStatData, UserStatDoc> {
  constructor(ref: CollectionReference) {
    super(ref, (snap) => new UserStatDoc(snap), userStatConverter);
  }

  create(id: string) {
    return this.insert({ id, sendLikeUserIds: [], receiveLikeUserIds: [], skipLikeUserIds: [], matchUserIds: [] });
  }
}
