import i18n from "./index";

export function formatCurrency(
  value: number,
  currencyByLng: Record<string, string> = { pt: "BRL", en: "USD", es: "EUR" }
) {
  const lng = (i18n.language || "pt").split("-")[0]; 
  const currency = currencyByLng[lng] || "USD";
  return new Intl.NumberFormat(lng, { style: "currency", currency }).format(value);
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const lng = (i18n.language || "pt").split("-")[0]; 
  return new Intl.DateTimeFormat(lng, { dateStyle: "medium" }).format(d);
}
