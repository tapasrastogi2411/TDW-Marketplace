import { GoogleAuthProvider } from "firebase/auth";

let googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/calendar.events");
export { googleProvider };
