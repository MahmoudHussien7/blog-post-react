import { auth } from "../../src/config/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db, storage } from "../../src/config/firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const signUp = async (username, email, password, photoFile) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Upload the profile picture to Firebase Storage
    const storageRef = ref(storage, `profileImages/${user.uid}`);
    await uploadBytes(storageRef, photoFile);
    const photoURL = await getDownloadURL(storageRef);

    // Update the user's profile
    await updateProfile(user, {
      displayName: username,
      photoURL: photoURL,
    });

    // Store user information in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: user.displayName,
      email: user.email,
      uid: user.uid,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    // Handle common errors
    if (error.code === "auth/email-already-in-use") {
      console.error("Email already in use");
    } else {
      console.error("Error signing up:", error.message);
    }
    throw error;
  }
};

export const logIn = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
};
export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: user.displayName,
      // photoURL: user.photoURL,
    });
  }
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
