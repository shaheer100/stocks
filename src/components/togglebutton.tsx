type ToggleButtonProps = {
  label: string;
  value: "chart" | "list";
  checked: boolean;
  onChange: (value: "chart" | "list") => void;
  disabled?: boolean;
};

export function ToggleButton({
  label,
  value,
  checked,
  onChange,
  disabled = false,
}: ToggleButtonProps) {
  let labelClasses = "";

  if (disabled && checked) {
    labelClasses = "cursor-not-allowed";
  } else if (disabled && !checked) {
    labelClasses = "cursor-not-allowed";
  } else if (checked) {
    labelClasses = "font-medium cursor-pointer";
  } else {
    labelClasses = "text-black cursor-pointer";
  }

  return (
    <label className={`flex items-center gap-1 text-xs ${labelClasses}`}>
      <span>{label}</span>
      <input
        type="radio"
        name="viewMode"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="accent-red-500"
      />
    </label>
  );
}
