export function formatStockPrice(price: number): string {
  return `$${price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatMarketCap(value: number): string {
  return `$${Math.round(value).toLocaleString()} B`;
}

export function formatChange(value: number): string {
  const sign = value >= 0 ? "+" : "";
  const arrow = value >= 0 ? "↑" : "↓";
  return `${sign}${value.toFixed(2)} ${arrow}`;
}
