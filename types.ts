
export interface Evaluation {
  id: string;
  date: string; // ISO string format: "YYYY-MM-DD"
  subject: string;
  course: string;
  content: string;
  instrument: string;
  instrumentUrl?: string;
  creatorId: string;
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
}
