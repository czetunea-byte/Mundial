// Pantalla REPORTES — avance real vs meta, ritmo, gastos por categoría.
import { useTheme } from "../theme.jsx";
import { Card, Pill, SectionTitle, Avatar, CountUp } from "./ui.jsx";
import { money } from "../utils/format";
import { EXPENSE_CATS } from "../config/app";

export default function Reports({ store }) {
  const t = useTheme();
  const { stats } = store;

  // La gráfica muestra SIEMPRE la trayectoria del plan (proyección a la meta,
  // todas las semanas) de fondo, y el avance real se va dibujando encima.
  const W = 320, H = 150, pad = 6;
  const totalW = stats.totalWeeks;
  const maxV = Math.max(stats.goal, 1);
  const xFor = (i) => pad + (i / Math.max(totalW - 1, 1)) * (W - pad * 2);
  const yFor = (v) => H - pad - (v / maxV) * (H - pad * 2);
  const planPts = stats.cumulative.map((d) => `${xFor(d.week)},${yFor(d.planned)}`).join(" ");
  const realData = stats.cumulative.filter((d) => d.real != null);
  const realPts = realData.map((d) => `${xFor(d.week)},${yFor(d.real)}`).join(" ");
  const hasReal = realData.length >= 2;

  const cats = Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(1, ...cats.map(([, v]) => v));
  const onPace = stats.pace >= 0.99;

  return (
    <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 14, padding: "6px 16px 24px" }}>
      <div style={{ borderRadius: 18, padding: 18, color: "#fff", position: "relative", overflow: "hidden",
        background: `linear-gradient(135deg, ${t.accentDeep}, ${t.accent})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 800, fontSize: 13, gap: 8 }}>
          <span style={{ whiteSpace: "nowrap" }}>🏆 Meta del fondo</span><span style={{ opacity: 0.9 }}><CountUp value={stats.progress * 100} format={(n) => n.toFixed(1)} />%</span>
        </div>
        <div style={{ fontFamily: "Anton", fontSize: 38, margin: "8px 0 2px" }}>$<CountUp value={stats.totalIn} /></div>
        <div style={{ fontSize: 13, opacity: 0.92, marginBottom: 14 }}>de {money(stats.goal)} · faltan $<CountUp value={Math.max(stats.goal - stats.totalIn, 0)} /></div>
        <div style={{ position: "relative", height: 12, borderRadius: 999, background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
          <div className="barfill" style={{ position: "absolute", inset: 0, width: `${stats.progress * 100}%`, borderRadius: 999, background: "linear-gradient(90deg,#ffe08a,#fff)" }} />
        </div>
      </div>

      <Card>
        <SectionTitle right={<Pill tone={onPace ? "ok" : "warn"}>{onPace ? "En ritmo ✓" : "Vamos atrás"}</Pill>}>📈 Avance vs. plan</SectionTitle>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 150, display: "block" }}>
          {/* Proyección/plan: trayectoria completa hacia la meta (de fondo) */}
          <polyline points={planPts} fill="none" stroke={t.gold} strokeWidth="2.5" strokeDasharray="5 5" opacity="0.85" />
          {/* Avance real: se dibuja encima conforme avanzan las semanas */}
          {hasReal && (
            <polyline className="draw-line" points={realPts} pathLength="100" fill="none" stroke={t.accent} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          )}
          {realData.length > 0 && (
            <circle className="pop-dot" cx={xFor(stats.currentWeek)} cy={yFor(stats.totalRaised)} r="4.5" fill={t.accent} />
          )}
        </svg>
        <div style={{ display: "flex", gap: 16, fontSize: 11.5, color: t.muted, marginTop: 4 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><i style={{ width: 16, height: 3, background: t.accent, borderRadius: 2 }} />Avance real</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><i style={{ width: 16, borderTop: `3px dashed ${t.gold}` }} />Plan (proyección)</span>
        </div>
        <div style={{ fontSize: 12, color: t.text, marginTop: 8, fontWeight: 600 }}>
          Llevan el <b style={{ color: onPace ? t.accent : t.danger }}><CountUp value={stats.pace * 100} format={(n) => Math.round(n)} />%</b> de lo planeado a la fecha.
          {onPace ? " ¡Así se hace, banda! 🔥" : " ¡Aguas, hay que apretar! 😅"}
        </div>
      </Card>

      <Card>
        <SectionTitle>🧾 Gastos por categoría</SectionTitle>
        {cats.length === 0 ? (
          <div style={{ color: t.muted, fontSize: 13, padding: "10px 0" }}>Sin gastos todavía.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cats.map(([c, v]) => (
              <div key={c} style={{ display: "grid", gridTemplateColumns: "92px 1fr auto", alignItems: "center", gap: 10, fontSize: 12.5 }}>
                <span style={{ color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{EXPENSE_CATS[c]} {c}</span>
                <span style={{ height: 14, borderRadius: 999, background: t.emptyCell, overflow: "hidden" }}>
                  <span className="barfill" style={{ display: "block", height: "100%", width: `${(v / maxCat) * 100}%`, borderRadius: 999, background: `linear-gradient(90deg,${t.accentDeep},${t.accent})` }} />
                </span>
                <span style={{ fontWeight: 700, color: t.text, whiteSpace: "nowrap" }}>$<CountUp value={v} /></span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle>👥 Aportado por integrante</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {stats.ranking.map((p) => {
            const max = stats.ranking[0]?.total || 1;
            return (
              <div key={p.member.id} style={{ display: "grid", gridTemplateColumns: "24px 1fr auto", alignItems: "center", gap: 9 }}>
                <Avatar member={p.member} size={24} badge={false} />
                <span style={{ height: 14, borderRadius: 999, background: t.emptyCell, overflow: "hidden" }}>
                  <span className="barfill" style={{ display: "block", height: "100%", width: `${(p.total / max) * 100}%`, borderRadius: 999,
                    background: `linear-gradient(90deg, oklch(0.5 0.15 ${p.member.hue}), oklch(0.66 0.16 ${p.member.hue}))` }} />
                </span>
                <span style={{ fontWeight: 700, color: t.text, fontSize: 12.5, whiteSpace: "nowrap" }}>$<CountUp value={p.total} /></span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
