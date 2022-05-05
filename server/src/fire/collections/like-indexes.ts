import { FireCollection } from "@rei-sogawa/unfireorm";
import { CollectionReference } from "firebase-admin/firestore";
import { merge, shuffle } from "lodash";

import { LikeIndexData, LikeIndexDoc } from "../docs/like-index";

export class LikeIndexesCollection extends FireCollection<LikeIndexData, LikeIndexDoc> {
  docIds = ["0", "1", "2"];

  constructor(ref: CollectionReference) {
    super(ref, (snap) => new LikeIndexDoc(snap));
  }

  get() {
    return this.findManyByQuery((ref) => ref).then((docs) =>
      docs.map((doc) => doc.toData()).reduce((prev, curr) => merge(prev, curr), {} as LikeIndexData)
    );
  }

  getOne() {
    const docId = shuffle(this.docIds)[0];
    return this.ref
      .doc(docId)
      .get()
      .then((doc) => {
        const data = doc.data();
        return data ? data : ({} as LikeIndexData);
      });
  }
}
