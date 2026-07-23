// Configuración base del fondo del Mundial.

export const DEFAULT_SETTINGS = {
  // Nombre del fondo (se muestra en el encabezado y en los reportes)
  fundName: "Fondo Mundial 2030 🇲🇽",
  // Cuota base por persona/semana (fallback si no hay tramos definidos)
  weeklyAmount: 1000,
  // Cuotas escalonadas: cada tramo aplica desde su fecha `from`.
  // +500 cada año (en el aniversario del arranque), sin afectar lo ya aportado.
  quotaTiers: [
    { from: "2026-06-03", amount: 1000 },
    { from: "2027-06-03", amount: 1500 },
    { from: "2028-06-03", amount: 2000 },
    { from: "2029-06-03", amount: 2500 },
  ],
  // Fecha en que arranca el ahorro (la primera semana empieza hoy)
  startDate: "2026-06-03",
  // Fecha objetivo: arranque del Mundial 2030
  targetDate: "2030-06-08",
  // Símbolo de moneda
  currency: "$",
  // Código de moneda para formateo
  currencyCode: "MXN",
};

// Categorías de gastos con su emoji.
export const EXPENSE_CATS = {
  Boletos: "🎟️",
  Vuelos: "✈️",
  Hospedaje: "🏨",
  Transporte: "🚌",
  Comida: "🌮",
  Otros: "📦",
};

// Categorías de ingresos extraordinarios (multas y otros extras) con su emoji.
export const INCOME_CATS = {
  "Multa por llegar tarde": "⏰",
  "Otra multa": "🚫",
  Cooperación: "🤝",
  Otro: "💰",
};
