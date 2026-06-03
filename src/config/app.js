// Configuración base del fondo del Mundial.
// Estos son los valores por defecto; se pueden editar desde la app (engrane)
// y quedan guardados de forma compartida para todos.

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

// Categorías sugeridas para los gastos
export const EXPENSE_CATEGORIES = [
  "Boletos",
  "Vuelos",
  "Hospedaje",
  "Transporte",
  "Comida",
  "Otros",
];

// Paleta para asignar color a cada integrante
export const MEMBER_COLORS = [
  "#2563eb", // azul
  "#16a34a", // verde
  "#dc2626", // rojo
  "#9333ea", // morado
  "#ea580c", // naranja
  "#0891b2", // cian
  "#ca8a04", // dorado
  "#db2777", // rosa
  "#4f46e5", // índigo
  "#65a30d", // lima
];

// Integrantes precargados. Se siembran una sola vez en el primer arranque
// (si después editan el equipo, no se vuelven a agregar). Edítalos libremente.
export const DEFAULT_MEMBERS = [
  "Carlos",
  "Arturo",
  "Mauri M",
  "Mauricio Y",
  "Salomón",
  "Caltum",
  "Marri",
].map((name, i) => ({
  id: "seed-" + i,
  name,
  color: MEMBER_COLORS[i % MEMBER_COLORS.length],
  createdAt: 1000 + i,
}));
