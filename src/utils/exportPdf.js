import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatMoney } from "./format";
import { formatDate } from "./dates";

// Genera y descarga un PDF con el estado del fondo.
export function exportFundPdf({ settings, stats, expenses }) {
  const doc = new jsPDF();
  const money = (v) => formatMoney(v, settings);
  const today = formatDate(new Date());

  // Encabezado
  doc.setFontSize(18);
  doc.text(settings.fundName, 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Reporte generado el ${today}`, 14, 25);
  doc.setTextColor(0);

  // Resumen
  doc.setFontSize(12);
  const summary = [
    ["Total recaudado", money(stats.totalRaised)],
    ["Total gastado", money(stats.totalSpent)],
    ["Saldo disponible", money(stats.balance)],
    ["Meta del fondo", money(stats.goal)],
    ["Avance", `${Math.round(stats.progress * 100)}%`],
    [
      "Semana",
      `${Math.min(stats.weeksElapsed, stats.totalWeeks)} de ${stats.totalWeeks}`,
    ],
  ];
  autoTable(doc, {
    startY: 32,
    head: [["Resumen", ""]],
    body: summary,
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] },
  });

  // Aportaciones por integrante
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 8,
    head: [["Integrante", "Aportado", "Semanas pagadas", "Pendiente", "Estado"]],
    body: stats.perMember.map((p) => [
      p.member.name,
      money(p.total),
      String(p.paidCount),
      money(p.owed),
      p.upToDate ? "Al corriente" : "Atrasado",
    ]),
    theme: "grid",
    headStyles: { fillColor: [22, 163, 74] },
  });

  // Gastos
  if (expenses.length > 0) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Fecha", "Concepto", "Categoría", "Monto"]],
      body: [...expenses]
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .map((e) => [
          e.date ? formatDate(e.date) : "—",
          e.title,
          e.category || "Otros",
          money(e.amount),
        ]),
      theme: "grid",
      headStyles: { fillColor: [220, 38, 38] },
    });
  }

  const safe = settings.fundName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`${safe}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
