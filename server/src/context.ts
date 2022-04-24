import { Config } from "apollo-server-core";
import { ExpressContext } from "apollo-server-express";
import * as admin from "firebase-admin";

import { Collections, createCollections } from "./fire/create-collections";
import { getAuth, getDb, getStorage } from "./firebase-app";

export type ServerContext = {
  uid?: string;
  auth: admin.auth.Auth;
  db: admin.firestore.Firestore;
  storage: admin.storage.Storage;
  collections: Collections;
};

export const serverContext: Config<ExpressContext>["context"] = async ({ req }): Promise<ServerContext> => {
  const auth = getAuth();
  const db = getDb();
  const storage = getStorage();

  const collections = createCollections(db);

  const idToken = req.header("authorization")?.split("Bearer ")[1];
  if (!idToken) return { auth, db, storage, collections };

  const decodedIdToken = await getAuth().verifyIdToken(idToken);
  return { uid: decodedIdToken.uid, auth, db, storage, collections };
};

export type Context = ServerContext;
