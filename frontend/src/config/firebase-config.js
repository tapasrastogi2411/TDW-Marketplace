import { initializeApp } from "firebase/app";
import Config from "../config.json";
import {getStorage} from "firebase/storage"; 

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = Config.FIREBASECONFIG;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app, Config.REACT_APP_BUCKET_URL); 

// export default storage;
export {app, storage};
