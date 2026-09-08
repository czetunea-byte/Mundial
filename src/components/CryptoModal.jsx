// Detalle de patrimonio en cripto (Bitcoin): resumen, rendimiento, historial
// de movimientos y (solo admin) alta de compras/ventas.
import { useState } from "react";
import { useTheme } from "../theme.jsx";
import { money, btc } from "../utils/format";

function Row({ t, label, value, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "7px 0", borderBottom: `1px solid ${t.border}` }}>
      <span style={{ fontSize: 12.5, color: t.muted }}>{label}</span>
      <span style={{ fontFamily: "Anton", fontSize: 17, color: color || t.text }}>{value}</span>
    </div>
  );
}

export default function CryptoModal({ store, price, onClose }) {
  const t = useTheme();
  const { stats, isAdmin } = store;
  const moves = [...(store.btcMoves || [])].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const held = stats.btcHeld || 0;
  const invested = stats.btcInvested || 0;
  const valueMXN = price ? held * price : null;
  const gain = valueMXN != null ? valueMXN - invested : null;
  const pct = invested > 0 && gain != null ? gain / invested : 0;
  const up = (gain || 0) >= 0;

  const [form, setForm] = useState({ type: "buy", btc: "", mxn: "" });

  const input = {
    width: "100%", padding: "11px 12px", borderRadius: 11, border: `1px solid ${t.border}`,
    background: t.surface, color: t.text, fontSize: 14, fontFamily: "Manrope, sans-serif", boxSizing: "border-box",
  };
  const btn = (bg, color) => ({ all: "unset", cursor: "pointer", textAlign: "center", padding: "11px 16px",
    borderRadius: 12, fontWeight: 800, fontSize: 13, background: bg, color });

  function submit(e) {
    e.preventDefault();
    if (!Number(form.btc) || !Number(form.mxn)) return;
    store.addBtcMove({ type: form.type, btc: Number(form.btc), mxn: Number(form.mxn), date: new Date().toISOString().slice(0, 10) });
    setForm({ type: "buy", btc: "", mxn: "" });
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 430, maxHeight: "92vh", overflowY: "auto",
        background: t.surfaceSolid, borderRadius: "22px 22px 0 0", border: `1px solid ${t.border}`, padding: 18, color: t.text }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontWeight: 800, fontSize: 16 }}>₿ Bitcoin del fondo</span>
          <button onClick={onClose} style={{ all: "unset", cursor: "pointer", color: t.muted, fontSize: 18, padding: 4 }}>✕</button>
        </div>

        <div style={{ marginBottom: 8 }}>
          <Row t={t} label="Bitcoin en el fondo" value={btc(held)} color={t.gold} />
          <Row t={t} label="Valor hoy" value={valueMXN != null ? money(valueMXN) : "—"} color={t.accent} />
          <Row t={t} label="Invertido (neto)" value={money(invested)} />
          <Row t={t} label="Rendimiento" value={gain != null ? `${up ? "+" : ""}${money(gain)} (${(pct * 100).toFixed(1)}%)` : "—"} color={up ? t.accent : t.danger} />
        </div>
        <div style={{ fontSize: 11, color: t.muted, marginBottom: 16 }}>
          {price ? <>1 BTC = {money(price)} · precio en vivo</> : "Precio no disponible sin conexión"}
        </div>

        {isAdmin && (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: t.muted, fontWeight: 700 }}>Registrar movimiento</div>
            <div style={{ display: "flex", gap: 9 }}>
              <select style={{ ...input, flex: 1 }} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="buy">🟢 Compra (pesos → BTC)</option>
                <option value="sell">🔴 Venta (BTC → pesos)</option>
              </select>
            </div>
            <input style={input} placeholder="Cantidad de BTC (ej. 0.09)" inputMode="decimal" value={form.btc}
              onChange={(e) => setForm({ ...form, btc: e.target.value.replace(/[^0-9.]/g, "") })} />
            <input style={input} placeholder="Pesos $ (lo pagado o recibido)" inputMode="numeric" value={form.mxn}
              onChange={(e) => setForm({ ...form, mxn: e.target.value.replace(/[^0-9]/g, "") })} />
            <button type="submit" style={btn(t.accent, t.onAccent)}>Registrar {form.type === "sell" ? "venta" : "compra"}</button>
          </form>
        )}

        <div style={{ fontSize: 12, color: t.muted, fontWeight: 700, marginBottom: 8 }}>Movimientos ({moves.length})</div>
        {moves.length === 0 ? (
          <div style={{ textAlign: "center", color: t.muted, padding: "16px 0", fontSize: 13 }}>Aún no hay movimientos de cripto.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {moves.map((mv) => {
              const sell = mv.type === "sell";
              return (
                <div key={mv.id} style={{ display: "flex", alignItems: "center", gap: 10, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: "9px 11px" }}>
                  <span style={{ fontSize: 17 }}>{sell ? "🔴" : "🟢"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: t.text }}>{sell ? "Venta" : "Compra"} · {btc(mv.btc)}</div>
                    <div style={{ fontSize: 11, color: t.muted }}>{money(mv.mxn)} · {new Date(mv.date).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "2-digit" })}</div>
                  </div>
                  {isAdmin && (
                    <button onClick={() => store.removeBtcMove(mv.id)} style={{ all: "unset", cursor: "pointer", color: t.faint, fontSize: 15, padding: 4 }}>✕</button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
