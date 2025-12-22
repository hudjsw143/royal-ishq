import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCSC6_6VJxsOWOZ6LuXcBjFFmpA7-RD6og",
  authDomain: "royal-ishq.firebaseapp.com",
  databaseURL: "https://royal-ishq-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "royal-ishq",
  storageBucket: "royal-ishq.firebasestorage.app",
  messagingSenderId: "178909054252",
  appId: "1:178909054252:web:4ed2961dcf9a6033b61889",
  measurementId: "G-MPM6658DRC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Helper to setup recaptcha for phone auth
export const setupRecaptcha = (containerId: string): RecaptchaVerifier => {
  const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      console.log("reCAPTCHA solved");
    },
  });
  return recaptchaVerifier;
};

export default app;
