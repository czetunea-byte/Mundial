// Formateo de dinero y helpers de texto.

// "$1,234" — redondeado, formato es-MX.
export function money(n) {
  return "$" + Math.round(Number(n) || 0).toLocaleString("es-MX");
}

// Iniciales (máx 2 letras) a partir del nombre.
export function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Compat: formateo con settings (se sigue usando en utils antiguos).
export function formatMoney(amount, settings) {
  const symbol = settings?.currency ?? "$";
  return `${symbol}${(Number(amount) || 0).toLocaleString("es-MX", {
    maximumFractionDigits: 2,
  })}`;
}
