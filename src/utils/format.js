// Formateo de dinero.

export function formatMoney(amount, settings) {
  const value = Number(amount) || 0;
  const formatted = value.toLocaleString("es-MX", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const symbol = settings?.currency ?? "$";
  return `${symbol}${formatted}`;
}

export function formatMoneyShort(amount, settings) {
  const value = Number(amount) || 0;
  const symbol = settings?.currency ?? "$";
  if (Math.abs(value) >= 1000) {
    return `${symbol}${(value / 1000).toLocaleString("es-MX", {
      maximumFractionDigits: 1,
    })}k`;
  }
  return `${symbol}${value.toLocaleString("es-MX")}`;
}
