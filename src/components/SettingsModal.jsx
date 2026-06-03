import { useState } from "react";
import { Modal } from "./ui";
import { updateSettings } from "../data/store";
import { sortedTiers } from "../utils/quota";

export default function SettingsModal({ settings, onClose }) {
  const [form, setForm] = useState({
    fundName: settings.fundName,
    startDate: settings.startDate,
    targetDate: settings.targetDate,
    currency: settings.currency,
  });
  const [tiers, setTiers] = useState(() =>
    sortedTiers(settings).map((t) => ({ ...t }))
  );
  const [saving, setSaving] = useState(false);

  const field = (k, v) => setForm({ ...form, [k]: v });

  function updateTier(i, key, value) {
    setTiers(tiers.map((t, idx) => (idx === i ? { ...t, [key]: value } : t)));
  }
  function addTier() {
    const last = tiers[tiers.length - 1];
    setTiers([
      ...tiers,
      { from: last?.from || form.startDate, amount: last?.amount || 1000 },
    ]);
  }
  function removeTier(i) {
    setTiers(tiers.filter((_, idx) => idx !== i));
  }

  async function save() {
    setSaving(true);
    const cleanTiers = tiers
      .filter((t) => t.from && Number(t.amount) >= 0)
      .map((t) => ({ from: t.from, amount: Number(t.amount) }))
      .sort((a, b) => (a.from < b.from ? -1 : 1));

    await updateSettings({
      fundName: form.fundName.trim() || settings.fundName,
      startDate: form.startDate,
      targetDate: form.targetDate,
      currency: form.currency || "$",
      quotaTiers: cleanTiers,
      // weeklyAmount como fallback = primera cuota
      weeklyAmount: cleanTiers[0]?.amount ?? settings.weeklyAmount,
    });
    setSaving(false);
    onClose();
  }

  return (
    <Modal
      title="Configuración del fondo"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </>
      }
    >
      <label className="field">
        <span>Nombre del fondo</span>
        <input
          className="input"
          value={form.fundName}
          onChange={(e) => field("fundName", e.target.value)}
        />
      </label>

      {/* Cuotas escalonadas */}
      <div className="field">
        <span>Cuota semanal por persona</span>
        <p className="small muted" style={{ margin: "0 0 8px" }}>
          Define cuánto aporta cada quien y desde qué fecha. Agrega un tramo
          cada año si suben la cuota — lo ya pagado no cambia.
        </p>
        <div className="tier-list">
          {tiers.map((t, i) => (
            <div key={i} className="tier-row">
              <div className="tier-fields">
                <label className="tier-mini">
                  <span>Desde</span>
                  <input
                    className="input"
                    type="date"
                    value={t.from}
                    onChange={(e) => updateTier(i, "from", e.target.value)}
                  />
                </label>
                <label className="tier-mini">
                  <span>Monto ({form.currency})</span>
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={t.amount}
                    onChange={(e) => updateTier(i, "amount", e.target.value)}
                  />
                </label>
              </div>
              <button
                className="icon-btn danger"
                onClick={() => removeTier(i)}
                aria-label="Quitar tramo"
                disabled={tiers.length === 1}
                title={tiers.length === 1 ? "Debe haber al menos una cuota" : "Quitar"}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
        <button className="btn tier-add" onClick={addTier} type="button">
          + Agregar cambio de cuota
        </button>
      </div>

      <div className="form-row">
        <label className="field">
          <span>Fecha de inicio</span>
          <input
            className="input"
            type="date"
            value={form.startDate}
            onChange={(e) => field("startDate", e.target.value)}
          />
        </label>
        <label className="field">
          <span>Fecha del Mundial</span>
          <input
            className="input"
            type="date"
            value={form.targetDate}
            onChange={(e) => field("targetDate", e.target.value)}
          />
        </label>
      </div>

      <label className="field">
        <span>Moneda</span>
        <input
          className="input"
          value={form.currency}
          onChange={(e) => field("currency", e.target.value)}
          maxLength={3}
          style={{ maxWidth: 100 }}
        />
      </label>
    </Modal>
  );
}
