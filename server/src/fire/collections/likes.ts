import { FireCollection } from "@rei-sogawa/unfireorm";
import { CollectionReference } from "firebase-admin/firestore";
import { head } from "lodash";

import { likeConverter, LikeData, LikeDoc } from "../docs";

export class LikesCollection extends FireCollection<LikeData, LikeDoc> {
  constructor(ref: CollectionReference) {
    super(ref, (snap) => new LikeDoc(snap), likeConverter);
  }

  async find({ senderId, receiverId }: { senderId: string; receiverId: string }) {
    const docs = await this.findManyByQuery((ref) =>
      ref.where("senderId", "==", senderId).where("receiverId", "==", receiverId)
    );
    return head(docs);
  }

  create({ senderId, receiverId }: { senderId: string; receiverId: string }) {
    return this.insert(LikeDoc.createData({ senderId, receiverId }));
  }
}
