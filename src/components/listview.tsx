import type { Stock } from "../stocks";
import { formatMarketCap, formatChange } from "../utils/format";

type ListViewProps = {
  stock: Stock;
};

export function ListView({ stock }: ListViewProps) {
  return (
    <div className="w-full pr-8">
      <table className="bg-white min-w-85 w-full">
        <thead>
          <tr>
            <th className="px-6 py-2 text-center">Year</th>
            <th className="px-6 py-2 text-center">Market Cap</th>
            <th className="px-6 py-2 text-center">Change</th>
          </tr>
        </thead>
        <tbody>
          {stock.history.map((point, index) => {
            const changeText = index === 0 ? 
                "n/a"
                : formatChange(point.mcap - stock.history[index - 1].mcap);

            return (
              <tr key={point.year}>
                <td className="px-6 py-1 text-center text-sm">{point.year}</td>
                <td className="px-6 py-1 text-center text-sm">{formatMarketCap(point.mcap)}</td>
                <td className="px-6 py-1 text-center text-sm">{changeText}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
