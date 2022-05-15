import { CollectionReference } from "firebase-admin/firestore";

const randomInt = (max: number, min = 0) => {
  return Math.floor((max - min + 1) * Math.random() + min);
};

const isPrimitive = (input: unknown) => {
  if (
    typeof input === "string" ||
    typeof input === "number" ||
    typeof input === "boolean" ||
    input === null ||
    (typeof input === "object" &&
      Object.prototype.hasOwnProperty.call(input, "nanoseconds") &&
      Object.prototype.hasOwnProperty.call(input, "seconds"))
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
  if (
    typeof input === "object" &&
    Object.prototype.hasOwnProperty.call(input, "nanoseconds") &&
    Object.prototype.hasOwnProperty.call(input, "seconds")
  )
    return 8;
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
    const docs = await Promise.all(this.docIds.map((id) => this.ref.doc(id).get()));
    return docs.flatMap((doc) => {
      const docData = doc.data();
      return docData ? docData.value : ([] as TData[]);
    });
  }

  async insert(data: TData) {
    return this.ref.firestore.runTransaction(async (t) => {
      const docs = await Promise.all(this.docIds.map((id) => t.get(this.ref.doc(id))));

      // DELETE
      const storedDoc = docs.find((doc) => {
        const docData = doc.data();
        return docData?.value.find((v) => v.id === data.id);
      });

      if (storedDoc) {
        const storedDocData = storedDoc.data();
        if (!storedDocData) throw new Error("storedDocData is not defined.");
        const nextStoredDocData = {
          ...storedDocData,
          value: storedDocData.value.filter((v) => v.id !== data.id),
          valueLength: storedDocData.value.length - 1,
        };
        const estimatedByteSize = calcObjectByte(nextStoredDocData);
        t.set(storedDoc.ref, { ...nextStoredDocData, estimatedByteSize });
      }

      // ADD
      const randomDoc = docs[randomInt(this.docIds.length - 1)];
      const randomDocData = randomDoc.data() ?? { estimatedByteSize: 0, valueLength: 0, value: [] };
      const nextRandomDocData = {
        ...randomDocData,
        value: [...randomDocData.value, data],
        valueLength: randomDocData.value.length + 1,
      };
      const estimatedByteSize = calcObjectByte(nextRandomDocData);
      t.set(randomDoc.ref, { ...nextRandomDocData, estimatedByteSize });
    });
  }

  async delete(data: TData) {
    return this.ref.firestore.runTransaction(async (t) => {
      const docs = await Promise.all(this.docIds.map((id) => t.get(this.ref.doc(id))));

      // DELETE
      const storedDoc = docs.find((doc) => {
        const docData = doc.data();
        return docData?.value.find((v) => v.id === data.id);
      });

      if (storedDoc) {
        const storedDocData = storedDoc.data();
        if (!storedDocData) throw new Error("storedDocData is not defined.");
        const nextStoredDocData = {
          ...storedDocData,
          value: storedDocData.value.filter((v) => v.id !== data.id),
          valueLength: storedDocData.value.length - 1,
        };
        const estimatedByteSize = calcObjectByte(nextStoredDocData);
        t.set(storedDoc.ref, { ...nextStoredDocData, estimatedByteSize });
      }
    });
  }
}
