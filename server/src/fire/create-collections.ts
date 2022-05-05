import { Firestore } from "firebase-admin/firestore";

import { LikeIndexShardsCollection } from "./collections/like-index-shards";
import { LikesCollection } from "./collections/likes";
import { UsersCollection } from "./collections/users";

export const createCollections = (db: Firestore) => {
  const usersRef = db.collection("users");
  const likesRef = db.collection("likes");
  const likeIndexShardsRef = db.collection("likeIndexShards");

  const usersCollection = new UsersCollection(usersRef);
  const likesCollection = new LikesCollection(likesRef);
  const likeIndexShardsCollection = new LikeIndexShardsCollection(likeIndexShardsRef);

  return { usersCollection, likesCollection, likeIndexShardsCollection };
};

export type Collections = ReturnType<typeof createCollections>;
