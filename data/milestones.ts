import type { Milestone } from "@/types";

export const SEED_MILESTONES: Milestone[] = [
  { id: 1, year: "2021", quarter: "Q1", side: "left", title: "Joined as L4 Engineer", body: "Platform infrastructure team. First 90 days focused on core service reliability.", skills: ["Distributed systems", "On-call ops"], status: "done" },
  { id: 2, year: "2022", quarter: "Q3", side: "right", title: "Promoted to Senior Engineer", body: "Owned migration of legacy queue infra. Mentored two new hires.", skills: ["Mentorship", "Migration design"], status: "done" },
  { id: 3, year: "2024", quarter: "Q2", side: "left", title: "Tech Lead — billing platform", body: "Cross-team RFC on idempotency. First exposure to product leadership.", skills: ["RFC authorship", "Product partnership"], status: "done" },
  { id: 4, year: "2026", quarter: "Q2", side: "right", title: "Now · Audit your reach", body: "M recommends a 6-week cross-functional shadow rotation with platform-PM and design-systems before pursuing Staff.", skills: ["Cross-fn reach", "Visibility"], status: "current", tasks: ["Shadow platform PM for 6 weeks", "Publish one RFC outside billing", "Co-host monthly arch review"] },
  { id: 5, year: "2027", quarter: "Q1", side: "left", title: "Staff Engineer track", body: "Visible artifact (talk, RFC, OSS) plus a hiring tree of 3+. Performance signal: drives a multi-team initiative.", skills: ["Public brand", "Hiring"], status: "future" },
  { id: 6, year: "2028", quarter: "Q3", side: "right", title: "Director of Platform Eng", body: "Leads 25+ org. Owns roadmap for billing + identity. Board-level visibility on availability metrics.", skills: ["Org design", "Executive presence"], status: "future" },
];
