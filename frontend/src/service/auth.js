import {
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {app} from "../config/firebase-config";
import Cookies from "js-cookie";

const auth = getAuth(app);

//signin
export const signInToApp = (provider) => {
  //makes it so user is not automatically logged out unless window changes. 
  setPersistence(auth, browserSessionPersistence).then(async () => { 
    try {
      const res = await signInWithPopup(auth, provider);
      if (res.user.providerData[0].providerId === "google.com") {
        Cookies.set(
          "refresh",
          GoogleAuthProvider.credentialFromResult(res).accessToken,
          { secure: true, sameSite: 'strict', path: "/", expires: 7 }
        );
      }
      return res.user;
    } catch (err) {
      console.log(err);
      return err;
    }
  }).catch((err) => { 
    console.log(err); 
    return err; 
  })
};

export const signOutOfApp = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful
    })
    .catch((err) => {
      // An error happened.
      return err;
    });
};

export const getCurrentUser = () => {
  return auth.currentUser;
};
