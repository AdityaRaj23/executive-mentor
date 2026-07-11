import {
  ARCHETYPE_MAX_SCORES,
  FLAGS,
  getAssessmentQuestions,
  getSliderQuestions,
  HOLLAND_MAX_SCORES,
  type Archetype,
  type AptitudeDimension,
  type CareerValue,
  type HollandCode,
  type PressureDimension,
  type VARKMode,
} from "@/data/questions";

export interface OnboardingTurn {
  id: number;
  question: string;
  answer: string;
}

export interface AssessmentAnswers {
  mcq: Record<number, string>; // question id → option key
  sliders: Record<number, number>; // question id → raw slider value 0–100
  aptitudeSeconds: Record<number, number>; // Module 2 question id → seconds taken
}

export interface ScoredEntry<K extends string> {
  key: K;
  raw: number;
  pct: number;
}

export interface AssessmentFlag {
  id: string;
  label: string;
  detail: string;
}

export interface AssessmentResult {
  archetypes: ScoredEntry<Archetype>[];
  holland: ScoredEntry<HollandCode>[];
  hollandCode: string;
  aptitude: (ScoredEntry<AptitudeDimension> & { correct: number })[];
  aptitudeCorrect: number;
  vark: ScoredEntry<VARKMode>[];
  dominantVark: VARKMode;
  values: { key: CareerValue; raw: number }[];
  pressure: Record<PressureDimension, number>;
  alignmentGap: number;
  flags: AssessmentFlag[];
}

const APTITUDE_DIMENSIONS: AptitudeDimension[] = ["Verbal", "Numerical", "Logical", "Spatial"];
const VARK_MODES: VARKMode[] = ["V", "A", "R", "K"];
const CAREER_VALUES: CareerValue[] = [
  "Achievement",
  "Independence",
  "Recognition",
  "Altruism",
  "Variety",
  "Security",
  "Creativity",
  "Leadership",
];
const PRESSURE_DIMENSIONS: PressureDimension[] = [
  "Family_Pressure_Score",
  "Desire_Gap_Score",
  "Suppression_Score",
  "Fear_Disappointment_Score",
  "Personal_Clarity_Score",
  "Peer_Pressure_Score",
  "Authenticity_Score",
  "Suppression_Detection_Score",
  "Career_Anxiety_Score",
  "Adult_Support_Score",
];

// Sliders whose stored dimension is the INVERSE of the raw slider value, per
// each question's slider_scoring note (slider 0 = score 100). Q88 is inverted
// so that Adult_Support_Score means "level of support", matching
// FLAGS.PARENT_MODULE_TRIGGER (< 30 activates the parent module).
const INVERTED_SLIDERS = new Set([83, 85, 88]);

// Module 2: 5 questions per dimension × (3 points + 1 speed bonus)
const APTITUDE_MAX = 20;
// Module 6: 8 questions × 2 points, single mode per option
const VARK_MAX = 16;
const SPEED_BONUS_SECONDS = 10;

export const APTITUDE_TIME_LIMIT_SECONDS = 30;

function zeroRecord<K extends string>(keys: readonly K[]): Record<K, number> {
  return Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;
}

function toSorted<K extends string>(raw: Record<K, number>, max: (k: K) => number): ScoredEntry<K>[] {
  return (Object.keys(raw) as K[])
    .map((key) => ({ key, raw: raw[key], pct: Math.round((raw[key] / max(key)) * 100) }))
    .sort((a, b) => b.pct - a.pct);
}

export function scoreAssessment(answers: AssessmentAnswers): AssessmentResult {
  const archetypeRaw = zeroRecord(Object.keys(ARCHETYPE_MAX_SCORES) as Archetype[]);
  const hollandRaw = zeroRecord(Object.keys(HOLLAND_MAX_SCORES) as HollandCode[]);
  const aptitudeRaw = zeroRecord(APTITUDE_DIMENSIONS);
  const aptitudeCorrectBy = zeroRecord(APTITUDE_DIMENSIONS);
  const varkRaw = zeroRecord(VARK_MODES);
  const valuesRaw = zeroRecord(CAREER_VALUES);

  const archetypeSet = new Set<string>(Object.keys(ARCHETYPE_MAX_SCORES));
  const aptitudeSet = new Set<string>(APTITUDE_DIMENSIONS);
  const valueSet = new Set<string>(CAREER_VALUES);

  for (const q of getAssessmentQuestions()) {
    if (q.type === "slider" || !q.options) continue;
    const picked = answers.mcq[q.id];
    if (!picked) continue;
    const option = q.options.find((o) => o.key === picked);
    if (!option) continue;

    let isCorrect = false;
    let aptitudeDim: AptitudeDimension | null = null;

    for (const inc of option.scoring) {
      const d = inc.dimension as string;
      if (d === "correct") {
        isCorrect = true;
      } else if (aptitudeSet.has(d)) {
        aptitudeRaw[d as AptitudeDimension] += inc.points;
        aptitudeDim = d as AptitudeDimension;
      } else if (archetypeSet.has(d)) {
        archetypeRaw[d as Archetype] += inc.points;
      } else if (valueSet.has(d)) {
        valuesRaw[d as CareerValue] += inc.points;
      } else if (q.module === 6) {
        // Single letters are ambiguous: A/R exist in both VARK and Holland.
        varkRaw[d as VARKMode] += inc.points;
      } else {
        hollandRaw[d as HollandCode] += inc.points;
      }
    }

    if (isCorrect && aptitudeDim) {
      aptitudeCorrectBy[aptitudeDim] += 1;
      const secs = answers.aptitudeSeconds[q.id];
      if (typeof secs === "number" && secs < SPEED_BONUS_SECONDS) {
        aptitudeRaw[aptitudeDim] += 1;
      }
    }
  }

  const pressure = zeroRecord(PRESSURE_DIMENSIONS);
  for (const q of getSliderQuestions()) {
    const raw = answers.sliders[q.id];
    if (typeof raw !== "number" || !q.pressure_dimension) continue;
    pressure[q.pressure_dimension] = INVERTED_SLIDERS.has(q.id) ? 100 - raw : raw;
  }

  const archetypes = toSorted(archetypeRaw, (k) => ARCHETYPE_MAX_SCORES[k]);
  const holland = toSorted(hollandRaw, (k) => HOLLAND_MAX_SCORES[k]);
  const aptitude = toSorted(aptitudeRaw, () => APTITUDE_MAX).map((e) => ({
    ...e,
    correct: aptitudeCorrectBy[e.key],
  }));
  const vark = toSorted(varkRaw, () => VARK_MAX);
  const values = (Object.keys(valuesRaw) as CareerValue[])
    .map((key) => ({ key, raw: valuesRaw[key] }))
    .sort((a, b) => b.raw - a.raw);

  const alignmentGap = pressure.Desire_Gap_Score;

  const flags: AssessmentFlag[] = [];
  if (alignmentGap > FLAGS.COUNSELLOR_MANDATORY_GAP) {
    flags.push({
      id: "counsellor-gap",
      label: "Counsellor referral — mandatory",
      detail: `The gap between the career you privately want and what your family expects scored ${alignmentGap}/100. A conversation with a counsellor is strongly recommended.`,
    });
  }
  if (pressure.Career_Anxiety_Score > FLAGS.COUNSELLOR_MANDATORY_ANXIETY) {
    flags.push({
      id: "counsellor-anxiety",
      label: "Counsellor referral — mandatory",
      detail: `Career decision anxiety scored ${pressure.Career_Anxiety_Score}/100. Talking this through with a counsellor will help more than any report.`,
    });
  }
  if (pressure.Suppression_Detection_Score > FLAGS.SUPPRESSION_FLAG) {
    flags.push({
      id: "suppression",
      label: "Suppressed preference detected",
      detail:
        "Your answers suggest there is a career you would choose if family support were guaranteed. It deserves to be part of the conversation.",
    });
  }
  if (pressure.Adult_Support_Score < FLAGS.PARENT_MODULE_TRIGGER) {
    flags.push({
      id: "parent-module",
      label: "Parent communication recommended",
      detail:
        "You reported low adult support for self-exploration. Sharing these results with a parent or trusted adult could open that door.",
    });
  }
  if (pressure.Family_Pressure_Score > 60 && pressure.Peer_Pressure_Score > 60) {
    flags.push({
      id: "social-pressure",
      label: "Compounded social pressure",
      detail:
        "Both family and peer pressure scored high. Your genuine preferences may be harder to hear right now — weigh the interest and personality results above the 'expected' options.",
    });
  }
  if (answers.mcq[74] === "D") {
    flags.push({
      id: "govt-conflict",
      label: "Family expectation conflict",
      detail:
        "You indicated your family expects government service but you are unsure it is right for you. Cross-check this against your pressure scores.",
    });
  }

  return {
    archetypes,
    holland,
    hollandCode: holland
      .slice(0, 2)
      .map((h) => h.key)
      .join(""),
    aptitude,
    aptitudeCorrect: APTITUDE_DIMENSIONS.reduce((n, d) => n + aptitudeCorrectBy[d], 0),
    vark,
    dominantVark: vark[0].key,
    values,
    pressure,
    alignmentGap,
    flags,
  };
}
