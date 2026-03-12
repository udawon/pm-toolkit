"use client";

import { useEffect } from "react";
import KpiCard from "./KpiCard";
import TrendChart from "./TrendChart";
import IssueTracker from "./IssueTracker";
import GoalProgress from "./GoalProgress";
import { useDashboardStore } from "@/stores/dashboard-store";

export default function Dashboard() {
  const { kpis, loading, error, fetchAll } = useDashboardStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading && kpis.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-text-muted text-sm animate-pulse">데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-danger text-sm mb-2">데이터 로딩 실패</div>
        <div className="text-text-muted text-xs mb-4">{error}</div>
        <button onClick={fetchAll} className="btn-accent text-xs px-4 py-2">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Trend Chart */}
      <TrendChart />

      {/* Issues + Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IssueTracker />
        <GoalProgress />
      </div>
    </div>
  );
}
