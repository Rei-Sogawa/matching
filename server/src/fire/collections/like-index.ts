import { CollectionReference } from "firebase-admin/firestore";

import { LikeIndexData } from "../docs/like";
import { FireIndex } from "../lib/fire-index";

export class LikeIndexCollection extends FireIndex<LikeIndexData> {
  docIds = ["0", "1", "2"];

  constructor(ref: CollectionReference) {
    super(ref);
  }
}
