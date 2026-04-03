import { formatStockPrice } from "../utils/format";

type StatusBarProps = {
  loadedCount: number;
  selectedCount: number;
  selectedName: string | null;
  selectedPrice: number | null;
};

export function StatusBar({
  loadedCount,
  selectedCount,
  selectedName,
  selectedPrice,
}: StatusBarProps) {
  const leftText = (selectedName !== null && selectedPrice !== null) ? 
      `${selectedName}: ${formatStockPrice(selectedPrice)}`
      : "";

  const rightText = `${loadedCount} Stocks (${selectedCount} Selected)`;

  return (
    <footer className="h-10 shrink-0 flex items-center px-3 text-xs bg-gray-200 border-t border-gray-300">
      <div>{leftText}</div>
      <div className="flex-1" />
      <div>{rightText}</div>
    </footer>
  );
}
