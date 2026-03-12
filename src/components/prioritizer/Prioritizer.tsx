"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import BacklogForm from "./BacklogForm";
import BacklogTable from "./BacklogTable";
import PriorityMatrix from "./PriorityMatrix";
import { usePrioritizerStore } from "@/stores/prioritizer-store";

export default function Prioritizer() {
  const { framework, setFramework } = usePrioritizerStore();
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="space-y-6">
      {/* Framework selector + Form */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="section-label">프레임워크:</span>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value as "rice" | "ice")}
            className="input-premium !py-2 !text-sm"
          >
            <option value="rice">RICE</option>
            <option value="ice">ICE</option>
          </select>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-text-muted hover:text-accent transition-colors"
            title="프레임워크 설명 보기"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1">
          <BacklogForm />
        </div>
      </div>

      {/* Framework guide */}
      {showGuide && (
        <div className="glass-card p-5 animate-fade-in-up">
          <h4 className="section-label mb-3">
            {framework === "rice" ? "RICE 프레임워크" : "ICE 프레임워크"} 가이드
          </h4>

          {framework === "rice" ? (
            <div className="space-y-3 text-sm text-text-secondary">
              <p>
                <span className="text-accent font-medium">RICE</span>는 Intercom에서 만든 우선순위 산정 프레임워크입니다.
                감이 아닌 데이터 기반으로 &quot;뭐부터 해야 하는가&quot;를 결정합니다.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white/[0.03] rounded-lg p-3">
                  <div className="text-accent text-xs font-medium mb-1">도달 범위 (Reach)</div>
                  <div className="text-xs text-text-muted">일정 기간 내 이 기능이 영향을 미치는 사용자 수. 높을수록 많은 사람에게 닿음</div>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-3">
                  <div className="text-accent text-xs font-medium mb-1">영향도 (Impact)</div>
                  <div className="text-xs text-text-muted">사용자 1명에게 주는 변화의 크기. 전환율, 만족도 등에 얼마나 기여하는가</div>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-3">
                  <div className="text-accent text-xs font-medium mb-1">확신도 (Confidence)</div>
                  <div className="text-xs text-text-muted">위 추정에 대한 확신 정도. 데이터 근거가 있으면 높게, 직감이면 낮게</div>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-3">
                  <div className="text-accent text-xs font-medium mb-1">투입 노력 (Effort)</div>
                  <div className="text-xs text-text-muted">개발에 필요한 공수. 높을수록 많은 리소스가 필요하며, 점수를 낮춤</div>
                </div>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-3 text-center">
                <span className="text-xs text-text-muted">공식: </span>
                <span className="text-accent font-mono text-xs">(도달 범위 × 영향도 × 확신도) ÷ 투입 노력 = 점수</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-text-secondary">
              <p>
                <span className="text-accent font-medium">ICE</span>는 RICE의 간소화 버전입니다.
                빠른 판단이 필요할 때, 3가지 기준만으로 우선순위를 정합니다.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/[0.03] rounded-lg p-3">
                  <div className="text-accent text-xs font-medium mb-1">영향도 (Impact)</div>
                  <div className="text-xs text-text-muted">이 기능이 목표 달성에 기여하는 정도</div>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-3">
                  <div className="text-accent text-xs font-medium mb-1">확신도 (Confidence)</div>
                  <div className="text-xs text-text-muted">성공할 것이라는 확신의 정도</div>
                </div>
                <div className="bg-white/[0.03] rounded-lg p-3">
                  <div className="text-accent text-xs font-medium mb-1">용이성 (Ease)</div>
                  <div className="text-xs text-text-muted">구현이 얼마나 쉬운가. Effort의 반대 개념</div>
                </div>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-3 text-center">
                <span className="text-xs text-text-muted">공식: </span>
                <span className="text-accent font-mono text-xs">영향도 × 확신도 × 용이성 = 점수</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table + Matrix */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
        <BacklogTable />
        <PriorityMatrix />
      </div>
    </div>
  );
}
