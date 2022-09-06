import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

// Your web app's Firebase configuration
/*
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
*/
const firebaseConfig = {
  apiKey: "AIzaSyBpZQW0zHFLHRqjsl9WE-D0SEPAMNoIqrg",
  authDomain: "axtat.netlify.app",
  projectId: "axtat-b6bfc",
  storageBucket: "axtat-b6bfc.appspot.com",
  messagingSenderId: "249470019976",
  appId: "1:249470019976:web:4d07ee1c575ab1c14c323d",
  measurementId: "G-1XZG8CR3N5",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//Authentication
export const authentication = getAuth(app);
export const firebaseAuthObj = firebase.auth();

//Database
export const db = getFirestore(app);
