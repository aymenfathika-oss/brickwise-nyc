"use client";

import { SearchFilters, BoroughCode } from "@/lib/types";
import BoroughTabs from "./BoroughTabs";

export default function FilterPanel({
  filters,
  onChange,
}: {
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-inkSoft mb-2">Borough</p>
        <BoroughTabs
          value={filters.borough}
          onChange={(b: BoroughCode | undefined) => onChange({ ...filters, borough: b })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs text-inkSoft">
          Built after
          <input
            type="number"
            placeholder="1900"
            value={filters.minYearBuilt ?? ""}
            onChange={(e) =>
              onChange({ ...filters, minYearBuilt: e.target.value ? Number(e.target.value) : undefined })
            }
            className="mt-1 w-full bg-transparent border border-line rounded-sm px-2 py-1.5 text-sm focus:border-blueprint outline-none"
          />
        </label>
        <label className="text-xs text-inkSoft">
          Built before
          <input
            type="number"
            placeholder="2026"
            value={filters.maxYearBuilt ?? ""}
            onChange={(e) =>
              onChange({ ...filters, maxYearBuilt: e.target.value ? Number(e.target.value) : undefined })
            }
            className="mt-1 w-full bg-transparent border border-line rounded-sm px-2 py-1.5 text-sm focus:border-blueprint outline-none"
          />
        </label>
      </div>
      <label className="flex items-center gap-2 text-xs text-inkSoft">
        <input
          type="checkbox"
          checked={!!filters.landmarkOnly}
          onChange={(e) => onChange({ ...filters, landmarkOnly: e.target.checked })}
          className="accent-stamp"
        />
        Landmarked buildings only
      </label>
    </div>
  );
}
