"use client";

import { useState } from "react";
import { SearchFilters } from "@/lib/types";

const EXAMPLES = [
  "pre-war buildings in Park Slope",
  "large apartment complexes in Queens built after 2000",
  "landmarked buildings in the Bronx",
  "small buildings near Astoria",
];

export default function SearchChat({
  onFilters,
  loading,
}: {
  onFilters: (f: SearchFilters) => void;
  loading: boolean;
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(query: string) {
    if (!query.trim() || pending) return;
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      onFilters(data.filters);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong reading that request.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="record-card p-5">
      <p className="font-mono text-[11px] uppercase tracking-widest text-inkSoft mb-2">
        Ask in plain English
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(text);
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. pre-war buildings in Park Slope"
          className="flex-1 bg-transparent border border-line rounded-sm px-3 py-2 text-sm focus:border-blueprint outline-none"
        />
        <button
          type="submit"
          disabled={pending || loading}
          className="bg-stamp text-paper text-sm font-medium px-4 py-2 rounded-sm hover:bg-stamp/90 disabled:opacity-50 transition-colors"
        >
          {pending ? "Reading request…" : "Search"}
        </button>
      </form>
      {error && <p className="text-xs text-stamp mt-2">{error}</p>}
      <div className="flex flex-wrap gap-2 mt-3">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => {
              setText(ex);
              submit(ex);
            }}
            className="text-xs text-inkSoft border border-line rounded-sm px-2 py-1 hover:border-blueprint hover:text-blueprint transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
