"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";

export default function GoalProgress() {
  const { goals, updateGoal } = useDashboardStore();
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingGoal) inputRef.current?.focus();
  }, [editingGoal]);

  const handleSave = (title: string) => {
    const num = parseFloat(editValue);
    if (!isNaN(num)) {
      updateGoal(title, { current: num });
    }
    setEditingGoal(null);
  };

  return (
    <div className="glass-card p-5">
      <h3 className="section-label mb-4">목표 달성률</h3>
      <div className="space-y-5">
        {goals.map((goal) => {
          const percentage = Math.min(
            Math.round((goal.current / goal.target) * 100),
            100
          );
          const isHigh = percentage >= 80;
          const isEditing = editingGoal === goal.title;

          return (
            <div key={goal.title} className="group/goal">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm">{goal.title}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditValue(String(goal.current));
                      setEditingGoal(goal.title);
                    }}
                    className="opacity-0 group-hover/goal:opacity-100 text-text-muted hover:text-accent transition-all"
                    title="현재 값 수정"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  {isEditing ? (
                    <span className="text-xs text-text-muted">
                      <input
                        ref={inputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave(goal.title)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave(goal.title);
                          if (e.key === "Escape") setEditingGoal(null);
                        }}
                        className="input-premium !py-0 !px-1 !text-xs !w-20 text-right inline-block"
                      />
                      {goal.unit} / {goal.target.toLocaleString()}
                      {goal.unit}
                    </span>
                  ) : (
                    <span
                      className={`text-xs cursor-pointer hover:text-accent transition-colors ${isHigh ? "text-accent font-bold" : "text-text-muted"}`}
                      onClick={() => {
                        setEditValue(String(goal.current));
                        setEditingGoal(goal.title);
                      }}
                    >
                      {goal.current.toLocaleString()}
                      {goal.unit} / {goal.target.toLocaleString()}
                      {goal.unit}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 progress-glow ${
                    isHigh
                      ? "bg-gradient-to-r from-accent-dark via-accent to-accent-light"
                      : percentage >= 50
                        ? "bg-gradient-to-r from-accent-dark to-accent"
                        : "bg-gradient-to-r from-danger to-danger"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-right mt-1">
                <span className={`text-xs ${isHigh ? "text-accent font-semibold" : "text-text-muted"}`}>
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="text-center text-text-muted text-sm py-4">
          등록된 목표가 없습니다
        </div>
      )}
    </div>
  );
}
