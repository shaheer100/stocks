import { useLayoutEffect, useRef } from "preact/hooks";
import type { Stock } from "../stocks";

type ChartViewProps = {
  stock: Stock;
};

export function ChartView({ stock }: ChartViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const draw = () => {
      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;

      const width = Math.max(parentWidth, 380);
      const height = Math.max(parentHeight, 220);

      canvas.width = width;
      canvas.height = height;

      const gc = canvas.getContext("2d");
      if (!gc) return;

      gc.clearRect(0, 0, width, height);
      gc.fillStyle = "white";
      gc.fillRect(0, 0, width, height);

      const left = 70;
      const right = width - 35;
      const top = 15;
      const bottom = height - 48;

      const plotWidth = right - left;
      const plotHeight = bottom - top;

      const points = stock.history;
      if (points.length === 0) return;

      const years = points.map((p) => p.year);
      const mcaps = points.map((p) => p.mcap);

      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      const minMcap = Math.min(...mcaps);
      const maxMcap = Math.max(...mcaps);

      const yTickCount = 6;
      const yStep = (maxMcap - minMcap) / (yTickCount - 1 || 1);

      gc.font = "14pt Arial";
      gc.fillStyle = "black";
      gc.strokeStyle = "gray";
      gc.lineWidth = 1;

      // y labels
      gc.textAlign = "right";
      gc.textBaseline = "middle";

      for (let i = 0; i < yTickCount; i++) {
        const value = minMcap + i * yStep;
        const ratio = maxMcap === minMcap ? 0 : (value - minMcap) / (maxMcap - minMcap);
        const y = bottom - ratio * plotHeight;

        gc.fillText(Math.round(value).toLocaleString(), left - 15, y);
      }

      // x labels
      gc.textAlign = "center";
      gc.textBaseline = "top";

      for (const point of points) {
        const x = left + ((point.year - minYear) / ((maxYear - minYear) || 1)) * plotWidth;
        gc.fillText(point.year.toString(), x, bottom + 20);
      }

      // line
      gc.strokeStyle = "blue";
      gc.lineWidth = 2;
      gc.beginPath();

      points.forEach((point, index) => {
        const x = left + ((point.year - minYear) / ((maxYear - minYear) || 1)) * plotWidth;
        const y = bottom - ((point.mcap - minMcap) / ((maxMcap - minMcap) || 1)) * plotHeight;

        if (index === 0)  { gc.moveTo(x, y); }
        else { gc.lineTo(x, y); }
      });

      gc.stroke();

      // points
      gc.fillStyle = "blue";
      for (const point of points) {
        const x = left + ((point.year - minYear) / ((maxYear - minYear) || 1)) * plotWidth;
        const y = bottom - ((point.mcap - minMcap) / ((maxMcap - minMcap) || 1)) * plotHeight;

        gc.beginPath();
        gc.arc(x, y, 4, 0, 2 * Math.PI);
        gc.fill();
      }
    };

    draw();

    const observer = new ResizeObserver(() => {
      draw();
    });

    observer.observe(parent);

    return () => {
      observer.disconnect();
    };

  }, [stock]);

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex-1 min-h-51.25">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      <div className="text-center mt-2 text-lg">
        Market Cap by Year (Billions)
      </div>
    </div>
  );
}
