// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHebYofuL5OVW2Al9ye5y2w4RHi8FCzzQ",
  authDomain: "asistencia-23f59.firebaseapp.com",
  projectId: "asistencia-23f59",
  storageBucket: "asistencia-23f59.firebasestorage.app",
  messagingSenderId: "515790247853",
  appId: "1:515790247853:web:d430ff9c9d904dbc1b3324",
  measurementId: "G-7KBX85EPM7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);