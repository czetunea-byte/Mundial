import { useEffect, useMemo, useState } from "react";
import {
  subscribeCollection,
  subscribeSettings,
  upsertItem,
} from "../data/store";
import { DEFAULT_SETTINGS, DEFAULT_MEMBERS } from "../config/app";
import { computeFund } from "../utils/compute";

const SEED_FLAG = "mundial:seeded";

// Suscribe a todos los datos del fondo y entrega tanto los datos crudos como
// los cálculos derivados. Se actualiza solo cuando cambian los datos
// (en tiempo real si Firebase está conectado).
export function useFund() {
  const [members, setMembers] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState({ members: false, settings: false });

  useEffect(() => {
    const unsubs = [
      subscribeCollection("members", (d) => {
        setMembers(d);
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
    if (members.length > 0) return;
    if (localStorage.getItem(SEED_FLAG)) return;
    localStorage.setItem(SEED_FLAG, "1");
    DEFAULT_MEMBERS.forEach((m) =>
      upsertItem("members", m.id, {
        name: m.name,
        color: m.color,
        createdAt: m.createdAt,
      })
    );
  }, [loaded.members, members.length]);

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
