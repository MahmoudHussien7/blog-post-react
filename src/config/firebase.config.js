import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCJuShcX-6xRw5SfS892Q4ki8ZYgoms9jU",
  authDomain: "blogpost-2d91c.firebaseapp.com",
  projectId: "blogpost-2d91c",
  storageBucket: "blogpost-2d91c.appspot.com",
  messagingSenderId: "119713746521",
  appId: "1:119713746521:web:f1fceb13be08c3429b2b48",
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
