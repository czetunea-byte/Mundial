// Frases "echadoras" para los que deben en la Tabla de goleo.
// Entre MÁS semanas deben, más fuerte la frase. Rotan por persona y por semana.

const ROASTS = {
  // Nivel 1 — debe 1 semana (apenas, leve)
  1: [
    "anda corto esta semana 👀",
    "se le durmió el gallo 🐓",
    "ya casi, no te hagas 😏",
    "un descuidito… lo dejamos pasar (por hoy)",
    "se le fue la onda con el depósito 🙄",
    "estás a un OXXO de ponerte al día 🏪",
  ],
  // Nivel 2 — debe 2-3 semanas (subiendo el tono)
  2: [
    "ya párale a las excusas 😤",
    "el Mundial no se paga con buenos deseos ✈️",
    "más perdido que el dinero del fondo 🔍",
    "ya hasta el balón le tiene pena ⚽",
    "¿le sembramos un recordatorio en la frente? 📌",
    "promesas no compran boletos, compa 🎟️",
    "el grupo ya lo trae en la mira 👀👀",
  ],
  // Nivel 3 — debe 4+ semanas (modo sin piedad, todo se vale)
  3: [
    "este ya quiere ver el Mundial por la tele 📺",
    "deudor oficial del fondo, denle un aplauso 👏",
    "al paso que va, llega a España… en 2034 🐢",
    "más rajón que excusa de lunes 🥲",
    "le urge un milagro guadalupano 🙏",
    "ya ni para las tortas del partido va a alcanzar 🌮",
    "patrocinado por 'la próxima sí' 🤡",
    "el fondo crece… menos por su culpa 📉",
  ],
};

function level(weeksBehind) {
  if (weeksBehind >= 4) return 3;
  if (weeksBehind >= 2) return 2;
  return 1;
}

// Devuelve una frase acorde al atraso, rotando por persona (seed) y semana.
export function roastFor(weeksBehind, seed = "", rotation = 0) {
  const arr = ROASTS[level(weeksBehind)];
  let n = 0;
  for (let i = 0; i < seed.length; i++) n += seed.charCodeAt(i);
  return arr[(n + rotation) % arr.length];
}
