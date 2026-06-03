import { useState } from "react";
import "./styles.css";
import { THEMES, ThemeCtx } from "./theme.jsx";
import { useFundStore } from "./hooks/useFundStore";
import Dashboard from "./components/Dashboard.jsx";
import Contributions from "./components/Contributions.jsx";
import Expenses from "./components/Expenses.jsx";
import Reports from "./components/Reports.jsx";
import Members from "./components/Members.jsx";
import SettingsModal from "./components/SettingsModal.jsx";

const TABS = [
  { key: "resumen", label: "Resumen", icon: "🏠" },
  { key: "aportaciones", label: "Cromos", icon: "📒" },
  { key: "gastos", label: "Gastos", icon: "🧾" },
  { key: "reportes", label: "Reportes", icon: "📊" },
  { key: "equipo", label: "Equipo", icon: "👥" },
];

const SCREENS = {
  resumen: Dashboard,
  aportaciones: Contributions,
  gastos: Expenses,
  reportes: Reports,
  equipo: Members,
};

const FLAVOR = "rotativa"; // festejo al pagar: confeti → gol → moneda

export default function App() {
  const [themeName, setThemeName] = useState(
    () => localStorage.getItem("mundial:theme") || "noche"
  );
  const [tab, setTab] = useState("resumen");
  const [showSettings, setShowSettings] = useState(false);
  const store = useFundStore();
  const theme = THEMES[themeName] || THEMES.noche;

  function toggleTheme() {
    const next = themeName === "noche" ? "dia" : "noche";
    setThemeName(next);
    localStorage.setItem("mundial:theme", next);
  }

  const Screen = SCREENS[tab];

  return (
    <ThemeCtx.Provider value={theme}>
      <div style={{ minHeight: "100dvh", background: themeName === "noche" ? "#04130e" : "#dce9e1",
        display: "flex", justifyContent: "center", fontFamily: "Manrope, sans-serif" }}>
        <div style={{ width: "100%", maxWidth: 430, height: "100dvh", display: "flex", flexDirection: "column",
          position: "relative", overflow: "hidden", background: theme.appBg, color: theme.text,
          boxShadow: "0 0 60px rgba(0,0,0,0.4)" }}>

          {/* luces de estadio (solo noche) */}
          {themeName === "noche" && (
            <div style={{ position: "absolute", top: -40, left: 0, right: 0, height: 160, pointerEvents: "none",
              background: `radial-gradient(60% 100% at 20% 0%, ${theme.accent}22, transparent 70%), radial-gradient(60% 100% at 80% 0%, ${theme.accent}22, transparent 70%)` }} />
          )}

          {/* header */}
          <header style={{ position: "relative", zIndex: 6, display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 18px 12px", background: theme.headerFade }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center",
                background: `linear-gradient(150deg,${theme.accent},${theme.accentDeep})`, fontSize: 17,
                boxShadow: themeName === "noche" ? `0 0 16px ${theme.accentGlow}` : "0 2px 6px rgba(0,0,0,0.15)" }}>⚽</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15.5, letterSpacing: "-0.01em" }}>Fondo Mundial<span style={{ color: theme.accent }}> 2030</span></div>
                <div style={{ fontSize: 10.5, color: theme.muted, fontWeight: 600 }}>🦅 ¡Vamos México! · Rumbo a España 2030 🇪🇸</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowSettings(true)} aria-label="Configuración"
                style={{ all: "unset", cursor: "pointer", width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center",
                  background: theme.surface, border: `1px solid ${theme.border}`, fontSize: 15 }}>
                ⚙️
              </button>
              <button onClick={toggleTheme} aria-label="Cambiar tema"
                style={{ all: "unset", cursor: "pointer", width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center",
                  background: theme.surface, border: `1px solid ${theme.border}`, fontSize: 15 }}>
                {themeName === "noche" ? "☀️" : "🌙"}
              </button>
            </div>
          </header>

          {/* contenido */}
          <main style={{ position: "relative", zIndex: 5, flex: 1, minHeight: 0,
            overflowY: tab === "aportaciones" ? "hidden" : "auto" }}>
            {store.ready ? (
              <Screen key={tab} store={store} flavor={FLAVOR} />
            ) : (
              <div style={{ textAlign: "center", color: theme.muted, padding: "60px 0" }}>Cargando…</div>
            )}
          </main>

          {/* tabbar */}
          <nav style={{ position: "relative", zIndex: 6, display: "flex", justifyContent: "space-around",
            padding: "8px 6px calc(10px + env(safe-area-inset-bottom))", background: theme.tabbar,
            borderTop: `1px solid ${theme.border}`, backdropFilter: "blur(10px)" }}>
            {TABS.map((tb) => {
              const active = tab === tb.key;
              return (
                <button key={tb.key} onClick={() => setTab(tb.key)} style={{
                  all: "unset", cursor: "pointer", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  padding: "4px 0", color: active ? theme.accent : theme.faint }}>
                  <span style={{ fontSize: 19, filter: active ? "none" : "grayscale(0.4)", transform: active ? "translateY(-1px) scale(1.08)" : "none", transition: "transform 0.2s" }}>{tb.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: active ? 800 : 600 }}>{tb.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {showSettings && store.ready && (
          <SettingsModal settings={store.settings} onClose={() => setShowSettings(false)} />
        )}
      </div>
    </ThemeCtx.Provider>
  );
}
