import { useState } from "react";
import { useTheme } from "../theme.jsx";
import { Avatar } from "./ui.jsx";
import { changePassword, logout } from "../utils/auth";

export default function AccountModal({ user, member, onClose }) {
  const t = useTheme();
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const input = {
    width: "100%", padding: "11px 12px", borderRadius: 11, border: `1px solid ${t.border}`,
    background: t.surface, color: t.text, fontSize: 14, fontFamily: "Manrope, sans-serif", boxSizing: "border-box",
  };

  async function guardar() {
    if (pass.length < 6) { setMsg("La contraseña debe tener al menos 6 caracteres."); return; }
    if (pass !== pass2) { setMsg("Las contraseñas no coinciden."); return; }
    setBusy(true); setMsg("");
    try {
      await changePassword(pass);
      setMsg("¡Contraseña actualizada! ✓");
      setPass(""); setPass2("");
    } catch (e) {
      setMsg(e.code?.includes("requires-recent-login")
        ? "Por seguridad, cierra sesión y vuelve a entrar para cambiarla."
        : "No se pudo: " + (e.code || e.message));
    }
    setBusy(false);
  }

  const btn = (bg, color) => ({ all: "unset", cursor: "pointer", textAlign: "center", padding: "11px 16px",
    borderRadius: 12, fontWeight: 800, fontSize: 13, background: bg, color });

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 430, maxHeight: "92vh", overflowY: "auto",
        background: t.surfaceSolid, borderRadius: "22px 22px 0 0", border: `1px solid ${t.border}`, padding: 18, color: t.text }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {member && <Avatar member={member} size={40} badge={false} />}
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>Hola, {user.name} 👋</div>
              <div style={{ fontSize: 11, color: t.muted }}>{user.isAdmin ? "Administrador" : "Integrante"}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ all: "unset", cursor: "pointer", color: t.muted, fontSize: 18, padding: 4 }}>✕</button>
        </div>

        <div style={{ fontSize: 12, color: t.muted, fontWeight: 700, marginBottom: 8 }}>Cambiar mi contraseña</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <input style={input} type="password" placeholder="Nueva contraseña" value={pass} onChange={(e) => setPass(e.target.value)} />
          <input style={input} type="password" placeholder="Repite la contraseña" value={pass2} onChange={(e) => setPass2(e.target.value)} />
          {msg && <div style={{ fontSize: 12.5, color: msg.includes("✓") ? t.accent : t.danger, fontWeight: 600 }}>{msg}</div>}
          <button onClick={guardar} disabled={busy} style={btn(t.accent, t.onAccent)}>{busy ? "Guardando…" : "Actualizar contraseña"}</button>
        </div>

        <button onClick={() => logout()} style={{ ...btn(t.dangerBg, t.danger), width: "100%", boxSizing: "border-box", marginTop: 18 }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
