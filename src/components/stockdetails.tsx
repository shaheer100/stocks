import type { Stock } from "../stocks";
import { ChartView } from "./chartview";
import { ListView } from "./listview";
import { formatStockPrice, formatChange } from "../utils/format";

type StockDetailsProps = {
  viewMode: "chart" | "list";
  selectedStock: Stock | null;
  selectedCount: number;
};

export function StockDetails({
  viewMode,
  selectedStock,
  selectedCount,
}: StockDetailsProps) {
  return (
  <section className="flex-1 h-full min-w-0 flex flex-col p-4 bg-red-50">
    {selectedCount === 0 ? (
        <>
          <div className="text-2xl font-medium mb-2">Welcome!</div>
          <div className="text-sm mb-5">
            This is a stocks application built with Preact, TypeScript, and Tailwind.
          </div>

          <div className="text-sm font-medium mb-2">Supported actions</div>
          <ul className="list-disc pl-9 text-sm mb-6">
            <li>Use the <span className="italic">Add</span> and <span className="italic">Del</span> buttons to add or remove a stock.</li>
            <li>Click to select a stock in the list, or Shift-click to select multiple stocks.</li>
            <li>• When viewing a single stock, use the Chart and List buttons for details.</li>
          </ul>

          <div className="text-sm font-medium mb-2">Keyboard shortcuts</div>
          <ul className="list-disc pl-9 text-sm">
            <li><span className="italic">Shift-A</span> - add a random stock</li>
            <li><span className="italic">Shift-D</span> - delete selected stocks</li>
            <li><span className="italic">Shift-C</span> - clear all selections</li>
            <li><span className="italic">Shift-U</span> - undo</li>
            <li><span className="italic">Shift-R</span> - redo</li>
          </ul>
        </>
      ) : selectedCount > 1 ? (
        <>
          <div className="text-sm mb-2">
            Multiple stocks selected. Details can only be shown when a single stock is selected.
          </div>

          <ul className="list-disc pl-9 text-sm">
            <li>Use Shift-click to modify your selection, or</li>
            <li>Press <span className="italic">Del</span> to delete all selected Stocks from the list.</li>
          </ul>
        </>
      ) : selectedStock ? (
        <>
          <div className="text-2xl font-medium mb-2">
            {selectedStock.name} ({selectedStock.symbol})
          </div>

          <div className="text-sm mb-2">Market Cap: ${selectedStock.mcap}</div>

          <div className="text-sm mb-4">
            Stock Price: {formatStockPrice(selectedStock.price)} ({formatChange(selectedStock.change)})
          </div>

          <div className="flex-1 min-h-0">
            {viewMode === "chart" ? (
              <ChartView stock={selectedStock} />
            ) : (
              <ListView stock={selectedStock} />
            )}
          </div>
        </>
      ) : null}
    </section>
  );
}
