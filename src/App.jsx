import { useState } from "react";
import "./styles.css";
import { useFund } from "./hooks/useFund";
import { STORAGE_MODE } from "./data/store";
import Dashboard from "./components/Dashboard";
import Members from "./components/Members";
import Contributions from "./components/Contributions";
import Expenses from "./components/Expenses";
import Reports from "./components/Reports";
import SettingsModal from "./components/SettingsModal";

const TABS = [
  { key: "dashboard", label: "Resumen", icon: "🏠" },
  { key: "contributions", label: "Aportaciones", icon: "📅" },
  { key: "expenses", label: "Gastos", icon: "🧾" },
  { key: "reports", label: "Reportes", icon: "📊" },
  { key: "members", label: "Equipo", icon: "👥" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const fund = useFund();
  const { members, expenses, settings, stats, ready } = fund;

  return (
    <div className="app">
      <div className="tricolor">
        <span className="tc-green" />
        <span className="tc-white" />
        <span className="tc-red" />
      </div>
      <header className="app-header">
        <div className="app-header-inner">
          <div>
            <h1>⚽ {settings.fundName}</h1>
            <p className="app-subtitle">
              {stats.totalWeeks} semanas · cuota {settings.currency}
              {stats.currentQuota.toLocaleString("es-MX")}/semana c/u
            </p>
            <p className="app-cheer">🦅 ¡Vamos México! · Rumbo al Mundial 2030</p>
          </div>
          <button
            className="icon-btn"
            onClick={() => setShowSettings(true)}
            aria-label="Configuración"
            title="Configuración"
          >
            ⚙️
          </button>
        </div>
      </header>

      {STORAGE_MODE === "local" && (
        <div className="banner">
          <strong>Modo local:</strong> los datos solo se guardan en este navegador.
          Conecta Firebase (ver <code>src/firebase.js</code>) para que todos vean el
          fondo actualizado en tiempo real.
        </div>
      )}

      <main className="app-main">
        {!ready ? (
          <div className="loading">Cargando…</div>
        ) : (
          <>
            {tab === "dashboard" && (
              <Dashboard
                members={members}
                settings={settings}
                stats={stats}
                onGoToMembers={() => setTab("members")}
              />
            )}
            {tab === "contributions" && (
              <Contributions members={members} settings={settings} stats={stats} />
            )}
            {tab === "expenses" && (
              <Expenses expenses={expenses} settings={settings} stats={stats} />
            )}
            {tab === "reports" && (
              <Reports
                members={members}
                settings={settings}
                stats={stats}
                expenses={expenses}
              />
            )}
            {tab === "members" && (
              <Members members={members} settings={settings} stats={stats} />
            )}
          </>
        )}
      </main>

      <nav className="tabbar">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab ${tab === t.key ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>

      {showSettings && (
        <SettingsModal settings={settings} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
