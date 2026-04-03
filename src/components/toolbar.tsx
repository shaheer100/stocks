import { ToolbarButton } from "./toolbarbutton";
import { ToggleButton } from "./togglebutton";

type ToolbarProps = {
  viewMode: "chart" | "list";
  setViewMode: (mode: "chart" | "list") => void;
  canAdd: boolean;
  canDelete: boolean;
  canUndo: boolean;
  canRedo: boolean;
  canShowDetails: boolean;
  onAdd: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
};

export function Toolbar({
  viewMode,
  setViewMode,
  canAdd,
  canDelete,
  canUndo,
  canRedo,
  canShowDetails,
  onAdd,
  onDelete,
  onUndo,
  onRedo,
}: ToolbarProps) {
  return (
    <header className="h-10 shrink-0 flex items-center px-2 gap-1 bg-red-100 border-b border-red-300">
      <div className="text-xl font-semibold">Stocks</div>
      <div className="flex-1" />

      <ToolbarButton disabled={!canUndo} onClick={onUndo}>↩️</ToolbarButton>
      <ToolbarButton disabled={!canRedo} onClick={onRedo}>↪️</ToolbarButton>

      <div className="mx-2 text-gray-500">|</div>

      <ToolbarButton disabled={!canAdd} onClick={onAdd}>Add</ToolbarButton>
      <ToolbarButton disabled={!canDelete} onClick={onDelete}>Del</ToolbarButton>

      <div className="mx-2 text-gray-500">|</div>

      <ToggleButton
        label="Chart"
        value="chart"
        checked={viewMode === "chart"}
        onChange={setViewMode}
        disabled={!canShowDetails}
      />

      <ToggleButton
        label="List"
        value="list"
        checked={viewMode === "list"}
        onChange={setViewMode}
        disabled={!canShowDetails}
      />
    </header>
  );
}
