"use client";

import { BarChart3, ListOrdered, FileText } from "lucide-react";

const tabs = [
  { id: "dashboard", label: "대시보드", icon: BarChart3 },
  { id: "prioritizer", label: "우선순위", icon: ListOrdered },
  { id: "prd", label: "PRD 생성기", icon: FileText },
] as const;

export type TabId = (typeof tabs)[number]["id"];

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="flex gap-1 px-6 border-b border-white/[0.03]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative rounded-t-lg
              ${
                isActive
                  ? "text-accent bg-accent/[0.05]"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/[0.03]"
              }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            {isActive && (
              <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-accent/80 via-accent to-accent/80 rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
