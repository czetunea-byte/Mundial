// Pequeños componentes de UI reutilizables.
import { useEffect, useRef, useState } from "react";

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);

// Número que "cuenta" desde 0 hasta el valor al aparecer.
export function CountUp({ value, format = (n) => Math.round(n), duration = 900 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = Number(value) || 0;
    cancelAnimationFrame(ref.current);
    const tick = (now) => {
      const t = clamp01((now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);
  return <>{format(display)}</>;
}

// Medidor de meta con balón que rueda hasta el porcentaje (animado).
export function GoalMeter({ value, leftLabel, rightLabel, big = false }) {
  const target = clamp01(value);
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setPct(target));
    return () => cancelAnimationFrame(id);
  }, [target]);
  const pctNum = Math.round(target * 100);
  return (
    <div className={`goalmeter ${big ? "goalmeter-big" : ""}`}>
      <div className="goalmeter-track">
        <div className="goalmeter-fill" style={{ width: `${pct * 100}%` }} />
        <span
          className="goalmeter-ball"
          style={{ left: `calc(${pct * 100}% - 12px)` }}
        >
          ⚽
        </span>
        <span className="goalmeter-goal">🥅</span>
      </div>
      <div className="goalmeter-labels">
        <span>{leftLabel}</span>
        <span className="goalmeter-pct">{pctNum}%</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}

export function Card({ children, className = "", ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Stat({ label, value, accent, sub }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value" style={accent ? { color: accent } : undefined}>
        {value}
      </span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  );
}

export function ProgressBar({ value, color = "#2563eb" }) {
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  return (
    <div className="progress">
      <div
        className="progress-fill"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

export function Avatar({ name, color, size = 32 }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className="avatar"
      style={{ background: color, width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </span>
  );
}

export function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ icon = "📭", title, children }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
    </div>
  );
}
