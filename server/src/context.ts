import { Config } from "apollo-server";
import * as admin from "firebase-admin";
import { DecodedIdToken } from "firebase-admin/auth";

import { Collections, createCollections } from "./fire/create-collections";
import { getAuth, getDb, getStorage } from "./firebase-app";

export type ServerContext = {
  decodedIdToken: DecodedIdToken | undefined;
  auth: admin.auth.Auth;
  db: admin.firestore.Firestore;
  storage: admin.storage.Storage;
  collections: Collections;
};

export const serverContext: Config["context"] = async ({ req }): Promise<ServerContext> => {
  const auth = getAuth();
  const db = getDb();
  const storage = getStorage();

  const collections = createCollections(db);

  const idToken = req.header("authorization")?.split("Bearer ")[1];
  if (!idToken) return { decodedIdToken: undefined, auth, db, storage, collections };

  const decodedIdToken = await getAuth().verifyIdToken(idToken);
  return { decodedIdToken: decodedIdToken, auth, db, storage, collections };
};

export type Context = ServerContext;
