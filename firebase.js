import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB5SFM0dKAMhJ8sAliAGw_AF_MUSRzVpEM",
  authDomain: "solaz-aa0f8.firebaseapp.com",
  projectId: "solaz-aa0f8",
  storageBucket: "solaz-aa0f8.firebasestorage.app",
  messagingSenderId: "780584234137",
  appId: "1:780584234137:web:6619b36f9964e964c1dc08",
  measurementId: "G-944SQX16XP"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;