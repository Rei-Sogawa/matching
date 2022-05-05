import { FireCollection } from "@rei-sogawa/unfireorm";
import { CollectionReference } from "firebase-admin/firestore";

import { LikeIndexData, LikeIndexDoc } from "../docs/like-index";

export class LikeIndexesCollection extends FireCollection<LikeIndexData, LikeIndexDoc> {
  constructor(ref: CollectionReference) {
    super(ref, (snap) => new LikeIndexDoc(snap));
  }
}
