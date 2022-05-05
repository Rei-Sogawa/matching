import { FireCollection } from "@rei-sogawa/unfireorm";
import { CollectionReference } from "firebase-admin/firestore";
import { head } from "lodash";

import { LikeData, LikeDoc } from "../docs/like";

export class LikesCollection extends FireCollection<LikeData, LikeDoc> {
  constructor(ref: CollectionReference) {
    super(ref, (snap) => new LikeDoc(snap));
  }

  async find({ senderId, receiverId }: { senderId: string; receiverId: string }) {
    const docs = await this.findManyByQuery((ref) =>
      ref.where("senderId", "==", senderId).where("receiverId", "==", receiverId)
    );
    return head(docs);
  }
}
