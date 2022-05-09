import { Config } from "apollo-server";
import * as admin from "firebase-admin";

import { Collections, createCollections } from "./fire/create-collections";
import { getAuth, getDb, getStorage } from "./firebase-app";

export type ServerContext = {
  auth: { uid: string } | undefined;
  collections: Collections;
  firebase: {
    auth: admin.auth.Auth;
    db: admin.firestore.Firestore;
    storage: admin.storage.Storage;
  };
};

export const serverContext: Config["context"] = async ({ req }): Promise<ServerContext> => {
  const firebase = {
    auth: getAuth(),
    db: getDb(),
    storage: getStorage(),
  };

  const collections = createCollections(firebase.db);

  const idToken = req.header("authorization")?.split("Bearer ")[1];
  if (!idToken) return { auth: undefined, collections, firebase };

  const decodedIdToken = await getAuth().verifyIdToken(idToken);
  return { auth: { uid: decodedIdToken.uid }, collections, firebase };
};

export type Context = ServerContext;
