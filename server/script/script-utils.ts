import "dotenv/config";

import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

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
process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.LOCAL_GOOGLE_APPLICATION_CREDENTIALS_PATH;

initializeApp({
  credential: applicationDefault(),
  storageBucket: "playground-abc-firebase.appspot.com",
});

export const getDb = () => getFirestore();
export { getAuth, getStorage };
