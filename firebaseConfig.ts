import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHebYofuL5OVW2Al9ye5y2w4RHi8FCzzQ",
  authDomain: "asistencia-23f59.firebaseapp.com",
  projectId: "asistencia-23f59",
  storageBucket: "asistencia-23f59.firebasestorage.app",
  messagingSenderId: "515790247853",
  appId: "1:515790247853:web:d430ff9c9d904dbc1b3324",
  measurementId: "G-7KBX85EPM7"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta auth y db
export const auth = getAuth(app);
export const db = getFirestore(app);
