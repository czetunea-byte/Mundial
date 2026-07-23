// Pantalla INGRESOS — ingresos extraordinarios (multas, etc.) que SUMAN al fondo.
import { useState } from "react";
import { useTheme } from "../theme.jsx";
import { Card, SectionTitle, Avatar } from "./ui.jsx";
import { money } from "../utils/format";
import { INCOME_CATS } from "../config/app";

export default function Incomes({ store }) {
  const t = useTheme();
  const { stats, incomes, members } = store;
  const [open, setOpen] = useState(false);
  const cats = Object.keys(INCOME_CATS);
  const [form, setForm] = useState({ memberId: "", title: "", amount: "", category: "Multa por llegar tarde" });

  const byId = Object.fromEntries(members.map((m) => [m.id, m]));

  function submit(e) {
    e.preventDefault();
    if (!Number(form.amount)) return;
    const title = form.title.trim() || form.category;
    store.addIncome({
      memberId: form.memberId,
      title,
      amount: Number(form.amount),
      category: form.category,
      date: new Date().toISOString().slice(0, 10),
    });
    setForm({ memberId: "", title: "", amount: "", category: "Multa por llegar tarde" });
    setOpen(false);
  }

  const inputStyle = { width: "100%", padding: "11px 12px", borderRadius: 11, border: `1px solid ${t.border}`,
    background: t.surfaceSolid, color: t.text, fontSize: 14, fontFamily: "Manrope, sans-serif", boxSizing: "border-box" };

  return (
    <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 14, padding: "6px 16px 24px" }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: t.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Ingresos extra</div>
            <div style={{ fontFamily: "Anton", fontSize: 32, color: t.accent, marginTop: 2 }}>+{money(stats.totalIncome)}</div>
            <div style={{ fontSize: 12, color: t.muted }}>multas y extras · ya suman al saldo <b style={{ color: t.text }}>{money(stats.balance)}</b></div>
          </div>
          <button onClick={() => setOpen((o) => !o)} style={{ all: "unset", cursor: "pointer",
            background: t.accent, color: t.onAccent, fontWeight: 800, fontSize: 13, padding: "10px 16px", borderRadius: 12 }}>
            {open ? "Cancelar" : "+ Ingreso"}
          </button>
        </div>

        {open && (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 14 }}>
            <select style={inputStyle} value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })}>
              <option value="">¿Quién? (opcional)</option>
              {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <select style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {cats.map((c) => <option key={c} value={c}>{INCOME_CATS[c]} {c}</option>)}
            </select>
            <input style={inputStyle} placeholder="Motivo (opcional)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input style={inputStyle} placeholder="Monto $" inputMode="numeric" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value.replace(/[^0-9]/g, "") })} />
            <button type="submit" style={{ all: "unset", cursor: "pointer", textAlign: "center",
              background: t.accent, color: t.onAccent, fontWeight: 800, padding: "11px", borderRadius: 12 }}>Registrar ingreso</button>
          </form>
        )}
      </Card>

      <div>
        <SectionTitle>💸 Ingresos extraordinarios ({incomes.length})</SectionTitle>
        {incomes.length === 0 ? (
          <Card><div style={{ textAlign: "center", color: t.muted, padding: "20px 0", fontSize: 13 }}>Aún no hay multas ni extras. Aquí se registra a quien llegó tarde ⏰</div></Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {incomes.map((inc) => {
              const who = byId[inc.memberId];
              return (
                <div key={inc.id} style={{ display: "flex", alignItems: "center", gap: 12, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: "11px 13px" }}>
                  {who ? <Avatar member={who} size={40} badge={false} />
                    : <span style={{ width: 40, height: 40, borderRadius: 11, display: "grid", placeItems: "center", fontSize: 19, background: t.emptyCell, flexShrink: 0 }}>{INCOME_CATS[inc.category] || "💰"}</span>}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {who ? who.name.split(" ")[0] + " · " : ""}{inc.title}
                    </div>
                    <div style={{ fontSize: 11, color: t.muted }}>{INCOME_CATS[inc.category] || "💰"} {inc.category} · {new Date(inc.date).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "2-digit" })}</div>
                  </div>
                  <span style={{ fontFamily: "Anton", fontSize: 18, color: t.accent }}>+{money(inc.amount)}</span>
                  {store.canEdit(inc) && (
                    <button onClick={() => store.removeIncome(inc.id)} style={{ all: "unset", cursor: "pointer", color: t.faint, fontSize: 15, padding: 4 }}>✕</button>
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
