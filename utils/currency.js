export function formatPrice(amount, currency) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency
  }).format(amount);
}
