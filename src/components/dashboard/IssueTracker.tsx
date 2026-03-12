"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";

const statusColors: Record<string, string> = {
  "in-progress": "bg-info/15 text-info backdrop-blur-sm",
  review: "bg-accent/15 text-accent backdrop-blur-sm",
  todo: "bg-white/[0.06] text-text-secondary backdrop-blur-sm",
  planning: "bg-white/[0.03] text-text-muted backdrop-blur-sm",
  done: "bg-success/15 text-success backdrop-blur-sm",
};

const statusLabel: Record<string, string> = {
  todo: "할 일",
  "in-progress": "진행 중",
  review: "검토",
  planning: "기획",
  done: "완료",
};

const priorityLabel: Record<string, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

const statusOptions = ["todo", "in-progress", "review", "planning", "done"] as const;
const priorityOptions = ["high", "medium", "low"] as const;

const priorityDot: Record<string, string> = {
  high: "bg-danger",
  medium: "bg-accent",
  low: "bg-text-muted",
};

export default function IssueTracker() {
  const { issues, updateIssue, addIssue, removeIssue } = useDashboardStore();
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newId, setNewId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId) editRef.current?.focus();
  }, [editingId]);

  const handleAdd = () => {
    if (!newTitle.trim() || !newId.trim()) return;
    addIssue({
      id: newId.trim(),
      title: newTitle.trim(),
      status: "todo",
      priority: "medium",
    });
    setNewTitle("");
    setNewId("");
    setAdding(false);
  };

  const handleEditSave = (issueId: string, originalTitle: string) => {
    if (editTitle.trim() && editTitle.trim() !== originalTitle) {
      updateIssue(issueId, { title: editTitle.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-label">진행 중 이슈</h3>
        <button
          onClick={() => setAdding(!adding)}
          className="text-text-muted hover:text-accent transition-colors"
          title="이슈 추가"
        >
          {adding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {adding && (
        <div className="flex gap-2 mb-3 animate-fade-in-up">
          <input
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            placeholder="ID (예: BUG-999)"
            className="input-premium !py-1.5 !text-xs w-28"
          />
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="이슈 제목"
            className="input-premium !py-1.5 !text-xs flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button onClick={handleAdd} className="btn-accent !py-1.5 !px-3 !text-xs">
            추가
          </button>
        </div>
      )}

      <div className="space-y-1">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="flex items-center gap-3 py-2.5 px-2 border-b border-white/[0.03] last:border-0
              rounded-lg hover:bg-white/[0.02] transition-all group"
          >
            <div className="w-0.5 h-6 rounded-full bg-transparent group-hover:bg-accent/40 transition-all shrink-0" />
            <select
              value={issue.priority}
              onChange={(e) => updateIssue(issue.id, { priority: e.target.value as typeof issue.priority })}
              className="appearance-none bg-transparent border-none cursor-pointer p-0 text-xs text-text-muted"
              title="우선도 변경"
            >
              {priorityOptions.map((p) => (
                <option key={p} value={p} className="bg-bg-secondary text-text-primary">{priorityLabel[p]}</option>
              ))}
            </select>
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${priorityDot[issue.priority]}
                ${issue.priority === "high" ? "animate-pulse-glow" : ""}`}
            />
            <div className="flex-1 min-w-0">
              {editingId === issue.id ? (
                <input
                  ref={editRef}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleEditSave(issue.id, issue.title)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEditSave(issue.id, issue.title);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="input-premium !py-0.5 !px-1 !text-sm w-full"
                />
              ) : (
                <div
                  className="text-sm truncate cursor-pointer hover:text-accent transition-colors"
                  onClick={() => { setEditTitle(issue.title); setEditingId(issue.id); }}
                >
                  {issue.title}
                </div>
              )}
              <div className="text-xs text-text-muted">{issue.id}</div>
            </div>
            <select
              value={issue.status}
              onChange={(e) => updateIssue(issue.id, { status: e.target.value as typeof issue.status })}
              className={`text-[10px] px-2.5 py-0.5 rounded-full shrink-0 border border-white/[0.04] cursor-pointer ${statusColors[issue.status]}`}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s} className="bg-bg-secondary text-text-primary">{statusLabel[s]}</option>
              ))}
            </select>
            <button
              onClick={() => removeIssue(issue.id)}
              className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition-all"
              title="삭제"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {issues.length === 0 && (
        <div className="text-center text-text-muted text-sm py-4">
          등록된 이슈가 없습니다
        </div>
      )}
    </div>
  );
}
