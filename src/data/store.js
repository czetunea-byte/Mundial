// ---------------------------------------------------------------------------
// Capa de datos unificada.
// Si Firebase está configurado -> usa Firestore (sincronización en tiempo real
// para todos). Si no -> usa localStorage (solo en este navegador) para poder
// probar la app de inmediato. La API es la misma en ambos casos.
// ---------------------------------------------------------------------------

import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  setDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";
import { DEFAULT_SETTINGS } from "../config/app";

export const STORAGE_MODE = isFirebaseConfigured ? "firebase" : "local";

// ----------------------------- backend local -------------------------------
const LS_PREFIX = "mundial:";
const localListeners = {}; // key -> Set<cb>

function lsRead(key, fallback) {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function lsWrite(key, data) {
  localStorage.setItem(LS_PREFIX + key, JSON.stringify(data));
  (localListeners[key] || []).forEach((cb) => cb(data));
}

function lsSubscribe(key, fallback, cb) {
  if (!localListeners[key]) localListeners[key] = new Set();
  localListeners[key].add(cb);
  cb(lsRead(key, fallback));
  const onStorage = (e) => {
    if (e.key === LS_PREFIX + key) cb(lsRead(key, fallback));
  };
  window.addEventListener("storage", onStorage);
  return () => {
    localListeners[key].delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// --------------------------- colecciones (listas) ---------------------------
// name: "members" | "contributions" | "expenses"

export function subscribeCollection(name, cb) {
  if (isFirebaseConfigured) {
    const q = query(collection(db, name), orderBy("createdAt", "asc"));
    return onSnapshot(
      q,
      (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => console.error(`Firestore[${name}]`, err)
    );
  }
  return lsSubscribe(name, [], cb);
}

export async function addItem(name, data) {
  const payload = { ...data, createdAt: Date.now() };
  if (isFirebaseConfigured) {
    await addDoc(collection(db, name), payload);
  } else {
    const items = lsRead(name, []);
    items.push({ id: genId(), ...payload });
    lsWrite(name, items);
  }
}

// Inserta o actualiza con un id fijo (idempotente: re-ejecutar no duplica).
export async function upsertItem(name, id, data) {
  if (isFirebaseConfigured) {
    await setDoc(doc(db, name, id), data, { merge: true });
  } else {
    const items = lsRead(name, []);
    const idx = items.findIndex((x) => x.id === id);
    if (idx >= 0) items[idx] = { ...items[idx], ...data };
    else items.push({ id, ...data });
    lsWrite(name, items);
  }
}

export async function updateItem(name, id, patch) {
  if (isFirebaseConfigured) {
    await updateDoc(doc(db, name, id), patch);
  } else {
    const items = lsRead(name, []).map((x) =>
      x.id === id ? { ...x, ...patch } : x
    );
    lsWrite(name, items);
  }
}

export async function removeItem(name, id) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(db, name, id));
  } else {
    lsWrite(
      name,
      lsRead(name, []).filter((x) => x.id !== id)
    );
  }
}

// ------------------------------- settings -----------------------------------
const SETTINGS_KEY = "settings";

export function subscribeSettings(cb) {
  if (isFirebaseConfigured) {
    return onSnapshot(
      doc(db, "meta", SETTINGS_KEY),
      (snap) => cb({ ...DEFAULT_SETTINGS, ...(snap.exists() ? snap.data() : {}) }),
      (err) => console.error("Firestore[settings]", err)
    );
  }
  if (!localListeners[SETTINGS_KEY]) localListeners[SETTINGS_KEY] = new Set();
  const wrapped = (data) => cb({ ...DEFAULT_SETTINGS, ...data });
  localListeners[SETTINGS_KEY].add(wrapped);
  wrapped(lsRead(SETTINGS_KEY, {}));
  return () => localListeners[SETTINGS_KEY].delete(wrapped);
}

export async function updateSettings(patch) {
  if (isFirebaseConfigured) {
    await setDoc(doc(db, "meta", SETTINGS_KEY), patch, { merge: true });
  } else {
    const current = lsRead(SETTINGS_KEY, {});
    lsWrite(SETTINGS_KEY, { ...current, ...patch });
  }
}
