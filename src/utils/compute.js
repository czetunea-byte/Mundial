// Cálculos derivados del estado del fondo.
import { buildWeeks, currentWeekIndex } from "./dates";
import { quotaForDate } from "./quota";

// Devuelve un objeto con todo lo calculado a partir de los datos crudos.
export function computeFund({ members, contributions, expenses, settings }) {
  const weeks = buildWeeks(settings.startDate, settings.targetDate);
  const totalWeeks = weeks.length;

  // Cuota vigente para cada semana (puede variar por tramos).
  const quotaByWeek = weeks.map((w) => quotaForDate(w.start, settings));
  // Adjunta la cuota a cada semana (las pantallas la usan).
  weeks.forEach((w, i) => { w.quota = quotaByWeek[i]; });
  const curIdx = currentWeekIndex(settings.startDate);
  const currentWeek = Math.min(Math.max(curIdx, 0), Math.max(totalWeeks - 1, 0));
  const weeksElapsed = Math.min(Math.max(curIdx + 1, 0), totalWeeks);

  // Mapa rápido + objeto plano: clave "memberId|weekIndex"
  const paidMap = new Map();
  const paid = {};
  for (const c of contributions) {
    const key = `${c.memberId}|${c.weekIndex}`;
    paidMap.set(key, c);
    paid[key] = true;
  }

  const totalRaised = contributions.reduce((s, c) => s + (Number(c.amount) || 0), 0);
  const totalSpent = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const balance = totalRaised - totalSpent;

  // Meta total: cada integrante aporta la cuota vigente de cada semana.
  const sumQuotas = quotaByWeek.reduce((s, q) => s + q, 0);
  const goal = members.length * sumQuotas;

  // Por integrante
  const perMember = members.map((m) => {
    const memberContribs = contributions.filter((c) => c.memberId === m.id);
    const paidWeeks = new Set(memberContribs.map((c) => c.weekIndex));
    const total = memberContribs.reduce((s, c) => s + (Number(c.amount) || 0), 0);

    // Semanas que ya debían estar pagadas (de la 0 a la actual)
    const pendingWeeks = [];
    for (let w = 0; w <= currentWeek; w++) {
      if (!paidWeeks.has(w)) pendingWeeks.push(w);
    }
    // Lo que debe = suma de la cuota vigente de cada semana pendiente.
    const owed =
      curIdx >= 0
        ? pendingWeeks.reduce((s, w) => s + (quotaByWeek[w] || 0), 0)
        : 0;

    return {
      member: m,
      total,
      paidCount: paidWeeks.size,
      pendingWeeks,
      paidWeeks,
      owed,
      upToDate: owed === 0,
    };
  });

  // Ranking (tabla de goleo) y quién falta esta semana.
  const ranking = [...perMember].sort((a, b) => b.total - a.total || a.owed - b.owed);
  const pendingThisWeek = members.filter((m) => !paid[`${m.id}|${currentWeek}`]);

  // Acumulado real del fondo + meta planeada, semana a semana (para la gráfica)
  const cumulativeByWeek = [];
  let running = 0;
  let plannedRunning = 0;
  for (let w = 0; w < totalWeeks; w++) {
    const weekTotal = contributions
      .filter((c) => c.weekIndex === w)
      .reduce((s, c) => s + (Number(c.amount) || 0), 0);
    running += weekTotal;
    // Lo que deberíamos llevar si los N integrantes pagan su cuota cada semana
    plannedRunning += members.length * (quotaByWeek[w] || 0);
    cumulativeByWeek.push({
      week: w,
      amount: running,
      // Solo dibujamos la línea real hasta la semana actual
      real: w <= currentWeek ? running : null,
      planned: plannedRunning,
    });
  }

  // ¿Cuánto deberíamos llevar a la fecha? (meta hasta la semana actual)
  const plannedToDate =
    curIdx >= 0 && cumulativeByWeek[currentWeek]
      ? cumulativeByWeek[currentWeek].planned
      : 0;
  const pace = plannedToDate > 0 ? totalRaised / plannedToDate : 1;

  // Gastos por categoría
  const byCategory = {};
  for (const e of expenses) {
    const cat = e.category || "Otros";
    byCategory[cat] = (byCategory[cat] || 0) + (Number(e.amount) || 0);
  }

  return {
    weeks,
    totalWeeks,
    currentWeek,
    currentWeekIndex: curIdx,
    weeksElapsed,
    notStarted: curIdx < 0,
    finished: curIdx >= totalWeeks,
    paidMap,
    paid,
    quotaByWeek,
    currentQuota: quotaByWeek[currentWeek] || settings.weeklyAmount,
    totalRaised,
    totalSpent,
    balance,
    goal,
    progress: goal > 0 ? Math.min(totalRaised / goal, 1) : 0,
    perMember,
    ranking,
    pendingThisWeek,
    cumulativeByWeek,
    cumulative: cumulativeByWeek,
    plannedToDate,
    pace,
    expensesByCategory: byCategory,
    byCategory,
  };
}
