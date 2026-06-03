// Utilidades de fechas: el ahorro se organiza por semanas desde startDate
// hasta targetDate. Cada semana tiene un índice (0, 1, 2, ...).

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

function parseDate(iso) {
  // Interpretar "YYYY-MM-DD" como fecha local a medianoche.
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addWeeks(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n * 7);
  return d;
}

// Lista de semanas entre startDate y targetDate (inclusive del arranque).
export function buildWeeks(startISO, targetISO) {
  const start = parseDate(startISO);
  const target = parseDate(targetISO);
  const weeks = [];
  let cur = new Date(start);
  let i = 0;
  while (cur <= target) {
    weeks.push({
      index: i,
      start: new Date(cur),
      end: addWeeks(cur, 1),
    });
    cur = addWeeks(cur, 1);
    i += 1;
  }
  return weeks;
}

// Índice de la semana actual respecto a startDate (puede ser negativo si aún
// no arranca, o mayor al total si ya pasó la fecha objetivo).
export function currentWeekIndex(startISO, now = new Date()) {
  const start = parseDate(startISO);
  return Math.floor((now - start) / MS_PER_WEEK);
}

const MESES = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

export function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatShortDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getDate()} ${MESES[d.getMonth()]}`;
}
