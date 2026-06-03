import { useEffect, useRef, useState } from "react";
import { Card, Avatar, EmptyState } from "./ui";
import { formatMoney } from "../utils/format";
import { formatShortDate } from "../utils/dates";
import { addItem, removeItem } from "../data/store";

export default function Contributions({ members, settings, stats }) {
  const [filter, setFilter] = useState("hasta-hoy"); // hasta-hoy | todas | pendientes
  const currentRowRef = useRef(null);

  useEffect(() => {
    if (currentRowRef.current) {
      currentRowRef.current.scrollIntoView({ block: "center" });
    }
    // solo al montar: enfoca la semana actual
  }, []);

  if (members.length === 0) {
    return (
      <EmptyState icon="📅" title="Primero agrega integrantes">
        Cuando tengas a tus amigos en la lista, aquí marcas quién pagó cada semana.
      </EmptyState>
    );
  }

  const money = (v) => formatMoney(v, settings);

  async function toggle(memberId, weekIndex) {
    const existing = stats.paidMap.get(`${memberId}|${weekIndex}`);
    if (existing) {
      await removeItem("contributions", existing.id);
    } else {
      await addItem("contributions", {
        memberId,
        weekIndex,
        amount: stats.quotaByWeek[weekIndex] ?? settings.weeklyAmount,
      });
    }
  }

  let weeks = stats.weeks;
  if (filter === "hasta-hoy") {
    weeks = weeks.filter((w) => w.index <= Math.max(stats.currentWeek, 0));
  } else if (filter === "pendientes") {
    weeks = weeks.filter(
      (w) =>
        w.index <= Math.max(stats.currentWeek, 0) &&
        members.some((m) => !stats.paidMap.has(`${m.id}|${w.index}`))
    );
  }

  return (
    <div className="stack">
      <Card>
        <div className="row-between" style={{ flexWrap: "wrap", gap: 8 }}>
          <strong>Aportaciones semanales · cuota actual {money(stats.currentQuota)}</strong>
          <div className="seg">
            {[
              ["hasta-hoy", "Hasta hoy"],
              ["pendientes", "Pendientes"],
              ["todas", "Todas"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`seg-btn ${filter === key ? "active" : ""}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <p className="small muted" style={{ marginTop: 6 }}>
          Toca una celda para marcar (o desmarcar) que esa persona puso su semana.
        </p>
      </Card>

      <Card className="grid-card">
        {weeks.length === 0 ? (
          <EmptyState icon="✅" title="Nada pendiente por aquí" />
        ) : (
          <div className="grid-scroll">
            <table className="grid-table">
              <thead>
                <tr>
                  <th className="sticky-col">Semana</th>
                  {members.map((m) => (
                    <th key={m.id} title={m.name}>
                      <Avatar name={m.name} color={m.color} size={26} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((w) => {
                  const isCurrent = w.index === stats.currentWeek;
                  return (
                    <tr
                      key={w.index}
                      ref={isCurrent ? currentRowRef : null}
                      className={isCurrent ? "current-week" : ""}
                    >
                      <td className="sticky-col">
                        <div className="week-label">
                          <span className="week-num">Sem {w.index + 1}</span>
                          <span className="week-date">
                            {formatShortDate(w.start)} · {money(stats.quotaByWeek[w.index])}
                          </span>
                        </div>
                      </td>
                      {members.map((m) => {
                        const paid = stats.paidMap.has(`${m.id}|${w.index}`);
                        return (
                          <td key={m.id}>
                            <button
                              className={`cell ${paid ? "cell-paid" : ""}`}
                              onClick={() => toggle(m.id, w.index)}
                              title={`${m.name} · Sem ${w.index + 1}`}
                            >
                              {paid ? "✓" : ""}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
