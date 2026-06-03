import { Card, EmptyState, Avatar, GoalMeter, CountUp } from "./ui";
import { formatMoney, formatMoneyShort } from "../utils/format";
import { exportFundPdf } from "../utils/exportPdf";
import { MEMBER_COLORS } from "../config/app";

// Gráfica de barras animada (aportado por integrante)
function BarChart({ data, settings, max }) {
  return (
    <div className="bars">
      {data.map((p) => (
        <div key={p.member.id} className="bar-row">
          <span className="bar-label">
            <Avatar name={p.member.name} color={p.member.color} size={22} />
            {p.member.name}
          </span>
          <div className="bar-track">
            <div
              className="bar-fill grow"
              style={{
                width: `${max > 0 ? (p.total / max) * 100 : 0}%`,
                background: p.member.color,
              }}
            />
          </div>
          <span className="bar-value">{formatMoney(p.total, settings)}</span>
        </div>
      ))}
    </div>
  );
}

// Gráfica "meta vs avance": línea planeada (meta) vs línea real, animada.
function GoalChart({ points, goal, settings }) {
  const W = 560;
  const H = 200;
  const pad = 6;
  const n = points.length;
  if (n < 2) return <p className="muted small">Aún no hay suficientes datos.</p>;

  const maxY = Math.max(goal, ...points.map((p) => p.planned), 1);
  const x = (i) => pad + (i / (n - 1)) * (W - pad * 2);
  const y = (v) => H - pad - (v / maxY) * (H - pad * 2);

  // Línea de meta (planeada): todas las semanas
  const plannedPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.planned)}`)
    .join(" ");

  // Línea real: solo hasta donde hay datos (real != null)
  const realPts = points.filter((p) => p.real !== null);
  const realPath = realPts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.week)} ${y(p.real)}`)
    .join(" ");
  const realArea =
    realPts.length > 1
      ? `${realPath} L ${x(realPts[realPts.length - 1].week)} ${H - pad} L ${x(
          realPts[0].week
        )} ${H - pad} Z`
      : "";

  const lastReal = realPts[realPts.length - 1];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="goalchart" preserveAspectRatio="none">
        {realArea && <path d={realArea} fill="rgba(0,104,71,0.12)" />}
        {/* Meta: dorada punteada */}
        <path
          className="line-planned"
          d={plannedPath}
          fill="none"
          stroke="#c9a227"
          strokeWidth="2.5"
          strokeDasharray="7 6"
        />
        {/* Real: verde sólida, con animación de dibujo */}
        <path
          className="line-real"
          d={realPath}
          fill="none"
          stroke="#006847"
          strokeWidth="3"
        />
        {lastReal && (
          <circle className="dot-real" cx={x(lastReal.week)} cy={y(lastReal.real)} r="4.5" fill="#006847" />
        )}
      </svg>
      <div className="legend">
        <span className="legend-item">
          <i style={{ background: "#006847" }} /> Lo que llevamos
        </span>
        <span className="legend-item">
          <i className="dash" style={{ background: "#c9a227" }} /> Meta planeada
        </span>
        <span className="muted">Meta final: {formatMoneyShort(goal, settings)}</span>
      </div>
    </div>
  );
}

export default function Reports({ members, settings, stats, expenses }) {
  const money = (v) => formatMoney(v, settings);

  if (members.length === 0) {
    return (
      <EmptyState icon="📊" title="Sin datos todavía">
        Agrega integrantes y registra aportaciones para ver los reportes.
      </EmptyState>
    );
  }

  const maxMember = Math.max(...stats.perMember.map((p) => p.total), 1);
  const categories = Object.entries(stats.expensesByCategory).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...categories.map(([, v]) => v), 1);
  const pacePct = Math.round((stats.pace || 1) * 100);
  const onPace = (stats.pace || 1) >= 0.98;

  return (
    <div className="stack">
      {/* Meta final, en grande y animada */}
      <Card className="goal-hero">
        <div className="goal-hero-top">
          <span>🏆 Meta final del fondo</span>
          <button
            className="btn btn-light"
            onClick={() => exportFundPdf({ settings, stats, expenses })}
          >
            ⬇ PDF
          </button>
        </div>
        <div className="goal-hero-amount">
          {settings.currency}
          <CountUp value={stats.goal} format={(n) => Math.round(n).toLocaleString("es-MX")} />
        </div>
        <div className="goal-hero-sub">
          Llevamos <strong>{money(stats.totalRaised)}</strong> · faltan{" "}
          {money(Math.max(stats.goal - stats.totalRaised, 0))}
        </div>
        <GoalMeter
          value={stats.goal > 0 ? stats.totalRaised / stats.goal : 0}
          leftLabel="Inicio"
          rightLabel="¡Mundial! 🇲🇽"
          big
        />
      </Card>

      {/* Ritmo */}
      <Card>
        <div className="row-between">
          <strong>¿Cómo vamos?</strong>
          <span className={onPace ? "pill pill-ok" : "pill pill-warn"}>
            {onPace ? "Vamos al corriente ✅" : `Vamos al ${pacePct}% del plan`}
          </span>
        </div>
        <p className="small muted" style={{ marginTop: 6 }}>
          A la fecha deberíamos llevar <strong>{money(stats.plannedToDate)}</strong> y
          llevamos <strong>{money(stats.totalRaised)}</strong>.
        </p>
        <GoalChart points={stats.cumulativeByWeek} goal={stats.goal} settings={settings} />
      </Card>

      <Card>
        <strong>Aportado por integrante</strong>
        <BarChart data={stats.perMember} settings={settings} max={maxMember} />
      </Card>

      {categories.length > 0 && (
        <Card>
          <strong>Gastos por categoría</strong>
          <div className="bars" style={{ marginTop: 10 }}>
            {categories.map(([cat, val], i) => (
              <div key={cat} className="bar-row">
                <span className="bar-label">{cat}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill grow"
                    style={{
                      width: `${(val / maxCat) * 100}%`,
                      background: MEMBER_COLORS[i % MEMBER_COLORS.length],
                    }}
                  />
                </div>
                <span className="bar-value">{money(val)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
