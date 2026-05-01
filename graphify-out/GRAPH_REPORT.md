# Graph Report - .  (2026-05-02)

## Corpus Check
- 105 files · ~62,815 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 569 nodes · 636 edges · 38 communities detected
- Extraction: 83% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Sandbox App + Tweaks Panel|Sandbox App + Tweaks Panel]]
- [[_COMMUNITY_Sandbox AI Concepts|Sandbox AI Concepts]]
- [[_COMMUNITY_Production Screen Components|Production Screen Components]]
- [[_COMMUNITY_Career Archetypes Data|Career Archetypes Data]]
- [[_COMMUNITY_Cohort Intelligence Dashboard|Cohort Intelligence Dashboard]]
- [[_COMMUNITY_AI Console Chat|AI Console Chat]]
- [[_COMMUNITY_First Year AI Pipeline + Clerk Auth|First Year AI Pipeline + Clerk Auth]]
- [[_COMMUNITY_Roadmap Cards & UI Primitives|Roadmap Cards & UI Primitives]]
- [[_COMMUNITY_Sandbox App Components|Sandbox App Components]]
- [[_COMMUNITY_Sandbox Console Components|Sandbox Console Components]]
- [[_COMMUNITY_Sandbox Dashboard Components|Sandbox Dashboard Components]]
- [[_COMMUNITY_Sandbox First-Year Components|Sandbox First-Year Components]]
- [[_COMMUNITY_Sandbox Landing Components|Sandbox Landing Components]]
- [[_COMMUNITY_Sandbox Roadmap Components|Sandbox Roadmap Components]]
- [[_COMMUNITY_Landing Page Composition|Landing Page Composition]]
- [[_COMMUNITY_Shared UI Primitives|Shared UI Primitives]]
- [[_COMMUNITY_First-Year Onboarding Flow|First-Year Onboarding Flow]]
- [[_COMMUNITY_First-Year Generate Route (4 prompts)|First-Year Generate Route (4 prompts)]]
- [[_COMMUNITY_Project Setup & Tooling|Project Setup & Tooling]]
- [[_COMMUNITY_Mock AI Dispatcher|Mock AI Dispatcher]]
- [[_COMMUNITY_Tweak Themes|Tweak Themes]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 101|Community 101]]
- [[_COMMUNITY_Community 102|Community 102]]
- [[_COMMUNITY_Community 103|Community 103]]
- [[_COMMUNITY_Community 104|Community 104]]
- [[_COMMUNITY_Community 105|Community 105]]
- [[_COMMUNITY_Community 106|Community 106]]
- [[_COMMUNITY_Community 107|Community 107]]

## God Nodes (most connected - your core abstractions)
1. `Executive Mentor.html (sandbox root, /test/project)` - 16 edges
2. `App root component (hash router)` - 14 edges
3. `Sandbox App entry (router + Tweaks)` - 14 edges
4. `ConsoleScreen` - 14 edges
5. `design.md (Executive Mentor brief)` - 14 edges
6. `ConsoleScreen (split chat + dossier)` - 11 edges
7. `DashboardScreen` - 11 edges
8. `ARCHETYPES (6 career archetypes)` - 11 edges
9. `ConsoleScreen (mentor chat + dossier)` - 10 edges
10. `DashboardScreen (admin macro)` - 9 edges

## Surprising Connections (you probably didn't know these)
- `ESLint Config` --lints_for--> `Next.js framework`  [INFERRED]
  eslint.config.mjs → README.md
- `Executive Mentor product (sandbox prototype)` --prototype_of--> `Production Next.js app (app/ in repo root)`  [AMBIGUOUS]
  test/project/export/src/src/app.jsx → app/page.tsx
- `FirstYearScreen dynamic import` --likely_consumes--> `DiagnosticAnswers interface`  [INFERRED]
  app/first-year/page.tsx → types/index.ts
- `ConsoleScreen dynamic import` --likely_consumes--> `boardroom voice`  [INFERRED]
  app/console/page.tsx → lib/voice.ts
- `Screen spec: Landing Pitch` --implemented_by--> `LandingScreen`  [INFERRED]
  test/project/uploads/design.md → test/project/export/src/src/landing.jsx

## Hyperedges (group relationships)
- **** —  [EXTRACTED 0.94]
- **** —  [EXTRACTED 0.93]
- **** —  [EXTRACTED 0.94]
- **** —  [EXTRACTED 0.96]
- **** —  [EXTRACTED 0.96]
- **** —  [EXTRACTED 0.95]
- **** — timeline_component, card_component, altcard_component [EXTRACTED 1.00]
- **** — roadmapscreen_component, timeline_component, detailpanel_component [EXTRACTED 1.00]
- **** — roadmapscreen_component, replanmodal_component, roadmapscreen_replan [EXTRACTED 1.00]
- **Dashboard Screen Composition** —  [high 0.95]
- **Cohort/Skills View Switch** —  [high 0.90]
- **Drilldown Sectioned Blocks** —  [high 0.92]
- **Dossier side panel composition** —  [EXTRACTED 1.00]
- **Console chat shell composition** —  [EXTRACTED 1.00]
- **Message rendering trio** —  [INFERRED 0.90]
- **** —  [INFERRED 0.90]
- **First Year Gemini endpoint consumers** — talentstack_generate, thirtydaybrief_generate, firstyearscreen_finishdiagnostic, archetypedeepdive_personalize [EXTRACTED 0.95]
- **First Year route kinds (4 prompt branches)** — route_kind_talent_stack, route_kind_thirty_day, route_kind_archetype_rank, route_kind_archetype_personal [EXTRACTED 1.00]
- **Clerk auth flow participants** — layout_clerkprovider, proxy_clerkmiddleware_protect, topnav_clerk_auth_cluster, route_clerk_auth_gate [EXTRACTED 0.95]

## Communities

### Community 0 - "Sandbox App + Tweaks Panel"
Cohesion: 0.04
Nodes (67): Sandbox App entry (router + Tweaks), Hash-based screen router, app.jsx (sandbox entry), ThemeRadio swatch picker, TWEAK_DEFAULTS (theme/voice/density/mode), VoiceRadio mentor-persona picker, window.claude.complete LLM call surface, Claude Design HTML/CSS/JS handoff bundle (+59 more)

### Community 1 - "Sandbox AI Concepts"
Cohesion: 0.06
Nodes (43): App root component (hash router), TWEAK_DEFAULTS (theme/voice/density/mode), VoiceRadio picker, Persona-by-screen routing rule, window.claude.complete (sandbox LLM endpoint), Structured JSON-tail parsing of LLM output, ChatBubble with adminView redaction, ChatInput (claude-haiku-4-5 send) (+35 more)

### Community 2 - "Production Screen Components"
Cohesion: 0.06
Nodes (40): ThemeRadio swatch picker, AdminViewOverlay (privacy preview), CohortTable, DashboardScreen (admin macro), DrilldownOverlay (per-member side panel), MetricRibbon (4 KPIs), NarrativePanel (M's read on cohort), PrivacyBanner (themes-not-transcripts) (+32 more)

### Community 3 - "Career Archetypes Data"
Cohesion: 0.07
Nodes (37): Archetype: The Analyst, Archetype: The Builder, Archetype: The Craftsperson, Archetype: The Operator, Archetype: The Storyteller, Archetype: The Synthesizer, DIAGNOSTIC questions, ARCHETYPES (6 career archetypes) (+29 more)

### Community 4 - "Cohort Intelligence Dashboard"
Cohesion: 0.08
Nodes (35): Close Drilldown (Esc/click), Open Member Drilldown Action, Select Active Metric Action, Switch Cohort/Skills Tab, Block, CohortTable, Cohort Intelligence Dashboard, Cohort Table View (+27 more)

### Community 5 - "AI Console Chat"
Cohesion: 0.08
Nodes (34): ChatBubble, ChatHeader, ChatInput, ConsolePage, ConsoleScreen dynamic import, AdminViewOverlay, ConsoleScreen, PersistedState (+26 more)

### Community 6 - "First Year AI Pipeline + Clerk Auth"
Cohesion: 0.12
Nodes (25): ArchetypeDeepDive.personalize (fetch /api/firstyear/generate), Cartography fitNotes per-card 'why this fits you' line, Clerk auth flow (provider + middleware + UI cluster), First Year Gemini pipeline (4 kinds), FirstYearScreen dynamic import, FirstYearScreen.finishDiagnostic (async ranking + fallback), fitNotes per-archetype why-this-fits map, PersistedState (localStorage shape) (+17 more)

### Community 7 - "Roadmap Cards & UI Primitives"
Cohesion: 0.16
Nodes (19): AltCard, Card, CTA, SIZES, DetailPanel, Icon, IconName, PATHS (+11 more)

### Community 8 - "Sandbox App Components"
Cohesion: 0.12
Nodes (4): App(), ThemeRadio(), VoiceRadio(), useTweaks()

### Community 9 - "Sandbox Console Components"
Cohesion: 0.23
Nodes (14): AdminViewOverlay(), ChatBubble(), ChatHeader(), ChatInput(), ConsoleScreen(), ContextChip(), Dossier(), loadStore() (+6 more)

### Community 10 - "Sandbox Dashboard Components"
Cohesion: 0.26
Nodes (12): Block(), CohortTable(), DashboardScreen(), DashHeader(), DrilldownOverlay(), MetricRibbon(), NarrativePanel(), PrivacyBanner() (+4 more)

### Community 11 - "Sandbox First-Year Components"
Cohesion: 0.26
Nodes (12): ArchetypeDeepDive(), Cartography(), CheckRow(), DataBlock(), Diagnostic(), FirstYearScreen(), fyLoad(), fySave() (+4 more)

### Community 13 - "Sandbox Landing Components"
Cohesion: 0.28
Nodes (11): ClosingCTA(), DemoBubble(), DemoTerminal(), FeatureCard(), FeatureGrid(), Hero(), InvestorTicker(), LandingScreen() (+3 more)

### Community 14 - "Sandbox Roadmap Components"
Cohesion: 0.3
Nodes (10): AltCard(), Card(), DetailPanel(), MilestoneRow(), RePlanModal(), rmLoad(), rmSave(), RoadmapScreen() (+2 more)

### Community 15 - "Landing Page Composition"
Cohesion: 0.2
Nodes (10): ClosingCTA, Kicker accent header pattern, Typewriter scripted animation, DemoBubble, DemoTerminal, Diagnostic, FeatureCard, FeatureGrid (+2 more)

### Community 16 - "Shared UI Primitives"
Cohesion: 0.39
Nodes (7): CTA(), Icon(), Kicker(), LogoMark(), ModeToggle(), PersonaToggle(), TopNav()

### Community 17 - "First-Year Onboarding Flow"
Cohesion: 0.22
Nodes (4): rankArchetypes(), finishDiagnostic(), reset(), remove()

### Community 18 - "First-Year Generate Route (4 prompts)"
Cohesion: 0.52
Nodes (6): archetypePersonalPrompt(), archetypeRankPrompt(), POST(), talentStackPrompt(), thirtyDayPrompt(), validateRankings()

### Community 19 - "Project Setup & Tooling"
Cohesion: 0.33
Nodes (6): Next.js agent rules, Graphify project rules, ESLint Config, Next.js framework, README project overview, Vercel deployment

### Community 20 - "Mock AI Dispatcher"
Cohesion: 0.6
Nodes (3): dispatch(), pickArchetype(), pickConsoleReply()

### Community 21 - "Tweak Themes"
Cohesion: 0.67
Nodes (1): applyTweaks()

### Community 50 - "PostCSS Config"
Cohesion: 1.0
Nodes (2): PostCSS Config, @tailwindcss/postcss plugin

### Community 51 - "Next.js Config"
Cohesion: 1.0
Nodes (2): Next.js Config, next-env.d.ts types reference

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (1): ModeToggle

### Community 94 - "Community 94"
Cohesion: 1.0
Nodes (1): CheckRow

### Community 95 - "Community 95"
Cohesion: 1.0
Nodes (1): DataBlock

### Community 96 - "Community 96"
Cohesion: 1.0
Nodes (1): PullQuote

### Community 97 - "Community 97"
Cohesion: 1.0
Nodes (1): InvestorTicker

### Community 98 - "Community 98"
Cohesion: 1.0
Nodes (1): MetricsRibbon

### Community 99 - "Community 99"
Cohesion: 1.0
Nodes (1): LogoMark

### Community 100 - "Community 100"
Cohesion: 1.0
Nodes (1): ThemeBootstrap

### Community 101 - "Community 101"
Cohesion: 1.0
Nodes (1): Mock AI completion (claude.complete)

### Community 102 - "Community 102"
Cohesion: 1.0
Nodes (1): LocalStorage persistence pattern

### Community 103 - "Community 103"
Cohesion: 1.0
Nodes (1): File Glyph SVG Icon

### Community 104 - "Community 104"
Cohesion: 1.0
Nodes (1): Vercel Logo SVG

### Community 105 - "Community 105"
Cohesion: 1.0
Nodes (1): Next.js Logo SVG

### Community 106 - "Community 106"
Cohesion: 1.0
Nodes (1): Globe Icon SVG

### Community 107 - "Community 107"
Cohesion: 1.0
Nodes (1): Window Icon SVG

## Ambiguous Edges - Review These
- `Production Next.js app (app/ in repo root)` → `Executive Mentor product (sandbox prototype)`  [AMBIGUOUS]
  test/project/export/src/src/app.jsx · relation: prototype_of
- `replan` → `Icon`  [AMBIGUOUS]
  components/roadmap/RoadmapScreen.tsx · relation: depends_on_ai

## Knowledge Gaps
- **140 isolated node(s):** `PostCSS Config`, `@tailwindcss/postcss plugin`, `next-env.d.ts types reference`, `ESLint Config`, `Next.js Config` (+135 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Tweak Themes`** (3 nodes): `applyTweaks()`, `themes.jsx`, `themes.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Config`** (2 nodes): `PostCSS Config`, `@tailwindcss/postcss plugin`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Config`** (2 nodes): `Next.js Config`, `next-env.d.ts types reference`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `ModeToggle`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 94`** (1 nodes): `CheckRow`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 95`** (1 nodes): `DataBlock`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 96`** (1 nodes): `PullQuote`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (1 nodes): `InvestorTicker`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 98`** (1 nodes): `MetricsRibbon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 99`** (1 nodes): `LogoMark`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 100`** (1 nodes): `ThemeBootstrap`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 101`** (1 nodes): `Mock AI completion (claude.complete)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 102`** (1 nodes): `LocalStorage persistence pattern`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 103`** (1 nodes): `File Glyph SVG Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 104`** (1 nodes): `Vercel Logo SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 105`** (1 nodes): `Next.js Logo SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 106`** (1 nodes): `Globe Icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 107`** (1 nodes): `Window Icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Production Next.js app (app/ in repo root)` and `Executive Mentor product (sandbox prototype)`?**
  _Edge tagged AMBIGUOUS (relation: prototype_of) - confidence is low._
- **What is the exact relationship between `replan` and `Icon`?**
  _Edge tagged AMBIGUOUS (relation: depends_on_ai) - confidence is low._
- **Why does `ConsoleScreen (mentor chat + dossier)` connect `Sandbox App + Tweaks Panel` to `Sandbox AI Concepts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `App root component (hash router)` connect `Sandbox AI Concepts` to `Production Screen Components`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `Sandbox App entry (router + Tweaks)` connect `Sandbox App + Tweaks Panel` to `Cohort Intelligence Dashboard`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Executive Mentor.html (sandbox root, /test/project)` (e.g. with `Executive Mentor.html (export root, /test/project/export)` and `Executive Mentor.html (export/src root)`) actually correct?**
  _`Executive Mentor.html (sandbox root, /test/project)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PostCSS Config`, `@tailwindcss/postcss plugin`, `next-env.d.ts types reference` to the rest of the system?**
  _140 weakly-connected nodes found - possible documentation gaps or missing edges._