"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";
import { usePrioritizerStore } from "@/stores/prioritizer-store";

export function getTierColor(rank: number, total: number): string {
  if (total <= 1) return "#22c55e";
  const pct = (rank - 1) / (total - 1);
  if (pct < 0.34) return "#22c55e";
  if (pct < 0.67) return "#3b82f6";
  return "#ef4444";
}

function CustomDot(props: Record<string, unknown>) {
  const { cx, cy, payload } = props as { cx: number; cy: number; payload: Record<string, unknown> };
  const rank = payload.rank as number;
  const color = payload.color as string;
  const total = payload.total as number;
  const r = Math.max(10, Math.min(20, 24 - total * 0.6));
  const fontSize = Math.max(7, r - 3);

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        fillOpacity={0.85}
        stroke={color}
        strokeOpacity={0.3}
        strokeWidth={r * 0.4}
        style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fff"
        fontSize={fontSize}
        fontWeight="bold"
        style={{ pointerEvents: "none" }}
      >
        {rank}
      </text>
    </g>
  );
}

export default function PriorityMatrix() {
  const items = usePrioritizerStore((s) => s.items);
  const framework = usePrioritizerStore((s) => s.framework);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isRice = framework === "rice";

  const data = useMemo(() => {
    const sorted = [...items].sort((a, b) => b.riceScore - a.riceScore);
    const rankMap = new Map<string, number>();
    sorted.forEach((item, i) => rankMap.set(item.id, i + 1));

    return items.map((item) => {
      const rank = rankMap.get(item.id)!;
      return {
        x: isRice ? item.scores.effort : item.scores.ease,
        y: item.scores.impact,
        name: item.name,
        score: item.riceScore,
        rank,
        total: items.length,
        color: getTierColor(rank, items.length),
      };
    });
  }, [items, isRice]);

  const xLabel = isRice ? "노력도 →" : "용이성 →";
  const xTooltip = isRice ? "노력도" : "용이성";
  const scoreLabel = isRice ? "RICE" : "ICE";

  const quadrants = isRice
    ? ["빠른 성과", "큰 도전", "여유 작업", "비효율 영역"]
    : ["재검토", "최우선", "후순위", "빠른 성과"];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-label">
          영향도 vs {isRice ? "노력도" : "용이성"} 매트릭스
        </h3>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22c55e]" />상위</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3b82f6]" />중위</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ef4444]" />하위</span>
        </div>
      </div>
      <div className="h-[300px]">
        {mounted && <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.03)"
            />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 11]}
              tick={{ fill: "#737373", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            >
              <Label
                value={xLabel}
                position="bottom"
                offset={0}
                style={{ fill: "#737373", fontSize: 11 }}
              />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 11]}
              tick={{ fill: "#737373", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            >
              <Label
                value="영향도 →"
                angle={-90}
                position="left"
                offset={-5}
                style={{ fill: "#737373", fontSize: 11 }}
              />
            </YAxis>
            <ReferenceLine
              x={5.5}
              stroke="rgba(245,166,35,0.2)"
              strokeDasharray="4 4"
            />
            <ReferenceLine
              y={5.5}
              stroke="rgba(245,166,35,0.2)"
              strokeDasharray="4 4"
            />
            <Tooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="backdrop-blur-xl bg-bg-tertiary/80 border border-accent/15 rounded-xl px-3 py-2 text-xs shadow-lg shadow-black/20">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center shrink-0"
                        style={{ background: d.color }}
                      >
                        {d.rank}
                      </span>
                      <span className="font-medium text-text-primary">{d.name}</span>
                    </div>
                    <div className="text-text-muted mt-1">
                      영향도: {d.y} | {xTooltip}: {d.x}
                    </div>
                    <div style={{ color: d.color }} className="mt-0.5 font-medium">
                      {scoreLabel}: {d.score.toFixed(1)}
                    </div>
                  </div>
                );
              }}
            />
            <Scatter data={data} shape={<CustomDot />} />
          </ScatterChart>
        </ResponsiveContainer>}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] text-text-muted">
        {quadrants.map((label, i) => (
          <div key={i} className="text-center">{label}</div>
        ))}
      </div>
    </div>
  );
}
