"use client";

import IdeaInput from "./IdeaInput";
import PrdViewer from "./PrdViewer";

export default function PrdGenerator() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <IdeaInput />
      <PrdViewer />
    </div>
  );
}
