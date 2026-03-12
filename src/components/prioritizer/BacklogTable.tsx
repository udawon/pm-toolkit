"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { Trash2, ArrowRightCircle } from "lucide-react";
import { usePrioritizerStore } from "@/stores/prioritizer-store";
import { TASK_PALETTE } from "@/types";
import { useDashboardStore } from "@/stores/dashboard-store";
import ScoreSlider from "./ScoreSlider";

export default function BacklogTable() {
  const { items, updateScore, updateColor, removeItem, framework } = usePrioritizerStore();
  const addIssue = useDashboardStore((s) => s.addIssue);
  const issues = useDashboardStore((s) => s.issues);
  const [displayOrder, setDisplayOrder] = useState<string[]>([]);
  const [frozenRankMap, setFrozenRankMap] = useState<Map<string, number> | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [colorPickerId, setColorPickerId] = useState<string | null>(null);
  const isDragging = useRef(false);

  const isRice = framework === "rice";

  // 실시간 순위 계산
  const liveRankMap = useMemo(() => {
    const sorted = [...items].sort((a, b) => b.riceScore - a.riceScore);
    const map = new Map<string, number>();
    sorted.forEach((item, i) => map.set(item.id, i + 1));
    return map;
  }, [items]);

  const rankMap = frozenRankMap ?? liveRankMap;

  // 이미 이슈로 보낸 항목 확인
  const issueNames = useMemo(() => new Set(issues.map((i) => i.title)), [issues]);

  const handleDragStart = useCallback(() => {
    if (isDragging.current) return;
    isDragging.current = true;
    const sorted = [...usePrioritizerStore.getState().items].sort((a, b) => b.riceScore - a.riceScore);
    const map = new Map<string, number>();
    sorted.forEach((item, i) => map.set(item.id, i + 1));
    setFrozenRankMap(map);
  }, []);

  const handleCommit = useCallback(() => {
    setTimeout(() => {
      isDragging.current = false;
      setFrozenRankMap(null);
      const current = usePrioritizerStore.getState().items;
      const sorted = [...current].sort((a, b) => b.riceScore - a.riceScore);
      setDisplayOrder(sorted.map((item) => item.id));
    }, 0);
  }, []);

  const handleSendToIssue = (item: typeof items[0]) => {
    const rank = rankMap.get(item.id) ?? 0;
    const issueId = `FEAT-${Date.now().toString().slice(-4)}`;
    addIssue({
      id: issueId,
      title: item.name,
      status: "todo",
      priority: rank <= 2 ? "high" : rank <= 4 ? "medium" : "low",
    });
    setSentIds((prev) => new Set(prev).add(item.id));
  };

  const orderedItems = useMemo(() => {
    if (displayOrder.length > 0) {
      const map = new Map(items.map((item) => [item.id, item]));
      const ordered = displayOrder
        .map((id) => map.get(id))
        .filter(Boolean) as typeof items;
      const newItems = items.filter((item) => !displayOrder.includes(item.id));
      return [...ordered, ...newItems];
    }
    return items;
  }, [items, displayOrder]);

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.04]">
              <th className="text-left p-4 section-label w-8">#</th>
              <th className="text-left p-4 section-label">기능</th>
              {isRice ? (
                <>
                  <th className="text-center p-4 section-label hidden md:table-cell">도달 범위(R)</th>
                  <th className="text-center p-4 section-label hidden md:table-cell">영향도(I)</th>
                  <th className="text-center p-4 section-label hidden md:table-cell">확신도(C)</th>
                  <th className="text-center p-4 section-label hidden md:table-cell">투입 노력(E)</th>
                </>
              ) : (
                <>
                  <th className="text-center p-4 section-label hidden md:table-cell">영향도(I)</th>
                  <th className="text-center p-4 section-label hidden md:table-cell">확신도(C)</th>
                  <th className="text-center p-4 section-label hidden md:table-cell">용이성(E)</th>
                </>
              )}
              <th className="text-right p-4 section-label">점수</th>
              <th className="p-4 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {orderedItems.map((item) => {
              const rank = rankMap.get(item.id) ?? 0;
              const itemColor = item.color || TASK_PALETTE[(rank - 1) % TASK_PALETTE.length];
              const isTop = rank === 1;
              const alreadySent = sentIds.has(item.id) || issueNames.has(item.name);
              const showPicker = colorPickerId === item.id;
              return (
                <tr
                  key={item.id}
                  className={`border-b border-white/[0.03] last:border-0 transition-all group
                    hover:bg-white/[0.02] ${isTop ? "bg-accent/[0.03]" : ""}`}
                >
                  <td className="p-4 relative">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-all rounded-r"
                      style={{ backgroundColor: itemColor }}
                    />
                    <button
                      onClick={() => setColorPickerId(showPicker ? null : item.id)}
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white hover:scale-110 transition-transform"
                      style={{ backgroundColor: itemColor }}
                      title="색상 변경"
                    >
                      {rank}
                    </button>
                    {showPicker && (
                      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 backdrop-blur-xl bg-bg-tertiary/90 border border-white/[0.08] rounded-lg p-1.5 flex gap-1 shadow-lg shadow-black/30">
                        {TASK_PALETTE.map((c) => (
                          <button
                            key={c}
                            onClick={() => { updateColor(item.id, c); setColorPickerId(null); }}
                            className={`w-5 h-5 rounded-full transition-transform hover:scale-125 ${c === itemColor ? "ring-2 ring-white ring-offset-1 ring-offset-bg-tertiary" : ""}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className={`font-medium ${isTop ? "text-accent" : ""}`}>{item.name}</div>
                    <div className="text-xs text-text-muted mt-0.5 hidden sm:block">
                      {item.description}
                    </div>
                    {/* Mobile score sliders */}
                    <div className="mt-3 space-y-2 md:hidden">
                      {isRice ? (
                        <>
                          <ScoreSlider label="R" value={item.scores.reach} onChange={(v) => updateScore(item.id, "reach", v)} onDragStart={handleDragStart} onCommit={handleCommit} />
                          <ScoreSlider label="I" value={item.scores.impact} onChange={(v) => updateScore(item.id, "impact", v)} onDragStart={handleDragStart} onCommit={handleCommit} />
                          <ScoreSlider label="C" value={item.scores.confidence} onChange={(v) => updateScore(item.id, "confidence", v)} onDragStart={handleDragStart} onCommit={handleCommit} />
                          <ScoreSlider label="E" value={item.scores.effort} onChange={(v) => updateScore(item.id, "effort", v)} onDragStart={handleDragStart} onCommit={handleCommit} />
                        </>
                      ) : (
                        <>
                          <ScoreSlider label="I" value={item.scores.impact} onChange={(v) => updateScore(item.id, "impact", v)} onDragStart={handleDragStart} onCommit={handleCommit} />
                          <ScoreSlider label="C" value={item.scores.confidence} onChange={(v) => updateScore(item.id, "confidence", v)} onDragStart={handleDragStart} onCommit={handleCommit} />
                          <ScoreSlider label="E" value={item.scores.ease} onChange={(v) => updateScore(item.id, "ease", v)} onDragStart={handleDragStart} onCommit={handleCommit} />
                        </>
                      )}
                    </div>
                  </td>
                  {/* Desktop score sliders */}
                  {isRice ? (
                    <>
                      <td className="p-4 hidden md:table-cell">
                        <ScoreSlider label="" value={item.scores.reach} onChange={(v) => updateScore(item.id, "reach", v)} onDragStart={handleDragStart} onCommit={handleCommit} />
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <ScoreSlider label="" value={item.scores.impact} onChange={(v) => updateScore(item.id, "impact", v)} onDragStart={handleDragStart} onCommit={handleCommit} />
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <ScoreSlider label="" value={item.scores.confidence} onChange={(v) => updateScore(item.id, "confidence", v)} onDragStart={handleDragStart} onCommit={handleCommit} />
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <ScoreSlider label="" value={item.scores.effort} onChange={(v) => updateScore(item.id, "effort", v)} onDragStart={handleDragStart} onCommit={handleCommit} />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 hidden md:table-cell">
                        <ScoreSlider label="" value={item.scores.impact} onChange={(v) => updateScore(item.id, "impact", v)} onDragStart={handleDragStart} onCommit={handleCommit} />
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <ScoreSlider label="" value={item.scores.confidence} onChange={(v) => updateScore(item.id, "confidence", v)} onDragStart={handleDragStart} onCommit={handleCommit} />
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <ScoreSlider label="" value={item.scores.ease} onChange={(v) => updateScore(item.id, "ease", v)} onDragStart={handleDragStart} onCommit={handleCommit} />
                      </td>
                    </>
                  )}
                  <td className="p-4 text-right">
                    <span className="text-accent font-mono font-bold text-base">
                      {item.riceScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {alreadySent ? (
                        <span className="text-[10px] text-success/60">등록됨</span>
                      ) : (
                        <button
                          onClick={() => handleSendToIssue(item)}
                          className="text-text-muted hover:text-accent transition-colors"
                          title="이슈로 보내기"
                        >
                          <ArrowRightCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-text-muted hover:text-danger transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {items.length === 0 && (
        <div className="p-8 text-center text-text-muted text-sm">
          기능을 추가하여 우선순위를 정해보세요
        </div>
      )}
    </div>
  );
}
