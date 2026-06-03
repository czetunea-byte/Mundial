// Autenticación: los integrantes entran con NOMBRE + contraseña.
// Por dentro usamos un "correo" invisible <id>@fondo-mundial.app (nunca lo ven).
// La PRIMERA vez que alguien entra, su cuenta se crea sola con la contraseña
// que escriba (les decimos que usen 123456 y luego la cambian).
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase";

export const EMAIL_DOMAIN = "fondo-mundial.app";
export const ADMIN_ID = "carlos"; // Carlos = admin (puede corregir todo)
export const DEFAULT_PASSWORD = "123456";

export const emailFor = (id) => `${id}@${EMAIL_DOMAIN}`;
export const idFromEmail = (email) => (email || "").split("@")[0];

// Entra; si la cuenta no existe todavía, la crea (primera vez).
export async function login(memberId, password) {
  const email = emailFor(memberId);
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch {
    // Puede ser que la cuenta aún no exista -> intentamos crearla.
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (e2) {
      const code = e2.code || "";
      if (code.includes("email-already-in-use")) {
        // La cuenta sí existía: entonces la contraseña estaba mal.
        const err = new Error("wrong-password");
        err.code = "auth/wrong-password";
        throw err;
      }
      throw e2; // weak-password u otro
    }
  }
}

export function logout() {
  return signOut(auth);
}

export function changePassword(newPassword) {
  if (!auth.currentUser) throw new Error("No hay sesión activa");
  return updatePassword(auth.currentUser, newPassword);
}
