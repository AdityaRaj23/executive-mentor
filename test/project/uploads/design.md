# Executive Mentor

## Product Overview

**The Pitch:** An enterprise-grade AI career mentorship platform that bridges the gap between individual ambition and institutional oversight. It delivers bespoke, actionable career guidance to users while providing institutions with macro-level analytics on workforce readiness and trajectory.

**For:** Institutional leaders tracking cohort progress, ambitious professionals seeking strategic career advice, and seed-stage investors evaluating market potential.

**Device:** desktop

**Design Direction:** A commanding, editorial aesthetic utilizing deep navy, slate, and vibrant emerald. High-contrast serif typography paired with premium glassmorphism creates an atmosphere of authority, wisdom, and modern sophistication.

**Inspired by:** The Wall Street Journal, MasterClass

---

## Screens

- **Landing Pitch:** Investor-optimized showcase of platform capabilities and market value
- **AI Mentorship Console:** Split-pane interface for deep, context-aware career conversations
- **Career Roadmap:** Visual timeline of the individual's strategic milestones and skills
- **Institutional Dashboard:** High-level metrics tracking cohort sentiment, engagement, and readiness

---

## Key Flows

**Strategic Mentorship Setup:** Individual initiates career planning
1. User is on **AI Mentorship Console** -> sees greeting and prompt suggestions
2. User clicks **"Map my path to VP"** -> AI begins a multi-turn diagnostic assessment
3. System generates dynamic milestones on the **Career Roadmap**

**Cohort Analysis:** Admin evaluates student progress
1. Admin is on **Institutional Dashboard** -> sees aggregate engagement metrics
2. Admin clicks **"Skill Gap Analysis"** -> filters cohort by targeted industry
3. System displays a heat-mapped table of missing competencies

---

<details>
<summary>Design System</summary>

## Color Palette

- **Primary:** `#0F292F` - Deep navy for strong structural elements
- **Background:** `#050A0F` - Abyss slate for depth
- **Surface:** `#141E28` - Glassmorphic panels (used with 60% opacity and backdrop blur)
- **Text:** `#F0F4F8` - Ice white for crisp readability
- **Muted:** `#829AB1` - Cool grey for secondary data and borders
- **Accent:** `#10B981` - Emerald green for success states, key CTAs, and data highlights

## Typography

- **Headings:** `Cormorant Garamond`, 700, 24-48px
- **Body:** `Hanken Grotesk`, 400, 16px
- **Small text:** `Hanken Grotesk`, 400, 13px
- **Buttons:** `Hanken Grotesk`, 600, 14px, uppercase tracking

**Style notes:** Extensive use of `backdrop-filter: blur(12px)` over deep slate backgrounds. `1px` solid borders using `rgba(255, 255, 255, 0.1)` to define structure. Sharp `2px` border radius to maintain an executive, editorial feel. Soft, expansive shadows `0 10px 40px rgba(0, 0, 0, 0.5)`.

## Design Tokens

```css
:root {
  --color-primary: #0F292F;
  --color-background: #050A0F;
  --color-surface: rgba(20, 30, 40, 0.6);
  --color-text: #F0F4F8;
  --color-muted: #829AB1;
  --color-accent: #10B981;
  --font-heading: 'Cormorant Garamond', serif;
  --font-body: 'Hanken Grotesk', sans-serif;
  --radius: 2px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 32px;
  --spacing-xl: 64px;
}
```

</details>

---

<details>
<summary>Screen Specifications</summary>

### Landing Pitch

**Purpose:** Convert institutional buyers and excite investors.

**Layout:** Full-height hero, alternating feature sections, stark dark mode aesthetic with emerald highlights.

**Key Elements:**
- **Hero Headline:** 64px `Cormorant Garamond`, center-aligned, "Wisdom at Scale."
- **Demo Terminal:** Glassmorphic panel simulating the AI interface, auto-typing a career query.
- **Investor Metrics Bar:** Fixed bottom banner, `14px` monospace showing simulated user acquisition stats.

**States:**
- **Loading:** Fade-in from `#050A0F` to reveal hero text.
- **Empty/Error:** N/A for static landing.

**Components:**
- **CTA Button:** `180px x 48px`, `#10B981` background, `#050A0F` text, sharp corners.

**Interactions:**
- **Hover CTA:** Background shifts to `#0EA5E9` (Sapphire), `0.2s` transition.

**Responsive:**
- **Desktop:** 3-column feature grid.
- **Tablet:** 2-column feature grid.
- **Mobile:** Stacked layout, `40px` hero text.

### AI Mentorship Console

**Purpose:** Deep, interactive career counseling.

**Layout:** Split-screen. Left 70% is the chat stream; Right 30% is a live contextual dossier.

**Key Elements:**
- **Chat Stream:** Alternating left/right messages. AI messages use `Cormorant Garamond` for headers, `Hanken Grotesk` for body.
- **Input Field:** Bottom-fixed, glassmorphic bar, `rgba(255, 255, 255, 0.05)` background, glowing `#10B981` send icon.
- **Live Dossier:** Right panel updating skills and goals dynamically as the chat progresses.

**States:**
- **Empty:** 3 large emerald-outlined suggestion chips ("Plan a pivot", "Ask for a raise").
- **Loading:** Pulsing `Cormorant Garamond` italic text: *"Analyzing trajectory..."*
- **Error:** Subtle red inline text block indicating connection failure.

**Components:**
- **AI Avatar:** `40x40px`, stylized serif 'M' inside a deep navy box.
- **Context Chip:** `#10B981` border, transparent background, `12px` text.

**Interactions:**
- **Click Send:** Input clears instantly, message slides up from bottom.
- **Hover Context Chip:** Fill turns `#10B981`, text turns `#050A0F`.

**Responsive:**
- **Desktop:** 70/30 split.
- **Tablet:** 60/40 split.
- **Mobile:** Dossier hidden behind a toggle menu.

### Career Roadmap

**Purpose:** Visual tracking of milestones and skill acquisition.

**Layout:** Vertical timeline centered on a dark canvas.

**Key Elements:**
- **Timeline Axis:** `2px` solid `#829AB1` vertical line.
- **Milestone Nodes:** `16px` circles on the axis. Completed are `#10B981`, future are `#141E28`.
- **Detail Cards:** Branching left/right from nodes, glassmorphic surface, `24px` padding.

**States:**
- **Empty:** Central pulsing node prompting "Begin your assessment".
- **Loading:** Skeleton nodes wiping from top to bottom.
- **Error:** Blurred timeline with "Failed to sync progress" overlay.

**Components:**
- **Skill Tag:** `rgba(16, 185, 129, 0.1)` background, `#10B981` text, `2px` radius.

**Interactions:**
- **Click Node:** Detail card expands smoothly `0.3s`, revealing actionable tasks.
- **Hover Card:** `1px` border glows `#F0F4F8`.

**Responsive:**
- **Desktop:** Alternating left/right cards.
- **Tablet:** Alternating left/right cards, narrower margins.
- **Mobile:** All cards on the right side of the axis.

### Institutional Dashboard

**Purpose:** Macro-level visibility for admin tracking and cohort analysis.

**Layout:** Dense, data-rich grid. Top metric ribbon, central charts, bottom data table.

**Key Elements:**
- **Metric Ribbon:** 4 cards showing Total Users, Engagement Rate, Top Skill Gap, Placement Probability.
- **Trajectory Chart:** Line graph using `#10B981` on dark `#141E28` grid lines.
- **Cohort Table:** High-density list of users, their primary tracks, and AI-assessed readiness score.

**States:**
- **Empty:** "No cohort data available. Invite members."
- **Loading:** Shimmering dark grey rectangles over chart areas.
- **Error:** Yellow warning banner below the top nav.

**Components:**
- **Readiness Score Badge:** `#10B981` for >80, `#F59E0B` for 50-80, `#EF4444` for <50.
- **Table Row:** `rgba(255, 255, 255, 0.02)` background, `1px` bottom border `#829AB1`.

**Interactions:**
- **Hover Table Row:** Background brightens to `rgba(255, 255, 255, 0.05)`.
- **Click Metric Card:** Chart below filters data `0.4s` fade transition.

**Responsive:**
- **Desktop:** 4x1 metric ribbon, side-by-side chart and secondary metrics.
- **Tablet:** 2x2 metric ribbon, stacked charts.
- **Mobile:** Stacked metrics, table requires horizontal scrolling.

</details>

---

<details>
<summary>Build Guide</summary>

**Stack:** HTML + Tailwind CSS v3

**Build Order:**
1. **AI Mentorship Console** - Establishes the core structural elements, glassmorphic design system, and split-pane layout mechanics.
2. **Career Roadmap** - Implements the timeline component and interactive node logic.
3. **Institutional Dashboard** - Applies the established visual language to data-dense components (charts, tables).
4. **Landing Pitch** - Repurposes components from above into a marketing format for investor demos.

</details>