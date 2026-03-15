import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDYmXIbFC4PYpUbpN_1W4gxTFHGoN66TPs",
  authDomain: "captina-app-next.firebaseapp.com",
  projectId: "captina-app-next",
  storageBucket: "captina-app-next.firebasestorage.app",
  messagingSenderId: "153613899264",
  appId: "1:153613899264:web:8f43c2a8469353bebdaae5"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
