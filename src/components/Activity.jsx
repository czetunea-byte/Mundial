// Pantalla ACTIVIDAD — registro de todos los cambios (quién, qué, cuándo).
import { useTheme } from "../theme.jsx";
import { Card, Avatar, SectionTitle } from "./ui.jsx";

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "hace un momento";
  const m = Math.floor(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `hace ${d} d`;
  return new Date(ts).toLocaleDateString("es-MX", { day: "2-digit", month: "short" });
}

const ICONS = { pago: "✅", "pago-quitar": "↩️", gasto: "🧾", "gasto-quitar": "🗑️", ingreso: "💸", "ingreso-quitar": "🗑️", miembro: "👤", "miembro-quitar": "👋", config: "⚙️" };

export default function Activity({ store }) {
  const t = useTheme();
  const { activity, members } = store;
  const byId = Object.fromEntries(members.map((m) => [m.id, m]));
  const items = [...(activity || [])].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return (
    <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 14, padding: "6px 16px 24px" }}>
      <Card>
        <SectionTitle>📋 Actividad del fondo</SectionTitle>
        <div style={{ fontSize: 11.5, color: t.muted }}>Aquí queda registro de cada movimiento: quién lo hizo y cuándo. Así nada se mueve "sin querer" sin que se note.</div>
      </Card>

      {items.length === 0 ? (
        <Card><div style={{ textAlign: "center", color: t.muted, padding: "20px 0", fontSize: 13 }}>Aún no hay movimientos registrados.</div></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {items.map((a) => {
            const actor = byId[a.actorId];
            return (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 11, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 13, padding: "10px 12px" }}>
                {actor ? <Avatar member={actor} size={32} badge={false} />
                  : <span style={{ width: 32, height: 32, borderRadius: "50%", background: t.emptyCell, display: "grid", placeItems: "center", fontSize: 15 }}>{ICONS[a.action] || "•"}</span>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: t.text, lineHeight: 1.35 }}>
                    <b>{a.actorName}</b> {a.detail}
                  </div>
                  <div style={{ fontSize: 10.5, color: t.faint, marginTop: 1 }}>{ICONS[a.action] || ""} {timeAgo(a.createdAt)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
