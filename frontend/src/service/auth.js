import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import app from "../config/firebase-config";
import Cookies from "js-cookie";

const auth = getAuth(app);

//signin
export const signInToApp = (provider) => {
  return signInWithPopup(auth, provider)
    .then((res) => {
      if (res.user.providerData[0].providerId === "google.com") {
        // TODO: secure the cookie
        Cookies.set(
          "refresh",
          GoogleAuthProvider.credentialFromResult(res).accessToken
        );
      }
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
