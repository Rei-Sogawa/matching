import { Firestore } from "firebase-admin/firestore";

import { UsersCollection } from "./collections/users";
import { UsersStatsCollection } from "./collections/users-stats";

export const createCollections = (db: Firestore) => {
  const usersRef = db.collection("users");
  const usersStatsRef = db.collection("usersStats");

  const usersCollection = new UsersCollection(usersRef);
  const usersStatsCollection = new UsersStatsCollection(usersStatsRef);

  return { usersCollection, usersStatsCollection };
};

export type Collections = ReturnType<typeof createCollections>;
