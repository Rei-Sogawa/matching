import "dotenv/config";

import * as admin from "firebase-admin";

if (process.env.NODE_ENV === "production") {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH;
} else {
  const PROJECT_ID = "playground-firebase-abc--test";
  const FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
  const FIRESTORE_EMULATOR_HOST = "localhost:8080";

  process.env.GCLOUD_PROJECT = PROJECT_ID;
  process.env.FIREBASE_AUTH_EMULATOR_HOST = FIREBASE_AUTH_EMULATOR_HOST;
  process.env.FIRESTORE_EMULATOR_HOST = FIRESTORE_EMULATOR_HOST;
}

export function getAdmin() {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App;
  } else {
    const app = admin.initializeApp();
    return app;
  }
}
export const getAuth = () => getAdmin().auth();
export const getDb = () => getAdmin().firestore();
