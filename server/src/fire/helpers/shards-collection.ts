import deepmerge from "deepmerge";
import { CollectionReference } from "firebase-admin/firestore";

import { randomInt } from "../../utils/random-int";

export class ShardsCollection<TData> {
  ref: CollectionReference<TData>;
  size: number;

  constructor(_ref: CollectionReference, _size: number) {
    this.ref = _ref as CollectionReference<TData>;
    this.size = _size;
  }

  async insert(data: TData) {
    const id = randomInt(this.size - 1).toString();
    const doc = await this.ref.doc(id).get();
    const prevData = doc.data();
    if (!prevData) return this.ref.doc(id).set(data);
    return this.ref.doc(id).set(deepmerge(prevData, data));
  }

  async get() {
    const shards = await this.ref.get().then(({ docs }) => docs.map((doc) => doc.data()));
    return deepmerge.all(shards) as TData;
  }
}
