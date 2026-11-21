import { BuildingRecord, SearchFilters } from "./types";

// NYC Dept of City Planning — Primary Land Use Tax Lot Output (PLUTO)
// Dataset: https://data.cityofnewyork.us/City-Government/Primary-Land-Use-Tax-Lot-Output-PLUTO-/64uk-42ks
const PLUTO_ENDPOINT = "https://data.cityofnewyork.us/resource/64uk-42ks.json";

function buildWhereClause(filters: SearchFilters): string {
  const clauses: string[] = ["latitude IS NOT NULL", "address IS NOT NULL"];

  if (filters.borough) clauses.push(`borough = '${filters.borough}'`);
  if (filters.minYearBuilt) clauses.push(`yearbuilt >= ${filters.minYearBuilt}`);
  if (filters.maxYearBuilt) clauses.push(`yearbuilt <= ${filters.maxYearBuilt}`);
  if (filters.minUnits) clauses.push(`unitstotal >= ${filters.minUnits}`);
  if (filters.maxUnits) clauses.push(`unitstotal <= ${filters.maxUnits}`);
  if (filters.landmarkOnly) clauses.push(`landmark IS NOT NULL`);
  if (filters.keyword) {
    const kw = filters.keyword.replace(/'/g, "''");
    clauses.push(`(upper(address) LIKE upper('%${kw}%') OR upper(ownername) LIKE upper('%${kw}%'))`);
  }

  return clauses.join(" AND ");
}

export async function searchBuildings(filters: SearchFilters, limit = 40): Promise<BuildingRecord[]> {
  const where = buildWhereClause(filters);
  const params = new URLSearchParams({
    $where: where,
    $limit: String(limit),
    $order: "yearbuilt DESC",
  });

  const appToken = process.env.NEXT_PUBLIC_NYC_OPEN_DATA_APP_TOKEN;
  const headers: Record<string, string> = {};
  if (appToken) headers["X-App-Token"] = appToken;

  const res = await fetch(`${PLUTO_ENDPOINT}?${params.toString()}`, { headers });
  if (!res.ok) throw new Error(`PLUTO request failed: ${res.status}`);
  const rows = await res.json();

  return rows.map(toBuildingRecord).filter((r: BuildingRecord) => r.latitude && r.longitude);
}

export async function getBuildingByBBL(bbl: string): Promise<BuildingRecord | null> {
  const params = new URLSearchParams({
    $where: `bbl = '${bbl}'`,
    $limit: "1",
  });
  const res = await fetch(`${PLUTO_ENDPOINT}?${params.toString()}`);
  if (!res.ok) throw new Error(`PLUTO request failed: ${res.status}`);
  const rows = await res.json();
  if (!rows.length) return null;
  return toBuildingRecord(rows[0]);
}

function toBuildingRecord(row: any): BuildingRecord {
  return {
    bbl: row.bbl,
    address: row.address,
    borough: row.borough,
    block: row.block,
    lot: row.lot,
    zipcode: row.zipcode,
    bldgclass: row.bldgclass,
    landuse: row.landuse,
    yearbuilt: row.yearbuilt,
    numfloors: row.numfloors,
    unitsres: row.unitsres,
    unitstotal: row.unitstotal,
    lotarea: row.lotarea,
    bldgarea: row.bldgarea,
    ownername: row.ownername,
    histdist: row.histdist,
    landmark: row.landmark,
    latitude: row.latitude,
    longitude: row.longitude,
  };
}
