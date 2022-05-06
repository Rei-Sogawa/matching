import { CollectionReference } from "firebase-admin/firestore";

const randomInt = (max: number, min = 0) => {
  return Math.floor((max - min + 1) * Math.random() + min);
};

type IndexData<TData extends { id: string }> = {
  value: TData[];
};

export abstract class FireIndex<TData extends { id: string }> {
  abstract docIds: string[];
  ref: CollectionReference<IndexData<TData>>;

  constructor(ref: CollectionReference) {
    this.ref = ref as CollectionReference<IndexData<TData>>;
  }

  async get() {
    const { docs } = await this.ref.get();
    return docs.flatMap((doc) => doc.data().value);
  }

  async add(data: TData) {
    const doc = await this.ref.doc(this.docIds[randomInt(this.docIds.length - 1)]).get();
    const prev = doc.data() ?? { value: [] };
    await doc.ref.set({ value: [...prev.value, data] });
  }

  async update(data: TData) {
    const { docs } = await this.ref.get();
    const doc = docs.find((doc) => doc.data().value.find((v) => v.id === data.id));
    if (doc) {
      await doc.ref.set({ value: doc.data().value.map((v) => (v.id === data.id ? data : v)) });
    }
  }

  async delete(data: TData) {
    const { docs } = await this.ref.get();
    const doc = docs.find((doc) => doc.data().value.find((v) => v.id === data.id));
    if (doc) {
      await doc.ref.set({ value: doc.data().value.filter((v) => v.id !== data.id) });
    }
  }
}
