// services/firebase.ts
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
import { auth, db } from "../firebaseConfig";

const evaluationsCollection = collection(db, "evaluations");

// --- AUTH FUNCTIONS ---
export const signInWithEmailAndPassword = (email: string, password: string) =>
  firebaseSignIn(auth, email, password);

export const signOut = () => firebaseSignOut(auth);

export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) =>
  firebaseOnAuthStateChanged(auth, callback);

// --- FIRESTORE FUNCTIONS ---

// Realtime listener for all evaluations
export const onSnapshot = (callback: (evaluations: Evaluation[]) => void) => {
  const q = query(evaluationsCollection, orderBy("date", "asc"));
  return firebaseOnSnapshot(q, (querySnapshot) => {
    const evaluations = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate().toISOString().split('T')[0]
      };
    });
    callback(evaluations);
  });
};

export const addDoc = (collectionName: string, data: Omit<Evaluation, "id">) => {
  const dataWithTimestamp = {
    ...data,
    date: Timestamp.fromDate(new Date(data.date))
  };
  return firebaseAddDoc(collection(db, collectionName), dataWithTimestamp);
};

export const updateDoc = (docId: string, data: Partial<Evaluation>) => {
  const dataWithTimestamp = {
    ...data,
    ...(data.date && { date: Timestamp.fromDate(new Date(data.date)) })
  };
  return firebaseUpdateDoc(doc(db, "evaluations", docId), dataWithTimestamp);
};

export const deleteDoc = (docId: string) => firebaseDeleteDoc(doc(db, "evaluations", docId));
