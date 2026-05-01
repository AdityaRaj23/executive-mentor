import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { ARCHETYPES } from "@/data/archetypes";

export const runtime = "nodejs";

type Kind = "talent-stack" | "thirty-day" | "archetype-rank" | "archetype-personal";

type ArchetypeRef = { id: string; label: string; tag: string };

type RequestBody = {
  kind: Kind;
  answers: Record<string, string>;
  archetype?: ArchetypeRef;
};

const MODEL = "gemini-2.5-flash";

function talentStackPrompt(answers: Record<string, string>, archetype: ArchetypeRef) {
  return `You are M, a career mentor. Based on the user's diagnostic answers, surface their TALENT STACK — concrete strengths and signals, framed generously but specifically. They are early-career, possibly fresh out of school. Most fresh grads systematically undervalue themselves; your job is to NAME their latent assets with evidence.

Diagnostic answers: ${JSON.stringify(answers)}
They're exploring archetype: ${archetype.label} (${archetype.tag}).

Output ONLY valid JSON, no prose, no markdown. Schema:
{
  "headline": "<one short evidence-based statement, like 'You have an unusual combination of X + Y + Z that 87% of grads don't.'>",
  "strengths": [{"label":"<short>", "evidence":"<10-18 word specific reason from their answers>"}, ... 4 items],
  "latent": [{"label":"<latent strength they undervalue>", "why":"<1 sentence>"}, ... 2 items],
  "weak_signals_to_strengthen": [{"label":"<thing missing>", "first_step":"<concrete step this month>"}, ... 2 items]
}`;
}

function thirtyDayPrompt(answers: Record<string, string>, archetype: ArchetypeRef) {
  return `You are M, a career mentor for fresh grads. Generate a concrete 30-DAY STARTER PLAN for someone exploring archetype "${archetype.label} — ${archetype.tag}". Their diagnostic: ${JSON.stringify(answers)}.

Goal: cut paralysis. Specific is better than ambitious. Output ONLY valid JSON.

Schema:
{
  "north_star": "<one sentence: what success in 30 days looks like>",
  "ship_one_thing": {"title":"<concrete artifact to make>", "why":"<1 sentence>", "first_three_steps":["s1","s2","s3"]},
  "talk_to_five": [{"who":"<archetype of person>", "how":"<concrete script or channel>"}, ... 5 items],
  "two_applications": [{"target":"<role / category>", "where":"<concrete companies or programs>"}, ... 2 items],
  "weekly_micro": ["<week 1 micro-action>", "<week 2>", "<week 3>", "<week 4>"]
}`;
}

function archetypePersonalPrompt(answers: Record<string, string>, archetype: ArchetypeRef) {
  return `You are M, a career mentor. The user is exploring the "${archetype.label} — ${archetype.tag}" archetype. Write 2-4 short sentences (max 80 words total) about how THIS PERSON specifically would experience this path — citing concrete phrases from their diagnostic. Mention what their background gives them as an edge, and one constraint or signal worth naming. Direct second-person ("you"), confident, specific. No bullet lists, no markdown.

Diagnostic answers: ${JSON.stringify(answers)}

Output ONLY valid JSON, no prose, no markdown. Schema:
{ "paragraph": "<the 2-4 sentence paragraph, plain text>" }`;
}

function archetypeRankPrompt(answers: Record<string, string>) {
  const catalog = ARCHETYPES.map(
    (a) => `  - id: "${a.id}" | ${a.label} — ${a.tag}. ${a.blurb}`,
  ).join("\n");
  return `You are M, a career mentor. Read the user's full diagnostic — including the free-text fields (background, lostInTime, constraints) — and rank ALL six career archetypes by fit, best to worst. Use specific phrasing from their answers in each "why" line so it's clear you read what they wrote.

Diagnostic answers: ${JSON.stringify(answers)}

Archetype catalog (use these exact ids):
${catalog}

Output ONLY valid JSON, no prose, no markdown. Schema:
{
  "rankings": [
    {"id": "<one of: builder | synthesizer | analyst | storyteller | operator | crafter>", "why": "<one sentence, 12-22 words, citing something specific from their answers>"},
    ... exactly 6 items, each archetype id appearing exactly once, ordered best fit first
  ]
}`;
}

const VALID_IDS = new Set(ARCHETYPES.map((a) => a.id));

function validateRankings(parsed: unknown): { id: string; why: string }[] | null {
  if (
    !parsed ||
    typeof parsed !== "object" ||
    !Array.isArray((parsed as { rankings?: unknown }).rankings)
  ) {
    return null;
  }
  const rankings = (parsed as { rankings: unknown[] }).rankings;
  if (rankings.length !== ARCHETYPES.length) return null;
  const seen = new Set<string>();
  const out: { id: string; why: string }[] = [];
  for (const r of rankings) {
    if (!r || typeof r !== "object") return null;
    const { id, why } = r as { id?: unknown; why?: unknown };
    if (typeof id !== "string" || !VALID_IDS.has(id) || seen.has(id)) return null;
    if (typeof why !== "string" || why.trim().length === 0) return null;
    seen.add(id);
    out.push({ id, why: why.trim() });
  }
  return out;
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

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.answers || typeof body.answers !== "object") {
    return NextResponse.json({ error: "Missing answers." }, { status: 400 });
  }

  let prompt: string;
  if (
    body.kind === "talent-stack" ||
    body.kind === "thirty-day" ||
    body.kind === "archetype-personal"
  ) {
    if (!body.archetype?.id) {
      return NextResponse.json({ error: "Missing archetype." }, { status: 400 });
    }
    if (body.kind === "talent-stack") {
      prompt = talentStackPrompt(body.answers, body.archetype);
    } else if (body.kind === "thirty-day") {
      prompt = thirtyDayPrompt(body.answers, body.archetype);
    } else {
      prompt = archetypePersonalPrompt(body.answers, body.archetype);
    }
  } else if (body.kind === "archetype-rank") {
    prompt = archetypeRankPrompt(body.answers);
  } else {
    return NextResponse.json({ error: "Unknown kind." }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = result.text;
    if (!text) {
      return NextResponse.json({ error: "Empty response from model." }, { status: 502 });
    }

    const match = text.match(/\{[\s\S]*\}/);
    const json = match ? match[0] : text;
    const parsed = JSON.parse(json);

    if (body.kind === "archetype-rank") {
      const rankings = validateRankings(parsed);
      if (!rankings) {
        return NextResponse.json(
          { error: "Model returned invalid rankings." },
          { status: 502 },
        );
      }
      return NextResponse.json({ rankings });
    }

    if (body.kind === "archetype-personal") {
      const paragraph =
        parsed && typeof (parsed as { paragraph?: unknown }).paragraph === "string"
          ? ((parsed as { paragraph: string }).paragraph || "").trim()
          : "";
      if (!paragraph) {
        return NextResponse.json(
          { error: "Model returned an empty paragraph." },
          { status: 502 },
        );
      }
      return NextResponse.json({ paragraph });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown model error.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
