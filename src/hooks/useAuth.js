import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { idFromEmail, ADMIN_ID } from "../utils/auth";
import { DEFAULT_MEMBERS } from "../config/members";

// Estado de sesión. Devuelve el usuario actual {id, name, isAdmin} o null.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (u) {
        const id = idFromEmail(u.email);
        const m = DEFAULT_MEMBERS.find((x) => x.id === id);
        setUser({ id, name: m?.name || id, email: u.email, isAdmin: id === ADMIN_ID });
      } else {
        setUser(null);
      }
      setReady(true);
    });
  }, []);

  return { user, ready };
}
