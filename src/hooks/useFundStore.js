import { useEffect, useMemo } from "react";
import { useFund } from "./useFund";
import { addItem, removeItem, upsertItem, updateSettings } from "../data/store";
import { DEFAULT_MEMBERS } from "../config/members";
import { money } from "../utils/format";

// Adaptador con IDENTIDAD: expone la API de las pantallas, agrega "dueño del
// registro" (createdBy), permisos (dueño o admin) y registro de actividad.
export function useFundStore(user) {
  const fund = useFund();
  const { members, contributions, expenses, activity, settings, stats, ready, error } = fund;

  // Siembra el plantel cuando está vacío EN LA NUBE (solo el admin puede
  // escribirlo). Idempotente: usa ids fijos, así re-ejecutar no duplica.
  useEffect(() => {
    if (!ready || error || !user?.isAdmin) return;
    if (members.length > 0) return;
    DEFAULT_MEMBERS.forEach((m) =>
      upsertItem("members", m.id, { name: m.name, hue: m.hue, createdAt: m.createdAt })
    );
  }, [ready, error, user, members.length]);

  const actions = useMemo(() => {
    const canEdit = (rec) => user?.isAdmin || (rec && rec.createdBy === user?.id);
    const log = (action, detail) =>
      addItem("activity", { actorId: user.id, actorName: user.name, action, detail });
    const nameOf = (id) => members.find((m) => m.id === id)?.name || id;

    return {
      toggleWeek(memberId, weekIndex) {
        const existing = stats.paidMap.get(`${memberId}|${weekIndex}`);
        if (existing) {
          if (!canEdit(existing)) {
            const owner = members.find((m) => m.id === existing.createdBy)?.name || "quien lo registró";
            window.alert(`Solo ${owner} (o el admin) puede quitar este pago.`);
            return false;
          }
          removeItem("contributions", existing.id);
          log("pago-quitar", `quitó el pago de ${nameOf(memberId)} · Sem ${weekIndex + 1}`);
          return false;
        }
        addItem("contributions", {
          memberId,
          weekIndex,
          amount: stats.quotaByWeek[weekIndex] ?? settings.weeklyAmount,
          createdBy: user.id,
        });
        log("pago", `marcó el pago de ${nameOf(memberId)} · Sem ${weekIndex + 1}`);
        return true;
      },
      addExpense(exp) {
        const amount = Number(exp.amount) || 0;
        addItem("expenses", {
          title: exp.title,
          amount,
          category: exp.category || "Otros",
          date: exp.date || new Date().toISOString().slice(0, 10),
          createdBy: user.id,
        });
        log("gasto", `registró el gasto "${exp.title}" (${money(amount)})`);
      },
      removeExpense(id) {
        const ex = expenses.find((e) => e.id === id);
        if (!canEdit(ex)) {
          const owner = members.find((m) => m.id === ex?.createdBy)?.name || "quien lo registró";
          window.alert(`Solo ${owner} (o el admin) puede borrar este gasto.`);
          return;
        }
        removeItem("expenses", id);
        log("gasto-quitar", `borró el gasto "${ex?.title || ""}"`);
      },
      addMember(name) {
        if (!user?.isAdmin) { window.alert("Solo el admin puede editar el plantel."); return; }
        const hue = (members.length * 47) % 360;
        addItem("members", { name, hue });
        log("miembro", `agregó a ${name} al equipo`);
      },
      removeMember(id) {
        if (!user?.isAdmin) { window.alert("Solo el admin puede editar el plantel."); return; }
        removeItem("members", id);
        log("miembro-quitar", `quitó a ${nameOf(id)} del equipo`);
      },
      async saveSettings(patch) {
        await updateSettings(patch);
        log("config", "actualizó la configuración del fondo");
      },
      // Para que las pantallas decidan si mostrar botón de borrar.
      canEdit,
    };
  }, [stats, settings, members, expenses, user]);

  return {
    members,
    contributions,
    expenses,
    activity,
    settings,
    stats,
    ready,
    error,
    currentUser: user,
    isAdmin: !!user?.isAdmin,
    ...actions,
  };
}
