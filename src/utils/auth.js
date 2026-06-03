// Autenticación: los integrantes entran con NOMBRE + contraseña.
// Por dentro usamos un "correo" invisible <id>@fondo-mundial.app (nunca lo ven).
import { initializeApp, deleteApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, firebaseConfig } from "../firebase";

export const EMAIL_DOMAIN = "fondo-mundial.app";
export const ADMIN_ID = "carlos"; // Carlos = admin (puede corregir todo)
export const DEFAULT_PASSWORD = "123456";

export const emailFor = (id) => `${id}@${EMAIL_DOMAIN}`;
export const idFromEmail = (email) => (email || "").split("@")[0];

export function login(memberId, password) {
  return signInWithEmailAndPassword(auth, emailFor(memberId), password);
}

export function logout() {
  return signOut(auth);
}

export function changePassword(newPassword) {
  if (!auth.currentUser) throw new Error("No hay sesión activa");
  return updatePassword(auth.currentUser, newPassword);
}

// Crea las cuentas de los integrantes (contraseña default) usando una app
// secundaria, para NO cerrar la sesión del admin que las crea.
export async function seedAuthUsers(members, password = DEFAULT_PASSWORD) {
  const secondary = initializeApp(firebaseConfig, "seeder-" + Date.now());
  const secAuth = getAuth(secondary);
  const results = [];
  for (const m of members) {
    try {
      await createUserWithEmailAndPassword(secAuth, emailFor(m.id), password);
      results.push({ id: m.id, name: m.name, created: true });
    } catch (e) {
      results.push({ id: m.id, name: m.name, created: false, error: e.code });
    }
  }
  await signOut(secAuth).catch(() => {});
  await deleteApp(secondary).catch(() => {});
  return results;
}
