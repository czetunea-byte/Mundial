// Tarjeta de patrimonio en la pantalla principal: efectivo (pesos) + bitcoin
// valuado a pesos en vivo, total combinado y rendimiento. Toca para el detalle.
import { useState } from "react";
import { useTheme } from "../theme.jsx";
import { Card } from "./ui.jsx";
import { money, btc } from "../utils/format";
import { useBtcPrice } from "../hooks/useBtcPrice";
import CryptoModal from "./CryptoModal.jsx";

function agoLabel(at) {
  if (!at) return "";
  const m = Math.floor((Date.now() - at) / 60000);
  if (m < 1) return "hace un momento";
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.floor(h / 24)} d`;
}

export default function CryptoCard({ store }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const { price, at, loading, error } = useBtcPrice();
  const { stats } = store;

  const held = stats.btcHeld || 0;
  const invested = stats.btcInvested || 0;

  // Se muestra si ya hay cripto o si eres admin (para poder registrar la 1a).
  if (held <= 0 && (store.btcMoves || []).length === 0 && !store.isAdmin) return null;

  const valueMXN = price ? held * price : null;
  const efectivo = (stats.balance || 0) - invested;
  const patrimonio = efectivo + (valueMXN || 0);
  const gain = valueMXN != null ? valueMXN - invested : null;
  const pct = invested > 0 && gain != null ? gain / invested : 0;
  const up = (gain || 0) >= 0;

  const mini = (label, value, color) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, color: t.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>{label}</div>
      <div style={{ fontFamily: "Anton", fontSize: 16, color: color || t.text, marginTop: 3, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  );

  return (
    <>
      <Card style={{ cursor: "pointer" }} onClick={() => setOpen(true)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: t.text }}>🪙 Patrimonio del fondo</span>
          <span style={{ fontSize: 10.5, color: t.accent, fontWeight: 700 }}>Detalle ›</span>
        </div>

        <div style={{ fontFamily: "Anton", fontSize: 30, color: t.text, lineHeight: 1 }}>
          {valueMXN != null ? money(patrimonio) : money(efectivo)}
        </div>
        <div style={{ fontSize: 11, color: t.muted, marginTop: 3, marginBottom: 12 }}>
          total (efectivo + bitcoin a valor de hoy)
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {mini("💵 Efectivo", money(efectivo))}
          {mini("₿ Bitcoin", btc(held), t.gold)}
          {mini("📈 Rendimiento", gain != null ? `${up ? "+" : ""}${(pct * 100).toFixed(1)}%` : "—", up ? t.accent : t.danger)}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, fontSize: 10.5, color: t.faint }}>
          <span>{held > 0 ? <>≈ {money(valueMXN || 0)} en BTC</> : "aún sin bitcoin"}</span>
          <span>
            {price
              ? <>1 BTC = {money(price)} · {error ? "guardado " : ""}{agoLabel(at)}{loading ? " · actualizando…" : ""}</>
              : loading ? "cargando precio…" : "precio no disponible"}
          </span>
        </div>
      </Card>

      {open && <CryptoModal store={store} price={price} onClose={() => setOpen(false)} />}
    </>
  );
}
