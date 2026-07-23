// Pantalla GASTOS — lista + alta de gastos del fondo.
import { useState } from "react";
import { useTheme } from "../theme.jsx";
import { Card, SectionTitle } from "./ui.jsx";
import { money } from "../utils/format";
import { EXPENSE_CATS } from "../config/app";

export default function Expenses({ store }) {
  const t = useTheme();
  const { stats, expenses } = store;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", amount: "", category: "Boletos" });
  const cats = Object.keys(EXPENSE_CATS);

  function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !Number(form.amount)) return;
    store.addExpense({ title: form.title.trim(), amount: Number(form.amount), category: form.category, date: new Date().toISOString().slice(0, 10) });
    setForm({ title: "", amount: "", category: "Boletos" });
    setOpen(false);
  }

  const inputStyle = { width: "100%", padding: "11px 12px", borderRadius: 11, border: `1px solid ${t.border}`,
    background: t.surfaceSolid, color: t.text, fontSize: 14, fontFamily: "Manrope, sans-serif", boxSizing: "border-box" };

  return (
    <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 14, padding: "6px 16px 24px" }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: t.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Total gastado</div>
            <div style={{ fontFamily: "Anton", fontSize: 32, color: t.danger, marginTop: 2 }}>{money(stats.totalSpent)}</div>
            <div style={{ fontSize: 12, color: t.muted }}>de {money(stats.totalIn)} recaudados · saldo <b style={{ color: t.text }}>{money(stats.balance)}</b></div>
          </div>
          <button onClick={() => setOpen((o) => !o)} style={{ all: "unset", cursor: "pointer",
            background: t.accent, color: t.onAccent, fontWeight: 800, fontSize: 13, padding: "10px 16px", borderRadius: 12 }}>
            {open ? "Cancelar" : "+ Gasto"}
          </button>
        </div>

        {open && (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 14 }}>
            <input style={inputStyle} placeholder="¿En qué se gastó?" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div style={{ display: "flex", gap: 9 }}>
              <input style={{ ...inputStyle, flex: 1 }} placeholder="Monto $" inputMode="numeric" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value.replace(/[^0-9]/g, "") })} />
              <select style={{ ...inputStyle, flex: 1 }} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {cats.map((c) => <option key={c} value={c}>{EXPENSE_CATS[c]} {c}</option>)}
              </select>
            </div>
            <button type="submit" style={{ all: "unset", cursor: "pointer", textAlign: "center",
              background: t.accent, color: t.onAccent, fontWeight: 800, padding: "11px", borderRadius: 12 }}>Registrar gasto</button>
          </form>
        )}
      </Card>

      <div>
        <SectionTitle>🧾 Movimientos ({expenses.length})</SectionTitle>
        {expenses.length === 0 ? (
          <Card><div style={{ textAlign: "center", color: t.muted, padding: "20px 0", fontSize: 13 }}>Aún no hay gastos. El fondo está intacto 💰</div></Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {expenses.map((ex) => (
              <div key={ex.id} style={{ display: "flex", alignItems: "center", gap: 12, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: "11px 13px" }}>
                <span style={{ width: 40, height: 40, borderRadius: 11, display: "grid", placeItems: "center", fontSize: 19,
                  background: t.emptyCell, flexShrink: 0 }}>{EXPENSE_CATS[ex.category] || "📦"}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ex.title}</div>
                  <div style={{ fontSize: 11, color: t.muted }}>{ex.category} · {new Date(ex.date).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "2-digit" })}</div>
                </div>
                <span style={{ fontFamily: "Anton", fontSize: 18, color: t.danger }}>−{money(ex.amount)}</span>
                {store.canEdit(ex) && (
                  <button onClick={() => store.removeExpense(ex.id)} style={{ all: "unset", cursor: "pointer", color: t.faint, fontSize: 15, padding: 4 }}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
