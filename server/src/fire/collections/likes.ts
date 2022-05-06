import { CollectionReference } from "firebase-admin/firestore";
import { head } from "lodash";

import { LikeData, LikeDoc } from "../docs/like";
import { FireCollection } from "../lib/fire-collection";

export class LikesCollection extends FireCollection<LikeData, LikeDoc> {
  constructor(ref: CollectionReference) {
    super(ref, (snap) => new LikeDoc(snap));
  }

  async find({ senderId, receiverId }: { senderId: string; receiverId: string }) {
    const docs = await this.query((ref) => ref.where("senderId", "==", senderId).where("receiverId", "==", receiverId));
    return head(docs);
  }
}
