import { Firestore } from "firebase-admin/firestore";

import { AllUsersStatsCollection } from "./collections/all-users-stats";
import { LikesCollection } from "./collections/likes";
import { UserStatsCollection } from "./collections/user-stats";
import { UsersCollection } from "./collections/users";

export const createCollections = (db: Firestore) => {
  const allUsersStatsRef = db.collection("allUsersStats");
  const usersRef = db.collection("users");
  const userStatsRef = db.collection("userStats");
  const likesRef = db.collection("likes");

  const allUsersStatsCollection = new AllUsersStatsCollection(allUsersStatsRef);
  const usersCollection = new UsersCollection(usersRef);
  const userStatsCollection = new UserStatsCollection(userStatsRef);
  const likesCollection = new LikesCollection(likesRef);

  return { allUsersStatsCollection, usersCollection, userStatsCollection, likesCollection };
};

export type Collections = ReturnType<typeof createCollections>;
