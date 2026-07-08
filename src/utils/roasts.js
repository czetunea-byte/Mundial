// Frases "echadoras" para los que deben en la Tabla de goleo.
// Entre MÁS semanas deben, más fuerte la frase. Rotan por persona y por semana
// (con un banco grande para que no se repitan seguido).

const ROASTS = {
  // Nivel 1 — debe 1 semana (leve, cariñoso)
  1: [
    "anda corto esta semana 👀",
    "se le durmió el gallo 🐓",
    "ya casi, no te hagas 😏",
    "un descuidito… lo dejamos pasar (por hoy)",
    "estás a un OXXO de ponerte al día 🏪",
    "se le fue la onda con el depósito 🙄",
    "nada grave… todavía 😌",
    "ponte la del 10 y paga 🔟",
    "una fecha y ya, no seas la selección 😅",
    "andas debiendo pero con estilo, ¿no? 😎",
  ],
  // Nivel 2 — debe 2-3 semanas (subiendo el tono)
  2: [
    "ya párale a las excusas 😤",
    "el Mundial no se paga con buenos deseos ✈️",
    "más perdido que el dinero del fondo 🔍",
    "ya hasta el balón le tiene pena ⚽",
    "promesas no compran boletos, compa 🎟️",
    "el grupo ya lo trae en la mira 👀👀",
    "dos semanas… ¿te presto para que me pagues? 😏",
    "el que debe y no paga, buen socio no es 🏠",
    "ya vas para deudor de honor 🎖️",
    "no seas como la Selección: cumple 🇲🇽",
    "más flojo para pagar que México en penales 🥅",
    "aportación en modo avión ✈️📵",
  ],
  // Nivel 3 — debe 4+ semanas (modo salvaje, todo se vale 🔥)
  3: [
    "este ya quiere ver el Mundial por la tele 📺",
    "al paso que va, llega a España… en 2034 🐢",
    "más rajón que promesa de político 🗳️",
    "ya ni para las tortas del partido le alcanza 🌮",
    "patrocinado por 'la próxima sí' 🤡",
    "el fondo crece… menos por su culpa 📉",
    "deudor con maestría y doctorado 🎓",
    "más seco que chiste de cuñado 🌵",
    "le debe hasta al de los tamales 🫔",
    "tiene el bolsillo en huelga indefinida ✊",
    "el único que ahorra… excusas 💾",
    "si deber fuera deporte, ya sería mundialista 🏅",
    "que le pongan una veladora al depósito 🕯️",
    "más ausente que México en la segunda ronda 👻",
    "junta más semanas debiendo que goles metió México ⚽😭",
    "ya hasta Hacienda le tiene lástima 🧾",
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
  for (let i = 0; i < seed.length; i++) n += seed.charCodeAt(i) * (i + 1);
  return arr[(n + rotation) % arr.length];
}
