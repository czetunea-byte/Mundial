import { useCallback, useEffect, useState } from "react";

// Precio del Bitcoin en pesos (MXN) EN VIVO.
// Fuente: Coinbase (sin API key, con CORS, devuelve MXN directo). La consulta
// la hace el navegador del usuario. Se cachea el último precio en localStorage
// para seguir mostrando algo si no hay conexión.
const URL = "https://api.coinbase.com/v2/prices/BTC-MXN/spot";
const CACHE_KEY = "mundial:btcPrice";
const REFRESH_MS = 5 * 60 * 1000; // cada 5 minutos

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    return typeof c?.price === "number" && c.price > 0 ? c : null;
  } catch {
    return null;
  }
}

function writeCache(price) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ price, at: Date.now() }));
  } catch {
    // ignore (modo privado, etc.)
  }
}

export function useBtcPrice() {
  const cached = readCache();
  const [price, setPrice] = useState(cached?.price ?? null);
  const [at, setAt] = useState(cached?.at ?? null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(false);

  const fetchPrice = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(URL, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      const p = Number(json?.data?.amount);
      if (!p || !isFinite(p)) throw new Error("respuesta inválida");
      setPrice(p);
      const now = Date.now();
      setAt(now);
      writeCache(p);
      setError(false);
    } catch (e) {
      console.warn("No se pudo obtener el precio de BTC", e);
      // Conservamos el último precio en caché (si lo hay) y marcamos error.
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    const id = setInterval(fetchPrice, REFRESH_MS);
    return () => clearInterval(id);
  }, [fetchPrice]);

  return { price, at, loading, error, refresh: fetchPrice };
}
