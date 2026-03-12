"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { KpiData, TrendData, Issue, Goal } from "@/types";

interface DashboardStore {
  // UI state
  selectedMetric: string;
  setSelectedMetric: (metric: string) => void;

  // Data
  kpis: KpiData[];
  trends: TrendData[];
  issues: Issue[];
  goals: Goal[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchAll: () => Promise<void>;
  updateKpi: (title: string, updates: Partial<KpiData>) => Promise<void>;
  updateIssue: (id: string, updates: Partial<Issue>) => Promise<void>;
  updateGoal: (title: string, updates: Partial<Goal>) => Promise<void>;
  addIssue: (issue: Issue) => Promise<void>;
  removeIssue: (id: string) => Promise<void>;
}

// KPI ↔ 목표 연동 매핑
const kpiGoalSync: Record<string, { goalTitle: string; toKpiValue: (n: number) => string; fromKpiValue: (v: string) => number }> = {
  DAU: {
    goalTitle: "DAU 15K 달성",
    toKpiValue: (n) => n.toLocaleString(),
    fromKpiValue: (v) => Number(v.replace(/,/g, "")),
  },
  NPS: {
    goalTitle: "NPS 80점",
    toKpiValue: (n) => String(n),
    fromKpiValue: (v) => Number(v),
  },
};

const goalKpiSync: Record<string, { kpiTitle: string; toKpiValue: (n: number) => string }> = {
  "DAU 15K 달성": { kpiTitle: "DAU", toKpiValue: (n) => n.toLocaleString() },
  "NPS 80점": { kpiTitle: "NPS", toKpiValue: (n) => String(n) },
};

// KPI → 주간 트렌드 연동 (최신 데이터 포인트 업데이트)
const kpiTrendSync: Record<string, { field: keyof TrendData; fromKpiValue: (v: string) => number }> = {
  DAU: { field: "dau", fromKpiValue: (v) => Number(v.replace(/,/g, "")) },
  Conversion: { field: "conversion", fromKpiValue: (v) => Number(v.replace(/%/g, "")) },
  Retention: { field: "retention", fromKpiValue: (v) => Number(v.replace(/%/g, "")) },
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  selectedMetric: "dau",
  setSelectedMetric: (metric) => set({ selectedMetric: metric }),

  kpis: [],
  trends: [],
  issues: [],
  goals: [],
  loading: true,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const [kpiRes, trendRes, issueRes, goalRes] = await Promise.all([
        supabase.from("pm_kpis").select("*").order("sort_order"),
        supabase.from("pm_weekly_trends").select("*").order("sort_order"),
        supabase.from("pm_issues").select("*").order("sort_order"),
        supabase.from("pm_goals").select("*").order("sort_order"),
      ]);

      if (kpiRes.error) throw kpiRes.error;
      if (trendRes.error) throw trendRes.error;
      if (issueRes.error) throw issueRes.error;
      if (goalRes.error) throw goalRes.error;

      set({
        kpis: kpiRes.data.map((k) => ({
          title: k.title,
          value: k.value,
          change: Number(k.change),
          trend: k.trend as KpiData["trend"],
          icon: k.icon,
        })),
        trends: trendRes.data.map((t) => ({
          date: t.date,
          dau: t.dau,
          conversion: Number(t.conversion),
          retention: t.retention,
        })),
        issues: issueRes.data.map((i) => ({
          id: i.issue_id,
          title: i.title,
          status: i.status as Issue["status"],
          priority: i.priority as Issue["priority"],
        })),
        goals: goalRes.data.map((g) => ({
          title: g.title,
          current: Number(g.current),
          target: Number(g.target),
          unit: g.unit,
        })),
        loading: false,
      });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  updateKpi: async (title, updates) => {
    // Optimistic update — KPI
    set((s) => ({
      kpis: s.kpis.map((k) => (k.title === title ? { ...k, ...updates } : k)),
    }));

    // KPI → 목표 동기화
    const sync = kpiGoalSync[title];
    if (sync && updates.value !== undefined) {
      const numValue = sync.fromKpiValue(updates.value);
      if (!isNaN(numValue)) {
        set((s) => ({
          goals: s.goals.map((g) =>
            g.title === sync.goalTitle ? { ...g, current: numValue } : g
          ),
        }));
        supabase
          .from("pm_goals")
          .update({ current: numValue, updated_at: new Date().toISOString() })
          .eq("title", sync.goalTitle)
          .then();
      }
    }

    // KPI → 주간 트렌드 동기화 (마지막 데이터 포인트)
    const trendSync = kpiTrendSync[title];
    if (trendSync && updates.value !== undefined) {
      const numValue = trendSync.fromKpiValue(updates.value);
      if (!isNaN(numValue)) {
        const trends = get().trends;
        if (trends.length > 0) {
          const lastDate = trends[trends.length - 1].date;
          set((s) => ({
            trends: s.trends.map((t, i) =>
              i === s.trends.length - 1
                ? { ...t, [trendSync.field]: numValue }
                : t
            ),
          }));
          supabase
            .from("pm_weekly_trends")
            .update({ [trendSync.field]: numValue })
            .eq("date", lastDate)
            .then();
        }
      }
    }

    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.value !== undefined) dbUpdates.value = updates.value;
    if (updates.change !== undefined) dbUpdates.change = updates.change;
    if (updates.trend !== undefined) dbUpdates.trend = updates.trend;

    const { error } = await supabase
      .from("pm_kpis")
      .update(dbUpdates)
      .eq("title", title);

    if (error) get().fetchAll();
  },

  updateIssue: async (issueId, updates) => {
    set((s) => ({
      issues: s.issues.map((i) => (i.id === issueId ? { ...i, ...updates } : i)),
    }));

    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;

    const { error } = await supabase
      .from("pm_issues")
      .update(dbUpdates)
      .eq("issue_id", issueId);

    if (error) get().fetchAll();
  },

  updateGoal: async (title, updates) => {
    // Optimistic update — 목표
    set((s) => ({
      goals: s.goals.map((g) => (g.title === title ? { ...g, ...updates } : g)),
    }));

    // 목표 → KPI 동기화
    const sync = goalKpiSync[title];
    if (sync && updates.current !== undefined) {
      const kpiValue = sync.toKpiValue(updates.current);
      set((s) => ({
        kpis: s.kpis.map((k) =>
          k.title === sync.kpiTitle ? { ...k, value: kpiValue } : k
        ),
      }));
      supabase
        .from("pm_kpis")
        .update({ value: kpiValue, updated_at: new Date().toISOString() })
        .eq("title", sync.kpiTitle)
        .then();
    }

    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.current !== undefined) dbUpdates.current = updates.current;
    if (updates.target !== undefined) dbUpdates.target = updates.target;

    const { error } = await supabase
      .from("pm_goals")
      .update(dbUpdates)
      .eq("title", title);

    if (error) get().fetchAll();
  },

  addIssue: async (issue) => {
    const maxOrder = get().issues.length + 1;

    set((s) => ({ issues: [...s.issues, issue] }));

    const { error } = await supabase.from("pm_issues").insert({
      issue_id: issue.id,
      title: issue.title,
      status: issue.status,
      priority: issue.priority,
      sort_order: maxOrder,
    });

    if (error) get().fetchAll();
  },

  removeIssue: async (issueId) => {
    set((s) => ({ issues: s.issues.filter((i) => i.id !== issueId) }));

    const { error } = await supabase
      .from("pm_issues")
      .delete()
      .eq("issue_id", issueId);

    if (error) get().fetchAll();
  },
}));
