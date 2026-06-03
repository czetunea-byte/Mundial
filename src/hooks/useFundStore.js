import { useMemo } from "react";
import { useFund } from "./useFund";
import { addItem, removeItem, upsertItem } from "../data/store";

// Adaptador: expone la API que esperan las pantallas del rediseño
// (toggleWeek, addExpense, ...) usando la capa de datos lista para Firebase.
export function useFundStore() {
  const { members, contributions, expenses, settings, stats, ready } = useFund();

  const actions = useMemo(
    () => ({
      // Marca/desmarca el pago. Devuelve true si se acaba de registrar.
      toggleWeek(memberId, weekIndex) {
        const existing = stats.paidMap.get(`${memberId}|${weekIndex}`);
        if (existing) {
          removeItem("contributions", existing.id);
          return false;
        }
        addItem("contributions", {
          memberId,
          weekIndex,
          amount: stats.quotaByWeek[weekIndex] ?? settings.weeklyAmount,
        });
        return true;
      },
      addExpense(exp) {
        addItem("expenses", {
          title: exp.title,
          amount: Number(exp.amount) || 0,
          category: exp.category || "Otros",
          date: exp.date || new Date().toISOString().slice(0, 10),
        });
      },
      removeExpense(id) {
        removeItem("expenses", id);
      },
      addMember(name) {
        const hue = (members.length * 47) % 360;
        addItem("members", { name, hue });
      },
      removeMember(id) {
        removeItem("members", id);
      },
      setPhoto(memberId, photo) {
        upsertItem("members", memberId, { photo });
      },
    }),
    [stats, settings, members.length]
  );

  return { members, contributions, expenses, settings, stats, ready, ...actions };
}
