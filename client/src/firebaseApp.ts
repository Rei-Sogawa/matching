import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZOAsGLjDqA6_6mMQ4a68kHLzpeP5diG8",
  authDomain: "playground-abc-firebase.firebaseapp.com",
  projectId: "playground-abc-firebase",
  storageBucket: "playground-abc-firebase.appspot.com",
  messagingSenderId: "776442458311",
  appId: "1:776442458311:web:b115782d46d0bd218ccee2",
};

initializeApp(firebaseConfig);

if (!import.meta.env.PROD) {
  connectAuthEmulator(getAuth(), "http://localhost:9099", { disableWarnings: true });
  connectFirestoreEmulator(getFirestore(), "localhost", 8080);
  connectStorageEmulator(getStorage(), "localhost", 9199);
}
