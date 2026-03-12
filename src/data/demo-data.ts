import type { KpiData, TrendData, Issue, Goal, BacklogItem } from "@/types";

export const kpiData: KpiData[] = [
  { title: "DAU", value: "12,847", change: 5.2, trend: "up", icon: "Users" },
  {
    title: "Conversion",
    value: "3.2%",
    change: -0.3,
    trend: "down",
    icon: "Target",
  },
  {
    title: "Retention",
    value: "78%",
    change: 2.1,
    trend: "up",
    icon: "RefreshCw",
  },
  { title: "NPS", value: "72", change: 0, trend: "flat", icon: "Heart" },
];

export const weeklyTrend: TrendData[] = [
  { date: "3/6", dau: 11200, conversion: 3.5, retention: 76 },
  { date: "3/7", dau: 11800, conversion: 3.3, retention: 77 },
  { date: "3/8", dau: 12100, conversion: 3.1, retention: 77 },
  { date: "3/9", dau: 12400, conversion: 3.4, retention: 78 },
  { date: "3/10", dau: 12600, conversion: 3.2, retention: 78 },
  { date: "3/11", dau: 12700, conversion: 3.0, retention: 79 },
  { date: "3/12", dau: 12847, conversion: 3.2, retention: 78 },
];

export const issues: Issue[] = [
  {
    id: "BUG-123",
    title: "결제 페이지 로딩 지연",
    status: "in-progress",
    priority: "high",
  },
  {
    id: "FEAT-456",
    title: "소셜 로그인 (Google)",
    status: "review",
    priority: "high",
  },
  {
    id: "FEAT-789",
    title: "알림 설정 페이지",
    status: "todo",
    priority: "medium",
  },
  {
    id: "BUG-101",
    title: "모바일 헤더 깨짐",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: "EPIC-202",
    title: "Q2 온보딩 개선",
    status: "planning",
    priority: "low",
  },
];

export const goals: Goal[] = [
  { title: "Q1 매출 목표", current: 78, target: 100, unit: "억원" },
  { title: "DAU 15K 달성", current: 12847, target: 15000, unit: "" },
  { title: "NPS 80점", current: 72, target: 80, unit: "점" },
];

export const demoBacklog: BacklogItem[] = [
  {
    id: "1",
    name: "소셜 로그인",
    description: "Google, GitHub OAuth 연동으로 가입 전환율 향상",
    scores: { reach: 8, impact: 7, confidence: 9, effort: 3, ease: 8 },
    riceScore: 168,
    createdAt: "2026-03-10",
  },
  {
    id: "2",
    name: "다크모드",
    description: "시스템 설정 연동 다크/라이트 모드 지원",
    scores: { reach: 5, impact: 4, confidence: 8, effort: 2, ease: 9 },
    riceScore: 80,
    createdAt: "2026-03-10",
  },
  {
    id: "3",
    name: "실시간 알림",
    description: "WebSocket 기반 인앱 푸시 알림 시스템",
    scores: { reach: 3, impact: 6, confidence: 7, effort: 5, ease: 4 },
    riceScore: 25.2,
    createdAt: "2026-03-10",
  },
  {
    id: "4",
    name: "대시보드 커스텀",
    description: "사용자가 위젯을 자유롭게 배치하는 대시보드",
    scores: { reach: 4, impact: 8, confidence: 5, effort: 7, ease: 3 },
    riceScore: 22.86,
    createdAt: "2026-03-11",
  },
];
