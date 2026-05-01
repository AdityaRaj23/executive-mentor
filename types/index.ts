export type Persona = "individual" | "grad" | "admin";
export type Mode = "dark" | "light";

export type Role = "user" | "ai";
export interface Message {
  role: Role;
  header?: string;
  body: string;
}

export interface Goal {
  label: string;
  status: "active" | "done";
}
export interface Skill {
  label: string;
  conf: number;
}
export interface Dossier {
  member: string;
  role: string;
  tenure: string;
  goals: Goal[];
  skills: Skill[];
  signals: string[];
}

export type MilestoneStatus = "done" | "current" | "future" | "alt";
export interface Milestone {
  id: number;
  year: string;
  quarter: string;
  side: "left" | "right";
  title: string;
  body: string;
  skills: string[];
  status: MilestoneStatus;
  tasks?: string[];
  _doneTasks?: number[];
}
export interface Branch {
  label: string;
  milestones: Milestone[];
}

export interface Archetype {
  id: string;
  label: string;
  tag: string;
  blurb: string;
  yr1: string;
  yr5: string;
  yr10: string;
  salary: string;
  daily: string;
  examplePeople: string;
  entry: string[];
  skills: string[];
}

export interface DiagnosticAnswers {
  background?: string;
  lostInTime?: string;
  energy?: string;
  stakes?: string;
  constraints?: string;
}

export interface TalentStack {
  headline: string;
  strengths: { label: string; evidence: string }[];
  latent: { label: string; why: string }[];
  weak_signals_to_strengthen: { label: string; first_step: string }[];
}

export interface ThirtyDayBrief {
  north_star: string;
  ship_one_thing: { title: string; why: string; first_three_steps: string[] };
  talk_to_five: { who: string; how: string }[];
  two_applications: { target: string; where: string }[];
  weekly_micro: string[];
  generatedFor?: string;
  _doneTalk?: number[];
  _doneApps?: number[];
  _doneShip?: number[];
  _doneWeeks?: number[];
}

export interface CohortMember {
  name: string;
  track: string;
  readiness: number;
  gap: string;
  last: string;
}

export type MetricId = "users" | "engagement" | "gap" | "placement";

export interface SkillRow {
  skill: string;
  tracks: { eng: number; product: number; design: number; data: number };
}

export interface Suggestion {
  title: string;
  body: string;
}
