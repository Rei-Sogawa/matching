import { Firestore } from "firebase-admin/firestore";

import { UsersCollection } from "./collections/users";
import { UsersStatShardsCollection } from "./collections/users-stats";

export const createCollections = (db: Firestore) => {
  const usersRef = db.collection("users");
  const usersStatShardsRef = db.collection("usersStatShards");

  const usersCollection = new UsersCollection(usersRef);
  const usersStatShards = new UsersStatShardsCollection(usersStatShardsRef);

  return { usersCollection, usersStatShards };
};

export type Collections = ReturnType<typeof createCollections>;
