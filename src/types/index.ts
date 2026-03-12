export interface KpiData {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down" | "flat";
  icon: string;
}

export interface TrendData {
  date: string;
  dau: number;
  conversion: number;
  retention: number;
}

export interface Issue {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "review" | "planning" | "done";
  priority: "high" | "medium" | "low";
}

export interface Goal {
  title: string;
  current: number;
  target: number;
  unit: string;
}

export const TASK_PALETTE = [
  "#22c55e", "#3b82f6", "#f59e0b", "#ef4444",
  "#a855f7", "#ec4899", "#06b6d4", "#f97316",
  "#14b8a6", "#6366f1", "#84cc16", "#e11d48",
  "#8b5cf6", "#0ea5e9", "#d946ef", "#facc15",
] as const;

export interface BacklogItem {
  id: string;
  name: string;
  description: string;
  color: string;
  scores: {
    reach: number;
    impact: number;
    confidence: number;
    effort: number;
    ease: number;
  };
  riceScore: number;
  createdAt: string;
}

export type Framework = "rice" | "ice";
export type PrdTemplate = "prd" | "spec" | "user-story";
