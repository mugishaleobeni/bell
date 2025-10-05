import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth'; 
import { getFirestore, Firestore } from 'firebase/firestore'; 

// 🚨 Define the configuration by reading the environment variables.
// NOTE: We use 'as string' to satisfy TypeScript, assuming the .env file is correctly set up.

const firebaseConfig: FirebaseOptions = {
  // Use VITE_ for Vite. Use REACT_APP_ if you are using Create React App.
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string, 
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services and Export
// Exporting the services allows you to import them wherever needed (e.g., in an Auth Context).
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;