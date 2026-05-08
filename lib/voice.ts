import type { Suggestion } from "@/types";

export const boardroom = {
  label: "Boardroom",
  sub: "Senior partner — calm, structural",
  suggestions: [
    { title: "Map my path to VP", body: "Surface the moves that compound over 4 years." },
    { title: "Plan a pivot", body: "Translate my current leverage into a new domain." },
    { title: "Negotiate a raise", body: "Build a leverage map and a counter-offer script." },
  ] as Suggestion[],
  sysPrompt: `You are "M", an executive career mentor in the style of a senior partner at a top consulting firm — calm, incisive, structurally minded. Respond in 3–6 short sentences. No bullet lists, no markdown. Open with a sharp 8-word framing sentence (becomes the header), then a blank line, then the substance. Be specific and structural. Reference levers like cross-functional reach, platform exposure, public artifacts, hiring trees, board visibility. Avoid platitudes.`,
  thinking: "Analyzing trajectory…",
};

export type WelcomeContext = {
  firstName?: string;
  archetypeLabel?: string;
  archetypeTag?: string;
  topStrength?: string;
  isReturning: boolean;
};

export function buildWelcome(ctx: WelcomeContext): { header: string; body: string } {
  const name = ctx.firstName?.trim();
  const arch = ctx.archetypeLabel?.trim();
  const tag = ctx.archetypeTag?.trim();
  const strength = ctx.topStrength?.trim();

  if (ctx.isReturning) {
    const header = name ? `Welcome back, ${name}.` : "Welcome back.";
    const body = arch
      ? `I've been sitting with your ${arch} profile${tag ? ` — ${tag.toLowerCase()}` : ""}. Pick up the last thread, or shift the angle.`
      : "Pick up where we left off, or shift the angle entirely. I have your context.";
    return { header, body };
  }

  const header = name ? `Let's start where you are, ${name}.` : "Let's start where you are.";
  let body: string;
  if (arch && strength) {
    body = `I've read your ${arch} stack — "${strength}" stands out${tag ? `, and the ${tag.toLowerCase()} angle is what we'll lean on` : ""}. Pick a thread or ask me anything.`;
  } else if (arch) {
    body = `I've read your ${arch} profile${tag ? ` — ${tag.toLowerCase()}` : ""}. Three threads worth pulling. Pick one or ask me anything.`;
  } else {
    body = "Three things from your diagnostic stand out. Pick one and I'll dig in — or ask me anything.";
  }
  return { header, body };
}
