import type { CohortMember, MetricId, SkillRow } from "@/types";

export const COHORT_DATA: CohortMember[] = [
  { name: "Maya Okafor", track: "Product · Senior PM", readiness: 87, gap: "Exec presence", last: "2h" },
  { name: "Jonas Pereira", track: "Eng · Staff candidate", readiness: 72, gap: "Cross-fn reach", last: "1d" },
  { name: "Anya Volkov", track: "Design · Director", readiness: 91, gap: "—", last: "4h" },
  { name: "Marcus Hale", track: "Eng · Senior", readiness: 64, gap: "Org design", last: "3h" },
  { name: "Priya Raman", track: "Data · Lead", readiness: 78, gap: "Hiring", last: "6h" },
  { name: "Kenji Ito", track: "Eng · IC4", readiness: 41, gap: "Public artifacts", last: "12h" },
  { name: "Sofia Marchetti", track: "Product · Group PM", readiness: 83, gap: "Board comms", last: "1d" },
  { name: "David Ouwasanmi", track: "Eng · Manager", readiness: 55, gap: "Strategic depth", last: "2d" },
];

export const SKILL_HEATMAP: SkillRow[] = [
  { skill: "Cross-functional reach", tracks: { eng: 0.42, product: 0.78, design: 0.65, data: 0.51 } },
  { skill: "Public technical brand", tracks: { eng: 0.31, product: 0.55, design: 0.72, data: 0.48 } },
  { skill: "Org design", tracks: { eng: 0.58, product: 0.81, design: 0.62, data: 0.44 } },
  { skill: "Executive presence", tracks: { eng: 0.44, product: 0.69, design: 0.71, data: 0.52 } },
  { skill: "Hiring & retention", tracks: { eng: 0.61, product: 0.74, design: 0.58, data: 0.56 } },
];

export const METRICS: { id: MetricId; label: string; value: string; delta: string; deltaColor: string }[] = [
  { id: "users", label: "Total members", value: "1,284", delta: "+42 this week", deltaColor: "var(--color-accent)" },
  { id: "engagement", label: "Engagement rate", value: "78%", delta: "+4.2% MoM", deltaColor: "var(--color-accent)" },
  { id: "gap", label: "Top skill gap", value: "Exec presence", delta: "34% of cohort", deltaColor: "var(--color-amber)" },
  { id: "placement", label: "Placement probability", value: "0.71", delta: "within 12 months", deltaColor: "var(--color-muted)" },
];

export const CHART_DATA: Record<MetricId, number[]> = {
  engagement: [62, 64, 63, 67, 71, 70, 73, 75, 74, 76, 78, 78],
  users: [820, 880, 920, 970, 1020, 1080, 1110, 1150, 1180, 1220, 1260, 1284],
  gap: [42, 41, 40, 39, 38, 37, 36, 35, 35, 34, 34, 34],
  placement: [0.58, 0.6, 0.61, 0.63, 0.64, 0.66, 0.67, 0.68, 0.69, 0.7, 0.7, 0.71],
};

export const MEMBER_THEMES = [
  { theme: "Visibility & cross-fn reach", count: 7, weight: 0.42 },
  { theme: "Negotiation prep", count: 4, weight: 0.24 },
  { theme: "Public artifacts", count: 3, weight: 0.18 },
  { theme: "Manager dynamics", count: 2, weight: 0.12 },
  { theme: "Pivot exploration", count: 1, weight: 0.04 },
];
