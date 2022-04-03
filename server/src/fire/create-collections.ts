import { Firestore } from "firebase-admin/firestore";

import { UsersCollection } from "./collections/users";

export const createCollections = (db: Firestore) => {
  const usersRef = db.collection("users");

  const usersCollection = new UsersCollection(usersRef);

  return { usersCollection };
};

export type Collections = ReturnType<typeof createCollections>;
