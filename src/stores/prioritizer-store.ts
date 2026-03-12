"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BacklogItem, Framework } from "@/types";
import { calculateRICE, calculateICE } from "@/lib/rice";
import { demoBacklog } from "@/data/demo-data";

function calcScore(scores: BacklogItem["scores"], fw: Framework): number {
  if (fw === "ice") return calculateICE(scores.impact, scores.confidence, scores.ease);
  return calculateRICE(scores);
}

interface PrioritizerStore {
  items: BacklogItem[];
  framework: Framework;
  addItem: (name: string, description: string) => void;
  updateScore: (
    id: string,
    field: keyof BacklogItem["scores"],
    value: number
  ) => void;
  removeItem: (id: string) => void;
  setFramework: (fw: Framework) => void;
}

export const usePrioritizerStore = create<PrioritizerStore>()(
  persist(
    (set) => ({
      items: demoBacklog,
      framework: "rice",
      addItem: (name, description) =>
        set((state) => {
          const scores = { reach: 5, impact: 5, confidence: 5, effort: 5, ease: 5 };
          const newItem: BacklogItem = {
            id: Date.now().toString(),
            name,
            description,
            scores,
            riceScore: calcScore(scores, state.framework),
            createdAt: new Date().toISOString().split("T")[0],
          };
          return { items: [...state.items, newItem] };
        }),
      updateScore: (id, field, value) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item;
            const newScores = { ...item.scores, [field]: value };
            return {
              ...item,
              scores: newScores,
              riceScore: calcScore(newScores, state.framework),
            };
          }),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      setFramework: (framework) =>
        set((state) => ({
          framework,
          items: state.items.map((item) => ({
            ...item,
            riceScore: calcScore(item.scores, framework),
          })),
        })),
    }),
    { name: "pm-toolkit-prioritizer" }
  )
);
