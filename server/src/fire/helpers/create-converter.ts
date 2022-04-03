import * as admin from "firebase-admin";
import { mapObjIndexed } from "ramda";

export const decodeTimestamp = <T>(obj: T) =>
  mapObjIndexed((v) => (v instanceof admin.firestore.Timestamp ? v.toDate() : v), obj);

export const encodeDate = <T>(obj: T) =>
  mapObjIndexed((v) => (v instanceof Date ? admin.firestore.Timestamp.fromDate(v) : v), obj);

export const createConverter = <TData>(): admin.firestore.FirestoreDataConverter<TData> => ({
  fromFirestore: (snap) => {
    return decodeTimestamp(snap.data()) as TData;
  },
  toFirestore: (data) => {
    return encodeDate(data);
  },
});
