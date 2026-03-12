"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Download, Pencil, Check, FileText } from "lucide-react";
import { usePrdStore } from "@/stores/prd-store";

export default function PrdViewer() {
  const { generatedContent, isGenerating, error, updateContent } = usePrdStore();
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prd.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="glass-card p-5 !border-danger/20">
        <div className="text-danger text-sm">{error}</div>
        <div className="text-xs text-text-muted mt-2">
          API 키가 설정되었는지 확인해주세요. (.env 파일의 ANTHROPIC_API_KEY)
        </div>
      </div>
    );
  }

  if (!generatedContent && !isGenerating) {
    return (
      <div className="glass-card p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="relative">
          <FileText className="w-12 h-12 text-text-muted mb-4" />
          <div className="absolute inset-0 w-12 h-12 bg-accent/10 rounded-full blur-xl animate-pulse-glow" />
        </div>
        <p className="text-text-muted text-sm mt-2">
          아이디어를 입력하고 Generate를 누르면
          <br />
          AI가 구조화된 문서를 자동으로 작성합니다
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-white/[0.04] backdrop-blur-sm bg-white/[0.02]">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/[0.04]"
        >
          {copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
          {copied ? "복사됨" : "복사"}
        </button>
        <button
          onClick={handleDownload}
          disabled={!generatedContent}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/[0.04]
            disabled:opacity-40"
        >
          <Download className="w-3 h-3" />
          .md
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors rounded-lg
            ${isEditing ? "text-accent bg-accent/[0.08]" : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"}`}
        >
          <Pencil className="w-3 h-3" />
          편집
        </button>
      </div>

      {/* Content */}
      <div className="p-5 max-h-[600px] overflow-y-auto">
        {isEditing ? (
          <textarea
            value={generatedContent}
            onChange={(e) => updateContent(e.target.value)}
            className="input-premium w-full min-h-[500px] font-mono resize-y"
          />
        ) : (
          <div className="prose-premium max-w-none">
            <ReactMarkdown>{generatedContent}</ReactMarkdown>
          </div>
        )}
        {isGenerating && (
          <div className="mt-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse-glow" />
            <span className="text-xs text-text-muted">AI가 작성 중...</span>
          </div>
        )}
      </div>
    </div>
  );
}
