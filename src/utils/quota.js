// La cuota semanal puede cambiar con el tiempo (p. ej. subir cada año).
// Se modela como una lista de "tramos": cada uno con una fecha de inicio
// (`from`) y un monto (`amount`). Para una fecha dada, aplica el tramo más
// reciente cuya fecha sea <= esa fecha.

function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Devuelve los tramos ordenados por fecha. Si no hay tramos definidos, cae al
// valor único `weeklyAmount` desde la fecha de inicio (compatibilidad).
export function sortedTiers(settings) {
  const raw =
    settings.quotaTiers && settings.quotaTiers.length
      ? settings.quotaTiers
      : [{ from: settings.startDate, amount: settings.weeklyAmount }];
  return raw
    .filter((t) => t && t.from && Number(t.amount) >= 0)
    .map((t) => ({ from: t.from, amount: Number(t.amount) }))
    .sort((a, b) => (a.from < b.from ? -1 : 1));
}

// Cuota aplicable a una fecha (Date u objeto convertible).
export function quotaForDate(date, settings) {
  const tiers = sortedTiers(settings);
  if (tiers.length === 0) return Number(settings.weeklyAmount) || 0;
  const d = date instanceof Date ? date : new Date(date);
  let amount = tiers[0].amount; // antes del primer tramo, usa el primero
  for (const t of tiers) {
    if (parseISO(t.from) <= d) amount = t.amount;
    else break;
  }
  return amount;
}
