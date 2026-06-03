import { useEffect, useMemo, useState } from "react";
import { subscribeCollection, subscribeSettings } from "../data/store";
import { DEFAULT_SETTINGS } from "../config/app";
import { PHOTOS } from "../config/members";
import { computeFund } from "../utils/compute";

// Suscribe a todos los datos del fondo (en tiempo real vía Firestore) y entrega
// datos crudos + cálculos derivados.
export function useFund() {
  const [rawMembers, setRawMembers] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [activity, setActivity] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState({ members: false, settings: false });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si algo falla (p. ej. reglas no publicadas), guardamos el error y
    // dejamos de "cargar" para poder mostrar el aviso.
    const onError = (e) => {
      setError(e);
      setLoaded({ members: true, settings: true });
    };
    const unsubs = [
      subscribeCollection("members", (d) => {
        setRawMembers(d);
        setLoaded((l) => ({ ...l, members: true }));
      }, onError),
      subscribeCollection("contributions", setContributions, onError),
      subscribeCollection("expenses", setExpenses, onError),
      subscribeCollection("activity", setActivity, onError),
      subscribeSettings((s) => {
        setSettings(s);
        setLoaded((l) => ({ ...l, settings: true }));
      }, onError),
    ];
    return () => unsubs.forEach((u) => u && u());
  }, []);

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
    rawMembers,
    contributions,
    expenses,
    activity,
    settings,
    stats,
    error,
    ready: loaded.members && loaded.settings,
  };
}
