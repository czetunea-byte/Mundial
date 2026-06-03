// ---------------------------------------------------------------------------
// Firebase: configuración del proyecto "fondo-mundial".
// La config web NO es secreta (va en toda app web); la seguridad la dan las
// reglas de Firestore + el login.
// ---------------------------------------------------------------------------
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyDdyx3v_NiEBfYsD-wnGNs1kujQRtHFHk8",
  authDomain: "fondo-mundial.firebaseapp.com",
  projectId: "fondo-mundial",
  storageBucket: "fondo-mundial.firebasestorage.app",
  messagingSenderId: "100542109876",
  appId: "1:100542109876:web:b0dc565e33213b95299fe1",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
