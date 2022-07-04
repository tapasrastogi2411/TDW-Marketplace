import {getAuth, signInWithPopup, signOut} from "firebase/auth"; 
import app from '../config/firebase-config'; 

//signin
export const signInToApp = (provider) => { 
  const auth = getAuth(app); 
  return signInWithPopup(auth, provider).then((res) => { 
    return res.user; 
  }).catch((err) => { 
    return err; 
  }); 
}; 

export const signOutOfApp = () => { 
  const auth = getAuth(app); 
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log("signed out");
  }).catch((err) => {
    // An error happened.
    return err; 
  });
} 