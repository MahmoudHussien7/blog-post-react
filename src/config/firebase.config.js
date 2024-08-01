// config/firebase/firebase.config.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA__RpD6vxlNOHIePGhO_jkRWdrE7XmiTo",
  authDomain: "blog-post-f2128.firebaseapp.com",
  projectId: "blog-post-f2128",
  storageBucket: "blog-post-f2128.appspot.com",
  messagingSenderId: "878494001025",
  appId: "1:878494001025:web:1051ec9f6330c294fc2a80",
  measurementId: "G-6SZ4DECJ9Q",
};

// Initialize Firebase only if it hasn't been initialized yet
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error(`Failed to sign in: ${error.message}`);
  }
};

const doSignOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw new Error(`Failed to sign out: ${error.message}`);
  }
};

export { auth, db, storage, doSignInWithEmailAndPassword, doSignOut };
