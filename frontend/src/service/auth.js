import { getAuth, signInWithPopup, signOut } from "firebase/auth";
import app from "../config/firebase-config";

const auth = getAuth(app);

//signin
export const signInToApp = (provider) => {
  return signInWithPopup(auth, provider)
    .then((res) => {
      return res.user;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

export const signOutOfApp = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((err) => {
      // An error happened.
      return err;
    });
};

export const getCurrentUser = () => {
  return auth.currentUser;
};
