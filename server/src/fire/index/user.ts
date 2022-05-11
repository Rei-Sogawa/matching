import { DocumentReference } from "firebase-admin/firestore";

import { LikeIndexCollection } from "../collections/like-index";

export class UserIndex {
  likeIndex = new LikeIndexCollection(this.ref.collection("likeIndex"));

  constructor(public ref: DocumentReference) {}
}
