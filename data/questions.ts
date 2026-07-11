// ============================================================
// BRAINLYTIC — ASSESSMENT QUESTION BANK
// File: questions.ts
// Usage: import { ALL_QUESTIONS, getModuleQuestions } from './questions'
// Claude Code: read this file to understand the full assessment
//              structure before building any assessment route or
//              scoring engine.
// ============================================================

// ── Types ────────────────────────────────────────────────────

export type ModuleId = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type QuestionType =
  | "conversational"   // Module 1 — open dialogue, no scoring
  | "multiple_choice"  // Modules 2, 3, 4, 6, 7
  | "slider"           // Module 5 — 0 to 100 numeric

export type HollandCode = "R" | "I" | "A" | "S" | "E" | "C"

export type Archetype =
  | "Builder"
  | "Healer"
  | "Inquirer"
  | "Connector"
  | "Guardian"
  | "Visionary"
  | "Navigator"
  | "Performer"

export type VARKMode = "V" | "A" | "R" | "K"

export type CareerValue =
  | "Achievement"
  | "Independence"
  | "Recognition"
  | "Altruism"
  | "Variety"
  | "Security"
  | "Creativity"
  | "Leadership"

export type AptitudeDimension =
  | "Verbal"
  | "Numerical"
  | "Logical"
  | "Spatial"

export type PressureDimension =
  | "Family_Pressure_Score"
  | "Desire_Gap_Score"
  | "Suppression_Score"
  | "Fear_Disappointment_Score"
  | "Personal_Clarity_Score"
  | "Peer_Pressure_Score"
  | "Authenticity_Score"
  | "Suppression_Detection_Score"
  | "Career_Anxiety_Score"
  | "Adult_Support_Score"

export interface ScoreIncrement {
  dimension: Archetype | HollandCode | AptitudeDimension | VARKMode | CareerValue | PressureDimension | "correct"
  points: number
}

export interface QuestionOption {
  key: string       // "A" | "B" | "C" | "D"
  text: string
  scoring: ScoreIncrement[]
}

export interface Question {
  id: number
  module: ModuleId
  module_name: string
  type: QuestionType
  question: string
  options?: QuestionOption[]
  // Slider-only fields
  anchor_lo?: string
  anchor_hi?: string
  slider_scoring?: string
  pressure_dimension?: PressureDimension
  flag?: string
  // Metadata
  maps_to: string
  research_note: string
  extraction_note?: string  // Module 1 only
}

// ── Module metadata ──────────────────────────────────────────

export const MODULES = {
  1: { name: "Conversational Onboarding",   count: 10, type: "conversational" },
  2: { name: "Aptitude Battery",            count: 20, type: "multiple_choice" },
  3: { name: "Interest Inventory",          count: 24, type: "multiple_choice" },
  4: { name: "Personality & Archetypes",    count: 24, type: "multiple_choice" },
  5: { name: "Emotional Pressure Gauge",    count: 10, type: "slider"          },
  6: { name: "Learning Style (VARK)",       count:  8, type: "multiple_choice" },
  7: { name: "Values Clarification",        count:  8, type: "multiple_choice" },
} as const

// ── Archetype scoring weights ────────────────────────────────
// Used by the scoring engine to normalise raw scores 0–100

export const ARCHETYPE_MAX_SCORES: Record<Archetype, number> = {
  Builder:   36,
  Healer:    36,
  Inquirer:  40,
  Connector: 36,
  Guardian:  32,
  Visionary: 40,
  Navigator: 36,
  Performer: 28,
}

export const HOLLAND_MAX_SCORES: Record<HollandCode, number> = {
  R: 48, I: 48, A: 48, S: 48, E: 48, C: 48,
}

// ── Counsellor flag thresholds ───────────────────────────────

export const FLAGS = {
  COUNSELLOR_MANDATORY_GAP:      60,  // Alignment gap > 60
  COUNSELLOR_MANDATORY_ANXIETY:  70,  // Career_Anxiety_Score > 70
  PARENT_MODULE_TRIGGER:         30,  // Adult_Support_Score < 30
  SUPPRESSION_FLAG:              60,  // Suppression_Detection_Score > 60
  CONFUSION_EXTENDED_ONBOARDING:  7,  // Confusion score from Q8 > 7
}

// ════════════════════════════════════════════════════════════
// MODULE 1 — CONVERSATIONAL ONBOARDING (Q1–Q10)
// Delivered by Arya as natural dialogue. No scoring.
// AI extracts structured JSON from responses silently.
// ════════════════════════════════════════════════════════════

const MODULE_1: Question[] = [
  {
    id: 1, module: 1, module_name: "Conversational Onboarding",
    type: "conversational",
    question: "What class are you in right now, and which board — CBSE, ICSE, or state board?",
    maps_to: "context.class, context.board",
    research_note: "Super's Career Development Theory — self-concept develops through structured exploration.",
    extraction_note: "Extract: { class: number, board: 'CBSE'|'ICSE'|'State' }. Feeds stream-selection logic and college pathway engine.",
  },
  {
    id: 2, module: 1, module_name: "Conversational Onboarding",
    type: "conversational",
    question: "Which city are you from — and would you say it is a big city, a mid-sized town, or a smaller place?",
    maps_to: "context.city, context.tier",
    research_note: "Gottfredson's circumscription theory — geographic accessibility shapes aspiration realism.",
    extraction_note: "Extract: { city: string, tier: 'Tier1'|'Tier2'|'Tier3' }. Feeds accessibility scoring in career recommendations.",
  },
  {
    id: 3, module: 1, module_name: "Conversational Onboarding",
    type: "conversational",
    question: "Have you already chosen your stream — Science, Commerce, or Arts — or are you still deciding?",
    maps_to: "context.stream_status",
    research_note: "Super's Life-Span theory — decision stage determines guidance depth needed.",
    extraction_note: "Extract: { stream_status: 'chosen'|'deciding'|'not_started', stream?: 'Science_PCM'|'Science_PCB'|'Commerce'|'Arts' }. If deciding: activate full stream-recommendation mode.",
  },
  {
    id: 4, module: 1, module_name: "Conversational Onboarding",
    type: "conversational",
    question: "Outside of school — what do you actually spend your time doing when nobody is telling you what to do?",
    maps_to: "signals.interests[], signals.archetype_early",
    research_note: "Self-Determination Theory (Deci & Ryan, 1985) — autonomous behaviour reveals intrinsic motivation free from social pressure.",
    extraction_note: "Extract: { free_time_activities: string[] }. Maps directly to Holland code and archetype signals. Highest validity question in module.",
  },
  {
    id: 5, module: 1, module_name: "Conversational Onboarding",
    type: "conversational",
    question: "Which subject in school feels the most natural to you — the one you do not have to force yourself to study?",
    maps_to: "signals.subject_ease[], aptitude.pre_calibration",
    research_note: "Bandura's Social Cognitive Career Theory — perceived self-efficacy correlates with natural ease.",
    extraction_note: "Extract: { easy_subjects: string[], hard_subjects: string[] }. Subject ease = cognitive fit proxy. Pre-calibrates aptitude module.",
  },
  {
    id: 6, module: 1, module_name: "Conversational Onboarding",
    type: "conversational",
    question: "Is there any career that you have been thinking about — even if you have not told anyone yet?",
    maps_to: "signals.private_aspiration",
    research_note: "Holland's vocational identity theory — private aspiration is less socially filtered than stated preference.",
    extraction_note: "Extract: { private_career: string | null }. Critical: compare to Q7 family expectation. Gap = first alignment signal.",
  },
  {
    id: 7, module: 1, module_name: "Conversational Onboarding",
    type: "conversational",
    question: "What career do the people around you — parents, relatives — expect you to pursue?",
    maps_to: "signals.family_expectation, pressure.early_signal",
    research_note: "Leong & Pearce (2011) — collectivist cultural context makes family expectation a dominant career variable in India.",
    extraction_note: "Extract: { family_expected_career: string }. Compare to Q6. Gap triggers pressure gauge attention.",
  },
  {
    id: 8, module: 1, module_name: "Conversational Onboarding",
    type: "conversational",
    question: "On a scale from 1 to 10, how clear do you feel about what you want to do with your life right now? 1 means very clear, 10 means completely lost.",
    maps_to: "context.confusion_score",
    research_note: "Career Decision-Making Self-Efficacy Scale (Taylor & Betz, 1983) — decisional clarity predicts guidance engagement.",
    extraction_note: "Extract: { confusion_score: number (1-10) }. Score > 7: activate extended onboarding. Score < 3: may indicate suppressed preference.",
  },
  {
    id: 9, module: 1, module_name: "Conversational Onboarding",
    type: "conversational",
    question: "Have you ever taken a career test or spoken to a career counsellor before? What happened?",
    maps_to: "context.prior_assessment, flags.dmit_flag",
    research_note: "Anchoring bias (Tversky & Kahneman, 1974) — prior assessments create reference points that distort new responses.",
    extraction_note: "Extract: { prior_assessment: boolean, assessment_type: string | null }. If DMIT mentioned: set flags.dmit_flag = true → add de-anchoring note in report.",
  },
  {
    id: 10, module: 1, module_name: "Conversational Onboarding",
    type: "conversational",
    question: "If I told you there are no wrong answers and your parents will never see this — what would you most love to do with your life?",
    maps_to: "signals.true_aspiration",
    research_note: "Brunstein (1993) — private goals correlate strongly with subjective wellbeing. Permission framing reduces social desirability bias.",
    extraction_note: "Extract: { true_aspiration: string }. Most revealing question in module. Compare to Q6 and Q7 for 3-way gap analysis.",
  },
]

// ════════════════════════════════════════════════════════════
// MODULE 2 — APTITUDE BATTERY (Q11–Q30)
// 5 questions per dimension. 30 seconds per question.
// Correct answer = +3. Time bonus: answer in <10s = +1 extra.
// ════════════════════════════════════════════════════════════

const MODULE_2: Question[] = [
  // ── VERBAL REASONING (Q11–Q15) ───────────────────────────
  {
    id: 11, module: 2, module_name: "Aptitude Battery — Verbal",
    type: "multiple_choice",
    question: "Complete the analogy: SURGEON is to SCALPEL as ARCHITECT is to ___",
    options: [
      { key: "A", text: "Building",    scoring: [{ dimension: "Verbal", points: 0 }] },
      { key: "B", text: "Blueprint",   scoring: [{ dimension: "Verbal", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "C", text: "Client",      scoring: [{ dimension: "Verbal", points: 0 }] },
      { key: "D", text: "Measurement", scoring: [{ dimension: "Verbal", points: 1 }] },
    ],
    maps_to: "aptitude.Verbal",
    research_note: "DAT verbal reasoning — professional tool analogy. Bennett et al. (1990).",
  },
  {
    id: 12, module: 2, module_name: "Aptitude Battery — Verbal",
    type: "multiple_choice",
    question: "Read this: Riya studied commerce for three years. She now runs a food blog with 200,000 followers and earns ₹1.2 lakh per month. Her parents consider her career a 'backup plan.' The best word to describe the gap in perspective here is:",
    options: [
      { key: "A", text: "Generational", scoring: [{ dimension: "Verbal", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "B", text: "Financial",    scoring: [{ dimension: "Verbal", points: 1 }] },
      { key: "C", text: "Educational",  scoring: [{ dimension: "Verbal", points: 1 }] },
      { key: "D", text: "Social",       scoring: [{ dimension: "Verbal", points: 2 }] },
    ],
    maps_to: "aptitude.Verbal",
    research_note: "Contextual vocabulary in India-relevant scenario. Reduces cultural bias.",
  },
  {
    id: 13, module: 2, module_name: "Aptitude Battery — Verbal",
    type: "multiple_choice",
    question: "Arrange these words into the most accurate true sentence: [careers / new / India / in / fastest-growing / are / creative fields]",
    options: [
      { key: "A", text: "New careers in India are fastest-growing creative fields",          scoring: [{ dimension: "Verbal", points: 0 }] },
      { key: "B", text: "In India, creative fields are among the fastest-growing new careers", scoring: [{ dimension: "Verbal", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "C", text: "India's creative fields are new and fast-growing careers",           scoring: [{ dimension: "Verbal", points: 1 }] },
      { key: "D", text: "Fastest-growing careers in India are new creative fields",           scoring: [{ dimension: "Verbal", points: 2 }] },
    ],
    maps_to: "aptitude.Verbal",
    research_note: "Sentence construction — dual-load task testing grammar and factual comprehension.",
  },
  {
    id: 14, module: 2, module_name: "Aptitude Battery — Verbal",
    type: "multiple_choice",
    question: "Which word does NOT belong: Empathy · Curiosity · Compassion · Patience · Precision",
    options: [
      { key: "A", text: "Empathy",   scoring: [{ dimension: "Verbal", points: 0 }] },
      { key: "B", text: "Curiosity", scoring: [{ dimension: "Verbal", points: 0 }] },
      { key: "C", text: "Precision", scoring: [{ dimension: "Verbal", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "D", text: "Patience",  scoring: [{ dimension: "Verbal", points: 0 }] },
    ],
    maps_to: "aptitude.Verbal",
    research_note: "Category exclusion — conceptual classification test.",
  },
  {
    id: 15, module: 2, module_name: "Aptitude Battery — Verbal",
    type: "multiple_choice",
    question: "A student says: 'I love talking to people, explaining things, and making complex ideas simple.' Based only on this, the most accurate career cluster is:",
    options: [
      { key: "A", text: "Engineering and technology",               scoring: [{ dimension: "Verbal", points: 0 }] },
      { key: "B", text: "Teaching, communication, and counselling", scoring: [{ dimension: "Verbal", points: 3 }, { dimension: "correct", points: 1 }, { dimension: "S", points: 2 }] },
      { key: "C", text: "Finance and accounting",                   scoring: [{ dimension: "Verbal", points: 0 }] },
      { key: "D", text: "Design and visual arts",                   scoring: [{ dimension: "Verbal", points: 1 }] },
    ],
    maps_to: "aptitude.Verbal, holland.S",
    research_note: "Applied verbal inference — career domain mapping from descriptive text.",
  },

  // ── NUMERICAL REASONING (Q16–Q20) ────────────────────────
  {
    id: 16, module: 2, module_name: "Aptitude Battery — Numerical",
    type: "multiple_choice",
    question: "A school has 1,200 students. 45% choose Science, 30% Commerce, 25% Arts. If Science has a 20% dropout rate by Class 12, how many Science students remain?",
    options: [
      { key: "A", text: "486", scoring: [{ dimension: "Numerical", points: 0 }] },
      { key: "B", text: "540", scoring: [{ dimension: "Numerical", points: 1 }] },
      { key: "C", text: "432", scoring: [{ dimension: "Numerical", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "D", text: "520", scoring: [{ dimension: "Numerical", points: 0 }] },
    ],
    maps_to: "aptitude.Numerical",
    research_note: "Multi-step percentage — DAT numerical battery. India education context.",
  },
  {
    id: 17, module: 2, module_name: "Aptitude Battery — Numerical",
    type: "multiple_choice",
    question: "A content creator earns ₹15,000 in Month 1. Earnings grow 20% each month. What do they earn in Month 4?",
    options: [
      { key: "A", text: "₹21,600", scoring: [{ dimension: "Numerical", points: 0 }] },
      { key: "B", text: "₹25,920", scoring: [{ dimension: "Numerical", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "C", text: "₹24,000", scoring: [{ dimension: "Numerical", points: 0 }] },
      { key: "D", text: "₹27,000", scoring: [{ dimension: "Numerical", points: 0 }] },
    ],
    maps_to: "aptitude.Numerical",
    research_note: "Compound growth — 15000 × 1.2³ = 25,920. Career income trajectory relevance.",
  },
  {
    id: 18, module: 2, module_name: "Aptitude Battery — Numerical",
    type: "multiple_choice",
    question: "3 out of every 5 engineering graduates in India work in a non-engineering field within 3 years. What percentage work in engineering?",
    options: [
      { key: "A", text: "30%", scoring: [{ dimension: "Numerical", points: 0 }] },
      { key: "B", text: "35%", scoring: [{ dimension: "Numerical", points: 0 }] },
      { key: "C", text: "40%", scoring: [{ dimension: "Numerical", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "D", text: "60%", scoring: [{ dimension: "Numerical", points: 1 }] },
    ],
    maps_to: "aptitude.Numerical",
    research_note: "Fraction-to-percentage conversion. Uses real India career stat for awareness.",
  },
  {
    id: 19, module: 2, module_name: "Aptitude Battery — Numerical",
    type: "multiple_choice",
    question: "Complete the series: 2, 6, 12, 20, 30, ___",
    options: [
      { key: "A", text: "40", scoring: [{ dimension: "Numerical", points: 0 }] },
      { key: "B", text: "42", scoring: [{ dimension: "Numerical", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "C", text: "44", scoring: [{ dimension: "Numerical", points: 0 }] },
      { key: "D", text: "48", scoring: [{ dimension: "Numerical", points: 0 }] },
    ],
    maps_to: "aptitude.Numerical",
    research_note: "Number series — differences are 4,6,8,10,12 (even increments). 30+12=42.",
  },
  {
    id: 20, module: 2, module_name: "Aptitude Battery — Numerical",
    type: "multiple_choice",
    question: "A counsellor charges ₹8,000/session × 4 students/day × 20 days = monthly revenue. Brainlytic charges ₹650/student/year for 600 students. How many times more does the counsellor earn per month?",
    options: [
      { key: "A", text: "8×",  scoring: [{ dimension: "Numerical", points: 0 }] },
      { key: "B", text: "16×", scoring: [{ dimension: "Numerical", points: 1 }] },
      { key: "C", text: "12×", scoring: [{ dimension: "Numerical", points: 0 }] },
      { key: "D", text: "~20×",scoring: [{ dimension: "Numerical", points: 3 }, { dimension: "correct", points: 1 }] },
    ],
    maps_to: "aptitude.Numerical",
    research_note: "Real-world business arithmetic using platform numbers. Counsellor: ₹6.4L/mo. Brainlytic: ₹32.5K/mo. ≈19.7×.",
  },

  // ── LOGICAL REASONING (Q21–Q25) ──────────────────────────
  {
    id: 21, module: 2, module_name: "Aptitude Battery — Logical",
    type: "multiple_choice",
    question: "All students scoring above 90% in Class 10 are eligible for Science stream. Priya: 87%. Rahul: 92%. Anjali: 90%. Which is definitely true?",
    options: [
      { key: "A", text: "Priya cannot take Science stream",  scoring: [{ dimension: "Logical", points: 1 }] },
      { key: "B", text: "Rahul is eligible for Science",     scoring: [{ dimension: "Logical", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "C", text: "Anjali is eligible for Science",    scoring: [{ dimension: "Logical", points: 1 }] },
      { key: "D", text: "Both B and C",                     scoring: [{ dimension: "Logical", points: 2 }] },
    ],
    maps_to: "aptitude.Logical",
    research_note: "Deductive syllogism. 90% is NOT above 90% — precision in rule interpretation.",
  },
  {
    id: 22, module: 2, module_name: "Aptitude Battery — Logical",
    type: "multiple_choice",
    question: "CREATIVITY → INNOVATION → GROWTH. A company has no GROWTH. What can we logically conclude?",
    options: [
      { key: "A", text: "The company has no creativity",                              scoring: [{ dimension: "Logical", points: 1 }] },
      { key: "B", text: "The company may lack creativity, innovation, or both",        scoring: [{ dimension: "Logical", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "C", text: "The company definitely has innovation but lacks growth drivers",scoring: [{ dimension: "Logical", points: 0 }] },
      { key: "D", text: "The company needs more funding",                              scoring: [{ dimension: "Logical", points: 0 }] },
    ],
    maps_to: "aptitude.Logical",
    research_note: "Modus tollens — chain logic. Absence of end result does not confirm which step failed.",
  },
  {
    id: 23, module: 2, module_name: "Aptitude Battery — Logical",
    type: "multiple_choice",
    question: "Doctor: helps individual patients. Nurse: helps individual patients. Epidemiologist: helps populations. The Epidemiologist is the odd one out because:",
    options: [
      { key: "A", text: "Epidemiologists earn less",                          scoring: [{ dimension: "Logical", points: 0 }] },
      { key: "B", text: "Epidemiologists work at population level, not individual", scoring: [{ dimension: "Logical", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "C", text: "Epidemiologists do not work in hospitals",           scoring: [{ dimension: "Logical", points: 0 }] },
      { key: "D", text: "Epidemiologists are less important",                 scoring: [{ dimension: "Logical", points: 0 }] },
    ],
    maps_to: "aptitude.Logical",
    research_note: "Inductive category identification — defining rule vs surface features.",
  },
  {
    id: 24, module: 2, module_name: "Aptitude Battery — Logical",
    type: "multiple_choice",
    question: "'I want to be an actor. Parents say acting is unstable. Therefore I should become an engineer.' What is the logical flaw?",
    options: [
      { key: "A", text: "There is no flaw — parents are right",                                    scoring: [{ dimension: "Logical", points: 0 }] },
      { key: "B", text: "The conclusion does not follow — many stable careers exist besides engineering", scoring: [{ dimension: "Logical", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "C", text: "Acting is actually stable so the premise is wrong",                       scoring: [{ dimension: "Logical", points: 1 }] },
      { key: "D", text: "The student should become a director instead",                            scoring: [{ dimension: "Logical", points: 0 }] },
    ],
    maps_to: "aptitude.Logical",
    research_note: "False dilemma / binary thinking detection. India career pressure context.",
  },
  {
    id: 25, module: 2, module_name: "Aptitude Battery — Logical",
    type: "multiple_choice",
    question: "Every successful entrepreneur had: Risk tolerance + Persistence + A problem to solve. Meera has risk tolerance and persistence. Her entrepreneurial potential?",
    options: [
      { key: "A", text: "Meera will definitely succeed",                            scoring: [{ dimension: "Logical", points: 0 }] },
      { key: "B", text: "She has two of three conditions — potential exists but unconfirmed", scoring: [{ dimension: "Logical", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "C", text: "She cannot be an entrepreneur without the third",          scoring: [{ dimension: "Logical", points: 2 }] },
      { key: "D", text: "She should study business to develop the third",           scoring: [{ dimension: "Logical", points: 0 }] },
    ],
    maps_to: "aptitude.Logical",
    research_note: "Necessary vs sufficient conditions — formal logic in career reasoning.",
  },

  // ── SPATIAL REASONING (Q26–Q30) ──────────────────────────
  {
    id: 26, module: 2, module_name: "Aptitude Battery — Spatial",
    type: "multiple_choice",
    question: "A room is 5m long × 4m wide. A 1m-wide corridor is added along one long side. What is the new total area?",
    options: [
      { key: "A", text: "20 sq m", scoring: [{ dimension: "Spatial", points: 0 }] },
      { key: "B", text: "24 sq m", scoring: [{ dimension: "Spatial", points: 1 }] },
      { key: "C", text: "25 sq m", scoring: [{ dimension: "Spatial", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "D", text: "28 sq m", scoring: [{ dimension: "Spatial", points: 0 }] },
    ],
    maps_to: "aptitude.Spatial",
    research_note: "2D spatial addition — architecture and engineering relevance.",
  },
  {
    id: 27, module: 2, module_name: "Aptitude Battery — Spatial",
    type: "multiple_choice",
    question: "A cube's front face shows a circle. You rotate it 90° to the right. Which face do you now see?",
    options: [
      { key: "A", text: "The same face",     scoring: [{ dimension: "Spatial", points: 0 }] },
      { key: "B", text: "The right-side face",scoring: [{ dimension: "Spatial", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "C", text: "The back face",     scoring: [{ dimension: "Spatial", points: 0 }] },
      { key: "D", text: "The top face",      scoring: [{ dimension: "Spatial", points: 0 }] },
    ],
    maps_to: "aptitude.Spatial",
    research_note: "Mental rotation — strong predictor of engineering and design aptitude.",
  },
  {
    id: 28, module: 2, module_name: "Aptitude Battery — Spatial",
    type: "multiple_choice",
    question: "A fashion designer's pattern must be symmetrical. The left half has a diagonal from top-left to bottom-right. The right half should have:",
    options: [
      { key: "A", text: "The same diagonal (top-left to bottom-right)", scoring: [{ dimension: "Spatial", points: 0 }] },
      { key: "B", text: "A diagonal from top-right to bottom-left",     scoring: [{ dimension: "Spatial", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "C", text: "A vertical line in the centre",                scoring: [{ dimension: "Spatial", points: 0 }] },
      { key: "D", text: "No line — the right half is blank",            scoring: [{ dimension: "Spatial", points: 0 }] },
    ],
    maps_to: "aptitude.Spatial",
    research_note: "Mirror symmetry — design and fashion career relevance.",
  },
  {
    id: 29, module: 2, module_name: "Aptitude Battery — Spatial",
    type: "multiple_choice",
    question: "A building looks like a rectangle from the front and an L-shape from above. The building is most likely:",
    options: [
      { key: "A", text: "A simple rectangular block", scoring: [{ dimension: "Spatial", points: 0 }] },
      { key: "B", text: "An L-shaped building",        scoring: [{ dimension: "Spatial", points: 3 }, { dimension: "correct", points: 1 }] },
      { key: "C", text: "A circular tower",            scoring: [{ dimension: "Spatial", points: 0 }] },
      { key: "D", text: "Two separate buildings",      scoring: [{ dimension: "Spatial", points: 0 }] },
    ],
    maps_to: "aptitude.Spatial",
    research_note: "Multi-view spatial reasoning — 2D views to 3D structure inference.",
  },
  {
    id: 30, module: 2, module_name: "Aptitude Battery — Spatial",
    type: "multiple_choice",
    question: "A flat sheet is folded once in a straight line. Which shape can be made?",
    options: [
      { key: "A", text: "A sphere",                         scoring: [{ dimension: "Spatial", points: 0 }] },
      { key: "B", text: "A cone",                           scoring: [{ dimension: "Spatial", points: 1 }] },
      { key: "C", text: "A cylinder",                       scoring: [{ dimension: "Spatial", points: 2 }] },
      { key: "D", text: "A triangular prism (tent shape)",  scoring: [{ dimension: "Spatial", points: 3 }, { dimension: "correct", points: 1 }] },
    ],
    maps_to: "aptitude.Spatial",
    research_note: "Paper folding / net visualisation — classic DAT spatial battery task.",
  },
]

// ════════════════════════════════════════════════════════════
// MODULE 3 — INTEREST INVENTORY (Q31–Q54)
// 24 "Would you rather" pairs. Each option increments a
// Holland RIASEC code. Top 2 codes = career interest code.
// ════════════════════════════════════════════════════════════

const MODULE_3: Question[] = [
  {
    id: 31, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Fix a broken motor or assemble something mechanical",        scoring: [{ dimension: "R", points: 2 }] },
      { key: "B", text: "Research why the motor broke and write a report on it",      scoring: [{ dimension: "I", points: 2 }] },
    ],
    maps_to: "holland.R vs holland.I · Builder vs Inquirer",
    research_note: "Holland RIASEC R-I pair. Hands-on execution vs analytical investigation.",
  },
  {
    id: 32, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Paint a mural for your school corridor",                     scoring: [{ dimension: "A", points: 2 }] },
      { key: "B", text: "Organise a school fundraiser and manage volunteers",         scoring: [{ dimension: "E", points: 2 }] },
    ],
    maps_to: "holland.A vs holland.E · Visionary vs Navigator",
    research_note: "A-E pair. Creative expression vs social leadership.",
  },
  {
    id: 33, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Tutor a struggling classmate in a subject you are good at", scoring: [{ dimension: "S", points: 2 }] },
      { key: "B", text: "Maintain the school attendance and record system perfectly", scoring: [{ dimension: "C", points: 2 }] },
    ],
    maps_to: "holland.S vs holland.C · Healer vs Guardian",
    research_note: "S-C pair. Helping individuals vs maintaining systems.",
  },
  {
    id: 34, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Build a working robot from spare parts",      scoring: [{ dimension: "R", points: 2 }] },
      { key: "B", text: "Write and direct a short film",               scoring: [{ dimension: "A", points: 2 }] },
    ],
    maps_to: "holland.R vs holland.A · Builder vs Visionary",
    research_note: "R-A pair. Physical construction vs creative expression.",
  },
  {
    id: 35, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Lead a debate team and argue cases in competition",          scoring: [{ dimension: "E", points: 2 }] },
      { key: "B", text: "Analyse data to find patterns in student exam results",     scoring: [{ dimension: "I", points: 2 }] },
    ],
    maps_to: "holland.E vs holland.I · Navigator vs Inquirer",
    research_note: "E-I pair. Persuasion and leadership vs data analysis.",
  },
  {
    id: 36, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Counsel a friend going through a difficult family situation", scoring: [{ dimension: "S", points: 2 }] },
      { key: "B", text: "Compose an original piece of music",                         scoring: [{ dimension: "A", points: 2 }] },
    ],
    maps_to: "holland.S vs holland.A · Healer vs Visionary",
    research_note: "S-A pair. Emotional support vs creative output.",
  },
  {
    id: 37, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Manage your school's annual budget and track every rupee",  scoring: [{ dimension: "C", points: 2 }] },
      { key: "B", text: "Volunteer at a hospital and assist patients",               scoring: [{ dimension: "S", points: 2 }] },
    ],
    maps_to: "holland.C vs holland.S · Guardian vs Healer",
    research_note: "C-S pair. System management vs direct human service.",
  },
  {
    id: 38, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Design a mobile app that solves a real problem",            scoring: [{ dimension: "R", points: 1 }, { dimension: "I", points: 1 }] },
      { key: "B", text: "Perform on stage in front of 500 people",                  scoring: [{ dimension: "A", points: 1 }, { dimension: "E", points: 1 }] },
    ],
    maps_to: "holland.RI vs holland.AE · Builder/Inquirer vs Visionary/Performer",
    research_note: "Cross-code pair. Technical creation vs performance expression.",
  },
  {
    id: 39, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Write an investigative article about a social issue",       scoring: [{ dimension: "I", points: 1 }, { dimension: "A", points: 1 }] },
      { key: "B", text: "Organise a community event that raises money for that issue",scoring: [{ dimension: "E", points: 1 }, { dimension: "S", points: 1 }] },
    ],
    maps_to: "holland.IA vs holland.ES · Journalism vs Social Entrepreneurship",
    research_note: "IA vs ES. Research and creative expression vs organising and helping.",
  },
  {
    id: 40, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Work alone on a complex coding problem until it is solved",  scoring: [{ dimension: "R", points: 1 }, { dimension: "I", points: 1 }] },
      { key: "B", text: "Coach a junior student through the same problem step by step",scoring: [{ dimension: "S", points: 2 }] },
    ],
    maps_to: "holland.RI vs holland.S · Technical solo vs teaching",
    research_note: "Key engineer vs teacher split.",
  },
  {
    id: 41, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Shoot and edit a documentary about street food culture",    scoring: [{ dimension: "A", points: 2 }] },
      { key: "B", text: "Analyse the economics of the street food industry",         scoring: [{ dimension: "I", points: 1 }, { dimension: "C", points: 1 }] },
    ],
    maps_to: "holland.A vs holland.IC · Creative storytelling vs analytical research",
    research_note: "Same domain, different Holland codes — expression vs analysis.",
  },
  {
    id: 42, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Be the lead negotiator in a business deal",                scoring: [{ dimension: "E", points: 2 }] },
      { key: "B", text: "Prepare all the legal documents and contracts for that deal",scoring: [{ dimension: "C", points: 2 }] },
    ],
    maps_to: "holland.E vs holland.C · Navigator vs Guardian within business",
    research_note: "E-C pair within business. Front-of-house vs back-office.",
  },
  {
    id: 43, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Develop a new surgical technique in a research lab",         scoring: [{ dimension: "I", points: 1 }, { dimension: "R", points: 1 }] },
      { key: "B", text: "Explain complex medical conditions to patients and families", scoring: [{ dimension: "S", points: 2 }] },
    ],
    maps_to: "holland.IR vs holland.S · Research medicine vs clinical communication",
    research_note: "Critical for NEET aspirants — research vs clinical practice split.",
  },
  {
    id: 44, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Create a brand identity — logo, colours, tagline — for a startup", scoring: [{ dimension: "A", points: 2 }] },
      { key: "B", text: "Build the financial model and pitch deck for that startup",         scoring: [{ dimension: "E", points: 1 }, { dimension: "C", points: 1 }] },
    ],
    maps_to: "holland.A vs holland.EC · Creative founder vs strategic founder",
    research_note: "Entrepreneur archetype split.",
  },
  {
    id: 45, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Teach underprivileged children basic literacy skills",                scoring: [{ dimension: "S", points: 2 }] },
      { key: "B", text: "Design the curriculum and programme structure for that initiative",   scoring: [{ dimension: "I", points: 1 }, { dimension: "C", points: 1 }] },
    ],
    maps_to: "holland.S vs holland.IC · Front-line service vs systemic design",
    research_note: "Social vs Investigative-Conventional — direct service vs programme design.",
  },
  {
    id: 46, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Write code that automates a boring repetitive task",        scoring: [{ dimension: "R", points: 1 }, { dimension: "I", points: 1 }] },
      { key: "B", text: "Write a story or script that moves people emotionally",     scoring: [{ dimension: "A", points: 2 }] },
    ],
    maps_to: "holland.RI vs holland.A · Technical problem-solving vs creative expression",
    research_note: "Computer science vs creative writing split.",
  },
  {
    id: 47, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Manage a team of 10 people and deliver a project on deadline",scoring: [{ dimension: "E", points: 2 }] },
      { key: "B", text: "Be the subject-matter expert the team comes to when stuck", scoring: [{ dimension: "I", points: 2 }] },
    ],
    maps_to: "holland.E vs holland.I · Management vs deep expertise",
    research_note: "Classic E-I split. Management vs specialist career paths.",
  },
  {
    id: 48, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Audit a company's financial records for accuracy",          scoring: [{ dimension: "C", points: 1 }, { dimension: "I", points: 1 }] },
      { key: "B", text: "Present that company's growth story to potential investors", scoring: [{ dimension: "E", points: 1 }, { dimension: "A", points: 1 }] },
    ],
    maps_to: "holland.CI vs holland.EA · CA/Auditor vs Investment Banker/Presenter",
    research_note: "Within finance — detail accuracy vs persuasive storytelling.",
  },
  {
    id: 49, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Design a bridge structure that holds maximum weight",       scoring: [{ dimension: "R", points: 1 }, { dimension: "I", points: 1 }] },
      { key: "B", text: "Advocate in court for a client who cannot afford a lawyer", scoring: [{ dimension: "S", points: 1 }, { dimension: "E", points: 1 }] },
    ],
    maps_to: "holland.RI vs holland.SE · Engineering vs Law",
    research_note: "Broad career divergence test — technical precision vs social justice.",
  },
  {
    id: 50, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Research the psychological reasons behind addiction",        scoring: [{ dimension: "I", points: 1 }, { dimension: "S", points: 1 }] },
      { key: "B", text: "Create a public awareness campaign to prevent addiction",   scoring: [{ dimension: "A", points: 1 }, { dimension: "S", points: 1 }] },
    ],
    maps_to: "holland.IS vs holland.AS · Research psychology vs science communication",
    research_note: "Both S — differentiates research vs communication pathway in helping careers.",
  },
  {
    id: 51, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Be first to discover a new scientific phenomenon",          scoring: [{ dimension: "I", points: 2 }] },
      { key: "B", text: "Be the person who explains that discovery to the world",   scoring: [{ dimension: "A", points: 1 }, { dimension: "S", points: 1 }] },
    ],
    maps_to: "holland.I vs holland.AS · Researcher vs Science Communicator",
    research_note: "Original discovery vs science journalism.",
  },
  {
    id: 52, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Train as a classical musician for 10 years to achieve mastery", scoring: [{ dimension: "A", points: 2 }] },
      { key: "B", text: "Produce and distribute music for 100 artists to reach more people",scoring: [{ dimension: "E", points: 2 }] },
    ],
    maps_to: "holland.A vs holland.E · Artist vs Music Industry Entrepreneur",
    research_note: "Personal artistic mastery vs scaling artistic impact.",
  },
  {
    id: 53, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Find the one overlooked legal precedent in 10,000 pages",  scoring: [{ dimension: "C", points: 1 }, { dimension: "I", points: 1 }] },
      { key: "B", text: "Argue the case before a judge with full confidence",        scoring: [{ dimension: "E", points: 2 }] },
    ],
    maps_to: "holland.CI vs holland.E · Research lawyer vs court-facing barrister",
    research_note: "Solicitor vs barrister split — research-heavy vs court-facing legal career.",
  },
  {
    id: 54, module: 3, module_name: "Interest Inventory",
    type: "multiple_choice",
    question: "Would you rather:",
    options: [
      { key: "A", text: "Build a working prototype of a new product with your hands", scoring: [{ dimension: "R", points: 2 }] },
      { key: "B", text: "Pitch that product to investors and secure ₹1 crore in funding",scoring: [{ dimension: "E", points: 2 }] },
    ],
    maps_to: "holland.R vs holland.E · Inventor vs Entrepreneur",
    research_note: "Technical creation vs commercial persuasion. Startup ecosystem careers.",
  },
]

// ════════════════════════════════════════════════════════════
// MODULE 4 — PERSONALITY & ARCHETYPES (Q55–Q78)
// 24 questions. Each answer increments archetype scores.
// Grounded in Big Five OCEAN + PMAI Jungian framework.
// ════════════════════════════════════════════════════════════

const MODULE_4: Question[] = [
  {
    id: 55, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "When I have a free afternoon, I most often end up:",
    options: [
      { key: "A", text: "Making, fixing, or building something physical",                         scoring: [{ dimension: "Builder",   points: 3 }] },
      { key: "B", text: "Reading, researching, or going deep into a topic I find interesting",   scoring: [{ dimension: "Inquirer",  points: 3 }] },
      { key: "C", text: "Calling a friend, meeting people, or doing something social",            scoring: [{ dimension: "Connector", points: 3 }, { dimension: "Performer", points: 1 }] },
      { key: "D", text: "Working on a creative project — writing, drawing, music, or design",    scoring: [{ dimension: "Visionary", points: 3 }] },
    ],
    maps_to: "archetypes — all 8",
    research_note: "Self-Determination Theory — autonomous behaviour reveals intrinsic motivation.",
  },
  {
    id: 56, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "In a group project, without anyone assigning roles, I naturally become:",
    options: [
      { key: "A", text: "The one who organises tasks and ensures deadlines are met",    scoring: [{ dimension: "Guardian",  points: 2 }, { dimension: "Navigator", points: 2 }] },
      { key: "B", text: "The one who researches and brings information to the group",  scoring: [{ dimension: "Inquirer",  points: 3 }] },
      { key: "C", text: "The one who keeps the team together and resolves conflict",   scoring: [{ dimension: "Connector", points: 3 }, { dimension: "Healer",    points: 1 }] },
      { key: "D", text: "The one who comes up with the creative concept or presentation",scoring: [{ dimension: "Visionary", points: 3 }, { dimension: "Performer", points: 1 }] },
    ],
    maps_to: "archetypes — emergent group role",
    research_note: "Emergent role in unstructured groups is one of the most reliable behavioural indicators.",
  },
  {
    id: 57, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "When I read about a problem in the world, my first instinct is:",
    options: [
      { key: "A", text: "I want to understand the root cause deeply before acting",                  scoring: [{ dimension: "Inquirer",  points: 3 }] },
      { key: "B", text: "I want to directly help the people affected right now",                    scoring: [{ dimension: "Healer",    points: 3 }] },
      { key: "C", text: "I want to organise others to solve it at scale",                           scoring: [{ dimension: "Navigator", points: 2 }, { dimension: "Guardian",  points: 2 }] },
      { key: "D", text: "I want to create something — campaign, story, design — that raises awareness",scoring: [{ dimension: "Visionary", points: 2 }, { dimension: "Connector", points: 2 }] },
    ],
    maps_to: "archetypes — problem response style",
    research_note: "Problem orientation reveals values hierarchy.",
  },
  {
    id: 58, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "Rate how much you agree: 'I prefer having clear rules and structured expectations over figuring things out as I go.'",
    options: [
      { key: "A", text: "Strongly agree — structure gives me confidence",       scoring: [{ dimension: "Guardian",  points: 3 }] },
      { key: "B", text: "Agree — I work better with clear guidelines",          scoring: [{ dimension: "Guardian",  points: 2 }, { dimension: "Navigator", points: 1 }] },
      { key: "C", text: "Neutral — depends on the situation",                   scoring: [{ dimension: "Builder",   points: 1 }] },
      { key: "D", text: "Disagree — I prefer to discover things my own way",   scoring: [{ dimension: "Visionary", points: 3 }, { dimension: "Inquirer",  points: 1 }] },
    ],
    maps_to: "archetypes — structure preference (Big Five Conscientiousness)",
    research_note: "Structure preference is a primary Big Five Conscientiousness indicator.",
  },
  {
    id: 59, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "When I explain something I know well to someone, I feel:",
    options: [
      { key: "A", text: "Energised — I love sharing knowledge and seeing understanding click",       scoring: [{ dimension: "Connector", points: 3 }, { dimension: "Healer",    points: 1 }] },
      { key: "B", text: "Fine, but I would rather just do the thing than explain it",               scoring: [{ dimension: "Builder",   points: 3 }] },
      { key: "C", text: "It depends — tiring unless I really care about the person",                scoring: [{ dimension: "Healer",    points: 2 }] },
      { key: "D", text: "Energised only if there is an audience — one-on-one feels too quiet",     scoring: [{ dimension: "Performer", points: 3 }] },
    ],
    maps_to: "archetypes — communication energy",
    research_note: "Communication energy reveals Extraversion and helping vs performing motivation.",
  },
  {
    id: 60, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "My biggest strength, if I am completely honest, is:",
    options: [
      { key: "A", text: "I notice things others miss and think more deeply than most",     scoring: [{ dimension: "Inquirer",  points: 3 }] },
      { key: "B", text: "I make people feel comfortable and understood",                  scoring: [{ dimension: "Healer",    points: 3 }, { dimension: "Connector", points: 1 }] },
      { key: "C", text: "I get things done — I am reliable and follow through",           scoring: [{ dimension: "Guardian",  points: 3 }, { dimension: "Builder",   points: 1 }] },
      { key: "D", text: "I can convince people, lead situations, and make things happen", scoring: [{ dimension: "Navigator", points: 3 }, { dimension: "Performer", points: 1 }] },
    ],
    maps_to: "archetypes — self-assessed core strength",
    research_note: "Super's career development theory — self-concept is central to career choice.",
  },
  {
    id: 61, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "When something goes wrong in a plan I was part of, I most naturally:",
    options: [
      { key: "A", text: "Analyse exactly what broke and why before moving on",    scoring: [{ dimension: "Inquirer",  points: 3 }] },
      { key: "B", text: "Make sure everyone in the team is okay first",           scoring: [{ dimension: "Healer",    points: 3 }, { dimension: "Connector", points: 1 }] },
      { key: "C", text: "Immediately start fixing it — action over analysis",    scoring: [{ dimension: "Builder",   points: 3 }, { dimension: "Guardian",  points: 1 }] },
      { key: "D", text: "Reframe the situation and find the hidden opportunity",  scoring: [{ dimension: "Visionary", points: 3 }, { dimension: "Navigator", points: 1 }] },
    ],
    maps_to: "archetypes — failure response style",
    research_note: "Crisis response reveals coping style and value priorities under pressure.",
  },
  {
    id: 62, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "I feel most alive and in my element when I am:",
    options: [
      { key: "A", text: "Working on something with my hands or technically — building, coding, designing physically",scoring: [{ dimension: "Builder",   points: 3 }] },
      { key: "B", text: "Having a really deep, meaningful conversation with one person",                           scoring: [{ dimension: "Healer",    points: 3 }, { dimension: "Connector", points: 1 }] },
      { key: "C", text: "Performing, presenting, or being the focal point of a group",                            scoring: [{ dimension: "Performer", points: 3 }] },
      { key: "D", text: "Figuring out a complex problem that nobody else has solved yet",                         scoring: [{ dimension: "Inquirer",  points: 3 }] },
    ],
    maps_to: "archetypes — peak experience / flow state",
    research_note: "Csikszentmihalyi's flow theory — flow state reveals dominant intrinsic motivation.",
  },
  {
    id: 63, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "My relationship with money and financial success is:",
    options: [
      { key: "A", text: "Very important — I want to be financially secure and successful",            scoring: [{ dimension: "Navigator", points: 3 }] },
      { key: "B", text: "It matters, but meaning and impact matter more",                             scoring: [{ dimension: "Healer",    points: 2 }, { dimension: "Connector", points: 1 }] },
      { key: "C", text: "I want enough to be comfortable — I prioritise other things",               scoring: [{ dimension: "Visionary", points: 2 }, { dimension: "Inquirer",  points: 1 }] },
      { key: "D", text: "It is a metric, not a goal — I focus on mastery and money follows",         scoring: [{ dimension: "Inquirer",  points: 3 }, { dimension: "Builder",   points: 1 }] },
    ],
    maps_to: "archetypes — financial motivation level",
    research_note: "Super's Work Values Inventory financial dimension.",
  },
  {
    id: 64, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "When I imagine my ideal work environment, it looks like:",
    options: [
      { key: "A", text: "A lab, workshop, or technical space — just me and the problem",              scoring: [{ dimension: "Inquirer",  points: 3 }, { dimension: "Builder",   points: 1 }] },
      { key: "B", text: "A people-filled office with constant collaboration and conversation",         scoring: [{ dimension: "Connector", points: 3 }, { dimension: "Performer", points: 1 }] },
      { key: "C", text: "Anywhere — I need flexibility and freedom to move between spaces",           scoring: [{ dimension: "Visionary", points: 3 }] },
      { key: "D", text: "A structured office with clear processes, a good team, and predictability",  scoring: [{ dimension: "Guardian",  points: 3 }, { dimension: "Navigator", points: 1 }] },
    ],
    maps_to: "archetypes — work environment preference",
    research_note: "Holland's person-environment fit theory.",
  },
  {
    id: 65, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "Rate how strongly you agree: 'I often find myself questioning rules or systems that seem inefficient or unfair.'",
    options: [
      { key: "A", text: "Strongly agree — I question most things",          scoring: [{ dimension: "Visionary", points: 3 }, { dimension: "Inquirer",  points: 1 }] },
      { key: "B", text: "Agree — but I pick my battles",                    scoring: [{ dimension: "Visionary", points: 2 }] },
      { key: "C", text: "Neutral — I notice but rarely challenge",          scoring: [{ dimension: "Connector", points: 1 }] },
      { key: "D", text: "Disagree — I prefer to work within the system",   scoring: [{ dimension: "Guardian",  points: 3 }] },
    ],
    maps_to: "archetypes — authority relationship (Openness vs Conscientiousness)",
    research_note: "Rule orientation is a primary Conscientiousness and Openness indicator.",
  },
  {
    id: 66, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "The kind of work that gives me the most satisfaction is work that:",
    options: [
      { key: "A", text: "Produces something tangible I can point to and say 'I made that'",     scoring: [{ dimension: "Builder",   points: 3 }] },
      { key: "B", text: "Directly changes someone's life for the better",                       scoring: [{ dimension: "Healer",    points: 3 }] },
      { key: "C", text: "Pushes the boundaries of what is known or possible",                   scoring: [{ dimension: "Inquirer",  points: 3 }, { dimension: "Visionary", points: 1 }] },
      { key: "D", text: "Builds something that outlasts me — a system, company, or institution",scoring: [{ dimension: "Navigator", points: 3 }, { dimension: "Guardian",  points: 1 }] },
    ],
    maps_to: "archetypes — legacy and satisfaction source",
    research_note: "Frankl's logotherapy — meaning as primary motivator.",
  },
  {
    id: 67, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "When a friend comes to me with a serious personal problem, I:",
    options: [
      { key: "A", text: "Listen completely before offering any opinion or solution", scoring: [{ dimension: "Connector", points: 2 }, { dimension: "Healer", points: 2 }] },
      { key: "B", text: "Try to solve it — I immediately think about what can be done",scoring: [{ dimension: "Builder",   points: 2 }, { dimension: "Navigator", points: 1 }] },
      { key: "C", text: "Empathise deeply and sit with them in the difficulty",      scoring: [{ dimension: "Healer",    points: 3 }] },
      { key: "D", text: "Gently challenge their thinking and offer a new perspective",scoring: [{ dimension: "Inquirer",  points: 2 }, { dimension: "Visionary", points: 1 }] },
    ],
    maps_to: "archetypes — interpersonal response style",
    research_note: "Empathic response style reveals Agreeableness and Social orientation.",
  },
  {
    id: 68, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "I am most proud of things I have done that were:",
    options: [
      { key: "A", text: "Technically complex and required real skill to pull off",    scoring: [{ dimension: "Builder",   points: 3 }, { dimension: "Inquirer",  points: 1 }] },
      { key: "B", text: "Emotionally difficult but important for someone I care about",scoring: [{ dimension: "Healer",    points: 3 }] },
      { key: "C", text: "Creatively original — things nobody else had thought of",   scoring: [{ dimension: "Visionary", points: 3 }] },
      { key: "D", text: "Strategically smart — I saw what needed to happen",         scoring: [{ dimension: "Navigator", points: 3 }] },
    ],
    maps_to: "archetypes — pride source (achievement motivation type)",
    research_note: "McClelland's achievement theory.",
  },
  {
    id: 69, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "If I am honest, my biggest weakness is:",
    options: [
      { key: "A", text: "I overthink everything and struggle to take action",                           scoring: [{ dimension: "Inquirer",  points: 3 }] },
      { key: "B", text: "I care too much what people think and find it hard to disappoint others",     scoring: [{ dimension: "Healer",    points: 3 }, { dimension: "Connector", points: 1 }] },
      { key: "C", text: "I get bored with routine and lose interest quickly",                          scoring: [{ dimension: "Visionary", points: 3 }, { dimension: "Performer", points: 1 }] },
      { key: "D", text: "I can be too blunt or impatient with people who don't move as fast as I do", scoring: [{ dimension: "Navigator", points: 3 }] },
    ],
    maps_to: "archetypes — shadow side mapping",
    research_note: "Shadow side questions provide more honest archetype signals than strength questions.",
  },
  {
    id: 70, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "In 20 years, the thing I most want to be known for is:",
    options: [
      { key: "A", text: "Building something that works perfectly and lasts",                       scoring: [{ dimension: "Builder",   points: 3 }] },
      { key: "B", text: "Having genuinely helped people and made their lives better",              scoring: [{ dimension: "Healer",    points: 3 }] },
      { key: "C", text: "Creating something original that changed how people see the world",      scoring: [{ dimension: "Visionary", points: 3 }] },
      { key: "D", text: "Leading something significant — a company, movement, or institution",    scoring: [{ dimension: "Navigator", points: 3 }, { dimension: "Guardian", points: 1 }] },
    ],
    maps_to: "archetypes — legacy aspiration (strongest signal question)",
    research_note: "Super's developmental career theory — long-term self-concept.",
  },
  {
    id: 71, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "When I encounter a topic I know nothing about, I:",
    options: [
      { key: "A", text: "Want to understand every layer of it — I go deep immediately",       scoring: [{ dimension: "Inquirer",  points: 3 }] },
      { key: "B", text: "Want to know the practical application — what can I do with this?", scoring: [{ dimension: "Builder",   points: 3 }, { dimension: "Navigator", points: 1 }] },
      { key: "C", text: "Want to see how it connects to people and their lives",             scoring: [{ dimension: "Connector", points: 3 }, { dimension: "Healer",    points: 1 }] },
      { key: "D", text: "Want to create something with it — how can I express this?",       scoring: [{ dimension: "Visionary", points: 3 }] },
    ],
    maps_to: "archetypes — learning motivation style",
    research_note: "Constructivist learning theory — epistemic orientation reveals archetype.",
  },
  {
    id: 72, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "Rate your agreement: 'I genuinely enjoy public speaking, presenting, or performing in front of others.'",
    options: [
      { key: "A", text: "Strongly agree — I come alive in front of an audience",                scoring: [{ dimension: "Performer", points: 3 }, { dimension: "Connector", points: 1 }] },
      { key: "B", text: "Agree — I am good at it even if it takes preparation",                scoring: [{ dimension: "Navigator", points: 2 }, { dimension: "Connector", points: 2 }] },
      { key: "C", text: "Neutral — I can do it but it drains me",                              scoring: [{ dimension: "Builder",   points: 1 }] },
      { key: "D", text: "Disagree — I strongly prefer smaller settings or one-on-one",         scoring: [{ dimension: "Inquirer",  points: 3 }, { dimension: "Healer",    points: 1 }] },
    ],
    maps_to: "archetypes — performance comfort (Extraversion)",
    research_note: "Stage comfort is the most direct Extraversion indicator in career contexts.",
  },
  {
    id: 73, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "The career that would make me feel I wasted my potential is:",
    options: [
      { key: "A", text: "A job where I follow orders and never get to innovate or decide",   scoring: [{ dimension: "Visionary", points: 3 }, { dimension: "Navigator", points: 1 }] },
      { key: "B", text: "A job where I never interact meaningfully with other people",       scoring: [{ dimension: "Connector", points: 3 }, { dimension: "Healer",    points: 1 }] },
      { key: "C", text: "A job where I never get to create something original",             scoring: [{ dimension: "Visionary", points: 3 }] },
      { key: "D", text: "A job where I do not have clear metrics of success",               scoring: [{ dimension: "Navigator", points: 3 }, { dimension: "Guardian",  points: 1 }] },
    ],
    maps_to: "archetypes — negative aspiration (avoidance motivation)",
    research_note: "McClelland's avoidance motivation — what each archetype fears.",
  },
  {
    id: 74, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "When I hear 'career in government service (IAS/IPS)', I feel:",
    options: [
      { key: "A", text: "Drawn to it — structure, security, and serving the nation appeals to me", scoring: [{ dimension: "Guardian",  points: 3 }] },
      { key: "B", text: "Neutral — depends on the role and the impact",                            scoring: [{ dimension: "Connector", points: 1 }, { dimension: "Healer", points: 1 }] },
      { key: "C", text: "Slightly put off — I need more flexibility than most government roles",   scoring: [{ dimension: "Visionary", points: 2 }, { dimension: "Performer", points: 1 }] },
      { key: "D", text: "Conflicted — my family expects it but I am not sure it is right for me", scoring: [] }, // D = pressure flag only
    ],
    maps_to: "archetypes — Guardian vs Visionary · D response triggers pressure correlation flag",
    research_note: "India-specific. D response is flagged for Module 5 pressure correlation.",
  },
  {
    id: 75, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "How often do you start projects with great enthusiasm but lose interest before finishing?",
    options: [
      { key: "A", text: "Rarely — I am built for completion and follow-through",               scoring: [{ dimension: "Guardian",  points: 3 }, { dimension: "Builder",   points: 1 }] },
      { key: "B", text: "Sometimes — if the project stops feeling meaningful",                scoring: [{ dimension: "Healer",    points: 2 }, { dimension: "Connector", points: 1 }] },
      { key: "C", text: "Often — I generate ideas faster than I can execute them",            scoring: [{ dimension: "Visionary", points: 3 }] },
      { key: "D", text: "It depends — I finish things that truly matter to me",              scoring: [{ dimension: "Inquirer",  points: 2 }] },
    ],
    maps_to: "archetypes — Conscientiousness vs Openness trade-off",
    research_note: "Low follow-through + high idea generation = Visionary archetype signature.",
  },
  {
    id: 76, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "The thought that keeps me up at night most often is:",
    options: [
      { key: "A", text: "A problem I have not solved yet — I mentally work on it until I find the answer", scoring: [{ dimension: "Inquirer",  points: 3 }, { dimension: "Builder",   points: 1 }] },
      { key: "B", text: "Worry about someone I care about",                                               scoring: [{ dimension: "Healer",    points: 3 }, { dimension: "Connector", points: 1 }] },
      { key: "C", text: "Excitement about something I am creating or building",                           scoring: [{ dimension: "Visionary", points: 3 }] },
      { key: "D", text: "Strategic thinking about where I want to be in 5 years",                        scoring: [{ dimension: "Navigator", points: 3 }] },
    ],
    maps_to: "archetypes — nocturnal thought content (strongest unconscious signal)",
    research_note: "Night-time rumination reveals dominant motivation without social filtering.",
  },
  {
    id: 77, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "Rate your agreement: 'The most important measure of a successful career is financial income.'",
    options: [
      { key: "A", text: "Strongly agree — income is the clearest measure",               scoring: [{ dimension: "Navigator", points: 3 }] },
      { key: "B", text: "Partially agree — income matters but is not everything",        scoring: [{ dimension: "Navigator", points: 1 }, { dimension: "Guardian",  points: 1 }] },
      { key: "C", text: "Disagree — impact, mastery, and meaning matter more",           scoring: [{ dimension: "Healer",    points: 2 }, { dimension: "Inquirer",  points: 2 }] },
      { key: "D", text: "Strongly disagree — I will not measure my life in money",      scoring: [{ dimension: "Visionary", points: 3 }, { dimension: "Healer",    points: 1 }] },
    ],
    maps_to: "archetypes — financial motivation · also captures internalised parent values",
    research_note: "Financial motivation is a Work Values Inventory dimension.",
  },
  {
    id: 78, module: 4, module_name: "Personality & Archetypes",
    type: "multiple_choice",
    question: "I would be most devastated if I spent my career and never ___",
    options: [
      { key: "A", text: "Built or created something that actually works and is used by people",scoring: [{ dimension: "Builder",   points: 3 }] },
      { key: "B", text: "Made a meaningful difference to someone's life directly",             scoring: [{ dimension: "Healer",    points: 3 }] },
      { key: "C", text: "Expressed myself fully and left something original in the world",    scoring: [{ dimension: "Visionary", points: 3 }, { dimension: "Performer", points: 1 }] },
      { key: "D", text: "Achieved the level of success and recognition I know I am capable of",scoring: [{ dimension: "Navigator", points: 3 }, { dimension: "Performer", points: 1 }] },
    ],
    maps_to: "archetypes — ultimate career regret (most emotionally loaded signal question)",
    research_note: "Regret minimisation framing — Bezos's career regret framework.",
  },
]

// ════════════════════════════════════════════════════════════
// MODULE 5 — EMOTIONAL PRESSURE GAUGE (Q79–Q88)
// Slider questions 0–100. No options — numeric input only.
// Produces Family_Pressure_Score, Personal_Clarity_Score,
// Desire_Gap_Score, and Alignment_Gap.
// Gap > 60 = mandatory counsellor referral.
// ════════════════════════════════════════════════════════════

const MODULE_5: Question[] = [
  {
    id: 79, module: 5, module_name: "Emotional Pressure Gauge",
    type: "slider",
    question: "How much pressure do you feel from your family to pursue a specific career?",
    anchor_lo: "No pressure at all — they support whatever I choose",
    anchor_hi: "Extreme pressure — it has already been decided for me",
    slider_scoring: "0–30: Low. 31–60: Moderate. 61–100: High. Store as Family_Pressure_Score.",
    pressure_dimension: "Family_Pressure_Score",
    maps_to: "pressure.Family_Pressure_Score",
    research_note: "Leong & Pearce (2011) — collectivist cultural context makes family expectation dominant in India.",
  },
  {
    id: 80, module: 5, module_name: "Emotional Pressure Gauge",
    type: "slider",
    question: "How different is the career YOU privately want from the career your FAMILY expects?",
    anchor_lo: "Exactly the same — we are fully aligned",
    anchor_hi: "Completely different — like two different worlds",
    slider_scoring: "0–20: Strong alignment. 21–50: Partial mismatch. 51–100: High mismatch. Store as Desire_Gap_Score. MOST IMPORTANT variable — used to calculate Alignment_Gap.",
    pressure_dimension: "Desire_Gap_Score",
    flag: "DGS > 60 → activate counsellor CTA",
    maps_to: "pressure.Desire_Gap_Score (CRITICAL)",
    research_note: "Gottfredson's compromise theory — circumscription of aspiration under social pressure.",
  },
  {
    id: 81, module: 5, module_name: "Emotional Pressure Gauge",
    type: "slider",
    question: "How often do you feel you cannot say what you actually want to do with your life — around family?",
    anchor_lo: "I can say exactly what I want and they will listen",
    anchor_hi: "I have never once been able to say what I actually want",
    slider_scoring: "High scores indicate suppressed preference. Correlate with Q10 (Module 1) true aspiration response. Store as Suppression_Score.",
    pressure_dimension: "Suppression_Score",
    maps_to: "pressure.Suppression_Score",
    research_note: "Lent, Brown & Hackett SCCT (1994) — social barriers suppress career self-efficacy.",
  },
  {
    id: 82, module: 5, module_name: "Emotional Pressure Gauge",
    type: "slider",
    question: "How much does the fear of disappointing your parents influence your career thinking?",
    anchor_lo: "Not at all — I make decisions independently",
    anchor_hi: "It completely drives my choices — I cannot think past it",
    slider_scoring: "0–30: Independent. 31–70: Partially fear-driven. 71–100: Fear-dominant. High scores flag for Healer/Connector archetype suppression.",
    pressure_dimension: "Fear_Disappointment_Score",
    maps_to: "pressure.Fear_Disappointment_Score · parental approval weight",
    research_note: "Deci & Ryan — fear of social disapproval reduces autonomous motivation.",
  },
  {
    id: 83, module: 5, module_name: "Emotional Pressure Gauge",
    type: "slider",
    question: "How clear are YOU — not your parents, not your teachers — about what kind of work would make you genuinely happy?",
    anchor_lo: "Completely clear — I know exactly",
    anchor_hi: "Completely lost — I have no idea",
    slider_scoring: "INVERT scale for Personal_Clarity_Score: slider 0 = PCS 100, slider 100 = PCS 0. Store as Personal_Clarity_Score.",
    pressure_dimension: "Personal_Clarity_Score",
    maps_to: "pressure.Personal_Clarity_Score (PCS) — core self-knowledge indicator",
    research_note: "Career Decision-Making Self-Efficacy Scale — decisional clarity predicts guidance engagement.",
  },
  {
    id: 84, module: 5, module_name: "Emotional Pressure Gauge",
    type: "slider",
    question: "How much does peer pressure — what your friends are planning — affect your career thinking?",
    anchor_lo: "Not at all — I do not compare myself to friends",
    anchor_hi: "Enormously — I feel like I am falling behind if I am different",
    slider_scoring: "0–30: Peer-independent. 31–60: Peer-influenced. 61–100: Peer-driven. High peer + high family = compounded social pressure flag.",
    pressure_dimension: "Peer_Pressure_Score",
    maps_to: "pressure.Peer_Pressure_Score · secondary social pressure input",
    research_note: "Social comparison theory (Festinger, 1954) — peer comparison amplifies career anxiety.",
  },
  {
    id: 85, module: 5, module_name: "Emotional Pressure Gauge",
    type: "slider",
    question: "How much of your current thinking about careers feels genuinely YOUR OWN versus absorbed from people around you?",
    anchor_lo: "100% my own — I have thought this through independently",
    anchor_hi: "None of it feels mine — I am echoing what I have been told",
    slider_scoring: "INVERT scale for Authenticity_Score: slider 0 = Auth 100, slider 100 = Auth 0. Store as Authenticity_Score.",
    pressure_dimension: "Authenticity_Score",
    maps_to: "pressure.Authenticity_Score · self-determination indicator",
    research_note: "Self-Determination Theory — internalised vs identified vs introjected motivation.",
  },
  {
    id: 86, module: 5, module_name: "Emotional Pressure Gauge",
    type: "slider",
    question: "If you knew your family would support ANY career you chose — would your answer about your ideal career change?",
    anchor_lo: "Not at all — my answer would be the same",
    anchor_hi: "Completely — I would choose something entirely different",
    slider_scoring: "0–20: No suppression. 21–60: Partial suppression. 61–100: Strong suppression. Most direct suppression detection question. High score = strong hidden preference exists.",
    pressure_dimension: "Suppression_Detection_Score",
    flag: "Score > 60 → activate suppression flag → add 'What you might really want' section in report",
    maps_to: "pressure.Suppression_Detection_Score (most direct hidden preference indicator)",
    research_note: "Counterfactual framing removes social constraint to surface authentic preference.",
  },
  {
    id: 87, module: 5, module_name: "Emotional Pressure Gauge",
    type: "slider",
    question: "How much decision-making anxiety do you feel when you think about choosing your career path?",
    anchor_lo: "None — I feel calm and clear about this",
    anchor_hi: "Extreme — even thinking about it makes me anxious",
    slider_scoring: "0–30: Low anxiety. 31–60: Normal career anxiety. 61–100: High anxiety. High anxiety + high pressure + low clarity = mandatory counsellor flag.",
    pressure_dimension: "Career_Anxiety_Score",
    flag: "Score > 70 → mandatory counsellor referral flag",
    maps_to: "pressure.Career_Anxiety_Score · mental wellness indicator",
    research_note: "Career Decision-Making Difficulties Questionnaire (Gati et al., 1996).",
  },
  {
    id: 88, module: 5, module_name: "Emotional Pressure Gauge",
    type: "slider",
    question: "How supported do you feel by the adults in your life in exploring who YOU actually are — beyond marks and grades?",
    anchor_lo: "Completely supported — they encourage my self-exploration",
    anchor_hi: "Not at all — everything is about results and nothing about me as a person",
    slider_scoring: "0–30: High support. 31–60: Partial support. 61–100: Low support. Low support score activates Parent Communication Module in report.",
    pressure_dimension: "Adult_Support_Score",
    flag: "Score > 70 → activate parent module in report",
    maps_to: "pressure.Adult_Support_Score · parent module trigger",
    research_note: "Attachment theory (Bowlby) — secure adult relationships enable identity exploration.",
  },
]

// ════════════════════════════════════════════════════════════
// MODULE 6 — LEARNING STYLE VARK (Q89–Q96)
// 8 scenario questions. Each answer = V, A, R, or K.
// Output: dominant learning modality + study recommendations.
// ════════════════════════════════════════════════════════════

const MODULE_6: Question[] = [
  {
    id: 89, module: 6, module_name: "Learning Style (VARK)",
    type: "multiple_choice",
    question: "You are learning something completely new — say, how to invest in the stock market. Your instinct is to:",
    options: [
      { key: "A", text: "Watch videos and look at charts, graphs, and visual explanations",         scoring: [{ dimension: "V", points: 2 }] },
      { key: "B", text: "Listen to a podcast or talk to someone who actually invests",              scoring: [{ dimension: "A", points: 2 }] },
      { key: "C", text: "Read books, articles, and detailed written guides cover to cover",         scoring: [{ dimension: "R", points: 2 }] },
      { key: "D", text: "Open a practice account and start making fake trades to learn by doing",  scoring: [{ dimension: "K", points: 2 }] },
    ],
    maps_to: "vark — initial learning approach",
    research_note: "Fleming & Mills VARK model (1992) — primary mode detection.",
  },
  {
    id: 90, module: 6, module_name: "Learning Style (VARK)",
    type: "multiple_choice",
    question: "You are trying to remember directions to a new place. You find it easiest when:",
    options: [
      { key: "A", text: "Someone draws you a map or you look at Google Maps visually",    scoring: [{ dimension: "V", points: 2 }] },
      { key: "B", text: "Someone describes the turns and landmarks verbally",             scoring: [{ dimension: "A", points: 2 }] },
      { key: "C", text: "You write the directions down step-by-step before you go",      scoring: [{ dimension: "R", points: 2 }] },
      { key: "D", text: "You walk the route once with someone and then you know it",     scoring: [{ dimension: "K", points: 2 }] },
    ],
    maps_to: "vark — spatial memory encoding",
    research_note: "Classic VARK navigation question — spatial memory encoding reveals modality.",
  },
  {
    id: 91, module: 6, module_name: "Learning Style (VARK)",
    type: "multiple_choice",
    question: "When studying for an important exam, the method that actually works best for you is:",
    options: [
      { key: "A", text: "Colour-coding notes, drawing diagrams, and making mind maps",             scoring: [{ dimension: "V", points: 2 }] },
      { key: "B", text: "Explaining the material out loud to yourself or recording yourself",      scoring: [{ dimension: "A", points: 2 }] },
      { key: "C", text: "Rewriting your notes neatly and reading them multiple times",             scoring: [{ dimension: "R", points: 2 }] },
      { key: "D", text: "Practising past papers, doing examples, and solving problems hands-on",  scoring: [{ dimension: "K", points: 2 }] },
    ],
    maps_to: "vark — study habit (strongest academic VARK indicator)",
    research_note: "Academic study habit — most reliable VARK indicator for school students.",
  },
  {
    id: 92, module: 6, module_name: "Learning Style (VARK)",
    type: "multiple_choice",
    question: "You are assembling furniture with 30 parts. Your natural approach is:",
    options: [
      { key: "A", text: "Spread all parts out and visually match them to the diagram first",      scoring: [{ dimension: "V", points: 2 }] },
      { key: "B", text: "Watch a YouTube video of someone assembling it step by step",            scoring: [{ dimension: "A", points: 2 }] },
      { key: "C", text: "Read the instruction manual carefully before touching anything",         scoring: [{ dimension: "R", points: 2 }] },
      { key: "D", text: "Start assembling immediately and figure it out as you go",               scoring: [{ dimension: "K", points: 2 }] },
    ],
    maps_to: "vark — procedural task learning",
    research_note: "Procedural task — kinesthetic vs reading distinction is clearest here.",
  },
  {
    id: 93, module: 6, module_name: "Learning Style (VARK)",
    type: "multiple_choice",
    question: "When you attend a lecture that is really engaging, what makes it engaging?",
    options: [
      { key: "A", text: "The teacher uses great slides, diagrams, and visuals throughout",    scoring: [{ dimension: "V", points: 2 }] },
      { key: "B", text: "The teacher explains clearly and tells stories and analogies",       scoring: [{ dimension: "A", points: 2 }] },
      { key: "C", text: "There are detailed notes and references to read alongside",          scoring: [{ dimension: "R", points: 2 }] },
      { key: "D", text: "There are activities, demonstrations, and things to try",            scoring: [{ dimension: "K", points: 2 }] },
    ],
    maps_to: "vark — preferred instruction format",
    research_note: "Classroom VARK detection — preferred instruction modality.",
  },
  {
    id: 94, module: 6, module_name: "Learning Style (VARK)",
    type: "multiple_choice",
    question: "When you try to explain something complex to a friend, you instinctively:",
    options: [
      { key: "A", text: "Draw a picture, diagram, or use hand gestures to show the shape of it", scoring: [{ dimension: "V", points: 2 }] },
      { key: "B", text: "Tell a story or use an analogy that sounds right",                      scoring: [{ dimension: "A", points: 2 }] },
      { key: "C", text: "Write it down or pull out your notes to show them exactly",             scoring: [{ dimension: "R", points: 2 }] },
      { key: "D", text: "Show them by doing it — demonstrate practically",                       scoring: [{ dimension: "K", points: 2 }] },
    ],
    maps_to: "vark — communication style as learning proxy",
    research_note: "Teaching others reveals own learning preference — teaching mirrors learning.",
  },
  {
    id: 95, module: 6, module_name: "Learning Style (VARK)",
    type: "multiple_choice",
    question: "You have two hours to learn a new skill. Which environment works best for you?",
    options: [
      { key: "A", text: "A quiet space with visual resources — diagrams, videos, charts",    scoring: [{ dimension: "V", points: 2 }] },
      { key: "B", text: "Having an expert talk you through it — even a phone call works",    scoring: [{ dimension: "A", points: 2 }] },
      { key: "C", text: "A good textbook or written guide you can annotate and re-read",     scoring: [{ dimension: "R", points: 2 }] },
      { key: "D", text: "Access to the actual tools and materials — learning by experimenting",scoring: [{ dimension: "K", points: 2 }] },
    ],
    maps_to: "vark — resource preference",
    research_note: "Environmental learning preference — Dunn & Dunn learning style model.",
  },
  {
    id: 96, module: 6, module_name: "Learning Style (VARK)",
    type: "multiple_choice",
    question: "After a really good class, what do you do to make sure you remember it?",
    options: [
      { key: "A", text: "Re-draw your diagrams and reorganise your visual notes",         scoring: [{ dimension: "V", points: 2 }] },
      { key: "B", text: "Talk it through with a friend or replay it in your head",        scoring: [{ dimension: "A", points: 2 }] },
      { key: "C", text: "Rewrite your notes cleanly and review them before sleeping",     scoring: [{ dimension: "R", points: 2 }] },
      { key: "D", text: "Apply what you learned to something real as soon as possible",   scoring: [{ dimension: "K", points: 2 }] },
    ],
    maps_to: "vark — retention strategy (reveals consolidation modality)",
    research_note: "Memory consolidation strategy reveals VARK dominant mode. Kolb (1984).",
  },
]

// ════════════════════════════════════════════════════════════
// MODULE 7 — VALUES CLARIFICATION (Q97–Q104) [wait — 8 Qs = Q97-Q104, but we started IDs at right numbers]
// Actually renumbering: Q89-Q96 above = Module 6
// Module 7 starts at Q97 but since this is a demo let's keep consistent
// ════════════════════════════════════════════════════════════

const MODULE_7: Question[] = [
  {
    id: 97, module: 7, module_name: "Values Clarification",
    type: "multiple_choice",
    question: "If you could only have ONE, which would you choose?",
    options: [
      { key: "A", text: "A career where you are seen as excellent and widely respected",    scoring: [{ dimension: "Achievement", points: 2 }, { dimension: "Recognition", points: 1 }] },
      { key: "B", text: "A career where you directly change people's lives for the better", scoring: [{ dimension: "Altruism", points: 2 }] },
    ],
    maps_to: "values — Achievement/Recognition vs Altruism",
    research_note: "Super's Work Values Inventory. Personal success vs service to others.",
  },
  {
    id: 98, module: 7, module_name: "Values Clarification",
    type: "multiple_choice",
    question: "Which would you give up harder?",
    options: [
      { key: "A", text: "The freedom to make your own decisions and set your own direction",     scoring: [{ dimension: "Independence", points: 2 }] },
      { key: "B", text: "The knowledge that your work genuinely matters to society",             scoring: [{ dimension: "Altruism", points: 2 }] },
    ],
    maps_to: "values — Independence vs Altruism",
    research_note: "Autonomy vs impact — fundamental career motivator split.",
  },
  {
    id: 99, module: 7, module_name: "Values Clarification",
    type: "multiple_choice",
    question: "You have been offered two roles. Which do you choose?",
    options: [
      { key: "A", text: "A highly stable, well-paying role with clear structure and zero uncertainty", scoring: [{ dimension: "Security", points: 2 }] },
      { key: "B", text: "An unpredictable, high-risk role that could be extraordinary or could fail",  scoring: [{ dimension: "Variety", points: 2 }, { dimension: "Independence", points: 1 }] },
    ],
    maps_to: "values — Security vs Variety/Independence",
    research_note: "Risk tolerance as values proxy — Guardian vs Visionary archetype alignment.",
  },
  {
    id: 100, module: 7, module_name: "Values Clarification",
    type: "multiple_choice",
    question: "Which would frustrate you more in a career?",
    options: [
      { key: "A", text: "Doing creative, interesting work that nobody sees or recognises", scoring: [{ dimension: "Recognition", points: 2 }] },
      { key: "B", text: "Being highly recognised for work that is not creative or original",scoring: [{ dimension: "Creativity",   points: 2 }] },
    ],
    maps_to: "values — Recognition vs Creativity",
    research_note: "Surface vs depth of satisfaction — what the student needs more.",
  },
  {
    id: 101, module: 7, module_name: "Values Clarification",
    type: "multiple_choice",
    question: "If you could only choose one:",
    options: [
      { key: "A", text: "Lead a team of 50 people building something significant",                 scoring: [{ dimension: "Leadership",   points: 2 }, { dimension: "Achievement", points: 1 }] },
      { key: "B", text: "Be the best individual contributor — the expert others come to",          scoring: [{ dimension: "Achievement",  points: 2 }] },
    ],
    maps_to: "values — Leadership vs Mastery",
    research_note: "Management vs deep expertise — Navigator vs Inquirer/Builder distinction.",
  },
  {
    id: 102, module: 7, module_name: "Values Clarification",
    type: "multiple_choice",
    question: "You are designing your dream career. The most essential element is:",
    options: [
      { key: "A", text: "That the work itself is constantly changing — every day is different",      scoring: [{ dimension: "Variety",      points: 2 }] },
      { key: "B", text: "That you have complete creative control over what you produce",             scoring: [{ dimension: "Creativity",   points: 2 }, { dimension: "Independence", points: 1 }] },
    ],
    maps_to: "values — Variety vs Creativity",
    research_note: "Change-seeking vs creative control.",
  },
  {
    id: 103, module: 7, module_name: "Values Clarification",
    type: "multiple_choice",
    question: "Which matters more to you in how you spend your working life?",
    options: [
      { key: "A", text: "Financial security and a comfortable, stable life for your family", scoring: [{ dimension: "Security",     points: 2 }] },
      { key: "B", text: "The respect and admiration of people whose opinions you value",     scoring: [{ dimension: "Recognition",  points: 2 }] },
    ],
    maps_to: "values — Security vs Recognition",
    research_note: "Material vs social reward preference.",
  },
  {
    id: 104, module: 7, module_name: "Values Clarification",
    type: "multiple_choice",
    question: "The career that would feel most empty, even if it paid extremely well, is one where:",
    options: [
      { key: "A", text: "You work alone with no meaningful connection to other people",          scoring: [{ dimension: "Altruism",   points: 2 }] },
      { key: "B", text: "You have no creative input — you just execute what others designed",   scoring: [{ dimension: "Creativity", points: 2 }] },
    ],
    maps_to: "values — Altruism/Connection vs Creativity",
    research_note: "Social connection vs creative expression — core unfulfillment sources.",
  },
]

// ════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════

export const ALL_QUESTIONS: Question[] = [
  ...MODULE_1,
  ...MODULE_2,
  ...MODULE_3,
  ...MODULE_4,
  ...MODULE_5,
  ...MODULE_6,
  ...MODULE_7,
]

// Get all questions for a specific module
export function getModuleQuestions(moduleId: ModuleId): Question[] {
  return ALL_QUESTIONS.filter(q => q.module === moduleId)
}

// Get a single question by ID
export function getQuestion(id: number): Question | undefined {
  return ALL_QUESTIONS.find(q => q.id === id)
}

// Get all multiple choice questions (for assessment rendering)
export function getAssessmentQuestions(): Question[] {
  return ALL_QUESTIONS.filter(q => q.type !== "conversational")
}

// Get all conversational questions (for Arya onboarding)
export function getOnboardingQuestions(): Question[] {
  return ALL_QUESTIONS.filter(q => q.type === "conversational")
}

// Get all slider questions (for pressure gauge)
export function getSliderQuestions(): Question[] {
  return ALL_QUESTIONS.filter(q => q.type === "slider")
}
