const KEY = "brickwise:saved-bbls";

export function getSavedBBLs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function isSaved(bbl: string): boolean {
  return getSavedBBLs().includes(bbl);
}

export function toggleSaved(bbl: string): boolean {
  const current = getSavedBBLs();
  const idx = current.indexOf(bbl);
  let next: string[];
  if (idx === -1) {
    next = [...current, bbl];
  } else {
    next = current.filter((b) => b !== bbl);
  }
  localStorage.setItem(KEY, JSON.stringify(next));
  return idx === -1;
}
