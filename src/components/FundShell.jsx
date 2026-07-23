import { useState } from "react";
import { useTheme } from "../theme.jsx";
import { useFundStore } from "../hooks/useFundStore";
import { logout } from "../utils/auth";
import { PHOTOS } from "../config/members";
import { Avatar } from "./ui.jsx";
import Dashboard from "./Dashboard.jsx";
import Contributions from "./Contributions.jsx";
import Expenses from "./Expenses.jsx";
import Incomes from "./Incomes.jsx";
import Reports from "./Reports.jsx";
import Members from "./Members.jsx";
import Activity from "./Activity.jsx";
import SettingsModal from "./SettingsModal.jsx";
import AccountModal from "./AccountModal.jsx";

const TABS = [
  { key: "resumen", label: "Resumen", icon: "🏠" },
  { key: "aportaciones", label: "Cromos", icon: "📒" },
  { key: "gastos", label: "Gastos", icon: "🧾" },
  { key: "ingresos", label: "Ingresos", icon: "💸" },
  { key: "reportes", label: "Reportes", icon: "📊" },
  { key: "actividad", label: "Actividad", icon: "📋" },
  { key: "equipo", label: "Equipo", icon: "👥" },
];

const SCREENS = {
  resumen: Dashboard,
  aportaciones: Contributions,
  gastos: Expenses,
  ingresos: Incomes,
  reportes: Reports,
  actividad: Activity,
  equipo: Members,
};

const FLAVOR = "rotativa";

export default function FundShell({ user, themeName, toggleTheme }) {
  const theme = useTheme();
  const [tab, setTab] = useState("resumen");
  const [showSettings, setShowSettings] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const store = useFundStore(user);

  const me = store.members.find((m) => m.id === user.id) || { name: user.name, hue: 150, photo: PHOTOS[user.id] };
  const Screen = SCREENS[tab];

  return (
    <div style={{ minHeight: "100dvh", background: themeName === "noche" ? "#04130e" : "#dce9e1",
      display: "flex", justifyContent: "center", fontFamily: "Manrope, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 430, height: "100dvh", display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden", background: theme.appBg, color: theme.text, boxShadow: "0 0 60px rgba(0,0,0,0.4)" }}>

        {themeName === "noche" && (
          <div style={{ position: "absolute", top: -40, left: 0, right: 0, height: 160, pointerEvents: "none",
            background: `radial-gradient(60% 100% at 20% 0%, ${theme.accent}22, transparent 70%), radial-gradient(60% 100% at 80% 0%, ${theme.accent}22, transparent 70%)` }} />
        )}

        <header style={{ position: "relative", zIndex: 6, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 18px 12px", background: theme.headerFade }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center",
              background: `linear-gradient(150deg,${theme.accent},${theme.accentDeep})`, fontSize: 17,
              boxShadow: themeName === "noche" ? `0 0 16px ${theme.accentGlow}` : "0 2px 6px rgba(0,0,0,0.15)" }}>⚽</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15.5, letterSpacing: "-0.01em" }}>Fondo Mundial<span style={{ color: theme.accent }}> 2030</span></div>
              <div style={{ fontSize: 10.5, color: theme.muted, fontWeight: 600 }}>🦅 ¡Vamos México! · Rumbo a España 2030</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {store.isAdmin && (
              <button onClick={() => setShowSettings(true)} aria-label="Configuración"
                style={{ all: "unset", cursor: "pointer", width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center",
                  background: theme.surface, border: `1px solid ${theme.border}`, fontSize: 15 }}>⚙️</button>
            )}
            <button onClick={toggleTheme} aria-label="Cambiar tema"
              style={{ all: "unset", cursor: "pointer", width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center",
                background: theme.surface, border: `1px solid ${theme.border}`, fontSize: 15 }}>
              {themeName === "noche" ? "☀️" : "🌙"}
            </button>
            <button onClick={() => setShowAccount(true)} aria-label="Mi cuenta" style={{ all: "unset", cursor: "pointer" }}>
              <Avatar member={me} size={36} badge={false} ring={theme.accent} />
            </button>
          </div>
        </header>

        <main style={{ position: "relative", zIndex: 5, flex: 1, minHeight: 0,
          overflowY: tab === "aportaciones" ? "hidden" : "auto" }}>
          {store.error ? (
            <div style={{ padding: "32px 24px", textAlign: "center", color: theme.text }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🔒</div>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>No se pudo leer la base de datos</div>
              <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.55 }}>
                Firebase respondió <b style={{ color: theme.danger }}>permisos insuficientes</b>.
                Falta <b style={{ color: theme.text }}>publicar las reglas de seguridad</b> en
                Firestore (Console → Firestore → Reglas → Publicar), o aún no se ha creado la base de datos.
              </div>
              <div style={{ fontSize: 11.5, color: theme.faint, marginTop: 12 }}>Sesión: {user.email}</div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
                <button onClick={() => window.location.reload()} style={{ all: "unset", cursor: "pointer",
                  background: theme.accent, color: theme.onAccent, fontWeight: 800, fontSize: 13, padding: "11px 18px", borderRadius: 12 }}>Reintentar</button>
                <button onClick={() => logout()} style={{ all: "unset", cursor: "pointer",
                  background: theme.surface, color: theme.text, fontWeight: 700, fontSize: 13, padding: "11px 18px", borderRadius: 12, border: `1px solid ${theme.border}` }}>Cerrar sesión</button>
              </div>
            </div>
          ) : store.ready ? (
            <Screen key={tab} store={store} flavor={FLAVOR} />
          ) : (
            <div style={{ textAlign: "center", color: theme.muted, padding: "60px 0" }}>Cargando…</div>
          )}
        </main>

        <nav style={{ position: "relative", zIndex: 6, display: "flex", justifyContent: "space-around",
          padding: "8px 4px calc(10px + env(safe-area-inset-bottom))", background: theme.tabbar,
          borderTop: `1px solid ${theme.border}`, backdropFilter: "blur(10px)" }}>
          {TABS.map((tb) => {
            const active = tab === tb.key;
            return (
              <button key={tb.key} onClick={() => setTab(tb.key)} style={{
                all: "unset", cursor: "pointer", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                padding: "4px 0", color: active ? theme.accent : theme.faint }}>
                <span style={{ fontSize: 18, filter: active ? "none" : "grayscale(0.4)", transform: active ? "translateY(-1px) scale(1.08)" : "none", transition: "transform 0.2s" }}>{tb.icon}</span>
                <span style={{ fontSize: 9.5, fontWeight: active ? 800 : 600 }}>{tb.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {showSettings && store.ready && (
        <SettingsModal settings={store.settings} onSave={store.saveSettings} onClose={() => setShowSettings(false)} />
      )}
      {showAccount && (
        <AccountModal user={user} member={me} onClose={() => setShowAccount(false)} />
      )}
    </div>
  );
}
