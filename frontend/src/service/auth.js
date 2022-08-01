import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { app } from "../config/firebase-config";
import Cookies from "js-cookie";
import Axios from "../axiosBaseURL";
const auth = getAuth(app);

//signin
export const signInToApp = async (provider) => {
  //makes it so user is not automatically logged out unless window changes.
  await setPersistence(auth, browserLocalPersistence)
    .then(async () => {
      try {
        const res = await signInWithPopup(auth, provider);
        if (res.user.providerData[0].providerId === "google.com") {
          Cookies.set(
            "google_id_token",
            GoogleAuthProvider.credentialFromResult(res).accessToken,
            { secure: true, sameSite: "strict", path: "/", expires: 7 }
          );
        }
        if (
          res.user.metadata.creationTime === res.user.metadata.lastSignInTime
        ) {
          sendRegistrationEmail();
        }
        return res.user;
      } catch (err) {
        console.log(err);
        return err;
      }
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

const sendRegistrationEmail = () => {
  auth.currentUser.getIdToken().then((idToken) => {
    const config = { headers: { Authorization: `Bearer ${idToken}` } };
    const body = {
      subject: "Thank you for registering with TDW Marketplace!",
      html: "<div><strong>Successfully registered to TDW Marketplace!</strong> <br/><br/>Now that you have a TDW Marketplace account, you can now create new items that will be listed on the marketplace, start a live bidding video session to interact with interested bidders on your product! <br/> <br/> Best, <br/> TDW Marketplace Team</div>",
    };
    Axios.post("/api/user/tasks/send_email", body, config);
  });
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
