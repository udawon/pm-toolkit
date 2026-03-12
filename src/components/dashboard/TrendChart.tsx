"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboardStore } from "@/stores/dashboard-store";

const metrics = [
  { key: "dau", label: "DAU", color: "#f59e0b" },
  { key: "conversion", label: "Conversion", color: "#3b82f6" },
  { key: "retention", label: "Retention", color: "#22c55e" },
];

export default function TrendChart() {
  const { selectedMetric, setSelectedMetric, trends } = useDashboardStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-label">주간 트렌드</h3>
        <div className="flex gap-1">
          {metrics.map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMetric(m.key)}
              className={`px-3 py-1 text-xs rounded-full transition-all ${
                selectedMetric === m.key
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-text-muted hover:text-text-secondary border border-transparent"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[240px]">
        {mounted && trends.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends}>
              <defs>
                {metrics.map((m) => (
                  <linearGradient
                    key={m.key}
                    id={`gradient-${m.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={m.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#737373", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#737373", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 17, 24, 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(245,166,35,0.15)",
                  borderRadius: "12px",
                  color: "#F0EDE6",
                  fontSize: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
              />
              {metrics
                .filter((m) => m.key === selectedMetric)
                .map((m) => (
                  <Area
                    key={m.key}
                    type="monotone"
                    dataKey={m.key}
                    stroke={m.color}
                    strokeWidth={2}
                    fill={`url(#gradient-${m.key})`}
                  />
                ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
        {mounted && trends.length === 0 && (
          <div className="flex items-center justify-center h-full text-text-muted text-sm">
            트렌드 데이터가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
