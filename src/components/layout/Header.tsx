"use client";

import { LayoutDashboard } from "lucide-react";

export default function Header() {
  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-bg-primary/60 border-b border-white/[0.03]">
      <div className="flex items-center gap-3 px-6 py-4">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-accent" />
          <h1
            className="text-2xl font-bold tracking-wide"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            PM Toolkit
          </h1>
        </div>
        <span className="section-label ml-2 mt-1">
          PM을 위한 올인원 도구
        </span>
      </div>
    </div>
  );
}
