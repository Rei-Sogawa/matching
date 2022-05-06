import { FireCollection } from "@rei-sogawa/unfireorm";
import { CollectionReference, Timestamp } from "firebase-admin/firestore";
import { filter, has, includes, map, merge, orderBy, shuffle, take, toPairs } from "lodash";

import { UserIndexShardData, UserIndexShardDoc } from "../docs/user-index-shard";

export class UserIndexShardsCollection extends FireCollection<UserIndexShardData, UserIndexShardDoc> {
  docIds = ["0", "1", "2"];

  constructor(ref: CollectionReference) {
    super(ref, (snap) => new UserIndexShardDoc(snap));
  }

  async getIndex() {
    const docs = await this.findManyByQuery((ref) => ref);
    return docs.map((doc) => doc.toData()).reduce((prev, curr) => merge(prev, curr), {} as UserIndexShardData).shard;
  }

  async getById(id: string) {
    const docs = await this.findManyByQuery((ref) => ref);
    const doc = docs.find((_doc) => has(_doc.shard, id));
    if (!doc) throw new Error("doc not found");
    return doc;
  }

  async get() {
    const docId = shuffle(this.docIds)[0];
    const snap = await this.ref.doc(docId).get();
    const data = snap.data() ?? ({} as UserIndexShardData);
    return new UserIndexShardDoc({ id: snap.id, ref: snap.ref, data: () => data });
  }

  async paginatedUserIds({
    userId,
    first,
    after,
    sendLikeUserIds,
  }: {
    userId: string;
    first: number;
    after: Timestamp | null | undefined;
    sendLikeUserIds: string[];
  }) {
    return this.getIndex()
      .then((userIndex) => toPairs(userIndex))
      .then((pairs) => orderBy(pairs, ([, data]) => data.lastAccessedAt, "desc"))
      .then((pairs) => filter(pairs, ([id]) => !includes([userId, ...sendLikeUserIds], id)))
      .then((pairs) => filter(pairs, ([, data]) => (after ? after > data.lastAccessedAt : true)))
      .then((pairs) => take(pairs, first))
      .then((pairs) => map(pairs, ([id]) => id));
  }
}
