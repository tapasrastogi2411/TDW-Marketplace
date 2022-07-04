import {initializeApp} from "firebase/app"; 
import {getAuth} from "firebase/auth"; 

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1YHfk785X10BeOBlOblP_dm-Z7QTjHJo",
  authDomain: "team-tdw.firebaseapp.com",
  projectId: "team-tdw",
  storageBucket: "team-tdw.appspot.com",
  messagingSenderId: "751437030681",
  appId: "1:751437030681:web:04dfcc9977583b68879188",
  measurementId: "G-ZGPV5G4W5D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app; 

