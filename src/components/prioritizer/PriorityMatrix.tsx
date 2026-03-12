"use client";

import { useState, useEffect } from "react";
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

export default function PriorityMatrix() {
  const items = usePrioritizerStore((s) => s.items);
  const framework = usePrioritizerStore((s) => s.framework);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isRice = framework === "rice";

  const data = items.map((item) => ({
    x: isRice ? item.scores.effort : item.scores.ease,
    y: item.scores.impact,
    name: item.name,
    score: item.riceScore,
  }));

  const xLabel = isRice ? "노력도 →" : "용이성 →";
  const xTooltip = isRice ? "노력도" : "용이성";
  const scoreLabel = isRice ? "RICE" : "ICE";

  // ICE에서는 사분면 의미가 다름 (X축이 용이성이라 높을수록 좋음)
  const quadrants = isRice
    ? ["빠른 성과", "큰 도전", "여유 작업", "비효율 영역"]
    : ["재검토", "최우선", "후순위", "빠른 성과"];

  return (
    <div className="glass-card p-5">
      <h3 className="section-label mb-4">
        영향도 vs {isRice ? "노력도" : "용이성"} 매트릭스
      </h3>
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
                    <div className="font-medium text-text-primary">{d.name}</div>
                    <div className="text-text-muted mt-1">
                      영향도: {d.y} | {xTooltip}: {d.x}
                    </div>
                    <div className="text-accent mt-0.5">
                      {scoreLabel}: {d.score.toFixed(1)}
                    </div>
                  </div>
                );
              }}
            />
            <Scatter data={data} fill="#f59e0b" fillOpacity={0.8}>
              {data.map((entry, i) => (
                <circle
                  key={i}
                  r={Math.max(6, Math.min(entry.score / 8, 18))}
                  style={{ filter: "drop-shadow(0 0 4px rgba(245,166,35,0.3))" }}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>}
      </div>
      {/* Quadrant labels */}
      <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] text-text-muted">
        {quadrants.map((label, i) => (
          <div key={i} className="text-center">{label}</div>
        ))}
      </div>
    </div>
  );
}
