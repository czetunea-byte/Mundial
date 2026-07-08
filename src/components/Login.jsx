import { useState } from "react";
import { useTheme } from "../theme.jsx";
import { Avatar } from "./ui.jsx";
import { DEFAULT_MEMBERS, PHOTOS } from "../config/members";
import { login, DEFAULT_PASSWORD } from "../utils/auth";

export default function Login() {
  const t = useTheme();
  const members = DEFAULT_MEMBERS.map((m) => ({ ...m, photo: PHOTOS[m.id] }));
  const [memberId, setMemberId] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    if (!memberId) { setError("Elige tu nombre 👆"); return; }
    if (!password) { setError("Escribe tu contraseña"); return; }
    setBusy(true); setError("");
    try {
      await login(memberId, password);
      // onAuthStateChanged se encarga del resto
    } catch (err) {
      const code = err.code || "";
      if (code.includes("wrong-password") || code.includes("invalid-credential")) {
        setError(`Contraseña incorrecta. (La primera vez es ${DEFAULT_PASSWORD}.)`);
      } else if (code.includes("weak-password")) {
        setError(`La primera vez tu contraseña debe tener al menos 6 caracteres (usa ${DEFAULT_PASSWORD}).`);
      } else if (code.includes("too-many-requests")) {
        setError("Demasiados intentos. Espera un momento e intenta de nuevo.");
      } else if (code.includes("network")) {
        setError("Sin conexión. Revisa tu internet.");
      } else {
        setError("No se pudo entrar: " + code);
      }
      setBusy(false);
    }
  }

  const input = {
    width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${t.border}`,
    background: t.surface, color: t.text, fontSize: 15, fontFamily: "Manrope, sans-serif", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100dvh", background: t.appBg, color: t.text, display: "flex",
      justifyContent: "center", fontFamily: "Manrope, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 430, padding: "0 20px 40px", overflowY: "auto" }}>
        <div style={{ textAlign: "center", padding: "44px 0 18px" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, display: "grid", placeItems: "center", margin: "0 auto 12px",
            background: `linear-gradient(150deg,${t.accent},${t.accentDeep})`, fontSize: 28,
            boxShadow: t.name === "noche" ? `0 0 22px ${t.accentGlow}` : "0 2px 8px rgba(0,0,0,0.15)" }}>⚽</div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>Fondo Mundial<span style={{ color: t.accent }}> 2030</span></div>
          <div style={{ fontSize: 12.5, color: t.muted, marginTop: 4 }}>🦅 ¡Vamos México! · y si sí, entra al fondo 😎</div>
        </div>

        <div style={{ fontSize: 12, color: t.muted, fontWeight: 700, marginBottom: 10 }}>¿Quién eres?</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 18 }}>
          {members.map((m) => {
            const sel = memberId === m.id;
            return (
              <button key={m.id} onClick={() => { setMemberId(m.id); setError(""); }} style={{
                all: "unset", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                padding: "8px 2px", borderRadius: 14, background: sel ? t.heroBg : "transparent",
                border: `1px solid ${sel ? t.heroBorder : "transparent"}` }}>
                <Avatar member={m} size={48} ring={sel ? t.accent : t.border} badge={false} />
                <span style={{ fontSize: 11, fontWeight: sel ? 800 : 600, color: sel ? t.text : t.faint, whiteSpace: "nowrap" }}>{m.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={entrar} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input style={input} type="password" placeholder="Tu contraseña" value={password}
            onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          {error && <div style={{ fontSize: 12.5, color: t.danger, fontWeight: 600 }}>{error}</div>}
          <button type="submit" disabled={busy} style={{ all: "unset", cursor: "pointer", textAlign: "center",
            background: t.accent, color: t.onAccent, fontWeight: 800, fontSize: 15, padding: "13px", borderRadius: 12, opacity: busy ? 0.6 : 1 }}>
            {busy ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <div style={{ marginTop: 16, fontSize: 11.5, color: t.muted, textAlign: "center", lineHeight: 1.5 }}>
          La primera vez, escribe <b style={{ color: t.text }}>{DEFAULT_PASSWORD}</b> — esa queda como tu contraseña.
          Luego la puedes cambiar tocando tu foto. 🔒
        </div>
      </div>
    </div>
  );
}
