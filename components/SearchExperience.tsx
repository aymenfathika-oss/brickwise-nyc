"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { SearchFilters, BuildingRecord } from "@/lib/types";
import { searchBuildings } from "@/lib/pluto";
import SearchChat from "./SearchChat";
import FilterPanel from "./FilterPanel";
import PropertyCard from "./PropertyCard";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

const EMPTY_FILTERS: SearchFilters = { summary: "" };

export default function SearchExperience() {
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);
  const [results, setResults] = useState<BuildingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function runSearch(f: SearchFilters) {
    setFilters(f);
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const records = await searchBuildings(f);
      setResults(records);
    } catch (err: any) {
      setError(err.message ?? "Couldn't reach the city's records right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="blueprint-band px-6 pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-6xl mx-auto">
          <span className="stamp-badge animate-stamp-in">NYC · Dept. of City Planning · PLUTO</span>
          <h1 className="font-display font-bold text-4xl sm:text-6xl leading-[1.05] max-w-3xl mt-6 text-paper animate-rise-in">
            Search the city&apos;s own property record.
          </h1>
          <p className="text-paper/60 mt-4 max-w-xl text-sm sm:text-base animate-rise-in" style={{ animationDelay: "0.1s" }}>
            Every tax lot in New York, straight from public records — described in plain English, not
            code fields. No listings, no prices, just the record and an honest read of it.
          </p>
        </div>
      </div>
      <div className="torn-edge" aria-hidden />

      <div className="max-w-6xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 -mt-10 sm:-mt-14 mb-8 relative z-10">
          <SearchChat onFilters={runSearch} loading={loading} />
          <div className="record-card p-5">
            <FilterPanel filters={filters} onChange={runSearch} />
          </div>
        </div>

        {filters.summary && (
          <p className="text-sm text-blueprint font-medium mb-4">&ldquo;{filters.summary}&rdquo;</p>
        )}

        {error && <p className="text-sm text-stamp mb-4">{error}</p>}

        {loading && <p className="text-sm text-inkSoft font-mono">Pulling records…</p>}

        {!loading && searched && results.length === 0 && !error && (
          <p className="text-sm text-inkSoft font-mono">
            No records matched. Try widening the year range or dropping a filter.
          </p>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
            <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
              {results.map((r) => (
                <PropertyCard key={r.bbl} record={r} />
              ))}
            </div>
            <div className="h-[400px] lg:h-[720px] sticky top-4">
              <MapView records={results} />
            </div>
          </div>
        )}

        {!searched && (
          <div className="mt-6 text-center py-16 border border-dashed border-line rounded-sm bg-[repeating-linear-gradient(45deg,rgba(28,37,48,0.02),rgba(28,37,48,0.02)_10px,transparent_10px,transparent_20px)]">
            <p className="text-inkSoft text-sm font-mono">
              Try asking for something, or set a borough above, to pull the first records.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
