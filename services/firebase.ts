// =================================================================================================
// MOCK FIREBASE SERVICE
// =================================================================================================
// This is a MOCK file that simulates Firebase Authentication and Firestore.
// It allows the app to run and demonstrate its features without a real Firebase project.
//
// TO USE WITH A REAL FIREBASE PROJECT:
// 1. Set up a Firebase project at https://firebase.google.com/
// 2. Enable Email/Password Authentication and Firestore.
// 3. Install the Firebase SDK in your project: `npm install firebase`
// 4. Replace the content of this file with the commented-out REAL Firebase code below.
// 5. Fill in your Firebase project configuration in the `firebaseConfig` object.
// =================================================================================================
import type { Evaluation, FirebaseUser } from '../types';

// --- MOCK DATA ---
const MOCK_TEACHER_USER: FirebaseUser = {
  uid: 'mock-teacher-uid-123',
  email: 'profesor@lir.cl',
};

let mockEvaluations: Evaluation[] = [
  { id: 'eval1', date: '2024-07-15', subject: 'Matemática', course: '3°A', content: 'Ecuaciones de segundo grado', instrument: 'Rúbrica', instrumentUrl: 'https://example.com/rubrica-matematica.pdf', creatorId: 'mock-teacher-uid-123' },
  { id: 'eval2', date: '2024-07-22', subject: 'Lengua y Literatura', course: '1°B', content: 'Análisis de "Cien Años de Soledad"', instrument: 'Prueba Global', creatorId: 'another-teacher-uid' },
  { id: 'eval3', date: '2024-07-22', subject: 'Historia, Geografía y Cs. Sociales', course: '4°C', content: 'La Guerra Fría', instrument: 'Pauta de Cotejo', instrumentUrl: 'https://example.com/pauta-historia.pdf', creatorId: 'mock-teacher-uid-123' },
];
let authStateListener: ((user: FirebaseUser | null) => void) | null = null;
// Use an object to store multiple listeners, mimicking Firestore's behavior
let evaluationsListeners: { [id: string]: (evals: Evaluation[]) => void } = {};
let listenerIdCounter = 0;
let currentMockUser: FirebaseUser | null = null;

// --- MOCK AUTH FUNCTIONS ---
export const signInWithEmailAndPassword = (email: string, password: string): Promise<{ user: FirebaseUser }> => {
  console.log(`(MOCK) Attempting to sign in with email: ${email}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === MOCK_TEACHER_USER.email && password === 'password123') {
        console.log('(MOCK) Sign in successful');
        currentMockUser = MOCK_TEACHER_USER;
        if (authStateListener) authStateListener(currentMockUser);
        resolve({ user: MOCK_TEACHER_USER });
      } else {
        console.log('(MOCK) Sign in failed: invalid credentials');
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

export const signOut = (): Promise<void> => {
  console.log('(MOCK) Signing out');
  return new Promise((resolve) => {
    setTimeout(() => {
      currentMockUser = null;
      if (authStateListener) authStateListener(null);
      resolve();
    }, 500);
  });
};

export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void): (() => void) => {
  console.log('(MOCK) Auth state listener attached');
  authStateListener = callback;
  // Immediately notify with current state
  setTimeout(() => callback(currentMockUser), 0); 
  return () => {
    console.log('(MOCK) Auth state listener detached');
    authStateListener = null;
  };
};

// --- MOCK FIRESTORE FUNCTIONS ---
const notifyEvaluationsListeners = () => {
  console.log(`(MOCK) Notifying ${Object.keys(evaluationsListeners).length} Firestore listeners.`);
  Object.values(evaluationsListeners).forEach(listener => {
    listener([...mockEvaluations]);
  });
};

export const onSnapshot = (callback: (evals: Evaluation[]) => void): (() => void) => {
    const id = `listener-${listenerIdCounter++}`;
    console.log(`(MOCK) Firestore listener attached with id: ${id}`);
    evaluationsListeners[id] = callback;
    
    // Immediately notify the new listener with the current state
    setTimeout(() => {
        if (evaluationsListeners[id]) {
             evaluationsListeners[id]([...mockEvaluations]);
        }
    }, 100);

    // Return an unsubscribe function
    return () => {
        console.log(`(MOCK) Firestore listener detached with id: ${id}`);
        delete evaluationsListeners[id];
    }
};

export const addDoc = (collectionName: string, data: Omit<Evaluation, 'id'>): Promise<Evaluation> => {
    console.log(`(MOCK) Adding doc to ${collectionName}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const newEval: Evaluation = {
                ...data,
                id: `eval${Date.now()}`
            };
            mockEvaluations.push(newEval);
            notifyEvaluationsListeners();
            resolve(newEval);
        }, 500);
    });
};

export const updateDoc = (docId: string, data: Partial<Evaluation>): Promise<void> => {
    console.log(`(MOCK) Updating doc ${docId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            mockEvaluations = mockEvaluations.map(ev => ev.id === docId ? { ...ev, ...data } : ev);
            notifyEvaluationsListeners();
            resolve();
        }, 500);
    });
};

export const deleteDoc = (docId: string): Promise<void> => {
    console.log(`(MOCK) Deleting doc ${docId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            mockEvaluations = mockEvaluations.filter(ev => ev.id !== docId);
            notifyEvaluationsListeners();
            resolve();
        }, 500);
    });
};

/*
// =================================================================================================
// REAL FIREBASE SERVICE CODE
// =================================================================================================
// To use this, first `npm install firebase`, then uncomment the code below and delete the mock code above.
// =================================================================================================

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword as firebaseSignIn,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc as firebaseAddDoc,
  onSnapshot as firebaseOnSnapshot,
  query,
  orderBy,
  doc,
  updateDoc as firebaseUpdateDoc,
  deleteDoc as firebaseDeleteDoc,
  Timestamp
} from "firebase/firestore";
import type { Evaluation, FirebaseUser } from '../types';

// TODO: Add your Firebase project's configuration here
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const evaluationsCollection = collection(db, "evaluations");

// --- AUTH FUNCTIONS ---
export const signInWithEmailAndPassword = (email, password) => firebaseSignIn(auth, email, password);
export const signOut = () => firebaseSignOut(auth);
export const onAuthStateChanged = (callback) => firebaseOnAuthStateChanged(auth, callback);

// --- FIRESTORE FUNCTIONS ---

// Realtime listener for all evaluations
export const onSnapshot = (callback) => {
  const q = query(evaluationsCollection, orderBy("date", "asc"));
  return firebaseOnSnapshot(q, (querySnapshot) => {
    const evaluations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate().toISOString().split('T')[0] // Convert Timestamp to YYYY-MM-DD string
    }));
    callback(evaluations);
  });
};

export const addDoc = (collectionName, data) => {
    const dataWithTimestamp = {
        ...data,
        date: Timestamp.fromDate(new Date(data.date))
    };
    return firebaseAddDoc(collection(db, collectionName), dataWithTimestamp);
}

export const updateDoc = (docId, data) => {
    const dataWithTimestamp = {
        ...data,
        ...(data.date && { date: Timestamp.fromDate(new Date(data.date)) })
    };
    return firebaseUpdateDoc(doc(db, "evaluations", docId), dataWithTimestamp);
}

export const deleteDoc = (docId) => firebaseDeleteDoc(doc(db, "evaluations", docId));
*/