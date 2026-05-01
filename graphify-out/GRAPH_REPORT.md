# Graph Report - .  (2026-05-02)

## Corpus Check
- 25 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 588 nodes · 704 edges · 30 communities detected
- Extraction: 78% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 117 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Sandbox App + Tweaks Panel|Sandbox App + Tweaks Panel]]
- [[_COMMUNITY_Sandbox Hash Router & Tweaks|Sandbox Hash Router & Tweaks]]
- [[_COMMUNITY_App Routes + Clerk Auth|App Routes + Clerk Auth]]
- [[_COMMUNITY_Career Archetypes Data|Career Archetypes Data]]
- [[_COMMUNITY_Cohort Intelligence Dashboard|Cohort Intelligence Dashboard]]
- [[_COMMUNITY_First-Year Onboarding Flow|First-Year Onboarding Flow]]
- [[_COMMUNITY_AI Console Chat|AI Console Chat]]
- [[_COMMUNITY_Roadmap Cards & UI Primitives|Roadmap Cards & UI Primitives]]
- [[_COMMUNITY_Sandbox AI Concepts|Sandbox AI Concepts]]
- [[_COMMUNITY_Sandbox App Components|Sandbox App Components]]
- [[_COMMUNITY_Console Component Functions|Console Component Functions]]
- [[_COMMUNITY_Dashboard Component Functions|Dashboard Component Functions]]
- [[_COMMUNITY_First-Year Component Functions|First-Year Component Functions]]
- [[_COMMUNITY_Landing Page Composition|Landing Page Composition]]
- [[_COMMUNITY_Roadmap Component Functions|Roadmap Component Functions]]
- [[_COMMUNITY_Landing Pitch Concepts|Landing Pitch Concepts]]
- [[_COMMUNITY_Shared UI Component Functions|Shared UI Component Functions]]
- [[_COMMUNITY_Local Storage Persistence|Local Storage Persistence]]
- [[_COMMUNITY_Project Setup & Tooling|Project Setup & Tooling]]
- [[_COMMUNITY_delay()|delay()]]
- [[_COMMUNITY_applyTweaks()|applyTweaks()]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_Persona type|Persona type]]
- [[_COMMUNITY_Mode type|Mode type]]
- [[_COMMUNITY_File Glyph SVG Icon|File Glyph SVG Icon]]
- [[_COMMUNITY_Vercel Logo SVG|Vercel Logo SVG]]
- [[_COMMUNITY_Next.js Logo SVG|Next.js Logo SVG]]
- [[_COMMUNITY_Globe Icon SVG|Globe Icon SVG]]
- [[_COMMUNITY_Window Icon SVG|Window Icon SVG]]

## God Nodes (most connected - your core abstractions)
1. `Executive Mentor.html (sandbox root, /test/project)` - 16 edges
2. `Sandbox App entry (router + Tweaks)` - 15 edges
3. `ConsoleScreen` - 14 edges
4. `App root component (hash router)` - 14 edges
5. `design.md (Executive Mentor brief)` - 14 edges
6. `ConsoleScreen (mentor chat + dossier)` - 12 edges
7. `ThirtyDayBrief` - 11 edges
8. `DashboardScreen` - 11 edges
9. `ARCHETYPES (6 career archetypes)` - 11 edges
10. `ConsoleScreen (split chat + dossier)` - 11 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout (Next.js app shell)` --informs--> `Pixel-perfect recreation directive (don't copy structure)`  [INFERRED]
  app/layout.tsx → test/README.md
- `ESLint Config` --lints_for--> `Next.js framework`  [INFERRED]
  eslint.config.mjs → README.md
- `FeatureCard` --uses_pattern--> `Glass card visual pattern`  [EXTRACTED]
  components/landing/FeatureGrid.tsx → app/globals.css
- `ConsoleScreen dynamic import` --likely_consumes--> `boardroom voice`  [INFERRED]
  app/console/page.tsx → lib/voice.ts
- `M mentor system prompt` --defines_persona_for--> `Executive Mentor product`  [INFERRED]
  lib/voice.ts → app/layout.tsx

## Hyperedges (group relationships)
- **** —  [EXTRACTED 1.00]
- **** —  [EXTRACTED 1.00]
- **** —  [INFERRED 0.90]
- **** —  [EXTRACTED 1.00]
- **** —  [INFERRED 0.85]
- **** —  [EXTRACTED 0.96]
- **** —  [EXTRACTED 0.94]
- **** —  [EXTRACTED 0.93]
- **** —  [EXTRACTED 0.95]
- **** —  [EXTRACTED 0.94]
- **** —  [EXTRACTED 0.96]
- **** —  [INFERRED 0.90]

## Communities

### Community 0 - "Sandbox App + Tweaks Panel"
Cohesion: 0.04
Nodes (71): App root component (hash router), TWEAK_DEFAULTS (theme/voice/density/mode), ThemeRadio swatch picker, VoiceRadio picker, Persona-by-screen routing rule, window.claude.complete (sandbox LLM endpoint), Structured JSON-tail parsing of LLM output, AdminViewOverlay (privacy preview) (+63 more)

### Community 1 - "Sandbox Hash Router & Tweaks"
Cohesion: 0.06
Nodes (41): Sandbox App entry (router + Tweaks), Hash-based screen router, app.jsx (sandbox entry), ThemeRadio swatch picker, TWEAK_DEFAULTS (theme/voice/density/mode), VoiceRadio mentor-persona picker, Claude Design HTML/CSS/JS handoff bundle, Admin persona (institution view) (+33 more)

### Community 2 - "App Routes + Clerk Auth"
Cohesion: 0.06
Nodes (39): Authentication gating concept, Clerk auth flow (provider + middleware + UI), Executive Mentor product, ConsolePage, ConsoleScreen dynamic import, DashboardPage, DashboardScreen dynamic import, FirstYearPage (+31 more)

### Community 3 - "Career Archetypes Data"
Cohesion: 0.07
Nodes (37): Archetype: The Analyst, Archetype: The Builder, Archetype: The Craftsperson, Archetype: The Operator, Archetype: The Storyteller, Archetype: The Synthesizer, DIAGNOSTIC questions, ARCHETYPES (6 career archetypes) (+29 more)

### Community 4 - "Cohort Intelligence Dashboard"
Cohesion: 0.08
Nodes (35): Close Drilldown (Esc/click), Open Member Drilldown Action, Select Active Metric Action, Switch Cohort/Skills Tab, Block, CohortTable, Cohort Intelligence Dashboard, Cohort Table View (+27 more)

### Community 5 - "First-Year Onboarding Flow"
Cohesion: 0.15
Nodes (30): ArchetypeDeepDive, Cartography, CheckRow, ClosingCTA, Archetype (career path), Checklist toggle UI, DiagnosticAnswers shape, First-Year Onboarding Flow (+22 more)

### Community 6 - "AI Console Chat"
Cohesion: 0.11
Nodes (27): ChatBubble, ChatHeader, ChatInput, AdminViewOverlay, ConsoleScreen, PersistedState, ConsoleScreen.resetSession, ConsoleScreen.send (+19 more)

### Community 7 - "Roadmap Cards & UI Primitives"
Cohesion: 0.12
Nodes (26): AltCard, Card, CTA, SIZES, DetailPanel, Icon, IconName, PATHS (+18 more)

### Community 8 - "Sandbox AI Concepts"
Cohesion: 0.1
Nodes (26): window.claude.complete LLM call surface, M — the executive mentor character, What-if alt-trajectory replanning, Admin-view privacy toggle (redaction preview), Live Dossier side panel, em.console.v1 localStorage persistence, OnboardingFlow diagnostic, ConsoleScreen (mentor chat + dossier) (+18 more)

### Community 9 - "Sandbox App Components"
Cohesion: 0.12
Nodes (4): App(), ThemeRadio(), VoiceRadio(), useTweaks()

### Community 10 - "Console Component Functions"
Cohesion: 0.23
Nodes (14): AdminViewOverlay(), ChatBubble(), ChatHeader(), ChatInput(), ConsoleScreen(), ContextChip(), Dossier(), loadStore() (+6 more)

### Community 11 - "Dashboard Component Functions"
Cohesion: 0.26
Nodes (12): Block(), CohortTable(), DashboardScreen(), DashHeader(), DrilldownOverlay(), MetricRibbon(), NarrativePanel(), PrivacyBanner() (+4 more)

### Community 12 - "First-Year Component Functions"
Cohesion: 0.26
Nodes (12): ArchetypeDeepDive(), Cartography(), CheckRow(), DataBlock(), Diagnostic(), FirstYearScreen(), fyLoad(), fySave() (+4 more)

### Community 14 - "Landing Page Composition"
Cohesion: 0.28
Nodes (11): ClosingCTA(), DemoBubble(), DemoTerminal(), FeatureCard(), FeatureGrid(), Hero(), InvestorTicker(), LandingScreen() (+3 more)

### Community 15 - "Roadmap Component Functions"
Cohesion: 0.3
Nodes (10): AltCard(), Card(), DetailPanel(), MilestoneRow(), RePlanModal(), rmLoad(), rmSave(), RoadmapScreen() (+2 more)

### Community 16 - "Landing Pitch Concepts"
Cohesion: 0.17
Nodes (12): TrajectoryChart (SVG line), Screen spec: Landing Pitch, ClosingCTA (investor preview), DemoTerminal auto-typer, FeatureGrid (Console/Roadmap/Dashboard tease), Hero (Wisdom at scale), InvestorTicker (fixed bottom ARR/NPS scroller), LandingScreen (+4 more)

### Community 17 - "Shared UI Component Functions"
Cohesion: 0.39
Nodes (7): CTA(), Icon(), Kicker(), LogoMark(), ModeToggle(), PersonaToggle(), TopNav()

### Community 18 - "Local Storage Persistence"
Cohesion: 0.33
Nodes (2): reset(), remove()

### Community 19 - "Project Setup & Tooling"
Cohesion: 0.33
Nodes (6): Next.js agent rules, Graphify project rules, ESLint Config, Next.js framework, README project overview, Vercel deployment

### Community 20 - "delay()"
Cohesion: 0.6
Nodes (3): dispatch(), pickArchetype(), pickConsoleReply()

### Community 25 - "applyTweaks()"
Cohesion: 0.67
Nodes (1): applyTweaks()

### Community 51 - "PostCSS Config"
Cohesion: 1.0
Nodes (2): PostCSS Config, @tailwindcss/postcss plugin

### Community 52 - "Next.js Config"
Cohesion: 1.0
Nodes (2): Next.js Config, next-env.d.ts types reference

### Community 93 - "Persona type"
Cohesion: 1.0
Nodes (1): Persona type

### Community 94 - "Mode type"
Cohesion: 1.0
Nodes (1): Mode type

### Community 95 - "File Glyph SVG Icon"
Cohesion: 1.0
Nodes (1): File Glyph SVG Icon

### Community 96 - "Vercel Logo SVG"
Cohesion: 1.0
Nodes (1): Vercel Logo SVG

### Community 97 - "Next.js Logo SVG"
Cohesion: 1.0
Nodes (1): Next.js Logo SVG

### Community 98 - "Globe Icon SVG"
Cohesion: 1.0
Nodes (1): Globe Icon SVG

### Community 99 - "Window Icon SVG"
Cohesion: 1.0
Nodes (1): Window Icon SVG

## Ambiguous Edges - Review These
- `replan` → `Icon`  [AMBIGUOUS]
  components/roadmap/RoadmapScreen.tsx · relation: depends_on_ai
- `Executive Mentor product (sandbox prototype)` → `Production Next.js app (app/ in repo root)`  [AMBIGUOUS]
  test/project/export/src/src/app.jsx · relation: prototype_of

## Knowledge Gaps
- **137 isolated node(s):** `PostCSS Config`, `@tailwindcss/postcss plugin`, `next-env.d.ts types reference`, `ESLint Config`, `Next.js Config` (+132 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Local Storage Persistence`** (6 nodes): `FirstYearScreen.tsx`, `reset()`, `load()`, `remove()`, `save()`, `storage.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `applyTweaks()`** (3 nodes): `applyTweaks()`, `themes.jsx`, `themes.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `PostCSS Config`** (2 nodes): `PostCSS Config`, `@tailwindcss/postcss plugin`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Config`** (2 nodes): `Next.js Config`, `next-env.d.ts types reference`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Persona type`** (1 nodes): `Persona type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mode type`** (1 nodes): `Mode type`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `File Glyph SVG Icon`** (1 nodes): `File Glyph SVG Icon`
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
- **What is the exact relationship between `Executive Mentor product (sandbox prototype)` and `Production Next.js app (app/ in repo root)`?**
  _Edge tagged AMBIGUOUS (relation: prototype_of) - confidence is low._
- **Why does `Sandbox App entry (router + Tweaks)` connect `Sandbox Hash Router & Tweaks` to `Sandbox AI Concepts`, `Cohort Intelligence Dashboard`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `ConsoleScreen (mentor chat + dossier)` connect `Sandbox AI Concepts` to `Sandbox App + Tweaks Panel`, `Sandbox Hash Router & Tweaks`, `Cohort Intelligence Dashboard`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `RootLayout (Next.js app shell)` connect `App Routes + Clerk Auth` to `Sandbox Hash Router & Tweaks`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Executive Mentor.html (sandbox root, /test/project)` (e.g. with `Executive Mentor.html (export root, /test/project/export)` and `Executive Mentor.html (export/src root)`) actually correct?**
  _`Executive Mentor.html (sandbox root, /test/project)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Sandbox App entry (router + Tweaks)` (e.g. with `Claude Design HTML/CSS/JS handoff bundle` and `Sandbox handoff README`) actually correct?**
  _`Sandbox App entry (router + Tweaks)` has 2 INFERRED edges - model-reasoned connections that need verification._