import { useState } from "react";
import { Card, Avatar, EmptyState } from "./ui";
import { formatMoney } from "../utils/format";
import { addItem, removeItem } from "../data/store";
import { MEMBER_COLORS } from "../config/app";

export default function Members({ members, settings, stats }) {
  const [name, setName] = useState("");

  async function addMember(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const color = MEMBER_COLORS[members.length % MEMBER_COLORS.length];
    await addItem("members", { name: trimmed, color });
    setName("");
  }

  async function deleteMember(m) {
    const ok = window.confirm(
      `¿Eliminar a ${m.name}? Esto NO borra sus aportaciones ya registradas.`
    );
    if (ok) await removeItem("members", m.id);
  }

  const money = (v) => formatMoney(v, settings);

  return (
    <div className="stack">
      <Card>
        <strong>Agregar integrante</strong>
        <form className="inline-form" onSubmit={addMember}>
          <input
            className="input"
            placeholder="Nombre del amigo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
          />
          <button className="btn btn-primary" type="submit">
            Agregar
          </button>
        </form>
      </Card>

      {members.length === 0 ? (
        <EmptyState icon="🧑‍🤝‍🧑" title="Todavía no hay nadie">
          Agrega a los integrantes del fondo arriba.
        </EmptyState>
      ) : (
        <Card>
          <strong>Integrantes ({members.length})</strong>
          <div className="member-status-list">
            {stats.perMember.map((p) => (
              <div key={p.member.id} className="member-status">
                <Avatar name={p.member.name} color={p.member.color} size={36} />
                <div className="member-status-info">
                  <div className="row-between">
                    <span className="member-status-name">{p.member.name}</span>
                    <strong>{money(p.total)}</strong>
                  </div>
                  <div className="small muted">
                    {p.paidCount} semanas · {p.upToDate ? "al corriente" : `debe ${money(p.owed)}`}
                  </div>
                </div>
                <button
                  className="icon-btn danger"
                  onClick={() => deleteMember(p.member)}
                  aria-label={`Eliminar ${p.member.name}`}
                  title="Eliminar"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
