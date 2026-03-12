"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { usePrioritizerStore } from "@/stores/prioritizer-store";

export default function BacklogForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const addItem = usePrioritizerStore((s) => s.addItem);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addItem(name.trim(), description.trim());
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="기능 이름"
        className="input-premium flex-1"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="설명"
        className="input-premium flex-[2] hidden sm:block"
      />
      <button
        type="submit"
        disabled={!name.trim()}
        className="btn-accent flex items-center gap-2 shrink-0"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">추가</span>
      </button>
    </form>
  );
}
