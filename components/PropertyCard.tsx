import Link from "next/link";
import { BuildingRecord } from "@/lib/types";
import SaveButton from "./SaveButton";

const BOROUGH_NAME: Record<string, string> = {
  MN: "Manhattan",
  BK: "Brooklyn",
  QN: "Queens",
  BX: "Bronx",
  SI: "Staten Island",
};

const BOROUGH_ACCENT: Record<string, string> = {
  MN: "bg-borough-mn",
  BK: "bg-borough-bk",
  QN: "bg-borough-qn",
  BX: "bg-borough-bx",
  SI: "bg-borough-si",
};

export default function PropertyCard({ record }: { record: BuildingRecord }) {
  const accent = BOROUGH_ACCENT[record.borough] ?? "bg-ink";

  return (
    <Link href={`/property/${record.bbl}`} className="block group">
      <div className="record-card lift-on-hover p-4 flex gap-3">
        <span className={`w-1.5 rounded-sm ${accent}`} aria-hidden />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-display font-medium text-base truncate group-hover:text-stamp transition-colors">
                {record.address || "Address on file"}
              </p>
              <p className="text-xs text-inkSoft mt-0.5">
                {BOROUGH_NAME[record.borough] ?? record.borough} · {record.zipcode ?? "—"}
              </p>
            </div>
            <span className="bbl-stamp shrink-0">{record.bbl}</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs font-mono text-inkSoft">
            <span>Built {record.yearbuilt && record.yearbuilt !== "0" ? record.yearbuilt : "unknown"}</span>
            <span>{record.numfloors ?? "—"} floors</span>
            <span>{record.unitstotal ?? "—"} units</span>
            {record.landmark && <span className="text-stamp">Landmark</span>}
          </div>
          <div className="mt-3">
            <SaveButton bbl={record.bbl} />
          </div>
        </div>
      </div>
    </Link>
  );
}
