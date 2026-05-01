import type { Archetype } from "@/types";

export const DIAGNOSTIC = [
  { id: "background", q: "What did you study, and where do you start from?", placeholder: "CS, BFA, mechanical eng, self-taught, bootcamp — anything goes.", kind: "text" as const },
  { id: "lostInTime", q: "When have you most lost track of time?", placeholder: "Be specific — what were you doing, what hooked you?", kind: "text" as const },
  { id: "energy", q: "What energizes you in a group?", placeholder: "", kind: "choice" as const, options: [
    "Building the thing",
    "Connecting people & ideas",
    "Finding patterns in data",
    "Telling the story",
    "Running the operation",
    "Going deep alone",
  ] },
  { id: "stakes", q: "What kind of risk feels like home right now?", placeholder: "", kind: "choice" as const, options: [
    "Salary & stability — I need to land",
    "Steady job, but learning fast",
    "Lower pay, faster growth",
    "High variance — I want a shot",
  ] },
  { id: "constraints", q: "Any hard constraints I should know?", placeholder: "Geography, visa, family, debt, health — be honest.", kind: "text" as const },
];

export const ARCHETYPES: Archetype[] = [
  {
    id: "builder", label: "The Builder", tag: "Make it real",
    blurb: "Compounds through artifacts. Best year-1 move: ship something visible.",
    yr1: "Junior eng / IC at fast-growing co or solo project shipping monthly.",
    yr5: "Senior IC, tech lead, or indie founder with a portfolio of shipped work.",
    yr10: "Staff engineer, CTO of a small co, or built something that pays you forever.",
    salary: "$70–110k → $180–350k",
    daily: "Heads-down work, code reviews, design docs, occasional war rooms.",
    examplePeople: "Jane Manchun Wong, Pieter Levels, early-career Patrick McKenzie",
    entry: ["New-grad SWE", "Founding engineer (seed/Series A)", "Build-in-public solo"],
    skills: ["Shipping cadence", "Systems thinking", "Async writing"],
  },
  {
    id: "synthesizer", label: "The Synthesizer", tag: "Connect the dots",
    blurb: "Compounds through cross-disciplinary range. Best year-1 move: get into rooms.",
    yr1: "APM / strategy / chief-of-staff / consulting analyst — generalist on purpose.",
    yr5: "PM, BizOps lead, founder, or strategy at a defining company.",
    yr10: "GM, founder, VC partner, or operator-investor.",
    salary: "$80–130k → $220–500k",
    daily: "Meetings, frameworks, decks, glue work, negotiation.",
    examplePeople: "Shishir Mehrotra (early), Lulu Cheng Meservey, generalists at Stripe",
    entry: ["APM programs (Stripe / Figma / Asana)", "Mgmt consulting", "Chief of staff role", "Ops at hypergrowth co"],
    skills: ["Frameworks", "Stakeholder mgmt", "Synthesis writing"],
  },
  {
    id: "analyst", label: "The Analyst", tag: "Find the truth in noise",
    blurb: "Compounds through depth on a hard question. Best year-1 move: pick a domain.",
    yr1: "Data analyst, quant, research assoc, ML eng, equity research.",
    yr5: "Senior DS, quant trader, ML lead, founding research engineer.",
    yr10: "Director of research, partner at a quant fund, lab founder.",
    salary: "$85–140k → $250–700k",
    daily: "Notebooks, models, papers, long debug loops, focused calm.",
    examplePeople: "Chris Olah, Erika Cheung, early Renaissance quants",
    entry: ["Quant trading desks", "AI lab residencies", "Data team at a tier-1 co"],
    skills: ["Statistical literacy", "Model intuition", "Patience"],
  },
  {
    id: "storyteller", label: "The Storyteller", tag: "Make people care",
    blurb: "Compounds through audience. Best year-1 move: publish weekly, in public.",
    yr1: "Content / brand / DevRel / journalist / designer-writer hybrid.",
    yr5: "Head of content, brand lead, columnist, popular newsletter author.",
    yr10: "CMO, editor-in-chief, owns a media property, or sells thought-leadership.",
    salary: "$55–95k → $150–400k",
    daily: "Drafting, interviewing, reviewing, performing, publishing rhythms.",
    examplePeople: "Casey Newton, Packy McCormick (early), early Anu Atluru",
    entry: ["DevRel / dev-marketing", "Newsroom fellowships", "Brand at fast-growing co"],
    skills: ["Voice", "Cadence", "Editing"],
  },
  {
    id: "operator", label: "The Operator", tag: "Make systems run",
    blurb: "Compounds through ownership. Best year-1 move: own one process end-to-end.",
    yr1: "Ops, recruiting, finance, customer success, program mgmt.",
    yr5: "Head of Ops / People / Finance, COO of a small startup.",
    yr10: "COO, CFO, GM of a major business unit, or your own services firm.",
    salary: "$65–105k → $200–450k",
    daily: "Dashboards, 1:1s, escalations, processes, calm-in-storms.",
    examplePeople: "Claire Hughes Johnson, early Bret Taylor (ops side)",
    entry: ["Ops rotation programs", "BizOps at a hypergrowth co", "CS / recruiting"],
    skills: ["Process design", "Calm authority", "Spreadsheets"],
  },
  {
    id: "crafter", label: "The Craftsperson", tag: "Master one thing deeply",
    blurb: "Compounds through taste. Best year-1 move: study the masters, ship daily.",
    yr1: "Apprentice / junior at a place known for craft (small studio, top team).",
    yr5: "Senior IC at a top firm, or own studio with reputation.",
    yr10: "Acknowledged master of craft — hire-of-record in your domain.",
    salary: "$55–95k → $180–400k",
    daily: "Long tool-time, critique, iteration, reference-building.",
    examplePeople: "Frank Chimero, Jonas Downey, master IC engineers",
    entry: ["Top-tier studio apprenticeship", "Senior IC mentorship", "Solo studio"],
    skills: ["Taste", "Reps", "Self-critique"],
  },
];

export function rankArchetypes(ans: { energy?: string; stakes?: string }): Archetype[] {
  const e = ans.energy || "";
  const s = ans.stakes || "";
  const weights = ARCHETYPES.map((a) => ({ ...a, w: 0 }));
  const bump = (id: string, n: number) => {
    const m = weights.find((x) => x.id === id);
    if (m) m.w += n;
  };

  if (e.startsWith("Building")) { bump("builder", 3); bump("crafter", 2); }
  if (e.startsWith("Connecting")) { bump("synthesizer", 3); bump("storyteller", 1); bump("operator", 1); }
  if (e.startsWith("Finding")) { bump("analyst", 3); bump("builder", 1); }
  if (e.startsWith("Telling")) { bump("storyteller", 3); bump("synthesizer", 1); }
  if (e.startsWith("Running")) { bump("operator", 3); bump("synthesizer", 1); }
  if (e.startsWith("Going deep")) { bump("crafter", 3); bump("analyst", 2); bump("builder", 1); }

  if (s.startsWith("Salary")) { bump("operator", 1); bump("analyst", 1); }
  if (s.startsWith("High variance")) { bump("builder", 1); bump("synthesizer", 1); bump("storyteller", 1); }

  weights.forEach((w, i) => (w.w += i * 0.01));
  return weights.sort((a, b) => b.w - a.w).map(({ w: _w, ...rest }) => rest);
}
