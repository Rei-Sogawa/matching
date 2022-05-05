import { Firestore } from "firebase-admin/firestore";

import { LikesCollection } from "./collections/likes";
import { UsersCollection } from "./collections/users";

export const createCollections = (db: Firestore) => {
  const usersRef = db.collection("users");
  const likesRef = db.collection("likes");

  const usersCollection = new UsersCollection(usersRef);
  const likesCollection = new LikesCollection(likesRef);

  return { usersCollection, likesCollection };
};

export type Collections = ReturnType<typeof createCollections>;
