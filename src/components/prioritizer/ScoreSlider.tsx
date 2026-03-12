"use client";

interface ScoreSliderProps {
  value: number;
  onChange: (value: number) => void;
  onDragStart?: () => void;
  onCommit?: () => void;
  label: string;
}

export default function ScoreSlider({ value, onChange, onDragStart, onCommit, label }: ScoreSliderProps) {
  const percentage = ((value - 1) / 9) * 100;

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-text-muted w-3 text-right">{label}</span>
      <div className="relative w-full">
        <input
          type="range"
          min={1}
          max={10}
          value={value}
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseUp={onCommit}
          onTouchEnd={onCommit}
          className="w-full h-1 bg-white/[0.06] rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent
            [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(245,166,35,0.4)]
            [&::-webkit-slider-thumb]:transition-shadow
            [&::-webkit-slider-thumb]:hover:shadow-[0_0_12px_rgba(245,166,35,0.6)]"
          style={{
            background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${percentage}%, rgba(255,255,255,0.06) ${percentage}%, rgba(255,255,255,0.06) 100%)`,
            borderRadius: "9999px",
            height: "4px",
          }}
        />
      </div>
      <span className="text-xs font-mono text-accent w-4 text-right">{value}</span>
    </div>
  );
}
