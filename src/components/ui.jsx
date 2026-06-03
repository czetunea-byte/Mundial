// Átomos de UI con tema. Avatar con foto real (member.photo).
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme.jsx";
import { initials } from "../utils/format";
import { useCountdown } from "../hooks/useCountdown";

// Número que cuenta hasta el valor. Anima desde 0 al montar y desde el valor
// anterior cuando cambia (se siente "vivo" al entrar a cada pantalla).
export function CountUp({
  value,
  format = (n) => Math.round(n).toLocaleString("es-MX"),
  duration = 850,
}) {
  const [disp, setDisp] = useState(0);
  const fromRef = useRef(0);
  const raf = useRef();
  useEffect(() => {
    const from = fromRef.current;
    const to = Number(value) || 0;
    if (from === to) return;
    const start = performance.now();
    cancelAnimationFrame(raf.current);
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisp(from + (to - from) * e);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);
  return <>{format(disp)}</>;
}

export function Avatar({ member, size = 48, ring, badge = true, mono = false, onClick }) {
  const t = useTheme();
  const r = ring || t.border;
  const base = mono ? `oklch(0.6 0.02 ${member.hue})` : `oklch(0.62 0.16 ${member.hue})`;
  const base2 = mono ? `oklch(0.4 0.02 ${member.hue})` : `oklch(0.46 0.17 ${member.hue})`;
  return (
    <span
      onClick={onClick}
      style={{
        position: "relative", display: "inline-flex", flexShrink: 0,
        width: size, height: size, borderRadius: "50%",
        alignItems: "center", justifyContent: "center",
        background: member.photo ? "#222" : `linear-gradient(150deg, ${base}, ${base2})`,
        boxShadow: `0 0 0 2px ${r}`, color: "#fff", fontWeight: 800,
        fontFamily: "Manrope, sans-serif", fontSize: size * 0.36, letterSpacing: "-0.02em",
        overflow: "hidden", cursor: onClick ? "pointer" : "default",
      }}
    >
      {member.photo ? (
        <img src={member.photo} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <>
          <span style={{ position: "absolute", inset: 0, opacity: 0.14,
            backgroundImage: "repeating-linear-gradient(45deg,#fff 0 1px,transparent 1px 6px)" }} />
          <span style={{ position: "relative", zIndex: 1 }}>{initials(member.name)}</span>
          {badge && (
            <span style={{ position: "absolute", bottom: -1, right: -1, zIndex: 2,
              width: size * 0.34, height: size * 0.34, minWidth: 14, minHeight: 14, borderRadius: "50%",
              background: "#fff", color: "#222", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: size * 0.18, boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>📷</span>
          )}
        </>
      )}
    </span>
  );
}

export function Card({ children, style, ...p }) {
  const t = useTheme();
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 18, padding: 16, ...style }} {...p}>
      {children}
    </div>
  );
}

export function Pill({ children, tone = "muted" }) {
  const t = useTheme();
  const tones = {
    ok: { bg: t.okBg, c: t.accent }, warn: { bg: t.dangerBg, c: t.danger },
    gold: { bg: "rgba(201,162,39,0.16)", c: t.gold }, muted: { bg: t.surface, c: t.muted },
  };
  const s = tones[tone] || tones.muted;
  return <span style={{ fontSize: 10.5, fontWeight: 800, padding: "3px 9px", borderRadius: 999, background: s.bg, color: s.c, whiteSpace: "nowrap" }}>{children}</span>;
}

export function SectionTitle({ children, right }) {
  const t = useTheme();
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 11 }}>
      <span style={{ fontWeight: 800, fontSize: 14, color: t.text, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{children}</span>
      {right && <span style={{ flexShrink: 0 }}>{right}</span>}
    </div>
  );
}

export function ProgressBar({ pct, withBall = true, height = 16 }) {
  const t = useTheme();
  const w = Math.max(0, Math.min(1, pct)) * 100;
  return (
    <div style={{ position: "relative", height, borderRadius: 999, background: t.emptyCell, overflow: "visible" }}>
      <div className="barfill" style={{ position: "absolute", inset: 0, width: `${w}%`, borderRadius: 999,
        background: `linear-gradient(90deg,${t.accentDeep},${t.accent})`, boxShadow: `0 0 14px ${t.accentGlow}`,
        transition: "width 0.9s cubic-bezier(0.22,1,0.36,1)" }} />
      {withBall && <span className="ball-float" style={{ position: "absolute", left: `calc(${w}% - 10px)`, top: "50%", transform: "translateY(-50%)",
        fontSize: height + 2, transition: "left 0.9s cubic-bezier(0.22,1,0.36,1)" }}>⚽</span>}
      {withBall && <span style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", fontSize: height }}>🥅</span>}
    </div>
  );
}

// Cuenta regresiva grande. Recibe la fecha objetivo (Date).
function CdUnit({ t, v, l }) {
  return (
    <div style={{ textAlign: "center", flex: "0 0 auto", minWidth: 54 }}>
      <div style={{ fontFamily: "Anton, sans-serif", fontSize: 40, lineHeight: 1, color: t.text,
        textShadow: t.name === "noche" ? `0 0 18px ${t.accentGlow}` : "none",
        fontVariantNumeric: "tabular-nums", letterSpacing: "0" }}>{String(v).padStart(2, "0")}</div>
      <div style={{ fontSize: 10, letterSpacing: "0.18em", color: t.muted, fontWeight: 700, marginTop: 4 }}>{l}</div>
    </div>
  );
}
function CdSep({ t }) {
  return <div style={{ width: 1, height: 38, background: t.heroBorder, flex: "0 0 auto", marginBottom: 14 }} />;
}

export function CountdownHero({ target, subtitle }) {
  const t = useTheme();
  const cd = useCountdown(target);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.32em", color: t.accent, fontWeight: 800 }}>FALTAN PARA EL PITAZO INICIAL</div>
      <div style={{ margin: "12px 0 8px", display: "flex", gap: 8, alignItems: "center", justifyContent: "center",
        background: t.heroBg, border: `1px solid ${t.heroBorder}`, borderRadius: 20, padding: "16px 6px",
        boxShadow: t.name === "noche" ? `0 0 40px -12px ${t.accentGlow} inset` : "none" }}>
        <CdUnit t={t} v={cd.days} l="DÍAS" /><CdSep t={t} /><CdUnit t={t} v={cd.hours} l="HRS" /><CdSep t={t} /><CdUnit t={t} v={cd.mins} l="MIN" /><CdSep t={t} /><CdUnit t={t} v={cd.secs} l="SEG" />
      </div>
      {subtitle && <div style={{ fontSize: 12, color: t.muted }}>{subtitle}</div>}
    </div>
  );
}
