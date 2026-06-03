import { useEffect, useMemo, useState } from "react";
import {
  subscribeCollection,
  subscribeSettings,
  upsertItem,
} from "../data/store";
import { DEFAULT_SETTINGS } from "../config/app";
import { DEFAULT_MEMBERS, PHOTOS } from "../config/members";
import { computeFund } from "../utils/compute";

// v2: nuevos integrantes (8) con foto/hue. Re-siembra aunque hubiera v1.
const SEED_FLAG = "mundial:seeded:v2";

// Suscribe a todos los datos del fondo y entrega tanto los datos crudos como
// los cálculos derivados. Se actualiza solo cuando cambian los datos
// (en tiempo real si Firebase está conectado).
export function useFund() {
  const [rawMembers, setRawMembers] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState({ members: false, settings: false });

  useEffect(() => {
    const unsubs = [
      subscribeCollection("members", (d) => {
        setRawMembers(d);
        setLoaded((l) => ({ ...l, members: true }));
      }),
      subscribeCollection("contributions", setContributions),
      subscribeCollection("expenses", setExpenses),
      subscribeSettings((s) => {
        setSettings(s);
        setLoaded((l) => ({ ...l, settings: true }));
      }),
    ];
    return () => unsubs.forEach((u) => u && u());
  }, []);

  // Siembra los integrantes por defecto una sola vez en el primer arranque.
  useEffect(() => {
    if (!loaded.members) return;
    if (rawMembers.length > 0) return;
    if (localStorage.getItem(SEED_FLAG)) return;
    localStorage.setItem(SEED_FLAG, "1");
    DEFAULT_MEMBERS.forEach((m) =>
      upsertItem("members", m.id, {
        name: m.name,
        hue: m.hue,
        createdAt: m.createdAt,
      })
    );
  }, [loaded.members, rawMembers.length]);

  // Adjunta la foto empaquetada por id.
  const members = useMemo(
    () => rawMembers.map((m) => ({ ...m, photo: m.photo || PHOTOS[m.id] })),
    [rawMembers]
  );

  const stats = useMemo(
    () => computeFund({ members, contributions, expenses, settings }),
    [members, contributions, expenses, settings]
  );

  return {
    members,
    contributions,
    expenses,
    settings,
    stats,
    ready: loaded.members && loaded.settings,
  };
}
