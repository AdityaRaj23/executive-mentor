# Graph Report - .  (2026-07-11)

## Corpus Check
- 117 files · ~69,220 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 951 nodes · 1759 edges · 71 communities (49 shown, 22 thin omitted)
- Extraction: 89% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 163 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Console Chat Surface
- App Pages & Component Files
- Cohort Dashboard Components
- Career Archetypes Data
- Package Dependencies
- Sandbox Tweaks Panel (React)
- TypeScript Config
- First-Year Gemini + Clerk Auth
- Root Layout & Shared Chrome
- Assessment Frameworks & Dimensions
- Assessment Question Bank
- Sandbox Console Module
- Sandbox Dashboard Module
- Sandbox Console Components (export)
- Sandbox Dashboard Components (export)
- Design Brief & Aesthetic Decisions
- Assessment Flow Screens
- Sandbox First-Year Module
- Sandbox Landing Module
- Sandbox First-Year Components (export)
- Sandbox Landing Components (export)
- Sandbox Roadmap Module
- Sandbox HTML Shells
- Sandbox App Router & Chrome
- First-Year Generate Route
- Production Dashboard Screens
- Landing Pitch Composition
- Sandbox Roadmap Components (export)
- Sandbox AI Console Concepts
- Roadmap Generate Route
- Sandbox Personas & Shared UI
- Sandbox Shared Components
- Arya Onboarding Extraction
- First-Year Onboarding Flow
- Dashboard & Landing Specs
- Tweaks Panel System
- Assessment Results Dashboard
- Roadmap Timeline Concepts
- Sandbox Shared Components (export)
- Sandbox First-Year Concepts
- Sandbox Themes Module
- Console Mentor Concepts
- Project Setup & Tooling
- Roadmap What-If Replanning
- Sandbox Themes (export)
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 60
- Community 61
- Community 62
- Community 63
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70

## God Nodes (most connected - your core abstractions)
1. `Kicker` - 32 edges
2. `CTA` - 29 edges
3. `Icon` - 22 edges
4. `RoadmapScreen` - 20 edges
5. `FirstYearScreen` - 19 edges
6. `Executive Mentor.html (sandbox root, /test/project)` - 16 edges
7. `scoreAssessment` - 16 edges
8. `compilerOptions` - 16 edges
9. `DiagnosticAnswers` - 16 edges
10. `App root component (hash router)` - 15 edges

## Surprising Connections (you probably didn't know these)
- `SCREENS Nav Config (Pitch, First Year, Console, Roadmap, Dashboard)` --semantically_similar_to--> `Prototype screens (landing, firstyear, console, roadmap, dashboard jsx modules)`  [INFERRED] [semantically similar]
  components/shared/TopNav.tsx → test/project/Executive Mentor.html
- `Sandbox App entry (router + Tweaks)` --documents--> `Sandbox handoff README`  [INFERRED]
  /Users/adityarajkashyap/Desktop/executive-mentor/test/project/src/app.jsx → test/README.md
- `SUGGESTION_PROMPTS` --semantically_similar_to--> `boardroom (M system voice)`  [INFERRED] [semantically similar]
  data/dossier.ts → lib/voice.ts
- `FirstYearScreen.finishDiagnostic (async ranking + fallback)` --drives--> `First Year Gemini pipeline (4 kinds)`  [INFERRED]
  components/firstyear/FirstYearScreen.tsx → /Users/adityarajkashyap/Desktop/executive-mentor/app/api/firstyear/generate/route.ts
- `LogoMark` --implements--> `Design token system (:root CSS variables — colors, serif/grotesk/mono fonts, hairlines, radius)`  [INFERRED]
  components/shared/LogoMark.tsx → test/project/Executive Mentor.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **First Year route kinds (4 prompt branches)** — route_kind_talent_stack, route_kind_thirty_day, route_kind_archetype_rank, route_kind_archetype_personal [EXTRACTED 1.00]
- **** — app_App, test_project_tweaks_panel_usetweaks, themes_applyTweaks [EXTRACTED 0.96]
- **** — console_ConsoleScreen, claude_complete_api, console_dossier_protocol [EXTRACTED 0.94]
- **** — dashboard_PrivacyBanner, console_AdminViewOverlay, dashboard_min_cohort_5 [EXTRACTED 0.93]
- **** — firstyear_Diagnostic, firstyear_rankArchetypes, firstyear_Cartography [EXTRACTED 0.95]
- **** — roadmap_RePlanModal, roadmap_AltCard, claude_complete_api [EXTRACTED 0.94]
- **** — themes_THEMES, themes_DENSITIES, themes_VOICES [EXTRACTED 0.96]
- **Clerk-gated Gemini 2.5 Flash API routes (shared guard + parse pattern)** — assessment_extract_route_post, console_chat_route_post, roadmap_generate_route_post [INFERRED 0.90]
- **Full assessment staged flow (intro to chat to modules to results)** — components_assessment_assessmentscreen_assessmentscreen, components_assessment_chatonboarding_chatonboarding, components_assessment_modulerunner_modulerunner, components_assessment_resultsdashboard_resultsdashboard, assessment_extract_route_post [EXTRACTED 0.95]
- **Admin-view privacy redaction pattern (adminView prop threading)** — components_console_consolescreen_consolescreen, components_console_chatbubble_chatbubble, components_console_chatheader_chatheader, components_console_chatinput_chatinput, components_console_dossier_dossier [EXTRACTED 0.90]
- **Cohort Analytics Dashboard Flow** — components_dashboard_dashboardscreen_dashboardscreen, components_dashboard_metricribbon_metricribbon, components_dashboard_trajectorychart_trajectorychart, components_dashboard_cohorttable_cohorttable, components_dashboard_skillheatmap_skillheatmap, components_dashboard_drilldownoverlay_drilldownoverlay [INFERRED 0.90]
- **First-Year Diagnostic to Result Stage Machine** — components_firstyear_firstyearscreen_firstyearscreen, components_firstyear_diagnostic_diagnostic, components_firstyear_firstyearscreen_rankingloader, components_firstyear_cartography_cartography, components_firstyear_archetypedeepdive_archetypedeepdive, app_api_firstyear_generate_route_post [INFERRED 0.90]
- **Privacy-First Analytics Messaging (min cohort 5, no transcripts)** — components_dashboard_privacybanner_privacybanner, components_dashboard_drilldownoverlay_drilldownoverlay, components_dashboard_dashboardscreen_dashboardscreen [INFERRED 0.80]
- **Roadmap Surface Composition** — components_roadmap_roadmapscreen_roadmapscreen, components_roadmap_timeline_timeline, components_roadmap_timeline_milestonerow, components_roadmap_detailpanel_detailpanel, components_roadmap_replanmodal_replanmodal, components_roadmap_card_card, components_roadmap_altcard_altcard, components_roadmap_statusbadge_statusbadge [EXTRACTED 1.00]
- **Landing Page Sections** — components_landing_hero_hero, components_landing_featuregrid_featuregrid, components_landing_metricsribbon_metricsribbon, components_landing_pullquote_pullquote, components_landing_closingcta_closingcta, components_landing_investorticker_investorticker, components_landing_demoterminal_demoterminal [INFERRED 0.85]
- **AI Generation Flow (M drafts artifacts from diagnostic answers and archetype)** — components_firstyear_talentstack_talentstack, components_firstyear_thirtydaybrief_thirtydaybrief, components_roadmap_roadmapscreen_roadmapscreen [INFERRED 0.90]
- **Assessment Scoring Pipeline (question bank to scored result and counsellor flags)** — data_questions_all_questions, data_questions_getassessmentquestions, data_questions_getsliderquestions, data_questions_flags, lib_assessmentscoring_scoreassessment, lib_assessmentscoring_assessmentresult [EXTRACTED 1.00]
- **Dark/Light Theme Mode System (em.mode localStorage + data-mode attribute)** — components_shared_themebootstrap_themebootstrap, lib_hooks_usethememode_usethememode, components_shared_modetoggle_modetoggle [INFERRED 0.85]
- **First-Year Snapshot to Dossier Flow (mock AI fixtures hydrate the user dossier)** — lib_mockai_talent_stack, lib_mockai_thirty_day, data_dossier_firstyearsnapshot, data_dossier_builddossier [INFERRED 0.80]

## Communities (71 total, 22 thin omitted)

### Community 0 - "Console Chat Surface"
Cohesion: 0.05
Nodes (75): buildPrompt(), POST(), RequestBody, Bubble (Arya chat bubble), ChatBubble (console message), ChatBubble, ChatHeader (admin-view toggle), ChatHeader (+67 more)

### Community 1 - "App Pages & Component Files"
Cohesion: 0.06
Nodes (49): LandingPage(), Block, ACTIONS, Accent, Stat, CheckRow, DataBlock, TalentStack (+41 more)

### Community 2 - "Cohort Dashboard Components"
Cohesion: 0.06
Nodes (51): Close Drilldown (Esc/click), Open Member Drilldown Action, Select Active Metric Action, Switch Cohort/Skills Tab, CohortTable, DashboardScreen, DashHeader, DrilldownOverlay (+43 more)

### Community 3 - "Career Archetypes Data"
Cohesion: 0.08
Nodes (39): Archetype: The Analyst, Archetype: The Builder, Archetype: The Craftsperson, Archetype: The Operator, Archetype: The Storyteller, Archetype: The Synthesizer, DIAGNOSTIC questions, ARCHETYPES (6 career archetypes) (+31 more)

### Community 4 - "Package Dependencies"
Cohesion: 0.05
Nodes (36): @clerk/nextjs, clsx, eslint, eslint-config-next, @google/genai, next, dependencies, @clerk/nextjs (+28 more)

### Community 5 - "Sandbox Tweaks Panel (React)"
Cohesion: 0.10
Nodes (30): react, react, TweakButton(), TweakColor(), TweakNumber(), TweakRadio(), TweakRow(), TweakSection() (+22 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.06
Nodes (30): ./*, dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+22 more)

### Community 7 - "First-Year Gemini + Clerk Auth"
Cohesion: 0.09
Nodes (28): ArchetypeDeepDive.personalize (fetch /api/firstyear/generate), personalNotes per-archetype cache, TalentStack.generate (fetch /api/firstyear/generate), ThirtyDayBrief.generate (fetch /api/firstyear/generate), TopNav Clerk auth cluster (SignIn/SignUp/UserButton via Show), Clerk auth flow (provider + middleware + UI cluster), First Year Gemini pipeline (4 kinds), ConsolePage (+20 more)

### Community 8 - "Root Layout & Shared Chrome"
Cohesion: 0.13
Nodes (17): cormorant, hanken, jetbrains, metadata, LogoMark, ModeToggle, ThemeBootstrap, SCREENS Nav Config (Pitch, First Year, Console, Roadmap, Dashboard) (+9 more)

### Community 9 - "Assessment Frameworks & Dimensions"
Cohesion: 0.14
Nodes (23): Aptitude Dimensions (Verbal, Numerical, Logical, Spatial), 8 Assessment Archetypes (Builder, Healer, Inquirer, Connector, Guardian, Visionary, Navigator, Performer), ARCHETYPE_MAX_SCORES, FLAGS Counsellor Thresholds, HOLLAND_MAX_SCORES, Holland RIASEC Codes (R/I/A/S/E/C), Module 2 — Aptitude Battery (20 timed MCQs), Module 3 — Interest Inventory (24 MCQs) (+15 more)

### Community 10 - "Assessment Question Bank"
Cohesion: 0.12
Nodes (20): ALL_QUESTIONS (104-question bank), 8 Career Values (Achievement, Independence, Recognition, Altruism, Variety, Security, Creativity, Leadership), getAssessmentQuestions, getModuleQuestions, getQuestion, getSliderQuestions, MODULE_1, MODULE_2 (+12 more)

### Community 11 - "Sandbox Console Module"
Cohesion: 0.25
Nodes (17): AdminViewOverlay(), ChatBubble(), ChatHeader(), ChatInput(), ConsoleScreen(), ContextChip(), Dossier(), loadStore() (+9 more)

### Community 12 - "Sandbox Dashboard Module"
Cohesion: 0.22
Nodes (17): Block(), CHART_DATA, COHORT_DATA, CohortTable(), DashboardScreen(), DashHeader(), DrilldownOverlay(), MEMBER_THEMES (+9 more)

### Community 13 - "Sandbox Console Components (export)"
Cohesion: 0.12
Nodes (6): ConsoleScreen(), loadStore(), ONBOARDING_QUESTIONS, saveStore(), SEED_DOSSIER, SUGGESTION_PROMPTS

### Community 14 - "Sandbox Dashboard Components (export)"
Cohesion: 0.11
Nodes (5): CHART_DATA, COHORT_DATA, MEMBER_THEMES, METRICS, SKILL_HEATMAP

### Community 15 - "Design Brief & Aesthetic Decisions"
Cohesion: 0.15
Nodes (16): ThemeRadio swatch picker, Editorial aesthetic (WSJ x MasterClass), Audience: institutional leaders, professionals, seed investors, Decision: build Console first (anchors design system), Stack decision: HTML + Tailwind v3 (spec) — actually shipped as inline-styled JSX, design.md (Executive Mentor brief), Color palette: navy/slate/emerald + glassmorphism, Pitch: AI career mentorship + institutional analytics (+8 more)

### Community 16 - "Assessment Flow Screens"
Cohesion: 0.21
Nodes (14): AssessmentScreen (stage machine), Intro (assessment landing), PersistedState (em.assessment.v1), Stage, INITIAL_RUNNER_STATE, MODULE_BLURBS, ModuleIntro (per-module splash), ModuleRunner (modules 2-7) (+6 more)

### Community 17 - "Sandbox First-Year Module"
Cohesion: 0.33
Nodes (13): ArchetypeDeepDive(), ARCHETYPES, Cartography(), CheckRow(), DataBlock(), DIAGNOSTIC, FirstYearScreen(), fyLoad() (+5 more)

### Community 18 - "Sandbox Landing Module"
Cohesion: 0.29
Nodes (13): ClosingCTA(), DEMO_SCRIPT, DemoBubble(), DemoTerminal(), FeatureCard(), FeatureGrid(), Hero(), InvestorTicker() (+5 more)

### Community 19 - "Sandbox First-Year Components (export)"
Cohesion: 0.18
Nodes (6): ARCHETYPES, DIAGNOSTIC, FirstYearScreen(), fyLoad(), fySave(), rankArchetypes()

### Community 21 - "Sandbox Roadmap Module"
Cohesion: 0.36
Nodes (11): AltCard(), Card(), DetailPanel(), MilestoneRow(), RePlanModal(), rmLoad(), rmSave(), RoadmapScreen() (+3 more)

### Community 22 - "Sandbox HTML Shells"
Cohesion: 0.15
Nodes (13): app.jsx (sandbox entry), console.jsx (sandbox), dashboard.jsx (sandbox), firstyear.jsx (sandbox), Executive Mentor.html (export root, /test/project/export), Executive Mentor.html (export/src root), Global .glass (backdrop-blur surface) class, html[data-mode=light] inline-rgba overrides (+5 more)

### Community 23 - "Sandbox App Router & Chrome"
Cohesion: 0.18
Nodes (12): App root component (hash router), TWEAK_DEFAULTS (theme/voice/density/mode), Persona-by-screen routing rule, Icon component (stroke SVG set), LogoMark component (italic M), ModeToggle (light/dark), PersonaToggle (member/grad/admin), SCREENS route table (landing/firstyear/console/roadmap/dashboard) (+4 more)

### Community 24 - "First-Year Generate Route"
Cohesion: 0.33
Nodes (10): archetypePersonalPrompt(), archetypeRankPrompt(), ArchetypeRef, Kind, POST /api/firstyear/generate, RequestBody, talentStackPrompt(), thirtyDayPrompt() (+2 more)

### Community 25 - "Production Dashboard Screens"
Cohesion: 0.18
Nodes (12): AdminViewOverlay (privacy preview), CohortTable, DashboardScreen (admin macro), DrilldownOverlay (per-member side panel), MetricRibbon (4 KPIs), NarrativePanel (M's read on cohort), PrivacyBanner (themes-not-transcripts), ReadinessBadge color tiers (+4 more)

### Community 26 - "Landing Pitch Composition"
Cohesion: 0.17
Nodes (12): TrajectoryChart (SVG line), Screen spec: Landing Pitch, ClosingCTA (investor preview), DemoTerminal auto-typer, FeatureGrid (Console/Roadmap/Dashboard tease), Hero (Wisdom at scale), InvestorTicker (fixed bottom ARR/NPS scroller), LandingScreen (+4 more)

### Community 27 - "Sandbox Roadmap Components (export)"
Cohesion: 0.20
Nodes (4): rmLoad(), rmSave(), RoadmapScreen(), SEED_MILESTONES

### Community 28 - "Sandbox AI Console Concepts"
Cohesion: 0.20
Nodes (11): VoiceRadio picker, window.claude.complete (sandbox LLM endpoint), ChatBubble with adminView redaction, ChatInput (claude-haiku-4-5 send), ConsoleScreen (split chat + dossier), Dossier (live skills/goals/signals), localStorage key em.console.v1, Screen spec: AI Mentorship Console (70/30 split) (+3 more)

### Community 29 - "Roadmap Generate Route"
Cohesion: 0.25
Nodes (10): Action, ArchetypeRef, attachShapes(), generatePrompt(), LockedMilestone, POST(), RawMilestone, replanPrompt() (+2 more)

### Community 30 - "Sandbox Personas & Shared UI"
Cohesion: 0.20
Nodes (11): Hash-based screen router, Admin persona (institution view), Grad / first-year persona, Member / individual persona, CTA reusable button, Icon stroke-set component, Kicker section heading, Shared components & utilities (+3 more)

### Community 31 - "Sandbox Shared Components"
Cohesion: 0.40
Nodes (8): CTA(), Icon(), Kicker(), LogoMark(), ModeToggle(), PersonaToggle(), SCREENS, TopNav()

### Community 32 - "Arya Onboarding Extraction"
Cohesion: 0.31
Nodes (8): extractionPrompt(), POST(), Turn, extractionPrompt (Arya profile extraction), POST /api/assessment/extract, ChatOnboarding (Arya chat, module 1), QS, getOnboardingQuestions (shared question bank)

### Community 33 - "First-Year Onboarding Flow"
Cohesion: 0.22
Nodes (10): OnboardingFlow (3-question diagnostic), Flow: Strategic Mentorship Setup (Map my path to VP), ARCHETYPES (Builder/Synthesizer/Analyst/Storyteller/Operator/Crafter), ArchetypeDeepDive (yr1/yr5/yr10), Cartography (ranked archetype map), DIAGNOSTIC question set (5 Qs), Diagnostic flow component, FirstYearScreen (grad onboarding) (+2 more)

### Community 34 - "Dashboard & Landing Specs"
Cohesion: 0.20
Nodes (10): CohortTable with readiness badges, DrilldownOverlay (per-member themes), DashboardScreen (institutional admin view), SkillHeatmap by track, TrajectoryChart (12-month SVG line), DemoTerminal auto-typing demo, Three-surface feature grid (console/roadmap/dashboard), InvestorTicker fixed bottom band (+2 more)

### Community 35 - "Tweaks Panel System"
Cohesion: 0.31
Nodes (9): Sandbox App entry (router + Tweaks), ThemeRadio swatch picker, TWEAK_DEFAULTS (theme/voice/density/mode), VoiceRadio mentor-persona picker, EDITMODE-BEGIN/END defaults block convention, Edit-mode postMessage host protocol, TweaksPanel floating shell component, Tweaks panel sandbox module (+1 more)

### Community 36 - "Assessment Results Dashboard"
Cohesion: 0.31
Nodes (7): HOLLAND_LABELS, POSITIVE_PRESSURE, PRESSURE_LABELS, pressureColor (inverted concern scale), ResultsDashboard, Section (results card), VARK_LABELS

### Community 37 - "Roadmap Timeline Concepts"
Cohesion: 0.22
Nodes (9): Structured JSON-tail parsing of LLM output, <<<DOSSIER>>> structured-tail JSON contract, Screen spec: Career Roadmap (vertical timeline), AltCard (sapphire ghost branch), DetailPanel (tasks + skills), RePlanModal (what-if AI prompt), RoadmapScreen (vertical timeline), Timeline (alternating L/R milestones) (+1 more)

### Community 39 - "Sandbox First-Year Concepts"
Cohesion: 0.32
Nodes (8): window.claude.complete LLM call surface, ARCHETYPES (Builder/Synthesizer/Analyst/Storyteller/Operator/Crafter), Cartography archetype map, Diagnostic 5-question intake, rankArchetypes heuristic scorer, FirstYearScreen (fresh-grad persona), TalentStack (LLM-generated strengths), ThirtyDayBrief 30-day starter plan

### Community 40 - "Sandbox Themes Module"
Cohesion: 0.25
Nodes (5): applyTweaks(), DENSITIES, LIGHT_OVERLAYS, THEMES, VOICES

### Community 41 - "Console Mentor Concepts"
Cohesion: 0.33
Nodes (7): M — the executive mentor character, Admin-view privacy toggle (redaction preview), Live Dossier side panel, em.console.v1 localStorage persistence, OnboardingFlow diagnostic, ConsoleScreen (mentor chat + dossier), VOICES (boardroom/coach/provocateur sysprompts)

### Community 42 - "Project Setup & Tooling"
Cohesion: 0.33
Nodes (6): Next.js agent rules, Graphify project rules, ESLint Config, Next.js framework, README project overview, Vercel deployment

### Community 43 - "Roadmap What-If Replanning"
Cohesion: 0.40
Nodes (6): What-if alt-trajectory replanning, AltCard ghost-path branch, RePlanModal — generate alt-trajectory, RoadmapScreen (timeline + what-if), SEED_MILESTONES sample career arc, Timeline component (vertical milestones)

### Community 44 - "Sandbox Themes (export)"
Cohesion: 0.33
Nodes (4): DENSITIES, LIGHT_OVERLAYS, THEMES, VOICES

### Community 45 - "Community 45"
Cohesion: 0.40
Nodes (5): attachShapes, generatePrompt (7-year trajectory), POST /api/roadmap/generate, replanPrompt (what-if re-planning), validateMilestones

### Community 47 - "Community 47"
Cohesion: 0.60
Nodes (5): applyTweaks(theme,density,mode) CSS-var writer, DENSITIES (cinematic/editorial/terminal), LIGHT_OVERLAYS per-theme palette, Theme/density/voice config module, THEMES (editorial/chairman/bauhaus)

### Community 48 - "Community 48"
Cohesion: 0.50
Nodes (4): Next.js Breaking-Changes Agent Rule, Graphify Workflow Rules, Local Permission Allowlist, Graphify PreToolUse Bash Hook

### Community 54 - "Community 54"
Cohesion: 0.67
Nodes (3): Claude Design HTML/CSS/JS handoff bundle, Pixel-perfect recreation directive (don't copy structure), Sandbox handoff README

## Ambiguous Edges - Review These
- `replan` → `Icon`  [AMBIGUOUS]
  components/roadmap/RoadmapScreen.tsx · relation: depends_on_ai
- `SuggestionChip` → `Diagnostic`  [AMBIGUOUS]
  components/console/Suggestions.tsx · relation: semantically_similar_to
- `pickArchetype(prompt)` → `8 Assessment Archetypes (Builder, Healer, Inquirer, Connector, Guardian, Visionary, Navigator, Performer)`  [AMBIGUOUS]
  lib/mockAI.ts · relation: conceptually_related_to
- `Production Next.js app (app/ in repo root)` → `Executive Mentor product (sandbox prototype)`  [AMBIGUOUS]
  /Users/adityarajkashyap/Desktop/executive-mentor/test/project/export/src/src/app.jsx · relation: prototype_of

## Knowledge Gaps
- **268 isolated node(s):** `@tailwindcss/postcss plugin`, `next-env.d.ts types reference`, `ESLint Config`, `Next.js Config`, `Production Next.js app (app/ in repo root)` (+263 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `replan` and `Icon`?**
  _Edge tagged AMBIGUOUS (relation: depends_on_ai) - confidence is low._
- **What is the exact relationship between `SuggestionChip` and `Diagnostic`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **What is the exact relationship between `pickArchetype(prompt)` and `8 Assessment Archetypes (Builder, Healer, Inquirer, Connector, Guardian, Visionary, Navigator, Performer)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Production Next.js app (app/ in repo root)` and `Executive Mentor product (sandbox prototype)`?**
  _Edge tagged AMBIGUOUS (relation: prototype_of) - confidence is low._
- **Why does `Executive Mentor prototype shell (design handoff)` connect `Root Layout & Shared Chrome` to `Sandbox Tweaks Panel (React)`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Why does `TweaksPanel (design-time tweaks shell + host edit-mode protocol)` connect `Sandbox Tweaks Panel (React)` to `Root Layout & Shared Chrome`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `App root component (hash router)` connect `Sandbox App Router & Chrome` to `First-Year Onboarding Flow`, `Sandbox Tweaks Panel (React)`, `Roadmap Timeline Concepts`, `Design Brief & Aesthetic Decisions`, `Production Dashboard Screens`, `Landing Pitch Composition`, `Sandbox AI Console Concepts`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._