import * as admin from "firebase-admin";
import request from "request";

// --- UTIL ---
export const sleep = (ms = 0) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(true);
    }, ms)
  );
// SEE: https://gist.github.com/gordonbrander/2230317
export const id = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};
export const randomInt = (max: number, min = 0) => {
  return Math.floor((max - min + 1) * Math.random() + min);
};

// --- SETUP ---
const PROJECT_ID = "playground-abc-firebase";
const FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
const FIRESTORE_EMULATOR_HOST = "localhost:8080";
const FIREBASE_STORAGE_EMULATOR_HOST = "localhost:9199";

process.env.GCLOUD_PROJECT = PROJECT_ID;
process.env.FIREBASE_AUTH_EMULATOR_HOST = FIREBASE_AUTH_EMULATOR_HOST;
process.env.FIRESTORE_EMULATOR_HOST = FIRESTORE_EMULATOR_HOST;
process.env.FIREBASE_STORAGE_EMULATOR_HOST = FIREBASE_STORAGE_EMULATOR_HOST;

admin.initializeApp({
  storageBucket: "playground-abc-firebase.appspot.com",
});
const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();
export const getAuth = () => auth;
export const getDb = () => db;
export const getStorage = () => storage;

// --- CLEAR EMULATOR ---
export const clearAuth = async () => {
  await request({
    url: `http://${FIREBASE_AUTH_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}/accounts`,
    method: "DELETE",
  });
  await sleep(10);
};
export const clearFirestore = async () => {
  await request({
    url: `http://${FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`,
    method: "DELETE",
  });
  await sleep(10);
};
