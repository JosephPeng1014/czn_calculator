"use client";

interface CardTypeCounterProps {
  label: string;
  value: number;
  max?: number;
  onDecrement: () => void;
  onIncrement: () => void;
  onChange: (value: number) => void;
}

export default function CardTypeCounter({
  label,
  value,
  max,
  onDecrement,
  onIncrement,
  onChange,
}: CardTypeCounterProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value === "" ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
    if (max != null) v = Math.min(v, max);
    onChange(v);
  };
  const canIncrement = max == null ? true : value < max;

  return (
    <div className="flex flex-col gap-1.5 rounded-xl bg-zinc-800/80 px-3 py-2.5">
      <span className="text-xs font-medium text-zinc-300">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrement}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-zinc-200 transition hover:bg-zinc-600"
          aria-label={`${label} 減少`}
        >
          −
        </button>
        <input
          type="number"
          min={0}
          max={max}
          value={value}
          onChange={handleInputChange}
          className="h-8 w-12 rounded-lg border border-zinc-600 bg-zinc-800 text-center text-sm font-medium text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={onIncrement}
          disabled={!canIncrement}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-700 text-zinc-200 transition hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`${label} 增加`}
        >
          +
        </button>
      </div>
    </div>
  );
}
