"use client";

import { useEffect, useState } from "react";
import { getSavedBBLs } from "@/lib/saved";
import { getBuildingByBBL } from "@/lib/pluto";
import { BuildingRecord } from "@/lib/types";
import PropertyCard from "@/components/PropertyCard";

export default function SavedPage() {
  const [records, setRecords] = useState<BuildingRecord[] | null>(null);

  useEffect(() => {
    const bbls = getSavedBBLs();
    if (bbls.length === 0) {
      setRecords([]);
      return;
    }
    Promise.all(bbls.map((bbl) => getBuildingByBBL(bbl).catch(() => null))).then((results) =>
      setRecords(results.filter((r): r is BuildingRecord => r !== null))
    );
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <p className="bbl-stamp mb-3">Your list</p>
      <h1 className="font-display font-bold text-3xl mb-6">Saved records</h1>

      {records === null && <p className="text-sm text-inkSoft font-mono">Loading…</p>}

      {records && records.length === 0 && (
        <div className="text-center py-16 border border-dashed border-line rounded-sm">
          <p className="text-sm text-inkSoft font-mono">
            Nothing saved yet. Save a record from search to see it here.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {records?.map((r) => (
          <PropertyCard key={r.bbl} record={r} />
        ))}
      </div>
    </div>
  );
}
