import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/claude";

const SYSTEM_PROMPT = `You translate a person's plain-English request about NYC buildings into a JSON filter object for the NYC PLUTO property dataset.

Respond with ONLY a JSON object, no preamble, no markdown fences. Shape:
{
  "borough": "MN" | "BK" | "QN" | "BX" | "SI" | null,
  "minYearBuilt": number | null,
  "maxYearBuilt": number | null,
  "minUnits": number | null,
  "maxUnits": number | null,
  "landmarkOnly": boolean,
  "keyword": string | null,
  "summary": string
}

Rules:
- borough: map neighborhood/borough names to codes (Manhattan=MN, Brooklyn=BK, Queens=QN, Bronx=BX, Staten Island=SI). If a specific neighborhood is named (e.g. "Park Slope", "Astoria"), put the neighborhood name in "keyword" and still set the correct borough if you know it.
- "old building", "pre-war", "historic" -> maxYearBuilt around 1945 and landmarkOnly may be true if they say "landmark" or "historic district" specifically.
- "new construction", "new building" -> minYearBuilt around 2015.
- "small building" -> maxUnits around 6. "large building" / "apartment complex" -> minUnits around 50.
- summary: one short friendly sentence (under 20 words) describing what you searched for, written as if telling the user what you did.
- Use null for anything not implied by the request. Do not invent constraints the user didn't ask for or imply.`;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Missing 'query' string" }, { status: 400 });
    }

    const raw = await askClaude(query, {
      system: SYSTEM_PROMPT,
      model: "claude-haiku-4-5-20251001",
      maxTokens: 300,
    });

    const cleaned = raw.replace(/```json|```/g, "").trim();
    const filters = JSON.parse(cleaned);

    return NextResponse.json({ filters });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Search parsing failed" }, { status: 500 });
  }
}
