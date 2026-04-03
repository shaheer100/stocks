import type { Stock } from "../stocks";
import { StockPanel } from "./stockpanel";

type StockListProps = {
  stocks: Stock[];
  selectedStocks: string[];
  onSelectStock: (symbol: string, shiftKey: boolean) => void;
  onClearSelection: () => void;
};

export function StockList({
  stocks,
  selectedStocks,
  onSelectStock,
  onClearSelection,
}: StockListProps) {
  return (
    <aside className="w-44 shrink-0 h-full flex flex-col p-2 gap-2 bg-gray-100 border-r border-gray-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClearSelection();
        }
      }}
    >
      {stocks.map((stock) => (
        <StockPanel
          key={stock.symbol}
          stock={stock}
          selected={selectedStocks.includes(stock.symbol)}
          onClick={(shiftKey) => onSelectStock(stock.symbol, shiftKey)}
        />
      ))}
    </aside>
  );
}
