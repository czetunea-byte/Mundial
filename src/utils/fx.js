// Festejo al registrar un pago: confeti, gol o moneda. Rotativo por defecto.

function fxLayer() {
  let el = document.getElementById("fx-layer");
  if (!el) {
    el = document.createElement("div");
    el.id = "fx-layer";
    el.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;";
    document.body.appendChild(el);
  }
  return el;
}

const CONFETTI_COLORS = ["#2de28c", "#ffe08a", "#ff7a7a", "#54b9ff", "#ffffff", "#ff9e3d"];

export function celebrate(originEl, flavor = "confeti") {
  if (!originEl) return;
  const r = originEl.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const layer = fxLayer();

  // Texto flotante (a veces sale el clásico "¡y si sí!")
  const pop = document.createElement("div");
  const labels = { confeti: "+$1,000", gol: "¡GOOOL! ⚽", moneda: "+$1,000 🪙", sello: "¡PAGÓ! ✓" };
  pop.textContent = Math.random() < 0.35 ? "¡y si sí! 💪" : (labels[flavor] || "+$1,000");
  pop.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);
    font-family:Anton,sans-serif;font-size:${flavor === "gol" ? 34 : 26}px;color:#2de28c;
    text-shadow:0 0 16px rgba(45,226,140,0.7),0 2px 4px rgba(0,0,0,0.5);white-space:nowrap;
    will-change:transform,opacity;`;
  layer.appendChild(pop);
  pop.animate(
    [
      { transform: "translate(-50%,-50%) scale(0.5)", opacity: 0 },
      { transform: "translate(-50%,-120%) scale(1.1)", opacity: 1, offset: 0.25 },
      { transform: "translate(-50%,-260%) scale(1)", opacity: 0 },
    ],
    { duration: 1300, easing: "cubic-bezier(0.22,1,0.36,1)" }
  ).onfinish = () => pop.remove();

  if (flavor === "gol") {
    const goal = document.createElement("div");
    goal.textContent = "🥅";
    goal.style.cssText = `position:absolute;left:${cx}px;top:${cy - 150}px;transform:translate(-50%,-50%);font-size:54px;`;
    layer.appendChild(goal);
    goal.animate(
      [
        { opacity: 0, transform: "translate(-50%,-50%) scale(0.6)" },
        { opacity: 1, transform: "translate(-50%,-50%) scale(1)" },
        { opacity: 0 },
      ],
      { duration: 1300 }
    ).onfinish = () => goal.remove();
    const ball = document.createElement("div");
    ball.textContent = "⚽";
    ball.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);font-size:30px;`;
    layer.appendChild(ball);
    ball.animate(
      [
        { transform: "translate(-50%,-50%) translateY(0) rotate(0deg)", opacity: 1 },
        { transform: "translate(-50%,-50%) translateY(-150px) rotate(720deg)", opacity: 1, offset: 0.8 },
        { transform: "translate(-50%,-50%) translateY(-150px) rotate(900deg)", opacity: 0 },
      ],
      { duration: 850, easing: "cubic-bezier(0.3,0.9,0.4,1)" }
    ).onfinish = () => ball.remove();
  }

  const isCoin = flavor === "moneda";
  const isStamp = flavor === "sello";
  const n = isStamp ? 0 : isCoin ? 14 : 30;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("div");
    const ang = (Math.PI * 2 * i) / n + Math.random() * 0.5;
    const dist = 60 + Math.random() * 90;
    const dx = Math.cos(ang) * dist;
    const dy = Math.sin(ang) * dist - (isCoin ? 0 : 30);
    if (isCoin) {
      p.textContent = "🪙";
      p.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;font-size:${14 + Math.random() * 8}px;will-change:transform,opacity;`;
    } else {
      const c = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      const w = 6 + Math.random() * 6;
      p.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${w}px;height:${w * 1.6}px;
        background:${c};border-radius:2px;will-change:transform,opacity;`;
    }
    layer.appendChild(p);
    const rot = (Math.random() * 720 - 360) | 0;
    p.animate(
      [
        { transform: "translate(-50%,-50%) translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(-50%,-50%) translate(${dx}px, ${dy + 140}px) rotate(${rot}deg)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 500, easing: "cubic-bezier(0.2,0.7,0.3,1)" }
    ).onfinish = () => p.remove();
  }
}

// Rotación de festejos: confeti → gol → moneda.
const FX_CYCLE = ["confeti", "gol", "moneda"];
let _fxIdx = 0;
export function resolveFlavor(flavor) {
  if (flavor === "rotativa" || !flavor) return FX_CYCLE[_fxIdx++ % FX_CYCLE.length];
  return flavor;
}
