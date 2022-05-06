import { Firestore } from "firebase-admin/firestore";

import { LikeIndexCollection } from "./collections/like-index";
import { LikesCollection } from "./collections/likes";
import { UserIndexCollection } from "./collections/user-index";
import { UsersCollection } from "./collections/users";

export const createCollections = (db: Firestore) => {
  const usersRef = db.collection("users");
  const likesRef = db.collection("likes");

  const userIndexRef = db.collection("userIndex");
  const likeIndexRef = db.collection("likeIndex");

  const usersCollection = new UsersCollection(usersRef);
  const likesCollection = new LikesCollection(likesRef);

  const userIndexCollection = new UserIndexCollection(userIndexRef);
  const likeIndexCollection = new LikeIndexCollection(likeIndexRef);

  return { usersCollection, likesCollection, userIndexCollection, likeIndexCollection };
};

export type Collections = ReturnType<typeof createCollections>;
