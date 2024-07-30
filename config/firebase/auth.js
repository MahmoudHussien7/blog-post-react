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

export const doCreateUserWithEmailAndPassword = async (
  email,
  password,
  firstName,
  lastName,
  img
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    const displayName = firstName + " " + lastName; // Create a display name
    await updateProfile(res.user, { displayName });

    if (img) {
      const storageRef = ref(storage, `usersImages/${res.user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, img);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          () => {},
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              firstName,
              lastName,
              displayName,
              email,
              photoURL: downloadURL,
            });
            resolve(res);
          }
        );
      });
    } else {
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        firstName,
        lastName,
        displayName,
        email,
      });
      return res;
    }
  } catch (error) {
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
