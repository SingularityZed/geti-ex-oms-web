export function amountFormat(amount: number, defaultValue?: any) {
  return amount ? (amount / 100).toFixed(2) : (defaultValue ? defaultValue : '');
}
