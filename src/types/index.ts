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

export interface BacklogItem {
  id: string;
  name: string;
  description: string;
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
