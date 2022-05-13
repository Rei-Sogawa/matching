import { CollectionReference } from "firebase-admin/firestore";

import { LikeIndexCollection } from "./like-index";

export class UserLikeIndexCollection {
  private cache: Record<string, LikeIndexCollection> = {};

  constructor(private ref: CollectionReference) {}

  of(userId: string) {
    if (!this.cache[userId]) this.cache[userId] = new LikeIndexCollection(this.ref.doc(userId).collection("likeIndex"));
    return this.cache[userId];
  }
}
