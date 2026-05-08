import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { boardroom } from "@/lib/voice";
import type { DiagnosticAnswers, Dossier, Message } from "@/types";

export const runtime = "nodejs";

const MODEL = "gemini-2.5-flash";

type RequestBody = {
  messages: Message[];
  dossier: Dossier;
  firstYear?: {
    archetype?: { label: string; tag: string };
    answers?: DiagnosticAnswers;
    stackHeadline?: string;
  };
};

function buildPrompt(
  messages: Message[],
  dossier: Dossier,
  firstYear: RequestBody["firstYear"],
) {
  const dossierStr = JSON.stringify({
    goals: dossier.goals.map((g) => g.label),
    skills: dossier.skills,
    signals: dossier.signals,
  });

  let diagnosticBlock = "";
  if (firstYear?.archetype) {
    const lines: string[] = [];
    lines.push(
      `Archetype: ${firstYear.archetype.label} — ${firstYear.archetype.tag}.`,
    );
    if (firstYear.stackHeadline) {
      lines.push(`Talent-stack headline: ${firstYear.stackHeadline}`);
    }
    const a = firstYear.answers ?? {};
    if (a.background) lines.push(`Background: ${a.background}`);
    if (a.lostInTime) lines.push(`Lost track of time: ${a.lostInTime}`);
    if (a.constraints) lines.push(`Constraints: ${a.constraints}`);
    diagnosticBlock = `\n\nDiagnostic context (cite specifics from this when useful):\n${lines.join(
      "\n",
    )}`;
  }

  const sys = `${boardroom.sysPrompt}

The user is ${dossier.member}, ${dossier.role}, ${dossier.tenure}. Current dossier: ${dossierStr}${diagnosticBlock}

IMPORTANT: After your prose response, on its own line at the very end, output a single JSON object on one line in this exact shape:
<<<DOSSIER>>>{"skill_deltas":[{"label":"<existing skill label>","delta":<-5..+5 integer>}], "new_signal":"<short observation or null>"}<<<END>>>

Only include skills already in the dossier. Pick at most 2 deltas tied to what was discussed. The signal should be a sharp 8-12 word observation about the user revealed by THIS exchange, or null.`;

  const transcript = messages
    .map((m) => `${m.role === "user" ? "User" : "M"}: ${m.body}`)
    .join("\n");

  return `${sys}\n\nConversation so far:\n${transcript}\n\nM:`;
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

  if (!Array.isArray(body.messages) || !body.dossier) {
    return NextResponse.json({ error: "Missing messages or dossier." }, { status: 400 });
  }

  const prompt = buildPrompt(body.messages, body.dossier, body.firstYear);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { temperature: 0.8 },
    });

    const text = result.text;
    if (!text) {
      return NextResponse.json({ error: "Empty response from model." }, { status: 502 });
    }

    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown model error.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
