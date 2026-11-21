export type BoroughCode = "MN" | "BK" | "QN" | "BX" | "SI";

export const BOROUGHS: { code: BoroughCode; name: string; plutoName: string }[] = [
  { code: "MN", name: "Manhattan", plutoName: "MN" },
  { code: "BK", name: "Brooklyn", plutoName: "BK" },
  { code: "QN", name: "Queens", plutoName: "QN" },
  { code: "BX", name: "Bronx", plutoName: "BX" },
  { code: "SI", name: "Staten Island", plutoName: "SI" },
];

export interface BuildingRecord {
  bbl: string;
  address: string;
  borough: string;
  block: string;
  lot: string;
  zipcode?: string;
  bldgclass?: string;
  landuse?: string;
  yearbuilt?: string;
  numfloors?: string;
  unitsres?: string;
  unitstotal?: string;
  lotarea?: string;
  bldgarea?: string;
  ownername?: string;
  histdist?: string;
  landmark?: string;
  latitude?: string;
  longitude?: string;
}

export interface SearchFilters {
  borough?: BoroughCode;
  minYearBuilt?: number;
  maxYearBuilt?: number;
  minUnits?: number;
  maxUnits?: number;
  landmarkOnly?: boolean;
  keyword?: string;
  summary: string;
}
