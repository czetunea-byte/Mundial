// Pantalla EQUIPO — integrantes, totales, alta/baja.
import { useState } from "react";
import { useTheme } from "../theme.jsx";
import { Card, SectionTitle, Avatar } from "./ui.jsx";
import { money } from "../utils/format";

export default function Members({ store }) {
  const t = useTheme();
  const { stats, members } = store;
  const [name, setName] = useState("");
  const byId = Object.fromEntries(stats.perMember.map((p) => [p.member.id, p]));

  const inputStyle = { flex: 1, padding: "11px 12px", borderRadius: 11, border: `1px solid ${t.border}`,
    background: t.surfaceSolid, color: t.text, fontSize: 14, fontFamily: "Manrope, sans-serif", boxSizing: "border-box" };

  function add(e) {
    e.preventDefault();
    if (!name.trim()) return;
    store.addMember(name.trim());
    setName("");
  }

  return (
    <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 14, padding: "6px 16px 24px" }}>
      <Card>
        <SectionTitle>➕ Sumar a la banda</SectionTitle>
        <form onSubmit={add} style={{ display: "flex", gap: 9 }}>
          <input style={inputStyle} placeholder="Nombre del compa" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
          <button type="submit" style={{ all: "unset", cursor: "pointer", background: t.accent, color: t.onAccent, fontWeight: 800, fontSize: 13, padding: "0 18px", borderRadius: 12 }}>Agregar</button>
        </form>
        <div style={{ fontSize: 11, color: t.muted, marginTop: 9 }}>📷 Las fotos se cargan con cada integrante (próximamente editable).</div>
      </Card>

      <div>
        <SectionTitle>👥 Plantel ({members.length})</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {members.map((m) => {
            const p = byId[m.id] || { total: 0, paidCount: 0, owed: 0, upToDate: true };
            return (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: "12px 14px" }}>
                <Avatar member={m} size={46} badge={!m.photo} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: t.text }}>{m.name}</div>
                  <div style={{ fontSize: 11.5, color: t.muted, marginTop: 2 }}>
                    {p.paidCount} semanas · {p.upToDate ? <span style={{ color: t.accent }}>al corriente ✓</span> : <span style={{ color: t.danger }}>debe {money(p.owed)}</span>}
                  </div>
                </div>
                <span style={{ fontFamily: "Anton", fontSize: 18, color: t.accent }}>{money(p.total)}</span>
                <button onClick={() => { if (confirm(`¿Quitar a ${m.name}? No borra sus aportaciones.`)) store.removeMember(m.id); }}
                  style={{ all: "unset", cursor: "pointer", color: t.faint, fontSize: 15, padding: 4 }}>🗑</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
