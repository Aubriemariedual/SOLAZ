// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpo17ey66VzKX_ptVUqnYLFhXquKESpDA",
  authDomain: "solaz-74a66.firebaseapp.com",
  projectId: "solaz-74a66",
  storageBucket: "solaz-74a66.firebasestorage.app",
  messagingSenderId: "763302893991",
  appId: "1:763302893991:web:395ac4a06fc13f37613e82",
  measurementId: "G-VZZS3SZ0XS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);