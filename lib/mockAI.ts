// Mock AI module — replaces window.claude.complete from the prototype.
// Inspects the prompt for fingerprints, dispatches to a fixture, returns
// the same shape the prototype's parsers expect.

const CONSOLE_REPLIES: { header: string; body: string; deltas: { label: string; delta: number }[]; signal?: string }[] = [
  {
    header: "Director track is reachable, but lopsided.",
    body: "Your IC depth is uncommonly strong, but you're carrying it like a moat instead of a ladder. The next two years should trade some pure-engineering depth for visible cross-functional reach. Three concrete moves: shadow a platform PM for six weeks (gets you the strategy vocabulary), publish one RFC outside billing (proves you can frame at the platform level), and co-host the monthly arch review (board-adjacent visibility without performative effort). The system here is the same one that decides VPs in five years.",
    deltas: [
      { label: "Cross-fn reach", delta: 4 },
      { label: "Executive presence", delta: 3 },
    ],
    signal: "Anchors goals to artifacts more than titles",
  },
  {
    header: "Pivots compound; titles don't transfer.",
    body: "The leverage you've built is more portable than the org chart suggests. Distributed-systems fluency translates directly into product-platform PM, infra-adjacent investing, or founder-CTO roles — the underlying skill is system decomposition, not Java. The risk in pivoting is losing one year of compounding momentum; the reward is exiting a five-year ceiling. Pick the pivot that recycles 70% of your current reps. Anything less is a restart.",
    deltas: [
      { label: "Org design", delta: 3 },
    ],
    signal: "Reasons through optionality before identity",
  },
  {
    header: "The leverage is yours; ask for it.",
    body: "You have the data, you just haven't priced it. Comp negotiations turn on three numbers: replacement cost (what they'd pay externally for your stack), revenue or risk you absorb (find a number you've moved), and your floor (the offer you'd take if they hold). Walk in with all three and a quiet 24-hour deadline. The sentence that does most of the work is: \"I want to stay; here's what I need to make that the obvious choice.\"",
    deltas: [
      { label: "Executive presence", delta: 5 },
    ],
    signal: "Treats negotiation as information design, not confrontation",
  },
  {
    header: "Visibility is an artifact problem.",
    body: "The reason your manager turnover is blocking promo signal is that your work doesn't survive without a narrator. Fix it at the artifact layer, not the politics layer. One technical talk per quarter, one public RFC, one named hire on your tree. These compound across manager changes — politics doesn't. Eighteen months of artifacts beats five years of relationships you didn't choose.",
    deltas: [
      { label: "Hiring & retention", delta: 2 },
      { label: "Executive presence", delta: 2 },
    ],
    signal: "Treats artifacts as durable infrastructure for career signal",
  },
];

const REPLAN_FIXTURES: Record<string, { year: string; quarter: string; title: string; body: string; skills: string[] }[]> = {
  layoff: [
    { year: "2026", quarter: "Q3", title: "Bridge contract — staff infra", body: "Three-month senior contract at a Series B platform co. Cash flow, network, story.", skills: ["Adaptability", "Senior IC delivery"] },
    { year: "2027", quarter: "Q2", title: "Founding engineer · seed startup", body: "Equity-heavy founding role. Use the pause to choose a domain you'd compound for ten years.", skills: ["0→1 building", "Equity literacy"] },
    { year: "2028", quarter: "Q4", title: "Tech lead → CTO ladder", body: "Either the seed company succeeds and you're early CTO, or the next move is Director at a defended company with the founding-eng narrative.", skills: ["Ownership", "Founder fluency"] },
  ],
  pivot: [
    { year: "2026", quarter: "Q4", title: "Internal transfer to platform PM", body: "Use existing manager equity to land an APM/PM rotation. Six months to prove the synthesis muscle.", skills: ["Product framing", "Stakeholder mgmt"] },
    { year: "2027", quarter: "Q3", title: "Senior PM · platform team", body: "Lead a multi-team initiative end-to-end. The story becomes engineer-turned-PM, not lateral mover.", skills: ["Roadmap ownership", "Cross-fn reach"] },
    { year: "2028", quarter: "Q4", title: "Group PM · platform", body: "Scope up. The combined eng+PM stack becomes the rare profile that runs platform orgs at the next stage.", skills: ["People leadership", "Strategic depth"] },
  ],
  indie: [
    { year: "2026", quarter: "Q4", title: "Soft launch · paid product", body: "One product, one pricing page, ten paying customers. Keep day job; prove demand before commitment.", skills: ["Product instinct", "Sales muscle"] },
    { year: "2027", quarter: "Q2", title: "Full indie · MRR > 8k", body: "Detach from W-2. Replace 60% of base from product revenue plus consulting bridge.", skills: ["Business literacy", "Marketing reps"] },
    { year: "2028", quarter: "Q3", title: "Studio of one (or sell)", body: "Either the product is durable and you compound; or the exercise produces a narrative and skill stack that lands a Director role with operator credibility.", skills: ["Optionality", "Executive narrative"] },
  ],
  default: [
    { year: "2026", quarter: "Q4", title: "Strategic re-orientation", body: "A 90-day reset to choose between depth and breadth before locking the next two years.", skills: ["Self-direction", "Decision hygiene"] },
    { year: "2027", quarter: "Q3", title: "Visible execution role", body: "A scoped, board-adjacent project that creates the artifact for the next move.", skills: ["Execution under scrutiny", "Public artifacts"] },
    { year: "2028", quarter: "Q4", title: "Director-track candidate", body: "Re-enter the original arc with a richer story — same destination, more durable narrative.", skills: ["Executive presence", "Org design"] },
  ],
};

const TALENT_STACK: Record<string, unknown> = {
  builder: {
    headline: "You have the rare combination of patience for systems thinking, energy for shipping, and willingness to learn in public — most fresh grads only have one.",
    strengths: [
      { label: "Shipping cadence", evidence: "You named losing time to building — that's the rep that compounds into a senior IC career." },
      { label: "Systems literacy", evidence: "Your background gives you the structural vocabulary most product-side grads lack." },
      { label: "Comfort with ambiguity", evidence: "You picked a high-variance archetype with eyes open — that's selection-resistance most peers don't have." },
      { label: "Practical autodidact", evidence: "You frame learning as artifacts, not credentials — that's the underlying engine of an IC career." },
    ],
    latent: [
      { label: "Storytelling around technical work", why: "Builders who narrate their work compound 3× faster — you have raw material; the muscle is missing." },
      { label: "Hiring instinct", why: "You haven't hired anyone yet, but your taste in collaborators is already sharper than most senior ICs." },
    ],
    weak_signals_to_strengthen: [
      { label: "Public surface area", first_step: "Publish one technical write-up this month — even rough. The act creates the artifact." },
      { label: "Cross-functional vocabulary", first_step: "Attend two PM/design rituals at your company and write a one-page synthesis." },
    ],
  },
  synthesizer: {
    headline: "You combine pattern-matching speed with comfort moving across rooms — a profile that 80% of fresh grads can't articulate they have.",
    strengths: [
      { label: "Cross-domain fluency", evidence: "You named connecting people and ideas — the substrate of every senior strategy career." },
      { label: "Stakeholder calm", evidence: "Your background suggests time spent translating between groups — already a senior-track skill." },
      { label: "Frameworks instinct", evidence: "You reach for structure rather than detail when overwhelmed — that's a post-grad muscle most lack." },
      { label: "Generalist comfort", evidence: "You don't need to be the deepest in any room — you stay valuable by being the most connective." },
    ],
    latent: [
      { label: "Domain-specific depth", why: "Synthesizers who pick one specialty before age 30 outpace pure generalists 5:1 in compensation." },
      { label: "Public synthesis", why: "Your write-ups and decks are likely better than you think; the audience is the missing input." },
    ],
    weak_signals_to_strengthen: [
      { label: "Narrative artifact production", first_step: "Write one essay or memo this month framing a domain you've observed — publish it somewhere." },
      { label: "Operating reps", first_step: "Volunteer to own one process end-to-end at your next role — even a small one." },
    ],
  },
  analyst: {
    headline: "You have the rare combination of comfort with long debug loops, statistical instinct, and willingness to publish — that's the analyst spine 90% of fresh grads can't sustain.",
    strengths: [
      { label: "Patience for depth", evidence: "You named losing time to a question — the operative skill in research and quant careers." },
      { label: "Pattern recognition", evidence: "You're drawn to truth-in-noise problems — that's the right gravity well for a research career." },
      { label: "Quantitative comfort", evidence: "You frame problems numerically without reaching for metaphor — already past where most grads are." },
      { label: "Calm under uncertainty", evidence: "You picked a domain with delayed feedback — most peers can't tolerate the wait." },
    ],
    latent: [
      { label: "Research communication", why: "The next-tier analyst careers are made by people who can translate research into narrative — a skill you can build now." },
      { label: "Tool-building instinct", why: "Analysts who write their own infra outpace pure consumers of tooling 4×." },
    ],
    weak_signals_to_strengthen: [
      { label: "Publication rhythm", first_step: "Pick one substack or blog and commit to one analysis post per month for six months." },
      { label: "Domain mentor", first_step: "Cold-email two senior researchers in your area; offer to do free analysis in exchange for one hour." },
    ],
  },
  storyteller: {
    headline: "You combine voice, audience instinct, and willingness to ship in public — the rarest stack among fresh grads, and the one most peers will dismiss until you compound.",
    strengths: [
      { label: "Voice instinct", evidence: "You named telling the story — most grads can't even identify that as a vocational signal." },
      { label: "Audience empathy", evidence: "You frame ideas around the listener rather than the speaker — already a senior content skill." },
      { label: "Cadence comfort", evidence: "You're drawn to publishing rhythms — the engine that turns voice into career." },
      { label: "Editing sensibility", evidence: "Your filter for what to leave out is sharper than most early peers'." },
    ],
    latent: [
      { label: "Domain expertise", why: "Storytellers with a beat outpace generalists 10:1; you'll need to claim one within 18 months." },
      { label: "Business literacy", why: "The career-defining moves in content all involve the economics — most peers ignore them too long." },
    ],
    weak_signals_to_strengthen: [
      { label: "Public archive", first_step: "Pick a platform, ship 12 pieces this year — the archive is the leverage, not any one piece." },
      { label: "Editing under deadline", first_step: "Volunteer for one piece per month at a publication or newsletter — the constraint is the teacher." },
    ],
  },
  operator: {
    headline: "You combine comfort with ambiguity, calm under storm, and instinct for ownership — a profile that operators four years out of school would recognize as their own.",
    strengths: [
      { label: "Process instinct", evidence: "You named running the operation — most grads can't even see operations as a discipline." },
      { label: "Calm authority", evidence: "Your answers suggest you stay regulated under conditions that destabilize peers." },
      { label: "Ownership reflex", evidence: "You don't wait to be assigned the gap — you fill it. Already a senior-track behavior." },
      { label: "Spreadsheet literacy", evidence: "You're comfortable with the unglamorous half of operating — the part most peers avoid." },
    ],
    latent: [
      { label: "Strategic communication", why: "Operators promoted to COO are the ones who can frame ops decisions to the board — most underrate this." },
      { label: "Recruiting instinct", why: "Your taste in collaborators is already informing hires — name that as part of the stack." },
    ],
    weak_signals_to_strengthen: [
      { label: "Cross-functional reach", first_step: "Volunteer to own one cross-team process at your next role — the recurring kind, not a project." },
      { label: "Written narrative", first_step: "Write one quarterly operating review on a function you observe — even unsolicited. It builds the muscle." },
    ],
  },
  crafter: {
    headline: "You combine taste, patience for reps, and willingness to study masters — that's the rarest craft profile among grads who haven't yet realized it's a career.",
    strengths: [
      { label: "Taste calibration", evidence: "You named going deep alone — most peers can't stay in a craft long enough to develop taste." },
      { label: "Reps tolerance", evidence: "You're drawn to long iteration cycles, the substrate of every craft career." },
      { label: "Self-critique", evidence: "You're harder on your own work than most peers — the engine of craft compounding." },
      { label: "Reference-building habit", evidence: "You collect work you admire — already a senior craft behavior." },
    ],
    latent: [
      { label: "Public visibility", why: "The craft careers that compound require a portfolio and a name; most crafters undervalue the publishing half." },
      { label: "Teaching instinct", why: "You'll likely teach within five years; building the muscle now creates a second career layer." },
    ],
    weak_signals_to_strengthen: [
      { label: "Mentor relationship", first_step: "Identify three masters in your craft within reach; commit to one apprenticeship-style coffee per quarter." },
      { label: "Process documentation", first_step: "Document your process for one piece this month — public or private. Builds the teaching layer." },
    ],
  },
};

const THIRTY_DAY: Record<string, unknown> = {
  builder: {
    north_star: "By day 30 you have one shipped artifact a senior engineer would link to.",
    ship_one_thing: {
      title: "A working tool that solves your own problem",
      why: "Builders who ship for themselves first compound; theoretical projects don't.",
      first_three_steps: [
        "Pick the daily annoyance that costs you the most time",
        "Write the README before the code — define done",
        "Ship a v0 by Friday of week 1, even if ugly",
      ],
    },
    talk_to_five: [
      { who: "A senior IC at a company you'd want to join in two years", how: "DM with one specific question about a problem they wrote about" },
      { who: "A founding engineer of a Series A startup", how: "Coffee request; lead with what you're building, not what you want" },
      { who: "An indie hacker shipping their own product", how: "Cold email referencing a specific decision in their build log" },
      { who: "A staff engineer at a defended company", how: "Ask about the scope of their last RFC, not their career" },
      { who: "A grad-school friend who chose a different path", how: "Compare reps; calibrate against someone with similar starting conditions" },
    ],
    two_applications: [
      { target: "New-grad SWE at a company you'd want to be senior at in five years", where: "Stripe, Figma, Linear, Vercel, Anthropic" },
      { target: "Founding engineer · seed/Series A", where: "YC's Work at a Startup; warm intros from your strongest 1:1" },
    ],
    weekly_micro: [
      "Open a public repo for the week's project; first commit by Wednesday",
      "Write one technical post about what you shipped",
      "Send three DMs to senior ICs whose work you respect",
      "Book one in-person coffee with someone two career steps ahead",
    ],
  },
  synthesizer: {
    north_star: "By day 30 you have one published synthesis that someone senior reposts.",
    ship_one_thing: {
      title: "A 1500-word memo connecting two domains you've observed",
      why: "Synthesizers compound through written framing; the artifact is the resume.",
      first_three_steps: [
        "Pick two domains you've moved between and find the structural overlap",
        "Outline the memo in five sections before writing prose",
        "Publish on Substack or LinkedIn; tag two senior practitioners as a callback",
      ],
    },
    talk_to_five: [
      { who: "An APM at a tier-1 program", how: "Coffee; ask what the program selects for, not how to apply" },
      { who: "A chief of staff at a Series B startup", how: "DM with a specific framing question about their scope" },
      { who: "A management consultant 2-4 years in", how: "Ask about the case style they use most, and which they've discarded" },
      { who: "A founder who started in strategy", how: "One question: what's the strategy skill they regret not building earlier" },
      { who: "A VC associate", how: "Bring an investment thesis on a sector you're curious about; ask for redirection" },
    ],
    two_applications: [
      { target: "APM program at a defining company", where: "Stripe, Figma, Asana, Anthropic, Notion" },
      { target: "Chief of staff to a fast-growing exec", where: "Sequoia and Founders Fund portfolio jobs boards; warm intros" },
    ],
    weekly_micro: [
      "Read two long-form pieces from outside your default discipline",
      "Outline the synthesis memo and send to one trusted reviewer",
      "Publish the memo and DM two senior practitioners to ask for one critique",
      "Book one in-person conversation with a generalist five years ahead of you",
    ],
  },
  analyst: {
    north_star: "By day 30 you have one shipped analysis a senior researcher would cite.",
    ship_one_thing: {
      title: "A reproducible analysis on a question that bugs you",
      why: "Analysts compound through artifacts that other analysts can run; opinions don't compound.",
      first_three_steps: [
        "Pick a public dataset and a question worth ten hours of attention",
        "Write the methodology section before touching data",
        "Publish notebook + post by end of week 2; iterate after critique",
      ],
    },
    talk_to_five: [
      { who: "A senior data scientist at a company you respect", how: "Cold email with a one-paragraph methodology critique of one of their posts" },
      { who: "A researcher at a top AI lab", how: "DM with a specific question about a paper, not a career question" },
      { who: "A quant trader 3-5 years in", how: "Reach via mutual; ask about the math they wish they'd known earlier" },
      { who: "An academic who left for industry", how: "Coffee; ask what compounds in industry that academia underestimates" },
      { who: "A peer one year ahead of you on the analyst track", how: "Calibration call; trade reps and resources" },
    ],
    two_applications: [
      { target: "Data analyst / DS new-grad at a defended company", where: "Stripe, Coinbase, Datadog, Anthropic" },
      { target: "Research associate / lab residency", where: "Anthropic, OpenAI residency, FAIR, DeepMind, top quant funds" },
    ],
    weekly_micro: [
      "Pick the dataset and write the question down in 200 words",
      "Run the first cut analysis; share with one mentor for early critique",
      "Publish the analysis with notebook attached",
      "Reach out to two researchers whose work informed yours; thank with the link",
    ],
  },
  storyteller: {
    north_star: "By day 30 you have a public publishing rhythm and 4 pieces shipped.",
    ship_one_thing: {
      title: "A weekly publication on a beat you can hold for a year",
      why: "Storytellers compound through cadence and beat — not virality.",
      first_three_steps: [
        "Pick one beat narrow enough to defend, broad enough to write 50 pieces about",
        "Set up the publishing surface (Substack / personal site) by Wednesday",
        "Ship the first piece by Sunday of week 1; do not edit it past competent",
      ],
    },
    talk_to_five: [
      { who: "A working journalist on your beat", how: "Pitch one tip; do not lead with wanting their job" },
      { who: "A successful Substack writer", how: "Subscribe, comment substantively, then DM with one craft question" },
      { who: "A DevRel or content lead at a company you respect", how: "Coffee; ask about the metrics they care about that aren't pageviews" },
      { who: "A brand strategist at a defining company", how: "Ask about the move they made that shifted brand voice" },
      { who: "An editor at a publication you read", how: "Pitch a piece; the answer is more useful than the access" },
    ],
    two_applications: [
      { target: "DevRel / content role at a fast-growing co", where: "Vercel, Linear, Stripe, Anthropic, Cursor" },
      { target: "Newsroom fellowship or brand role", where: "The Verge, Stratechery (assistant), top startup brand teams" },
    ],
    weekly_micro: [
      "Set up the publication; write the first piece",
      "Ship piece two; reach out to one peer storyteller for trade-critique",
      "Ship piece three; pitch one publication for a guest post",
      "Ship piece four; draft a quarterly editorial calendar",
    ],
  },
  operator: {
    north_star: "By day 30 you've owned one process end-to-end and have a writeup of how you ran it.",
    ship_one_thing: {
      title: "A documented process improvement on something running today",
      why: "Operators compound through ownership artifacts; theoretical frameworks don't.",
      first_three_steps: [
        "Pick a recurring process at your job or community that's mildly broken",
        "Document current state in 500 words; design the improvement in another 500",
        "Implement; track results for two weeks; publish the writeup",
      ],
    },
    talk_to_five: [
      { who: "A head of ops at a Series B startup", how: "Coffee; ask about the metric they own that nobody else watches" },
      { who: "A chief of staff", how: "DM with a specific question about their cadence" },
      { who: "A senior recruiter", how: "Ask about the trade-offs in their pipeline that the engineers underestimate" },
      { who: "A finance lead at a fast-growing co", how: "Bring a question about unit economics, not careers" },
      { who: "A peer operator one year ahead of you", how: "Trade calibration; what's working, what isn't" },
    ],
    two_applications: [
      { target: "BizOps / strategy ops at a hypergrowth co", where: "Stripe, Ramp, Anthropic, Brex, Notion" },
      { target: "Ops rotation program", where: "Top consulting ops practices, top startup rotation programs" },
    ],
    weekly_micro: [
      "Pick the process; document current state",
      "Design the improvement; pre-circulate to one stakeholder",
      "Implement; track the two metrics that matter",
      "Publish the writeup; offer to run another process next quarter",
    ],
  },
  crafter: {
    north_star: "By day 30 you have one piece of work in your portfolio that meets your taste.",
    ship_one_thing: {
      title: "A single piece of craft you're proud to show",
      why: "Crafters compound through taste; one excellent piece beats ten average ones.",
      first_three_steps: [
        "Pick the project narrow enough that one month of focused work makes it excellent",
        "Spend week 1 in reference and study; do not start work yet",
        "Ship by end of month; critique honestly; do not over-polish",
      ],
    },
    talk_to_five: [
      { who: "A senior IC in your craft at a top firm", how: "Coffee; bring three pieces of their work and one question about each" },
      { who: "A solo studio of one practitioner", how: "Ask about the early years; what they'd tell their younger self" },
      { who: "A teacher in your craft (formal or informal)", how: "Audit one of their critiques if accessible; ask one question after" },
      { who: "A peer one craft level ahead of you", how: "Trade work-in-progress; learn faster from peers than masters" },
      { who: "A client or buyer of your craft", how: "Listen for the language they use about quality — that's the market signal" },
    ],
    two_applications: [
      { target: "Apprenticeship at a small studio known for craft", where: "Studios you've referenced; cold email with three pieces of your work" },
      { target: "Senior IC under a master", where: "Top design / engineering teams that take juniors; specific people first" },
    ],
    weekly_micro: [
      "Reference week — gather 50 examples and three obsessions",
      "Begin the piece; show work-in-progress to two trusted critics",
      "Iterate; cut everything that doesn't meet your bar",
      "Publish the piece; write a 200-word reflection on what you learned",
    ],
  },
};

const ARCHETYPE_NAMES: { id: string; needle: string }[] = [
  { id: "builder", needle: "The Builder" },
  { id: "synthesizer", needle: "The Synthesizer" },
  { id: "analyst", needle: "The Analyst" },
  { id: "storyteller", needle: "The Storyteller" },
  { id: "operator", needle: "The Operator" },
  { id: "crafter", needle: "The Craftsperson" },
];

function pickArchetype(prompt: string): string {
  const hit = ARCHETYPE_NAMES.find((a) => prompt.includes(a.needle));
  return hit?.id ?? "builder";
}

function pickConsoleReply() {
  return CONSOLE_REPLIES[Math.floor(Math.random() * CONSOLE_REPLIES.length)];
}

function dispatch(prompt: string): string {
  // FirstYear talent stack
  if (prompt.includes('"strengths"') && prompt.includes('"latent"')) {
    const id = pickArchetype(prompt);
    return JSON.stringify(TALENT_STACK[id] ?? TALENT_STACK.builder);
  }
  // FirstYear 30-day brief
  if (prompt.includes('"north_star"')) {
    const id = pickArchetype(prompt);
    return JSON.stringify(THIRTY_DAY[id] ?? THIRTY_DAY.builder);
  }
  // Roadmap re-plan
  if (prompt.includes("Output ONLY a JSON array")) {
    const lower = prompt.toLowerCase();
    let key = "default";
    if (lower.includes("layoff") || lower.includes("laid off")) key = "layoff";
    else if (lower.includes("pivot") || lower.includes("pm")) key = "pivot";
    else if (lower.includes("indie") || lower.includes("solo") || lower.includes("consult")) key = "indie";
    return JSON.stringify(REPLAN_FIXTURES[key]);
  }
  // Console with structured dossier tail
  if (prompt.includes("<<<DOSSIER>>>")) {
    const r = pickConsoleReply();
    const tail = JSON.stringify({
      skill_deltas: r.deltas,
      new_signal: r.signal ?? null,
    });
    return `${r.header}\n\n${r.body}\n<<<DOSSIER>>>${tail}<<<END>>>`;
  }
  // Default boardroom-voice reply
  const r = pickConsoleReply();
  return `${r.header}\n\n${r.body}`;
}

async function delay() {
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 600));
}

export const claude = {
  async complete(opts: { messages: { role: "user"; content: string }[] }): Promise<string> {
    const prompt = opts.messages.map((m) => m.content).join("\n");
    await delay();
    return dispatch(prompt);
  },
};
