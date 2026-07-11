import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { getOnboardingQuestions } from "@/data/questions";

export const runtime = "nodejs";

type Turn = { id: number; question: string; answer: string };

const MODEL = "gemini-2.5-flash";

function extractionPrompt(turns: Turn[]) {
  const notes = getOnboardingQuestions()
    .map((q) => `Q${q.id}: ${q.question}\n  ${q.extraction_note ?? ""}`)
    .join("\n");

  return `You are Arya, a career-guidance AI for Indian school students. A student just completed a 10-question conversational onboarding. Extract a structured profile from their answers, silently and generously — infer where reasonable, use null where genuinely unknown.

Per-question extraction guidance:
${notes}

Transcript (question/answer pairs):
${JSON.stringify(turns)}

Output ONLY valid JSON, no prose, no markdown — ONE flat object with exactly these fields:
{
  "class": <number|null>,
  "board": <"CBSE"|"ICSE"|"State"|null>,
  "city": <string|null>,
  "tier": <"Tier1"|"Tier2"|"Tier3"|null>,
  "stream_status": <"chosen"|"deciding"|"not_started"|null>,
  "stream": <"Science_PCM"|"Science_PCB"|"Commerce"|"Arts"|null>,
  "free_time_activities": <string[]>,
  "easy_subjects": <string[]>,
  "hard_subjects": <string[]>,
  "private_career": <string|null>,
  "family_expected_career": <string|null>,
  "confusion_score": <number 1-10|null>,
  "prior_assessment": <boolean>,
  "assessment_type": <string|null>,
  "dmit_flag": <boolean>,
  "true_aspiration": <string|null>
}`;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not set on the server." },
      { status: 500 },
    );
  }

  let turns: Turn[];
  try {
    const body = (await req.json()) as { turns?: Turn[] };
    if (!Array.isArray(body.turns) || body.turns.length === 0) {
      return NextResponse.json({ error: "Missing turns." }, { status: 400 });
    }
    turns = body.turns;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: extractionPrompt(turns),
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const text = result.text;
    if (!text) {
      return NextResponse.json({ error: "Empty response from model." }, { status: 502 });
    }

    const match = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Model returned an invalid profile." }, { status: 502 });
    }

    return NextResponse.json({ profile: parsed });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown model error.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
