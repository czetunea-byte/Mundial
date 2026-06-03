import { useState } from "react";
import "./styles.css";
import { THEMES, ThemeCtx } from "./theme.jsx";
import { useAuth } from "./hooks/useAuth";
import Login from "./components/Login.jsx";
import FundShell from "./components/FundShell.jsx";

export default function App() {
  const [themeName, setThemeName] = useState(
    () => localStorage.getItem("mundial:theme") || "noche"
  );
  const theme = THEMES[themeName] || THEMES.noche;
  const { user, ready } = useAuth();

  function toggleTheme() {
    const next = themeName === "noche" ? "dia" : "noche";
    setThemeName(next);
    localStorage.setItem("mundial:theme", next);
  }

  return (
    <ThemeCtx.Provider value={theme}>
      {!ready ? (
        <div style={{ minHeight: "100dvh", background: theme.appBg, color: theme.muted,
          display: "grid", placeItems: "center", fontFamily: "Manrope, sans-serif" }}>
          Cargando…
        </div>
      ) : !user ? (
        <Login />
      ) : (
        <FundShell user={user} themeName={themeName} toggleTheme={toggleTheme} />
      )}
    </ThemeCtx.Provider>
  );
}
