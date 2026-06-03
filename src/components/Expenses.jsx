import { useState } from "react";
import { Card, EmptyState } from "./ui";
import { formatMoney } from "../utils/format";
import { formatDate } from "../utils/dates";
import { addItem, removeItem } from "../data/store";
import { EXPENSE_CATEGORIES } from "../config/app";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function Expenses({ expenses, settings, stats }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: EXPENSE_CATEGORIES[0],
    date: todayISO(),
    note: "",
  });

  const money = (v) => formatMoney(v, settings);

  async function addExpense(e) {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.title.trim() || !amount || amount <= 0) return;
    await addItem("expenses", {
      title: form.title.trim(),
      amount,
      category: form.category,
      date: form.date,
      note: form.note.trim(),
    });
    setForm({
      title: "",
      amount: "",
      category: EXPENSE_CATEGORIES[0],
      date: todayISO(),
      note: "",
    });
  }

  async function deleteExpense(ex) {
    if (window.confirm(`¿Eliminar el gasto "${ex.title}"?`)) {
      await removeItem("expenses", ex.id);
    }
  }

  const sorted = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="stack">
      <Card>
        <div className="row-between">
          <strong>Saldo disponible</strong>
          <span className="big-balance" style={{ color: stats.balance < 0 ? "#dc2626" : "#16a34a" }}>
            {money(stats.balance)}
          </span>
        </div>
        <div className="small muted">
          Recaudado {money(stats.totalRaised)} − gastado {money(stats.totalSpent)}
        </div>
      </Card>

      <Card>
        <strong>Registrar gasto</strong>
        <form className="form-grid" onSubmit={addExpense}>
          <input
            className="input"
            placeholder="Concepto (ej. Boletos fase de grupos)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            maxLength={80}
          />
          <div className="form-row">
            <input
              className="input"
              type="number"
              inputMode="decimal"
              placeholder="Monto"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              min="0"
              step="0.01"
            />
            <select
              className="input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              className="input"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <input
            className="input"
            placeholder="Nota (opcional)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            maxLength={120}
          />
          <button className="btn btn-primary" type="submit">
            Agregar gasto
          </button>
        </form>
      </Card>

      {sorted.length === 0 ? (
        <EmptyState icon="🧾" title="Aún no hay gastos">
          Cuando empiecen a comprar boletos, vuelos u hospedaje, regístralo aquí.
        </EmptyState>
      ) : (
        <Card>
          <strong>Historial de gastos ({sorted.length})</strong>
          <div className="expense-list">
            {sorted.map((ex) => (
              <div key={ex.id} className="expense-item">
                <div className={`expense-cat cat-${(ex.category || "otros").toLowerCase()}`}>
                  {ex.category || "Otros"}
                </div>
                <div className="expense-info">
                  <div className="row-between">
                    <span className="expense-title">{ex.title}</span>
                    <strong>{money(ex.amount)}</strong>
                  </div>
                  <div className="small muted">
                    {ex.date ? formatDate(ex.date) : "—"}
                    {ex.note ? ` · ${ex.note}` : ""}
                  </div>
                </div>
                <button
                  className="icon-btn danger"
                  onClick={() => deleteExpense(ex)}
                  aria-label="Eliminar gasto"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
