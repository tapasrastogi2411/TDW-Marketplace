import { initializeApp } from "firebase/app";
import Config from "../config.json";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = Config.FIREBASECONFIG;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
