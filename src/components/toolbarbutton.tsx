type ToolbarButtonProps = {
  children: preact.ComponentChildren;
  onClick?: () => void;
  disabled?: boolean;
};

export function ToolbarButton({
  children,
  onClick,
  disabled = false,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        h-7 px-2 border rounded text-xs
        bg-white text-black border-gray-400
        hover:bg-red-200
        active:bg-red-600 active:text-white
        disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300
        disabled:cursor-not-allowed
      "
    >
      {children}
    </button>
  );
}
