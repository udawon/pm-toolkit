"use client";

import { create } from "zustand";
import type { PrdTemplate } from "@/types";

interface PrdStore {
  idea: string;
  template: PrdTemplate;
  generatedContent: string;
  isGenerating: boolean;
  error: string | null;
  setIdea: (idea: string) => void;
  setTemplate: (t: PrdTemplate) => void;
  setGeneratedContent: (content: string) => void;
  generate: () => Promise<void>;
  updateContent: (content: string) => void;
}

export const usePrdStore = create<PrdStore>((set, get) => ({
  idea: "",
  template: "prd",
  generatedContent: "",
  isGenerating: false,
  error: null,
  setIdea: (idea) => set({ idea }),
  setTemplate: (template) => set({ template }),
  setGeneratedContent: (content) => set({ generatedContent: content }),
  generate: async () => {
    const { idea, template } = get();
    if (!idea.trim()) return;

    set({ isGenerating: true, generatedContent: "", error: null });

    try {
      const response = await fetch("/api/generate-prd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, template }),
      });

      if (!response.ok) {
        throw new Error("PRD 생성에 실패했습니다.");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("스트림을 읽을 수 없습니다.");

      let content = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        content += decoder.decode(value, { stream: true });
        set({ generatedContent: content });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      set({ isGenerating: false });
    }
  },
  updateContent: (content) => set({ generatedContent: content }),
}));
