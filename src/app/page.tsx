"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import TabNavigation, { type TabId } from "@/components/layout/TabNavigation";
import Dashboard from "@/components/dashboard/Dashboard";
import Prioritizer from "@/components/prioritizer/Prioritizer";
import PrdGenerator from "@/components/prd-generator/PrdGenerator";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  return (
    <div className="max-w-7xl mx-auto">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="p-6">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "prioritizer" && <Prioritizer />}
        {activeTab === "prd" && <PrdGenerator />}
      </main>

      <footer className="px-6 py-8 border-t border-white/[0.03] text-center">
        <p className="section-label">
          Developed by u.da.won
        </p>
      </footer>
    </div>
  );
}
