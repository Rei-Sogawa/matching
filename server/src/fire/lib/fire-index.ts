import { CollectionReference, Timestamp } from "firebase-admin/firestore";

const randomInt = (max: number, min = 0) => {
  return Math.floor((max - min + 1) * Math.random() + min);
};

const isPrimitive = (input: unknown) => {
  if (
    typeof input === "string" ||
    typeof input === "number" ||
    typeof input === "boolean" ||
    input === null ||
    // TODO: ライブラリ化した時にライブラリの firebase app に依存させたくないので hasOwnProperty('toDate') とかで判定したい
    input instanceof Timestamp
  )
    return true;
  return false;
};

// SEE: https://firebase.google.com/docs/firestore/storage-size
const calcPrimitiveByte = (input: unknown) => {
  if (typeof input === "string") return Buffer.byteLength(input, "utf-8") + 1;
  if (typeof input === "number") return 8;
  if (typeof input === "boolean") return 1;
  if (input === null) return 1;
  if (input instanceof Timestamp) return 8;
  throw new Error("could not calcPrimitiveByte");
};

const calcObjectByte = (input: unknown): number => {
  if (isPrimitive(input)) return calcPrimitiveByte(input);
  if (Array.isArray(input)) return input.map((v) => calcObjectByte(v)).reduce((prev, curr) => prev + curr, 0);
  if (typeof input === "object" && !Array.isArray(input) && input !== null)
    return Object.entries(input).reduce((prev, [k, v]) => prev + calcPrimitiveByte(k) + calcObjectByte(v), 0);
  throw new Error("could not calcObjectByte");
};

type IndexData<TData extends { id: string }> = {
  value: TData[];
  valueLength: number;
  estimatedByteSize: number;
};

export abstract class FireIndex<TData extends { id: string }> {
  ref: CollectionReference<IndexData<TData>>;
  abstract docIds: string[];

  constructor(ref: CollectionReference) {
    this.ref = ref as CollectionReference<IndexData<TData>>;
  }

  async get() {
    const { docs } = await this.ref.get();
    return docs.flatMap((doc) => doc.data().value);
  }

  async add(data: TData) {
    return this.ref.firestore.runTransaction(async (t) => {
      const doc = await t.get(this.ref.doc(this.docIds[randomInt(this.docIds.length - 1)]));
      const prev = doc.data() ?? { estimatedByteSize: 0, valueLength: 0, value: [] };
      const next = { ...prev, value: [...prev.value, data], valueLength: prev.value.length + 1 };
      const estimatedByteSize = calcObjectByte(next);
      await t.set(doc.ref, { ...next, estimatedByteSize });
    });
  }

  async update(data: TData) {
    return this.ref.firestore.runTransaction(async (t) => {
      const { docs } = await t.get(this.ref);
      const doc = docs.find((doc) => doc.data().value.find((v) => v.id === data.id));
      if (doc) {
        const prev = doc.data() ?? { estimatedByteSize: 0, value: [] };
        const next = { ...prev, value: prev.value.map((v) => (v.id === data.id ? data : v)) };
        const estimatedByteSize = calcObjectByte(next);
        await t.set(doc.ref, { ...next, estimatedByteSize });
      }
    });
  }

  async delete(data: TData) {
    return this.ref.firestore.runTransaction(async (t) => {
      const { docs } = await t.get(this.ref);
      const doc = docs.find((doc) => doc.data().value.find((v) => v.id === data.id));
      if (doc) {
        const prev = doc.data() ?? { estimatedByteSize: 0, value: [] };
        const next = { ...prev, value: prev.value.filter((v) => v.id !== data.id), valueLength: prev.value.length - 1 };
        const estimatedByteSize = calcObjectByte(next);
        await t.set(doc.ref, { ...next, estimatedByteSize });
      }
    });
  }
}
