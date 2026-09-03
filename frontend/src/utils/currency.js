export const CURRENCIES = {
  NGN: { symbol: "₦", locale: "en-NG" },
  USD: { symbol: "$", locale: "en-US" },
  GBP: { symbol: "£", locale: "en-GB" },
  EUR: { symbol: "€", locale: "de-DE" },
  GHS: { symbol: "GH₵", locale: "en-GH" },
  KES: { symbol: "KSh", locale: "en-KE" },
};

/** amountMinor is kobo/cents — the smallest currency unit, matching the backend's *Kobo fields. */
export function formatCurrency(amountMinor, currency = "NGN") {
  const cfg = CURRENCIES[currency] || CURRENCIES.NGN;
  const amount = amountMinor / 100;
  return `${cfg.symbol}${amount.toLocaleString(cfg.locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
