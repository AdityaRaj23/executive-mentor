import type {
  Archetype,
  DiagnosticAnswers,
  Dossier,
  Suggestion,
  TalentStack,
  ThirtyDayBrief,
} from "@/types";

export const SEED_DOSSIER: Dossier = {
  member: "You",
  role: "Year-one career",
  tenure: "First year",
  goals: [],
  skills: [],
  signals: [],
};

export const SUGGESTION_PROMPTS: Suggestion[] = [
  { title: "Map my path to VP", body: "Surface the moves that compound over 4 years." },
  { title: "Plan a pivot", body: "Translate my current leverage into a new domain." },
  { title: "Negotiate a raise", body: "Build a leverage map and a counter-offer script." },
];

export const ONBOARDING_QUESTIONS = [
  { id: "q1", q: "What role are you targeting in 3 years?", placeholder: "e.g. Director of Platform Eng" },
  { id: "q2", q: "What's the work you've been avoiding?", placeholder: "Be specific — name the conversation, the artifact, the meeting." },
  { id: "q3", q: "Who are 2 people whose careers you'd like to study?", placeholder: "Names + why" },
];

export interface FirstYearSnapshot {
  archetype?: Archetype;
  answers?: DiagnosticAnswers;
  stack?: TalentStack | null;
  brief?: ThirtyDayBrief | null;
}

function clip(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

export function buildDossier(args: {
  firstName?: string | null;
  fullName?: string | null;
  firstYear: FirstYearSnapshot;
}): Dossier {
  const { firstYear } = args;
  const name = (args.fullName?.trim() || args.firstName?.trim() || "You").trim();

  const arch = firstYear.archetype;
  const role = arch ? `${arch.label} — ${arch.tag}` : SEED_DOSSIER.role;

  const bg = firstYear.answers?.background?.trim();
  const tenure = bg ? clip(bg, 60) : "First year";

  const goals: Dossier["goals"] = [];
  if (firstYear.brief?.north_star) {
    goals.push({ label: clip(firstYear.brief.north_star, 90), status: "active" });
  }
  for (const w of firstYear.stack?.weak_signals_to_strengthen ?? []) {
    if (goals.length >= 3) break;
    if (w?.label) goals.push({ label: clip(w.label, 60), status: "active" });
  }

  const skills: Dossier["skills"] = [];
  for (const s of firstYear.stack?.strengths ?? []) {
    if (skills.length >= 4) break;
    if (s?.label) skills.push({ label: clip(s.label, 36), conf: 70 });
  }
  for (const w of firstYear.stack?.weak_signals_to_strengthen ?? []) {
    if (skills.length >= 4) break;
    if (w?.label) skills.push({ label: clip(w.label, 36), conf: 30 });
  }

  const signals: string[] = [];
  for (const l of firstYear.stack?.latent ?? []) {
    if (signals.length >= 3) break;
    if (l?.label) signals.push(clip(l.label, 80));
  }
  if (signals.length === 0 && firstYear.stack?.headline) {
    signals.push(clip(firstYear.stack.headline, 100));
  }

  return {
    member: name,
    role,
    tenure,
    goals,
    skills,
    signals,
  };
}
