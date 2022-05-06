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
    const prev = doc.data() ?? { estimatedByteSize: 0, valueLength: 0, value: [] };
    const next = { ...prev, value: [...prev.value, data] };
    const estimatedByteSize = calcObjectByte(next);
    await doc.ref.set({ ...next, valueLength: next.value.length, estimatedByteSize });
  }

  async update(data: TData) {
    const { docs } = await this.ref.get();
    const doc = docs.find((doc) => doc.data().value.find((v) => v.id === data.id));
    if (doc) {
      const prev = doc.data() ?? { estimatedByteSize: 0, value: [] };
      const next = { ...prev, value: prev.value.map((v) => (v.id === data.id ? data : v)) };
      const estimatedByteSize = calcObjectByte(next);
      await doc.ref.set({ ...next, valueLength: next.value.length, estimatedByteSize });
    }
  }

  async delete(data: TData) {
    const { docs } = await this.ref.get();
    const doc = docs.find((doc) => doc.data().value.find((v) => v.id === data.id));
    if (doc) {
      const prev = doc.data() ?? { estimatedByteSize: 0, value: [] };
      const next = { ...prev, value: prev.value.filter((v) => v.id !== data.id) };
      const estimatedByteSize = calcObjectByte(next);
      await doc.ref.set({ ...next, valueLength: next.value.length, estimatedByteSize });
    }
  }
}
