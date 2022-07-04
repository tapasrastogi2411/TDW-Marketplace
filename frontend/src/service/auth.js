import {getAuth, signInWithPopup} from "firebase/auth"; 
import app from '../config/firebase-config'; 

const socialMediaAuth = (provider) => { 
  const auth = getAuth(app); 
  return signInWithPopup(auth, provider).then((res) => { 
    return res.user; 
  }).catch((err) => { 
    return err; 
  }); 
}; 

export default socialMediaAuth; 