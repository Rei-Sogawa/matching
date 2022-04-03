import "dotenv/config";

import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth as originalGetAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (process.env.NODE_ENV === "production") {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH;

  initializeApp({ credential: applicationDefault() });
} else {
  const PROJECT_ID = "playground-abc-firebase";
  const FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
  const FIRESTORE_EMULATOR_HOST = "localhost:8080";

  process.env.GCLOUD_PROJECT = PROJECT_ID;
  process.env.FIREBASE_AUTH_EMULATOR_HOST = FIREBASE_AUTH_EMULATOR_HOST;
  process.env.FIRESTORE_EMULATOR_HOST = FIRESTORE_EMULATOR_HOST;

  initializeApp();
}

export const getAuth = () => originalGetAuth();
export const getDb = () => getFirestore();
