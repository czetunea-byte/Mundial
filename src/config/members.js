// Integrantes del fondo (8) con su color (hue para OKLCH) y foto real.
// Las fotos viven en src/assets/photos y Vite las empaqueta.

import carlos from "../assets/photos/carlos.png";
import salomon from "../assets/photos/salomon.png";
import maurim from "../assets/photos/maurim.png";
import marri from "../assets/photos/marri.png";
import arturo from "../assets/photos/arturo.png";
import caltum from "../assets/photos/caltum.png";
import mauricioy from "../assets/photos/mauricioy.png";
import chal from "../assets/photos/chal.png";

// Foto por id de integrante (se adjunta en el hook al leer del store).
export const PHOTOS = {
  carlos,
  salomon,
  maurim,
  marri,
  arturo,
  caltum,
  mauricioy,
  chal,
};

// Integrantes precargados (se siembran una sola vez en el primer arranque).
export const DEFAULT_MEMBERS = [
  { id: "carlos", name: "Carlos", hue: 150 },
  { id: "salomon", name: "Salomón", hue: 28 },
  { id: "maurim", name: "Mauri M", hue: 265 },
  { id: "marri", name: "Marri", hue: 330 },
  { id: "arturo", name: "Arturo", hue: 200 },
  { id: "caltum", name: "Caltum", hue: 95 },
  { id: "mauricioy", name: "Mauricio Y", hue: 8 },
  { id: "chal", name: "Chal", hue: 55 },
].map((m, i) => ({ ...m, createdAt: 1000 + i }));

// Frases echadoras que rotan por semana en el Resumen.
export const PHRASES = [
  "Ya ni llorar es bueno: cayó México, ¡pero el fondo NO! 🦅",
  "El 2026 fue el calentamiento… en España 2030 SÍ es la buena 🔥",
  "¿Que perdió México? Y si sí… por eso vamos por el 2030 🇲🇽",
  "Y si sí, aquí seguimos — arriba ese ánimo, banda 💪",
  "Y si sí, esta semana toca soltar la lana 😎",
  "¡¡EEEEH!! El fondo va con todo esta semana 🎉⚽",
  "Esta semana hasta el que debe va a pagar 💪",
  "El que no aporta, no va al palco 🏟️",
  "Aguas, que el Mundial no se paga con excusas 😎",
  "Ahorrar hoy = chelas frías en el estadio en 2030 🍺",
  "Cada peso es un paso más cerca de la tribuna 🇲🇽",
  "El fondo no descansa, ¡y ustedes tampoco! ⚽",
  "Quien falle su semana, paga las tortas el día del partido 🌮",
];
