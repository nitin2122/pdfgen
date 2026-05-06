import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiZ0gMej_iPpGbUmZ6nZQNiC6c1gg7jsI",
  authDomain: "pdfgen-suite-pro.firebaseapp.com",
  projectId: "pdfgen-suite-pro",
  storageBucket: "pdfgen-suite-pro.firebasestorage.app",
  messagingSenderId: "757012037570",
  appId: "1:757012037570:web:cbba182994107beee7e05b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
