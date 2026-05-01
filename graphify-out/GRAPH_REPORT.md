# Graph Report - .  (2026-05-01)

## Corpus Check
- Corpus is ~21,183 words - fits in a single context window. You may not need a graph.

## Summary
- 311 nodes · 317 edges · 20 communities detected
- Extraction: 63% EXTRACTED · 25% INFERRED · 0% AMBIGUOUS · INFERRED: 78 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Routes & Screens|App Routes & Screens]]
- [[_COMMUNITY_First-Year Onboarding Flow|First-Year Onboarding Flow]]
- [[_COMMUNITY_Cohort Intelligence Dashboard|Cohort Intelligence Dashboard]]
- [[_COMMUNITY_AI Console Chat|AI Console Chat]]
- [[_COMMUNITY_Career Archetypes Data|Career Archetypes Data]]
- [[_COMMUNITY_Roadmap Cards & UI Primitives|Roadmap Cards & UI Primitives]]
- [[_COMMUNITY_Mock Data Fixtures|Mock Data Fixtures]]
- [[_COMMUNITY_Top Nav & Theming|Top Nav & Theming]]
- [[_COMMUNITY_Local Storage Persistence|Local Storage Persistence]]
- [[_COMMUNITY_Project Setup & Tooling|Project Setup & Tooling]]
- [[_COMMUNITY_Mock AI Dispatcher|Mock AI Dispatcher]]
- [[_COMMUNITY_PostCSS  Tailwind|PostCSS / Tailwind]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_Persona Type|Persona Type]]
- [[_COMMUNITY_Mode Type|Mode Type]]
- [[_COMMUNITY_File Glyph SVG|File Glyph SVG]]
- [[_COMMUNITY_Vercel Logo SVG|Vercel Logo SVG]]
- [[_COMMUNITY_Next.js Logo SVG|Next.js Logo SVG]]
- [[_COMMUNITY_Globe Icon SVG|Globe Icon SVG]]
- [[_COMMUNITY_Window Icon SVG|Window Icon SVG]]

## God Nodes (most connected - your core abstractions)
1. `ConsoleScreen` - 14 edges
2. `ThirtyDayBrief` - 11 edges
3. `DashboardScreen` - 11 edges
4. `ARCHETYPES (6 career archetypes)` - 11 edges
5. `FirstYearScreen` - 10 edges
6. `TalentStack` - 9 edges
7. `Executive Mentor product` - 8 edges
8. `ArchetypeDeepDive` - 8 edges
9. `Glass card visual pattern` - 8 edges
10. `Kicker accent header pattern` - 8 edges

## Surprising Connections (you probably didn't know these)
- `ESLint Config` --lints_for--> `Next.js framework`  [INFERRED]
  eslint.config.mjs → README.md
- `FeatureCard` --uses_pattern--> `Glass card visual pattern`  [EXTRACTED]
  components/landing/FeatureGrid.tsx → app/globals.css
- `ConsoleScreen dynamic import` --likely_consumes--> `boardroom voice`  [INFERRED]
  app/console/page.tsx → lib/voice.ts
- `M mentor system prompt` --defines_persona_for--> `Executive Mentor product`  [INFERRED]
  lib/voice.ts → app/layout.tsx
- `ThirtyDayBrief` --uses_pattern--> `Glass card visual pattern`  [EXTRACTED]
  components/firstyear/ThirtyDayBrief.tsx → app/globals.css

## Hyperedges (group relationships)
- **Client-only dynamic route shells** —  [INFERRED 0.90]
- **Career mentorship data model** —  [INFERRED 0.85]
- **Global app shell composition** —  [EXTRACTED 1.00]
- **** — diagnostic_diagnostic, cartography_cartography, archetypedeepdive_archetypedeepdive, talentstack_talentstack, thirtydaybrief_thirtydaybrief, firstyearscreen_firstyearscreen [INFERRED 0.90]
- **** — hero_hero, metricsribbon_metricsribbon, featuregrid_featuregrid, pullquote_pullquote, closingcta_closingcta, investorticker_investorticker [INFERRED 0.90]
- **** — roadmapscreen_component, timeline_component, detailpanel_component [EXTRACTED 1.00]
- **** — roadmapscreen_component, replanmodal_component, roadmapscreen_replan [EXTRACTED 1.00]
- **** — timeline_component, card_component, altcard_component [EXTRACTED 1.00]
- **Dashboard Screen Composition** —  [high 0.95]
- **Drilldown Sectioned Blocks** —  [high 0.92]
- **Cohort/Skills View Switch** —  [high 0.90]
- **Console chat shell composition** —  [EXTRACTED 1.00]
- **Message rendering trio** —  [INFERRED 0.90]
- **Dossier side panel composition** —  [EXTRACTED 1.00]
- **App-wide seed data fixtures** —  [INFERRED 0.85]
- **Archetype-id keyed fixtures** —  [INFERRED 0.90]
- **Client-side persistence** —  [INFERRED 0.82]

## Communities

### Community 0 - "App Routes & Screens"
Cohesion: 0.08
Nodes (31): Executive Mentor product, ConsolePage, ConsoleScreen dynamic import, DashboardPage, DashboardScreen dynamic import, FirstYearPage, FirstYearScreen dynamic import, Cormorant Garamond font (+23 more)

### Community 1 - "First-Year Onboarding Flow"
Cohesion: 0.15
Nodes (30): ArchetypeDeepDive, Cartography, CheckRow, ClosingCTA, Archetype (career path), Checklist toggle UI, DiagnosticAnswers shape, First-Year Onboarding Flow (+22 more)

### Community 2 - "Cohort Intelligence Dashboard"
Cohesion: 0.1
Nodes (29): Close Drilldown (Esc/click), Open Member Drilldown Action, Select Active Metric Action, Switch Cohort/Skills Tab, Block, CohortTable, Cohort Intelligence Dashboard, Cohort Table View (+21 more)

### Community 3 - "AI Console Chat"
Cohesion: 0.11
Nodes (27): ChatBubble, ChatHeader, ChatInput, AdminViewOverlay, ConsoleScreen, PersistedState, ConsoleScreen.resetSession, ConsoleScreen.send (+19 more)

### Community 4 - "Career Archetypes Data"
Cohesion: 0.1
Nodes (24): Archetype: The Analyst, Archetype: The Builder, Archetype: The Craftsperson, Archetype: The Operator, Archetype: The Storyteller, Archetype: The Synthesizer, DIAGNOSTIC questions, ARCHETYPES (6 career archetypes) (+16 more)

### Community 5 - "Roadmap Cards & UI Primitives"
Cohesion: 0.18
Nodes (19): AltCard, Card, CTA, SIZES, DetailPanel, Icon, IconName, PATHS (+11 more)

### Community 6 - "Mock Data Fixtures"
Cohesion: 0.18
Nodes (13): CHART_DATA (sparkline series), COHORT_DATA (members), MEMBER_THEMES, METRICS (KPI cards), data/cohort.ts, SKILL_HEATMAP, data/dossier.ts, ONBOARDING_QUESTIONS (+5 more)

### Community 7 - "Top Nav & Theming"
Cohesion: 0.33
Nodes (7): LogoMark, ModeToggle, ThemeBootstrap, TopNav, initialsFor, personaForPath, SCREENS

### Community 8 - "Local Storage Persistence"
Cohesion: 0.33
Nodes (2): reset(), remove()

### Community 9 - "Project Setup & Tooling"
Cohesion: 0.33
Nodes (6): Next.js agent rules, Graphify project rules, ESLint Config, Next.js framework, README project overview, Vercel deployment

### Community 10 - "Mock AI Dispatcher"
Cohesion: 0.6
Nodes (3): dispatch(), pickArchetype(), pickConsoleReply()

### Community 40 - "PostCSS / Tailwind"
Cohesion: 1.0
Nodes (2): PostCSS Config, @tailwindcss/postcss plugin

### Community 41 - "Next.js Config"
Cohesion: 1.0
Nodes (2): Next.js Config, next-env.d.ts types reference

### Community 82 - "Persona Type"
Cohesion: 1.0
Nodes (1): Persona type

### Community 83 - "Mode Type"
Cohesion: 1.0
Nodes (1): Mode type

### Community 84 - "File Glyph SVG"
Cohesion: 1.0
Nodes (1): File Glyph SVG Icon

### Community 85 - "Vercel Logo SVG"
Cohesion: 1.0
Nodes (1): Vercel Logo SVG

### Community 86 - "Next.js Logo SVG"
Cohesion: 1.0
Nodes (1): Next.js Logo SVG

### Community 87 - "Globe Icon SVG"
Cohesion: 1.0
Nodes (1): Globe Icon SVG

### Community 88 - "Window Icon SVG"
Cohesion: 1.0
Nodes (1): Window Icon SVG

## Ambiguous Edges - Review These
- `replan` → `Icon`  [AMBIGUOUS]
  components/roadmap/RoadmapScreen.tsx · relation: depends_on_ai

## Knowledge Gaps
- **73 isolated node(s):** `PostCSS Config`, `@tailwindcss/postcss plugin`, `next-env.d.ts types reference`, `ESLint Config`, `Next.js Config` (+68 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Local Storage Persistence`** (6 nodes): `FirstYearScreen.tsx`, `reset()`, `load()`, `remove()`, `save()`, `storage.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS / Tailwind`** (2 nodes): `PostCSS Config`, `@tailwindcss/postcss plugin`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Config`** (2 nodes): `Next.js Config`, `next-env.d.ts types reference`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Persona Type`** (1 nodes): `Persona type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mode Type`** (1 nodes): `Mode type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `File Glyph SVG`** (1 nodes): `File Glyph SVG Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vercel Logo SVG`** (1 nodes): `Vercel Logo SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Logo SVG`** (1 nodes): `Next.js Logo SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Globe Icon SVG`** (1 nodes): `Globe Icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Window Icon SVG`** (1 nodes): `Window Icon SVG`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `replan` and `Icon`?**
  _Edge tagged AMBIGUOUS (relation: depends_on_ai) - confidence is low._
- **Why does `boardroom voice` connect `AI Console Chat` to `App Routes & Screens`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `ThirtyDayBrief` (e.g. with `Checklist toggle UI` and `First-Year Onboarding Flow`) actually correct?**
  _`ThirtyDayBrief` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `ARCHETYPES (6 career archetypes)` (e.g. with `ARCHETYPE_NAMES needle map` and `TALENT_STACK fixture (per archetype)`) actually correct?**
  _`ARCHETYPES (6 career archetypes)` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `FirstYearScreen` (e.g. with `First-Year Onboarding Flow` and `Archetype (career path)`) actually correct?**
  _`FirstYearScreen` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PostCSS Config`, `@tailwindcss/postcss plugin`, `next-env.d.ts types reference` to the rest of the system?**
  _73 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Routes & Screens` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._