// Pantalla RESUMEN — marcar el pago de la semana dispara el festejo.
import { useTheme } from "../theme.jsx";
import { Avatar, Card, Pill, SectionTitle, ProgressBar, CountdownHero, CountUp } from "./ui.jsx";
import { money } from "../utils/format";
import { PHRASES } from "../config/members";
import { roastFor } from "../utils/roasts";
import { celebrate, resolveFlavor } from "../utils/fx";

function Stat({ t, label, val, color }) {
  return (
    <div style={{ flex: 1, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: "12px 12px" }}>
      <div style={{ fontSize: 10.5, color: t.muted, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: "Anton, sans-serif", fontSize: 23, color, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{val}</div>
    </div>
  );
}

export default function Dashboard({ store, flavor }) {
  const t = useTheme();
  const { stats, members, settings } = store;
  const phrase = PHRASES[stats.currentWeek % PHRASES.length];
  const pending = stats.pendingThisWeek.length;
  const target = new Date(settings.targetDate + "T18:00:00");

  function payClick(e, m) {
    const wrap = e.currentTarget;
    const justPaid = store.toggleWeek(m.id, stats.currentWeek);
    if (justPaid) {
      wrap.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.28) translateY(-6px)" }, { transform: "scale(1)" }],
        { duration: 520, easing: "cubic-bezier(0.34,1.56,0.64,1)" }
      );
      const av = wrap.querySelector(".av-anchor") || wrap;
      celebrate(av, resolveFlavor(flavor));
    }
  }

  return (
    <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 16, padding: "6px 16px 24px" }}>
      <CountdownHero target={target} subtitle={`Semana ${stats.currentWeek + 1} de ${stats.totalWeeks} · ¡rumbo a España 2030! ⚽`} />

      <div style={{ display: "flex", gap: 9 }}>
        <Stat t={t} label="Recaudado" val={<>$<CountUp value={stats.totalIn} /></>} color={t.accent} />
        <Stat t={t} label="Saldo" val={<>$<CountUp value={stats.balance} /></>} color={t.text} />
        <Stat t={t} label="Gastado" val={<>$<CountUp value={stats.totalSpent} /></>} color={t.danger} />
      </div>

      {stats.totalIncome > 0 && (
        <div style={{ marginTop: -6, fontSize: 11.5, color: t.muted, textAlign: "center" }}>
          Incluye <b style={{ color: t.accent }}>{money(stats.totalIncome)}</b> de multas y extras 💸
        </div>
      )}

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: t.text, whiteSpace: "nowrap" }}>🏆 Rumbo a la meta</span>
          <span style={{ color: t.muted, fontSize: 10.5, whiteSpace: "nowrap" }}>{money(stats.totalIn)} / {money(stats.goal)}</span>
        </div>
        <ProgressBar pct={stats.progress} />
        <div style={{ fontSize: 11.5, color: t.accent, fontWeight: 700, marginTop: 9 }}>
          {(stats.progress * 100).toFixed(1)}% — ¡apenas arranca el partido, a meterle! 🔥
        </div>
      </Card>

      <Card>
        <SectionTitle right={pending ? <Pill tone="warn">{pending} deben</Pill> : <Pill tone="ok">¡Todos al día! ✓</Pill>}>
          Esta semana · {money(stats.currentQuota)}
        </SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {members.map((m) => {
            const paid = !!stats.paid[`${m.id}|${stats.currentWeek}`];
            return (
              <button key={m.id} onClick={(e) => payClick(e, m)} style={{
                all: "unset", cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 5, width: 60 }}>
                <span className="av-anchor" style={{ position: "relative", display: "inline-flex" }}>
                  <Avatar member={m} size={48} ring={paid ? t.accent : t.border} badge={!m.photo} />
                  {paid && <span style={{ position: "absolute", top: -3, right: -3, width: 18, height: 18, borderRadius: "50%",
                    background: t.accent, color: t.onAccent, fontSize: 11, fontWeight: 900, display: "grid", placeItems: "center",
                    boxShadow: `0 0 8px ${t.accentGlow}` }}>✓</span>}
                </span>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: paid ? t.text : t.faint, whiteSpace: "nowrap" }}>{m.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: t.muted, marginTop: 10 }}>Toca una cara para registrar (o quitar) su pago de la semana.</div>
      </Card>

      <div style={{ padding: "2px 14px", borderRadius: 14, background: "linear-gradient(100deg, rgba(201,162,39,0.16), rgba(201,162,39,0.04))",
        border: `1px solid ${t.goldLine}`, display: "flex", gap: 10, alignItems: "center", minHeight: 52 }}>
        <span style={{ fontSize: 20 }}>📣</span>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: t.gold, lineHeight: 1.35 }}>{phrase}</span>
      </div>

      <div>
        <SectionTitle>🥇 Tabla de goleo</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {stats.ranking.map((p, i) => (
            <div key={p.member.id} style={{ display: "flex", alignItems: "center", gap: 11,
              background: t.surface, border: `1px solid ${t.border}`, borderRadius: 13, padding: "8px 12px" }}>
              <span style={{ fontFamily: "Anton", fontSize: 18, color: i === 0 ? t.gold : t.faint, width: 18, textAlign: "center" }}>{i + 1}</span>
              <Avatar member={p.member} size={36} badge={false} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: t.text }}>{p.member.name}</div>
                <div style={{ fontSize: 10.5, color: p.owed ? t.danger : t.accent, lineHeight: 1.3 }}>
                  {p.owed
                    ? `${roastFor(p.pendingWeeks.length, p.member.id, stats.currentWeek)} · debe ${money(p.owed)}`
                    : "al corriente ✓"}
                </div>
              </div>
              <span style={{ fontFamily: "Anton", fontSize: 17, color: t.accent }}>{money(p.total)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: 12.5, color: t.faint, fontWeight: 800, padding: "6px 0 2px", letterSpacing: "0.02em" }}>
        y si sí 😎🇲🇽 — rumbo a España 2030
      </div>
    </div>
  );
}
