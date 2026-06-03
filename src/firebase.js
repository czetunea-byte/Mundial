// ---------------------------------------------------------------------------
// Configuración de Firebase
// ---------------------------------------------------------------------------
// Para que TODOS vean el fondo actualizado en tiempo real, conecta Firebase.
// Pasos (una sola vez, ~5 min):
//
//   1. Entra a  https://console.firebase.google.com  y crea un proyecto.
//   2. Dentro del proyecto: Compilación → Firestore Database → "Crear base de
//      datos" (modo producción está bien; luego ajustamos las reglas).
//   3. Configuración del proyecto (engrane) → "Tus apps" → ícono Web (</>) →
//      registra una app web y copia el objeto firebaseConfig.
//   4. Pega esos valores en un archivo  .env.local  en la raíz del proyecto
//      (ver  .env.example ). NO subas .env.local a git: ya está ignorado.
//
// Mientras NO esté configurado, la app funciona en "modo local" (los datos se
// guardan solo en tu navegador) para que puedas probarla de inmediato.
// ---------------------------------------------------------------------------

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let db = null;
if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export { db };
