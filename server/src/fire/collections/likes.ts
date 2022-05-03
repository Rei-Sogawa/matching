import { FireCollection } from "@rei-sogawa/unfireorm";
import { CollectionReference } from "firebase-admin/firestore";

import { likeConverter, LikeData, LikeDoc } from "../docs";

export class LikesCollection extends FireCollection<LikeData, LikeDoc> {
  constructor(ref: CollectionReference) {
    super(ref, (snap) => new LikeDoc(snap), likeConverter);
  }
}
