import DataLoader from "dataloader";
import { CollectionReference, DocumentSnapshot, Query } from "firebase-admin/firestore";

import { FireDocumentInput } from "./fire-document";

const createLoader = <TData>(ref: CollectionReference<TData>) => {
  return new DataLoader<string, DocumentSnapshot<TData>>((ids) => Promise.all(ids.map((id) => ref.doc(id).get())));
};

export class FireCollection<TData, TTransformed> {
  ref: CollectionReference<TData>;
  transformer: (snap: FireDocumentInput<TData>) => TTransformed;
  loader: DataLoader<string, DocumentSnapshot<TData>>;

  constructor(ref: CollectionReference, transformer: (snap: FireDocumentInput<TData>) => TTransformed) {
    this.ref = ref as CollectionReference<TData>;
    this.transformer = transformer;
    this.loader = createLoader(this.ref);
  }

  get(id: string, { cache } = { cache: true }) {
    return cache ? this.loader.load(id).then(this.transformer) : this.loader.clear(id).load(id).then(this.transformer);
  }

  async query(queryFn: (ref: CollectionReference<TData>) => Query<TData>, { prime } = { prime: false }) {
    const snaps = await queryFn(this.ref).get();
    if (prime) {
      snaps.forEach((snap) => this.loader.prime(snap.id, snap));
    }
    return snaps.docs.map(this.transformer);
  }
}
