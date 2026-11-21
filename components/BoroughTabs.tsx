"use client";

import { BOROUGHS, BoroughCode } from "@/lib/types";

const ACCENT: Record<BoroughCode, string> = {
  MN: "border-borough-mn text-borough-mn data-[active=true]:bg-borough-mn",
  BK: "border-borough-bk text-borough-bk data-[active=true]:bg-borough-bk",
  QN: "border-borough-qn text-borough-qn data-[active=true]:bg-borough-qn",
  BX: "border-borough-bx text-borough-bx data-[active=true]:bg-borough-bx",
  SI: "border-borough-si text-borough-si data-[active=true]:bg-borough-si",
};

export default function BoroughTabs({
  value,
  onChange,
}: {
  value?: BoroughCode;
  onChange: (b: BoroughCode | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(undefined)}
        data-active={value === undefined}
        className="px-3 py-1 text-xs font-mono uppercase tracking-wide border border-line rounded-sm data-[active=true]:bg-ink data-[active=true]:text-paper transition-colors"
      >
        All boroughs
      </button>
      {BOROUGHS.map((b) => (
        <button
          key={b.code}
          onClick={() => onChange(b.code)}
          data-active={value === b.code}
          className={`px-3 py-1 text-xs font-mono uppercase tracking-wide border rounded-sm transition-colors data-[active=true]:text-paper ${ACCENT[b.code]}`}
        >
          {b.name}
        </button>
      ))}
    </div>
  );
}
