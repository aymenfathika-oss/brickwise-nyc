"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { getBuildingByBBL } from "@/lib/pluto";
import { BuildingRecord } from "@/lib/types";
import SaveButton from "@/components/SaveButton";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const BOROUGH_NAME: Record<string, string> = {
  MN: "Manhattan",
  BK: "Brooklyn",
  QN: "Queens",
  BX: "Bronx",
  SI: "Staten Island",
};

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-inkSoft">{label}</p>
      <p className="text-sm mt-0.5">{value && value !== "0" ? value : "—"}</p>
    </div>
  );
}

export default function PropertyPage() {
  const params = useParams();
  const bbl = String(params.bbl);

  const [record, setRecord] = useState<BuildingRecord | null | undefined>(undefined);
  const [insight, setInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  useEffect(() => {
    getBuildingByBBL(bbl)
      .then(setRecord)
      .catch(() => setRecord(null));
  }, [bbl]);

  useEffect(() => {
    if (!record) return;
    setInsightLoading(true);
    setInsightError(null);
    fetch("/api/insight", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(record),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Insight failed");
        setInsight(data.insight);
      })
      .catch((err) => setInsightError(err.message ?? "Couldn't generate a briefing right now."))
      .finally(() => setInsightLoading(false));
  }, [record]);

  if (record === undefined) {
    return <p className="max-w-3xl mx-auto px-6 py-16 text-sm font-mono text-inkSoft">Pulling record…</p>;
  }
  if (record === null) {
    return (
      <p className="max-w-3xl mx-auto px-6 py-16 text-sm font-mono text-stamp">
        No PLUTO record found for BBL {bbl}.
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="record-card p-6 mb-6 animate-rise-in">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span className="bbl-stamp mb-2 inline-block animate-stamp-in">{record.bbl}</span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl leading-tight">
              {record.address}
            </h1>
            <p className="text-sm text-inkSoft mt-1">
              {BOROUGH_NAME[record.borough] ?? record.borough} · Block {record.block}, Lot {record.lot}
            </p>
          </div>
          <SaveButton bbl={record.bbl} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-line pt-4">
          <Field label="Year built" value={record.yearbuilt} />
          <Field label="Floors" value={record.numfloors} />
          <Field label="Total units" value={record.unitstotal} />
          <Field label="Residential units" value={record.unitsres} />
          <Field label="Lot area (sq ft)" value={record.lotarea} />
          <Field label="Building area (sq ft)" value={record.bldgarea} />
          <Field label="Building class" value={record.bldgclass} />
          <Field label="Owner on record" value={record.ownername} />
          <Field label="Historic district" value={record.histdist} />
        </div>
      </div>

      <div className="record-card p-6 mb-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-inkSoft mb-3">
          AI-written briefing
        </p>
        {insightLoading && <p className="text-sm text-inkSoft font-mono">Reading the record…</p>}
        {insightError && <p className="text-sm text-stamp">{insightError}</p>}
        {insight && <p className="text-sm leading-relaxed whitespace-pre-line">{insight}</p>}
      </div>

      {record.latitude && record.longitude && (
        <div className="h-[360px] record-card overflow-hidden">
          <MapView records={[record]} />
        </div>
      )}
    </div>
  );
}
