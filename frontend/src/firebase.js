
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPrMIQkkr0bUUzgQKIzAlQbbEjfW1YEVA",
  authDomain: "myfitnessapp-8dd2d.firebaseapp.com",
  projectId: "myfitnessapp-8dd2d",
  storageBucket: "myfitnessapp-8dd2d.appspot.com",
  messagingSenderId: "67152972469",
  appId: "1:67152972469:web:e1aaf94d6aab1dbb278cfc",
  measurementId: "G-QDZ14S16DZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;