import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/claude";

const SYSTEM_PROMPT = `You are a knowledgeable, neutral NYC property analyst. You are given raw fields from the
NYC Department of City Planning's PLUTO dataset for a single tax lot. Write a short, plain-English
briefing (3 short paragraphs, no headers, no markdown) covering:

1. What the building is (type, approximate age, size, units) in a natural sentence, not a data dump.
2. Anything notable: landmark/historic district status, how its age compares to typical NYC building stock,
   unusually large or small for its block, mixed commercial/residential use if apparent from building class.
3. One neutral, practical observation for someone evaluating the property or block (e.g. what the building
   class code suggests about use, what an old building might mean for renovation, what a landmark district
   means for exterior changes). Do not invent facts not supported by the data. If data is missing, say so
   briefly rather than guessing.

Keep it under 160 words total. Do not repeat raw field names like "bldgclass" verbatim — translate them.
No disclaimers, no "As an AI" framing, just the briefing.`;

export async function POST(req: NextRequest) {
  try {
    const record = await req.json();
    if (!record || !record.bbl) {
      return NextResponse.json({ error: "Missing building record" }, { status: 400 });
    }

    const prompt = `Building record (BBL ${record.bbl}):\n${JSON.stringify(record, null, 2)}`;

    const insight = await askClaude(prompt, {
      system: SYSTEM_PROMPT,
      model: "claude-sonnet-5",
      maxTokens: 400,
    });

    return NextResponse.json({ insight });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Insight generation failed" }, { status: 500 });
  }
}
