"use client";

import { useState, useRef, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, Users, Target, RefreshCw, Heart, Pencil, Info } from "lucide-react";
import type { KpiData } from "@/types";
import { useDashboardStore } from "@/stores/dashboard-store";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Target,
  RefreshCw,
  Heart,
};

interface KpiInfo {
  name: string;
  desc: string;
  formula: string;
  source: string;
  benchmark: string;
}

const kpiInfo: Record<string, KpiInfo> = {
  DAU: {
    name: "Daily Active Users",
    desc: "하루 동안 서비스에 접속한 순 이용자 수",
    formula: "당일 고유 로그인(또는 세션) 사용자 수",
    source: "GA4, Mixpanel, Amplitude 등 분석 도구",
    benchmark: "MAU 대비 DAU/MAU 비율이 20% 이상이면 양호",
  },
  Conversion: {
    name: "전환율 (Conversion Rate)",
    desc: "방문자 중 목표 행동을 완료한 사용자 비율",
    formula: "(전환 완료 수 ÷ 총 방문자 수) × 100",
    source: "GA4 이벤트, 결제/가입 시스템 로그",
    benchmark: "SaaS 평균 3~5%, 이커머스 평균 2~3%",
  },
  Retention: {
    name: "잔존율 (Retention Rate)",
    desc: "일정 기간 후 다시 돌아오는 사용자 비율",
    formula: "(N일 후 재방문 사용자 ÷ 최초 사용자) × 100",
    source: "코호트 분석 (Amplitude, Mixpanel 등)",
    benchmark: "D7 잔존율 20% 이상이면 양호, 40% 이상이면 우수",
  },
  NPS: {
    name: "Net Promoter Score",
    desc: "고객 추천 의향을 측정하는 지표 (-100 ~ 100)",
    formula: "추천 비율(9~10점) − 비추천 비율(0~6점)",
    source: "인앱 설문, Typeform, SurveyMonkey 등",
    benchmark: "0 이상 양호, 50 이상 우수, 70 이상 최상급",
  },
};

// % 접미사가 붙는 KPI
const percentKpis = new Set(["Conversion", "Retention"]);

// 값에서 숫자만 추출
function stripSuffix(val: string): string {
  return val.replace(/%/g, "").trim();
}

// 숫자에 접미사 붙이기
function addSuffix(title: string, raw: string): string {
  if (percentKpis.has(title)) return `${raw}%`;
  return raw;
}

export default function KpiCard({ title, value, change, trend, icon }: KpiData) {
  const updateKpi = useDashboardStore((s) => s.updateKpi);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const Icon = iconMap[icon] || Users;
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-success"
      : trend === "down"
        ? "text-danger"
        : "text-text-muted";

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const startEdit = () => {
    setEditValue(stripSuffix(value));
    setEditing(true);
  };

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      const finalValue = addSuffix(title, trimmed);
      if (finalValue !== value) {
        updateKpi(title, { value: finalValue });
      }
    }
    setEditing(false);
  };

  return (
    <div className="glass-card glow-border p-5 animate-fade-in-up group/kpi relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="section-label">{title}</span>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-text-muted hover:text-accent transition-colors"
            title="지표 설명"
          >
            <Info className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={startEdit}
            className="opacity-0 group-hover/kpi:opacity-100 text-text-muted hover:text-accent transition-all"
            title="값 수정"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <Icon className="w-4 h-4 text-text-muted" />
        </div>
      </div>

      {showInfo && kpiInfo[title] && (
        <div className="mb-3 bg-white/[0.03] rounded-lg px-3 py-2.5 animate-fade-in-up space-y-1.5">
          <div className="text-xs text-text-primary font-medium">{kpiInfo[title].name}</div>
          <div className="text-[11px] text-text-secondary">{kpiInfo[title].desc}</div>
          <div className="flex flex-col gap-1 mt-1.5 pt-1.5 border-t border-white/[0.04]">
            <div className="text-[10px]">
              <span className="text-accent/70">산출 공식</span>
              <span className="text-text-secondary ml-1.5">{kpiInfo[title].formula}</span>
            </div>
            <div className="text-[10px]">
              <span className="text-accent/70">데이터 소스</span>
              <span className="text-text-secondary ml-1.5">{kpiInfo[title].source}</span>
            </div>
            <div className="text-[10px]">
              <span className="text-accent/70">업계 기준</span>
              <span className="text-text-secondary ml-1.5">{kpiInfo[title].benchmark}</span>
            </div>
          </div>
        </div>
      )}

      {editing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") { setEditing(false); }
          }}
          className="input-premium !text-[clamp(1.5rem,3vw,2rem)] !font-bold !p-0 !bg-transparent !border-b !border-accent/30 !rounded-none w-full mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        />
      ) : (
        <div
          className="text-[clamp(1.5rem,3vw,2rem)] font-bold mb-2 cursor-pointer hover:text-accent transition-colors"
          style={{ fontFamily: "var(--font-heading)" }}
          onClick={startEdit}
        >
          {value}
        </div>
      )}

      <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
        <TrendIcon className={`w-3 h-3 ${trend === "up" ? "animate-pulse-glow" : ""}`} />
        <span>
          {change > 0 ? "+" : ""}
          {change}%
        </span>
        <span className="text-text-muted ml-1">지난주 대비</span>
      </div>
    </div>
  );
}
