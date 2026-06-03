import { Card, Stat, Avatar, EmptyState, GoalMeter, CountUp } from "./ui";
import { formatMoney } from "../utils/format";
import { addItem, removeItem } from "../data/store";

export default function Dashboard({ members, settings, stats, onGoToMembers }) {
  const money = (v) => formatMoney(v, settings);

  // Pagar / quitar el pago de la semana actual para un integrante
  async function toggleCurrentWeek(memberId) {
    const wk = stats.currentWeek;
    const existing = stats.paidMap.get(`${memberId}|${wk}`);
    if (existing) {
      await removeItem("contributions", existing.id);
    } else {
      await addItem("contributions", {
        memberId,
        weekIndex: wk,
        amount: stats.quotaByWeek[wk] ?? settings.weeklyAmount,
      });
    }
  }

  if (members.length === 0) {
    return (
      <EmptyState icon="👥" title="Aún no hay integrantes">
        Agrega a tus amigos para empezar a llevar el control de las aportaciones.
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={onGoToMembers}>
            Agregar integrantes
          </button>
        </div>
      </EmptyState>
    );
  }

  const weekLabel = stats.notStarted
    ? "El ahorro aún no arranca"
    : stats.finished
      ? "¡Llegó el Mundial! 🎉"
      : `Semana ${stats.currentWeek + 1} de ${stats.totalWeeks}`;

  const pendingThisWeek = members.filter(
    (m) => !stats.paidMap.has(`${m.id}|${stats.currentWeek}`)
  );

  return (
    <div className="stack">
      {/* Tarjetas principales */}
      <div className="grid-stats">
        <Card>
          <Stat
            label="Total recaudado"
            value={<CountUp value={stats.totalRaised} format={(n) => money(n)} />}
            accent="var(--green)"
          />
        </Card>
        <Card>
          <Stat
            label="Total gastado"
            value={<CountUp value={stats.totalSpent} format={(n) => money(n)} />}
            accent="var(--red)"
          />
        </Card>
        <Card>
          <Stat
            label="Saldo disponible"
            value={<CountUp value={stats.balance} format={(n) => money(n)} />}
            accent="var(--mx-green)"
          />
        </Card>
        <Card>
          <Stat label="Integrantes" value={members.length} sub={weekLabel} />
        </Card>
      </div>

      {/* Avance hacia la meta, con balón rodando */}
      <Card>
        <div className="row-between">
          <strong>🏆 Avance hacia la meta</strong>
          <span className="muted small">
            {money(stats.totalRaised)} / {money(stats.goal)}
          </span>
        </div>
        <div style={{ marginTop: 12 }}>
          <GoalMeter
            value={stats.progress}
            leftLabel="Inicio"
            rightLabel={`${Math.min(stats.weeksElapsed, stats.totalWeeks)}/${stats.totalWeeks} sem`}
          />
        </div>
      </Card>

      {/* Pago de la semana actual */}
      {!stats.notStarted && !stats.finished && (
        <Card>
          <div className="row-between" style={{ marginBottom: 8 }}>
            <strong>Pago de esta semana · {money(stats.currentQuota)} c/u</strong>
            <span className={pendingThisWeek.length ? "pill pill-warn" : "pill pill-ok"}>
              {pendingThisWeek.length
                ? `${pendingThisWeek.length} pendiente${pendingThisWeek.length > 1 ? "s" : ""}`
                : "Todos al día ✓"}
            </span>
          </div>
          <div className="member-toggle-list">
            {members.map((m) => {
              const paid = stats.paidMap.has(`${m.id}|${stats.currentWeek}`);
              return (
                <button
                  key={m.id}
                  className={`member-toggle ${paid ? "paid" : ""}`}
                  onClick={() => toggleCurrentWeek(m.id)}
                >
                  <Avatar name={m.name} color={m.color} size={28} />
                  <span className="member-toggle-name">{m.name}</span>
                  <span className="member-toggle-check">{paid ? "✓ Pagó" : "Marcar"}</span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Estado por integrante */}
      <Card>
        <strong>Estado por integrante</strong>
        <div className="member-status-list">
          {stats.perMember.map((p) => (
            <div key={p.member.id} className="member-status">
              <Avatar name={p.member.name} color={p.member.color} size={36} />
              <div className="member-status-info">
                <div className="row-between">
                  <span className="member-status-name">{p.member.name}</span>
                  <strong>{money(p.total)}</strong>
                </div>
                <div className="row-between small muted">
                  <span>{p.paidCount} semanas pagadas</span>
                  {p.upToDate ? (
                    <span className="pill pill-ok">Al corriente</span>
                  ) : (
                    <span className="pill pill-warn">Debe {money(p.owed)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
