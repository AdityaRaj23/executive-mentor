import type { Milestone } from "@/types";

// Empty by default — milestones are generated per-user from their first-year
// diagnostic via /api/roadmap/generate. SEED_MILESTONES exists as a typed
// fallback for the brief moment before hydration completes.
export const SEED_MILESTONES: Milestone[] = [];
