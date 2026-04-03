import type { Stock } from "../stocks";
import { formatStockPrice, formatChange } from "../utils/format";

type StockPanelProps = {
  stock: Stock;
  selected: boolean;
  onClick: (shiftKey: boolean) => void;
};

export function StockPanel({ stock, selected, onClick }: StockPanelProps) {
  return (
    <button type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e.shiftKey);
      }}

      className= {`border rounded p-2 text-left 
        ${
          selected ? 
            "bg-red-300 border-red-400"
            : "bg-white border-gray-300 hover:bg-red-100"
          }`}
    >

      <div className="text-sm font-medium">
        {stock.name} ({stock.symbol})
      </div>

      <div className="text-xs text-gray-700">
        {formatStockPrice(stock.price)} ({formatChange(stock.change)})
      </div>
      
    </button>
  );
}
