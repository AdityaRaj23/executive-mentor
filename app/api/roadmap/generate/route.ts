import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import type { DiagnosticAnswers, Milestone, TalentStack, ThirtyDayBrief } from "@/types";

export const runtime = "nodejs";

const MODEL = "gemini-2.5-flash";

type Action = "generate" | "replan";

type ArchetypeRef = { id?: string; label: string; tag: string };

type LockedMilestone = { year: string; quarter: string; title: string; body: string };

type RequestBody = {
  action: Action;
  firstName?: string;
  archetype: ArchetypeRef;
  answers?: DiagnosticAnswers;
  stack?: TalentStack | null;
  brief?: ThirtyDayBrief | null;
  // replan only
  scenario?: string;
  locked?: LockedMilestone[];
  futureCount?: number;
};

type RawMilestone = {
  year: string;
  quarter: string;
  title: string;
  body: string;
  skills: string[];
};

function generatePrompt(body: RequestBody) {
  const { firstName, archetype, answers, stack, brief } = body;
  const stackBlock = stack
    ? `Talent stack:
- Headline: ${stack.headline}
- Strengths: ${stack.strengths.map((s) => s.label).join(", ")}
- Latent: ${stack.latent.map((l) => l.label).join(", ")}
- Gaps to strengthen: ${stack.weak_signals_to_strengthen.map((w) => w.label).join(", ")}`
    : "";
  const briefBlock = brief?.north_star ? `North star (next 30 days): ${brief.north_star}` : "";
  const dxBlock = answers
    ? `Diagnostic free-text:
- Background: ${answers.background ?? ""}
- Lost track of time: ${answers.lostInTime ?? ""}
- Constraints: ${answers.constraints ?? ""}`
    : "";

  return `You are M, a career strategist mapping a 7-year trajectory for an early-career person${firstName ? ` named ${firstName}` : ""}. They are exploring archetype "${archetype.label} — ${archetype.tag}".

${stackBlock}
${briefBlock}
${dxBlock}

Generate exactly 6 milestones spanning years 2026 → 2032. The first milestone is status "current" (year 2026, the present pivot — what they should be doing right now). The remaining 5 are "future" — concrete career inflection points specific to this archetype and to phrases from their diagnostic. Each milestone must escalate scope: title should name a role, project, or visible artifact. Body is 1-2 sentences naming the lever (e.g. cross-functional reach, public artifact, hiring tree, platform exposure). Avoid platitudes.

Output ONLY valid JSON, no prose, no markdown fences. Schema:
{
  "milestones": [
    {"year":"2026","quarter":"Q2","title":"<short>","body":"<1-2 sentences>","skills":["s1","s2"]},
    ... exactly 6 items, ordered chronologically
  ]
}`;
}

function replanPrompt(body: RequestBody) {
  const { archetype, scenario, locked, futureCount, answers } = body;
  const lockedStr = (locked ?? [])
    .map((m) => `${m.year} ${m.quarter}: ${m.title} — ${m.body}`)
    .join("\n");
  return `You are M, a career strategist re-planning a path. The user is on the "${archetype.label} — ${archetype.tag}" track. Their constraints: ${answers?.constraints ?? "—"}.

Locked past milestones (do NOT change):
${lockedStr || "—"}

What-if scenario from the user: "${scenario ?? ""}"

Generate ${futureCount ?? 5} alt-trajectory future milestones that respond to that scenario while still leveraging this archetype. Output ONLY valid JSON, no prose, no markdown fences.

Schema:
{
  "milestones": [
    {"year":"YYYY","quarter":"QN","title":"<short>","body":"<1-2 sentences>","skills":["s1","s2"]},
    ... exactly ${futureCount ?? 5} items
  ]
}`;
}

function validateMilestones(parsed: unknown, expected: number): RawMilestone[] | null {
  if (!parsed || typeof parsed !== "object") return null;
  const arr = (parsed as { milestones?: unknown }).milestones;
  if (!Array.isArray(arr) || arr.length !== expected) return null;
  const out: RawMilestone[] = [];
  for (const m of arr) {
    if (!m || typeof m !== "object") return null;
    const { year, quarter, title, body, skills } = m as Record<string, unknown>;
    if (
      typeof year !== "string" ||
      typeof quarter !== "string" ||
      typeof title !== "string" ||
      typeof body !== "string" ||
      !Array.isArray(skills)
    )
      return null;
    out.push({
      year: year.trim(),
      quarter: quarter.trim(),
      title: title.trim(),
      body: body.trim(),
      skills: skills.filter((s): s is string => typeof s === "string"),
    });
  }
  return out;
}

function attachShapes(raw: RawMilestone[], action: Action, idOffset = 0): Milestone[] {
  return raw.map((r, i) => ({
    id: idOffset + i + 1,
    year: r.year,
    quarter: r.quarter,
    side: i % 2 === 0 ? "left" : "right",
    title: r.title,
    body: r.body,
    skills: r.skills,
    status: action === "generate" ? (i === 0 ? "current" : "future") : "alt",
  }));
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

  if (!body.archetype?.label || !body.archetype?.tag) {
    return NextResponse.json({ error: "Missing archetype." }, { status: 400 });
  }

  const expected = body.action === "replan" ? body.futureCount ?? 5 : 6;
  const prompt = body.action === "replan" ? replanPrompt(body) : generatePrompt(body);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.7 },
    });

    const text = result.text;
    if (!text) {
      return NextResponse.json({ error: "Empty response from model." }, { status: 502 });
    }
    const match = text.match(/\{[\s\S]*\}/);
    const json = match ? match[0] : text;
    const parsed = JSON.parse(json);

    const raw = validateMilestones(parsed, expected);
    if (!raw) {
      return NextResponse.json({ error: "Model returned invalid milestones." }, { status: 502 });
    }

    const milestones = attachShapes(raw, body.action, body.action === "replan" ? 100 : 0);
    return NextResponse.json({ milestones });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown model error.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
