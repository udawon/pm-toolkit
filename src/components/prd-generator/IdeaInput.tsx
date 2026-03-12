"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { usePrdStore } from "@/stores/prd-store";
import type { PrdTemplate } from "@/types";

export default function IdeaInput() {
  const { idea, setIdea, template, setTemplate, isGenerating, generate } =
    usePrdStore();

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-label">기능 아이디어를 설명해주세요</h3>
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value as PrdTemplate)}
          className="input-premium !py-1.5 !text-xs"
        >
          <option value="prd">PRD</option>
          <option value="spec">Feature Spec</option>
          <option value="user-story">User Stories</option>
        </select>
      </div>
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="예: 사용자가 소셜 로그인(Google, GitHub)으로 간편하게 가입할 수 있는 기능. 현재 이메일 가입만 지원하고 있어서 가입 전환율이 낮은 상황..."
        className="input-premium w-full h-40 resize-none"
      />
      <div className="flex items-center justify-between mt-4 gap-3">
        <span className="text-xs text-text-muted truncate hidden sm:block">
          {idea.length > 0 ? `${idea.length}자` : "팁: 문제, 대상 사용자, 기대 결과를 구체적으로 작성하세요"}
        </span>
        <span className="text-xs text-text-muted sm:hidden">
          {idea.length > 0 ? `${idea.length}자` : ""}
        </span>
        <button
          onClick={generate}
          disabled={!idea.trim() || isGenerating}
          className="btn-accent flex items-center gap-2 shrink-0 !py-2 !px-4"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isGenerating ? "생성 중..." : "PRD 생성"}
        </button>
      </div>
    </div>
  );
}
