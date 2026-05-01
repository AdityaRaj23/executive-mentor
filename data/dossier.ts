import type { Dossier, Suggestion } from "@/types";

export const SEED_DOSSIER: Dossier = {
  member: "Eliot Cho",
  role: "Senior Engineer · Platform",
  tenure: "5y · 2 promos",
  goals: [
    { label: "Director track by 2027", status: "active" },
    { label: "Public technical brand", status: "active" },
  ],
  skills: [
    { label: "Distributed systems", conf: 92 },
    { label: "Org design", conf: 64 },
    { label: "Executive presence", conf: 41 },
    { label: "Hiring & retention", conf: 58 },
  ],
  signals: [
    "High IC depth, low cross-functional surface area",
    "No public artifacts in 18 months",
    "Manager turnover blocking visibility",
  ],
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
