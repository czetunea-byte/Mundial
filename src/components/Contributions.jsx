// Pantalla APORTACIONES — cuadrícula de cromos. Cada celda (persona × semana)
// es una estampa que se "pega" al tocarla.
import { useState } from "react";
import { useTheme } from "../theme.jsx";
import { Card, Avatar, SectionTitle } from "./ui.jsx";
import { money, initials } from "../utils/format";
import { celebrate, resolveFlavor } from "../utils/fx";

export default function Contributions({ store, flavor }) {
  const t = useTheme();
  const { stats, members } = store;
  const [filter, setFilter] = useState("hasta-hoy");

  let weeks = stats.weeks;
  if (filter === "hasta-hoy") weeks = weeks.filter((w) => w.index <= stats.currentWeek);
  else if (filter === "pendientes")
    weeks = weeks.filter((w) => w.index <= stats.currentWeek && members.some((m) => !stats.paid[`${m.id}|${w.index}`]));

  function stick(e, m, wi) {
    const btn = e.currentTarget;
    const justPaid = store.toggleWeek(m.id, wi);
    if (justPaid) {
      btn.animate(
        [{ transform: "scale(0.6) rotate(-8deg)", opacity: 0.4 }, { transform: "scale(1.15) rotate(3deg)", opacity: 1, offset: 0.6 }, { transform: "scale(1) rotate(0)" }],
        { duration: 420, easing: "cubic-bezier(0.34,1.56,0.64,1)" }
      );
      if (flavor && flavor !== "ninguna") celebrate(btn, resolveFlavor(flavor));
    }
  }

  const cols = `58px repeat(${members.length}, 1fr)`;
  const stuck = members.reduce((s, m) => s + (stats.paid[`${m.id}|${stats.currentWeek}`] ? 1 : 0), 0);

  return (
    <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 14, padding: "6px 14px 24px", height: "100%" }}>
      <Card style={{ flexShrink: 0 }}>
        <SectionTitle right={<span style={{ fontSize: 11, color: t.muted, fontWeight: 700 }}>cuota {money(stats.currentQuota)}</span>}>
          📒 Álbum de aportaciones
        </SectionTitle>
        <div style={{ display: "inline-flex", background: t.emptyCell, borderRadius: 10, padding: 3, gap: 2 }}>
          {[["hasta-hoy", "Hasta hoy"], ["pendientes", "Pendientes"], ["todas", "Todas"]].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} style={{
              all: "unset", cursor: "pointer", padding: "6px 12px", fontSize: 12, fontWeight: 700, borderRadius: 8,
              color: filter === k ? t.onAccent : t.muted, background: filter === k ? t.accent : "transparent" }}>{l}</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: t.muted, marginTop: 9 }}>Toca un cromo para pegar (o despegar) la estampa de esa semana. Semana {stats.currentWeek + 1}: {stuck}/{members.length} pegados.</div>
      </Card>

      <Card style={{ padding: 10, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ overflow: "auto", flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: 5, position: "sticky", top: 0, zIndex: 2,
            background: t.surfaceSolid, paddingBottom: 7 }}>
            <div style={{ fontSize: 9, color: t.faint, fontWeight: 800, alignSelf: "end", paddingBottom: 4 }}>SEM</div>
            {members.map((m) => (
              <div key={m.id} style={{ display: "flex", justifyContent: "center" }} title={m.name}>
                <Avatar member={m} size={28} badge={false} />
              </div>
            ))}
          </div>

          {weeks.length === 0 ? (
            <div style={{ textAlign: "center", color: t.muted, padding: "30px 0", fontSize: 13 }}>✅ Nada pendiente por aquí, ¡bien ahí!</div>
          ) : weeks.map((w) => {
            const isCur = w.index === stats.currentWeek;
            return (
              <div key={w.index} style={{ display: "grid", gridTemplateColumns: cols, gap: 5, alignItems: "center",
                padding: "3px 0", borderRadius: 8, background: isCur ? t.heroBg : "transparent" }}>
                <div style={{ lineHeight: 1.15 }}>
                  <div style={{ fontFamily: "Anton", fontSize: 13, color: isCur ? t.accent : t.text }}>{w.index + 1}</div>
                  <div style={{ fontSize: 8.5, color: t.faint, fontWeight: 700 }}>{w.start.toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}</div>
                </div>
                {members.map((m) => {
                  const paid = !!stats.paid[`${m.id}|${w.index}`];
                  return (
                    <button key={m.id} onClick={(e) => stick(e, m, w.index)} title={`${m.name} · Sem ${w.index + 1}`} style={{
                      all: "unset", cursor: "pointer", aspectRatio: "3/3.6", borderRadius: 6, position: "relative",
                      display: "grid", placeItems: "center", overflow: "hidden",
                      background: paid ? `linear-gradient(150deg, oklch(0.62 0.16 ${m.hue}), oklch(0.44 0.17 ${m.hue}))` : t.emptyCell,
                      border: paid ? "none" : `1px dashed ${t.emptyCellBorder}`,
                      boxShadow: paid ? `0 0 0 1.5px ${t.gold}` : "none" }}>
                      {paid ? (
                        <>
                          <span style={{ position: "absolute", inset: 0, opacity: 0.4, mixBlendMode: "overlay",
                            backgroundImage: "repeating-linear-gradient(115deg,transparent 0 5px,rgba(255,255,255,0.5) 6px,transparent 8px 14px)" }} />
                          <span style={{ position: "relative", color: "#fff", fontWeight: 900, fontSize: 11, textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>{initials(m.name)}</span>
                        </>
                      ) : (
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: t.emptyCellBorder }} />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
