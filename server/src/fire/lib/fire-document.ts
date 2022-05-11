import { CollectionReference, DocumentReference, DocumentSnapshot, FieldValue } from "firebase-admin/firestore";

import { FireCollection } from "./fire-collection";

export declare type Primitive = string | number | boolean | undefined | null;
export declare type PartialWithFieldValue<T> =
  | Partial<T>
  | (T extends Primitive
      ? T
      : // eslint-disable-next-line @typescript-eslint/ban-types
      T extends {}
      ? {
          [K in keyof T]?: PartialWithFieldValue<T[K]> | FieldValue;
        }
      : never);

export type FireDocumentInput<TData> = Pick<DocumentSnapshot<TData>, "id" | "ref" | "data">;

export class FireDocument<TData> {
  id: string;
  ref: DocumentReference<TData>;

  constructor(snap: FireDocumentInput<TData>) {
    this.id = snap.id;
    this.ref = snap.ref;

    const data = snap.data();
    Object.assign(this, data);
  }

  get toData() {
    const { id, ref, ...restFields } = this;
    const data = Object.fromEntries(
      Object.entries(restFields).filter(([, v]) => (v instanceof FireCollection ? false : true))
    );
    return data as unknown as TData;
  }

  get toBatch() {
    return [this.ref, this.toData] as const;
  }

  edit(data: PartialWithFieldValue<TData>) {
    Object.assign(this, data);
    return this;
  }

  async save() {
    await this.ref.set(this.toData);
    return this;
  }

  async delete() {
    await this.ref.delete();
    return this;
  }

  static createInput<TData>(
    collection: { ref: CollectionReference<TData> },
    id: null | string,
    data: TData
  ): FireDocumentInput<TData> {
    const docRef = id ? collection.ref.doc(id) : collection.ref.doc();
    return {
      ref: docRef,
      id: docRef.id,
      data: () => data,
    };
  }
}
