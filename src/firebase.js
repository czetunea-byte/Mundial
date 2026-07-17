// ---------------------------------------------------------------------------
// Firebase: configuración del proyecto "fondo-mundial".
// La config web NO es secreta (va en toda app web); la seguridad la dan las
// reglas de Firestore + el login.
// ---------------------------------------------------------------------------
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
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

// Firestore por defecto usa WebChannel (streaming), que algunas redes de datos
// móviles / proxies de operador bloquean o amortiguan, dejando la conexión
// colgada (la app se queda en "Cargando…"). Con auto-detección de long-polling,
// Firebase cambia solo a un transporte más compatible cuando detecta esas redes.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
export const auth = getAuth(app);
