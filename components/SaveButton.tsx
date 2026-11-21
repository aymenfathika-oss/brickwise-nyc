"use client";

import { useEffect, useState } from "react";
import { isSaved, toggleSaved } from "@/lib/saved";

export default function SaveButton({ bbl, className = "" }: { bbl: string; className?: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isSaved(bbl));
  }, [bbl]);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSaved(toggleSaved(bbl));
      }}
      className={`font-mono text-[11px] uppercase tracking-wide border rounded-sm px-2 py-1 transition-colors ${
        saved
          ? "bg-ink text-paper border-ink"
          : "border-line text-inkSoft hover:border-ink hover:text-ink"
      } ${className}`}
    >
      {saved ? "Saved ✓" : "Save"}
    </button>
  );
}
