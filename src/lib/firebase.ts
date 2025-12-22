import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAISZyrReGPKL78m93ebFELrN21zDJX2sg",
  authDomain: "royal-ishq-bikram.firebaseapp.com",
  databaseURL: "https://royal-ishq-bikram-default-rtdb.firebaseio.com",
  projectId: "royal-ishq-bikram",
  storageBucket: "royal-ishq-bikram.firebasestorage.app",
  messagingSenderId: "677986512758",
  appId: "1:677986512758:web:60b67c0da583475fed5457"
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
