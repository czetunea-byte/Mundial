// Configuración del fondo (estilo del rediseño). Editable por el admin.
import { useState } from "react";
import { useTheme } from "../theme.jsx";
import { updateSettings } from "../data/store";
import { sortedTiers } from "../utils/quota";

export default function SettingsModal({ settings, onClose }) {
  const t = useTheme();
  const [form, setForm] = useState({
    fundName: settings.fundName,
    startDate: settings.startDate,
    targetDate: settings.targetDate,
    currency: settings.currency,
  });
  const [tiers, setTiers] = useState(() => sortedTiers(settings).map((x) => ({ ...x })));
  const [saving, setSaving] = useState(false);

  const input = {
    width: "100%", padding: "10px 12px", borderRadius: 11, border: `1px solid ${t.border}`,
    background: t.surface, color: t.text, fontSize: 14, fontFamily: "Manrope, sans-serif", boxSizing: "border-box",
  };
  const label = { fontSize: 11, color: t.muted, fontWeight: 700, marginBottom: 5, display: "block" };
  const field = (k, v) => setForm({ ...form, [k]: v });

  function updateTier(i, key, value) {
    setTiers(tiers.map((tr, idx) => (idx === i ? { ...tr, [key]: value } : tr)));
  }
  function addTier() {
    const last = tiers[tiers.length - 1];
    setTiers([...tiers, { from: last?.from || form.startDate, amount: (Number(last?.amount) || 1000) + 500 }]);
  }
  function removeTier(i) {
    setTiers(tiers.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true);
    const clean = tiers
      .filter((tr) => tr.from && Number(tr.amount) >= 0)
      .map((tr) => ({ from: tr.from, amount: Number(tr.amount) }))
      .sort((a, b) => (a.from < b.from ? -1 : 1));
    await updateSettings({
      fundName: form.fundName.trim() || settings.fundName,
      startDate: form.startDate,
      targetDate: form.targetDate,
      currency: form.currency || "$",
      quotaTiers: clean,
      weeklyAmount: clean[0]?.amount ?? settings.weeklyAmount,
    });
    setSaving(false);
    onClose();
  }

  const btn = (bg, color) => ({ all: "unset", cursor: "pointer", textAlign: "center", padding: "11px 16px",
    borderRadius: 12, fontWeight: 800, fontSize: 13, background: bg, color });

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 430, maxHeight: "92vh", overflowY: "auto",
        background: t.surfaceSolid, borderRadius: "22px 22px 0 0", border: `1px solid ${t.border}`, padding: 18, color: t.text }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: 800, fontSize: 16 }}>⚙️ Configuración del fondo</span>
          <button onClick={onClose} style={{ all: "unset", cursor: "pointer", color: t.muted, fontSize: 18, padding: 4 }}>✕</button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <span style={label}>Nombre del fondo</span>
          <input style={input} value={form.fundName} onChange={(e) => field("fundName", e.target.value)} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <span style={label}>Cuota semanal por persona (sube cada año)</span>
          <div style={{ fontSize: 11, color: t.faint, marginBottom: 8 }}>Cada tramo aplica desde su fecha. Lo ya aportado no cambia al subir.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tiers.map((tr, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end", background: t.surface, borderRadius: 11, padding: 8 }}>
                <div style={{ flex: 1 }}>
                  <span style={{ ...label, fontSize: 10 }}>Desde</span>
                  <input style={input} type="date" value={tr.from} onChange={(e) => updateTier(i, "from", e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ ...label, fontSize: 10 }}>Monto ({form.currency})</span>
                  <input style={input} type="number" min="0" value={tr.amount} onChange={(e) => updateTier(i, "amount", e.target.value)} />
                </div>
                <button onClick={() => removeTier(i)} disabled={tiers.length === 1}
                  style={{ all: "unset", cursor: tiers.length === 1 ? "default" : "pointer", color: t.faint, fontSize: 16, padding: "10px 4px", opacity: tiers.length === 1 ? 0.4 : 1 }}>🗑</button>
              </div>
            ))}
          </div>
          <button onClick={addTier} style={{ all: "unset", cursor: "pointer", marginTop: 8, display: "block", textAlign: "center",
            width: "100%", padding: "9px", borderRadius: 11, border: `1px dashed ${t.accent}`, color: t.accent, fontWeight: 700, fontSize: 12.5 }}>
            + Agregar cambio de cuota
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <span style={label}>Fecha de inicio</span>
            <input style={input} type="date" value={form.startDate} onChange={(e) => field("startDate", e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={label}>Fecha del Mundial</span>
            <input style={input} type="date" value={form.targetDate} onChange={(e) => field("targetDate", e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: 18, width: 110 }}>
          <span style={label}>Moneda</span>
          <input style={input} maxLength={3} value={form.currency} onChange={(e) => field("currency", e.target.value)} />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={btn(t.surface, t.text)}>Cancelar</button>
          <button onClick={save} disabled={saving} style={btn(t.accent, t.onAccent)}>{saving ? "Guardando…" : "Guardar"}</button>
        </div>
      </div>
    </div>
  );
}
