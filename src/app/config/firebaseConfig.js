// src/app/config/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkSHr6i86qTv4Og_uKHJRg3Oq2ZSxFcYo",
  authDomain: "quizee-4459b.firebaseapp.com",
  projectId: "quizee-4459b",
  storageBucket: "quizee-4459b.firebasestorage.app",
  messagingSenderId: "632794760890",
  appId: "1:632794760890:web:41399faa07b659b84ea483",
  measurementId: "G-DN9Z2QHVK0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };
