import "./styles/app.css";
import { useRef, useState, useEffect } from "preact/hooks";
import type { Stock } from "./stocks";
import { stockRecords } from "./stocks";
import { Toolbar } from "./components/toolbar";
import { StockList } from "./components/stocklist";
import { StockDetails } from "./components/stockdetails";
import { StatusBar } from "./components/statusbar";
import { UndoManager, type Command } from "./utils/undo";

export function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"chart" | "list">("chart");

  const [, forceRender] = useState(0);

  const undoManagerRef = useRef(new UndoManager());

  const stocksRef = useRef<Stock[]>([]);
  const selectedStocksRef = useRef<string[]>([]);

  stocksRef.current = stocks;
  selectedStocksRef.current = selectedStocks;

  const selectedStock = selectedStocks.length === 1 ? 
    (stocks.find((stock) => stock.symbol === selectedStocks[0]) ?? null) 
    : null;

  function refreshUndoState() {
    forceRender((v) => v + 1);
  }

  function applySelection(nextSelected: string[]) {
    setSelectedStocks(nextSelected);

    if (nextSelected.length !== 1) {
      setViewMode("chart");
    }
  }

  function SelectionUndo(nextSelected: string[]) {
    const previousSelected = [...selectedStocksRef.current];

    const sameSelection =
      previousSelected.length === nextSelected.length &&
      previousSelected.every((symbol, index) => symbol === nextSelected[index]);

    if (sameSelection) return;

    const command: Command = {
      do: () => {
        applySelection(nextSelected);
      },
      undo: () => {
        applySelection(previousSelected);
      },
    };

    undoManagerRef.current.execute(command);
    refreshUndoState();
  }

  function addRandomStock() {
    const currentStocks = stocksRef.current;

    const availableStocks = stockRecords.filter(
      (stock) => !currentStocks.some((s) => s.symbol === stock.symbol)
    );

    if (availableStocks.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableStocks.length);
    const stockToAdd = availableStocks[randomIndex];
    const insertIndex = currentStocks.length;

    const command: Command = {
      do: () => {
        const nextStocks = [...stocksRef.current];
        nextStocks.splice(insertIndex, 0, stockToAdd);
        setStocks(nextStocks);
      },
      undo: () => {
        const nextStocks = stocksRef.current.filter(
          (stock) => stock.symbol !== stockToAdd.symbol
        );
        setStocks(nextStocks);
      },
    };

    undoManagerRef.current.execute(command);
    refreshUndoState();
  }

  function deleteSelectedStocks() {
    const currentStocks = stocksRef.current;
    const currentSelected = selectedStocksRef.current;

    if (currentSelected.length === 0) return;

    const deletedEntries = currentStocks
      .map((stock, index) => ({ stock, index }))
      .filter(({ stock }) => currentSelected.includes(stock.symbol));

    if (deletedEntries.length === 0) return;

    const previousSelected = [...currentSelected];
    const deletedSymbols = new Set(
      deletedEntries.map((entry) => entry.stock.symbol)
    );
    const topDeletedIndex = deletedEntries[0].index;

    const command: Command = {
      do: () => {
        const remainingStocks = stocksRef.current.filter(
          (stock) => !deletedSymbols.has(stock.symbol)
        );
        setStocks(remainingStocks);

        if (remainingStocks.length === 0) {
          applySelection([]);
          return;
        }

        const nextSelectedIndex =
          topDeletedIndex === 0 ? 
            0
            : Math.min(topDeletedIndex - 1, remainingStocks.length - 1);

        applySelection([remainingStocks[nextSelectedIndex].symbol]);
      },

      undo: () => {
        const restoredStocks = [...stocksRef.current];

        deletedEntries.forEach(({ stock, index }) => {
          restoredStocks.splice(index, 0, stock);
        });

        setStocks(restoredStocks);
        applySelection(previousSelected);
      },
    };

    undoManagerRef.current.execute(command);
    refreshUndoState();
  }

  function selectStock(symbol: string, shiftKey: boolean) {
    const currentSelected = selectedStocksRef.current;

    let nextSelected: string[];

    if (shiftKey) {
      if (currentSelected.includes(symbol)) {
        nextSelected = currentSelected.filter((s) => s !== symbol);
      } else {
        nextSelected = [...currentSelected, symbol];
      }
    } else {
      if (currentSelected.length === 1 && currentSelected[0] === symbol) {
        nextSelected = [];
      } else {
        nextSelected = [symbol];
      }
    }

    SelectionUndo(nextSelected);
  }

  function clearSelection() {
    SelectionUndo([]);
  }

  function undo() {
    undoManagerRef.current.undo();
    refreshUndoState();
  }

  function redo() {
    undoManagerRef.current.redo();
    refreshUndoState();
  }

  const canUndo = undoManagerRef.current.canUndo;
  const canRedo = undoManagerRef.current.canRedo;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!e.shiftKey) return;

      const key = e.key.toLowerCase();

      if (key === "a") {
        if (stocks.length < stockRecords.length) {
          addRandomStock();
        }
      } else if (key === "d") {
        if (selectedStocks.length > 0) {
          deleteSelectedStocks();
        }
      } else if (key === "c") {
        if (selectedStocks.length > 0) {
          clearSelection();
        }
      } else if (key === "u") {
        if (undoManagerRef.current.canUndo) {
          undo();
        }
      } else if (key === "r") {
        if (undoManagerRef.current.canRedo) {
          redo();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    stocks.length,
    selectedStocks.length,
    addRandomStock,
    deleteSelectedStocks,
    clearSelection,
    undo,
    redo,
  ]);

  return (
    <div className="h-screen flex flex-col">
      <Toolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        canAdd={stocks.length < stockRecords.length}
        canDelete={selectedStocks.length > 0}
        canUndo={canUndo}
        canRedo={canRedo}
        canShowDetails={selectedStocks.length === 1}
        onAdd={addRandomStock}
        onDelete={deleteSelectedStocks}
        onUndo={undo}
        onRedo={redo}
      />

      <main className="flex-1 flex min-h-0">
        <StockList
          stocks={stocks}
          selectedStocks={selectedStocks}
          onSelectStock={selectStock}
          onClearSelection={clearSelection}
        />
        <StockDetails
          viewMode={viewMode}
          selectedStock={selectedStock}
          selectedCount={selectedStocks.length}
        />
      </main>

      <StatusBar
        loadedCount={stocks.length}
        selectedCount={selectedStocks.length}
        selectedName={selectedStock ? selectedStock.name : null}
        selectedPrice={selectedStock ? selectedStock.price : null}
      />
    </div>
  );
}
