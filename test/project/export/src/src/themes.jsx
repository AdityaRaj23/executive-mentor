// Theme system — wholesale aesthetic shifts driven from Tweaks
// Each theme rewrites CSS variables on :root so the whole app reflows.

const THEMES = {
  editorial: {
    label: 'Editorial',
    sub: 'WSJ × MasterClass — original direction',
    vars: {
      '--color-primary': '#0F292F',
      '--color-bg': '#050A0F',
      '--color-surface': 'rgba(20, 30, 40, 0.6)',
      '--color-surface-solid': '#141E28',
      '--color-text': '#F0F4F8',
      '--color-muted': '#829AB1',
      '--color-accent': '#10B981',
      '--color-amber': '#F59E0B',
      '--color-rose': '#EF4444',
      '--color-sapphire': '#0EA5E9',
      '--font-heading': "'Cormorant Garamond', 'Times New Roman', serif",
      '--font-body': "'Hanken Grotesk', -apple-system, sans-serif",
      '--font-mono': "'JetBrains Mono', ui-monospace, monospace",
      '--radius': '2px',
      '--bg-grad-1': 'radial-gradient(1200px 600px at 80% -10%, rgba(16,185,129,0.06), transparent 60%)',
      '--bg-grad-2': 'radial-gradient(900px 500px at -10% 110%, rgba(14,165,233,0.05), transparent 60%)',
      '--logo-italic': 'italic',
    },
  },
  chairman: {
    label: 'Chairman',
    sub: 'Old-money library — oxblood, cream, tobacco',
    vars: {
      '--color-primary': '#3A1A1F',
      '--color-bg': '#1C0F11',
      '--color-surface': 'rgba(45, 26, 30, 0.6)',
      '--color-surface-solid': '#2D1A1E',
      '--color-text': '#F4ECDC',
      '--color-muted': '#A8927A',
      '--color-accent': '#C9A961',
      '--color-amber': '#E0A458',
      '--color-rose': '#C26B5A',
      '--color-sapphire': '#7C9885',
      '--font-heading': "'Cormorant Garamond', 'Times New Roman', serif",
      '--font-body': "'Hanken Grotesk', -apple-system, sans-serif",
      '--font-mono': "'JetBrains Mono', ui-monospace, monospace",
      '--radius': '0px',
      '--bg-grad-1': 'radial-gradient(1200px 600px at 80% -10%, rgba(201,169,97,0.08), transparent 60%)',
      '--bg-grad-2': 'radial-gradient(900px 500px at -10% 110%, rgba(124,152,133,0.05), transparent 60%)',
      '--logo-italic': 'italic',
    },
  },
  bauhaus: {
    label: 'Bauhaus',
    sub: 'Stark — true black, acid, sans-only',
    vars: {
      '--color-primary': '#0A0A0A',
      '--color-bg': '#000000',
      '--color-surface': 'rgba(15, 15, 15, 0.7)',
      '--color-surface-solid': '#0F0F0F',
      '--color-text': '#FAFAFA',
      '--color-muted': '#737373',
      '--color-accent': '#CCFF00',
      '--color-amber': '#FF9500',
      '--color-rose': '#FF3B30',
      '--color-sapphire': '#00D4FF',
      '--font-heading': "'Hanken Grotesk', -apple-system, sans-serif",
      '--font-body': "'Hanken Grotesk', -apple-system, sans-serif",
      '--font-mono': "'JetBrains Mono', ui-monospace, monospace",
      '--radius': '0px',
      '--bg-grad-1': 'radial-gradient(1200px 600px at 80% -10%, rgba(204,255,0,0.04), transparent 60%)',
      '--bg-grad-2': 'radial-gradient(900px 500px at -10% 110%, rgba(0,212,255,0.03), transparent 60%)',
      '--logo-italic': 'normal',
    },
  },
};

const DENSITIES = {
  cinematic: { label: 'Cinematic', scale: 1.15, gap: 1.3, sub: 'Generous, theatrical' },
  editorial: { label: 'Editorial', scale: 1.0,  gap: 1.0, sub: 'As designed' },
  terminal:  { label: 'Terminal',  scale: 0.85, gap: 0.7, sub: 'Dense, operational' },
};

const VOICES = {
  boardroom: {
    label: 'Boardroom',
    sub: 'Senior partner — calm, structural',
    welcomeHeader: 'Welcome back, Eliot.',
    welcomeBody: "I've been reviewing your last quarter. Three things changed your trajectory — pick one and I'll dig in. Or ask me anything.",
    suggestions: [
      { title: 'Map my path to VP', body: 'Surface the moves that compound over 4 years.' },
      { title: 'Plan a pivot', body: 'Translate my current leverage into a new domain.' },
      { title: 'Negotiate a raise', body: 'Build a leverage map and a counter-offer script.' },
    ],
    sysPrompt: `You are "M", an executive career mentor in the style of a senior partner at a top consulting firm — calm, incisive, structurally minded. Respond in 3–6 short sentences. No bullet lists, no markdown. Open with a sharp 8-word framing sentence (becomes the header), then a blank line, then the substance. Be specific and structural. Reference levers like cross-functional reach, platform exposure, public artifacts, hiring trees, board visibility. Avoid platitudes.`,
    thinking: 'Analyzing trajectory…',
  },
  coach: {
    label: 'Coach',
    sub: 'Warm, generative, encouraging',
    welcomeHeader: 'Glad you came back.',
    welcomeBody: "I noticed something in your last session worth picking up — but you lead. What's been on your mind this week?",
    suggestions: [
      { title: "What's blocking me?", body: "Name the thing you've been avoiding. We'll work it together." },
      { title: 'Celebrate something', body: "Let's sit with a recent win and pull lessons from it." },
      { title: 'Process a hard moment', body: 'No agenda — just a place to think out loud safely.' },
    ],
    sysPrompt: `You are "M", a warm career coach — present, generative, never prescriptive. Respond in 2–5 short sentences with the gentle confidence of someone who has held many leaders. No bullet lists. Open with a soft 8-word opening that lands (becomes the header), then a blank line, then a question or reflection. Mirror the user's emotional state. Ask one good question more often than you offer one good answer.`,
    thinking: 'Sitting with that…',
  },
  provocateur: {
    label: 'Provocateur',
    sub: 'Direct, unsparing, surgical',
    welcomeHeader: "Let's not waste this hour.",
    welcomeBody: "You came here because something isn't working. I'll be direct. What are you actually afraid to admit about your career right now?",
    suggestions: [
      { title: "What I'm avoiding", body: "Name the conversation you've been ducking for 6 months." },
      { title: 'Kill a goal', body: "Show me a goal that's still on your list out of inertia." },
      { title: 'The unsexy truth', body: "What does the data say you're actually good at?" },
    ],
    sysPrompt: `You are "M", a surgical career provocateur in the style of an exec coach who tells leaders what no one else will. Respond in 2–4 sentences, ruthlessly direct but never cruel. No bullets, no markdown. Open with a sharp 8-word challenge (becomes the header), blank line, then the cut. Call out avoidance, magical thinking, comfort moves. Ask the question the user is afraid to ask themselves.`,
    thinking: 'Cutting through…',
  },
};

// Light-mode overlays — each theme has a paired light palette
const LIGHT_OVERLAYS = {
  editorial: {
    '--color-primary': '#E8EEF2',
    '--color-bg': '#F7F4EE',
    '--color-surface': 'rgba(255, 255, 255, 0.7)',
    '--color-surface-solid': '#FDFBF6',
    '--color-text': '#0F1A24',
    '--color-muted': '#5A6B7A',
    '--color-accent': '#047857',
    '--color-amber': '#B45309',
    '--color-rose': '#B91C1C',
    '--color-sapphire': '#0369A1',
    '--hairline': '1px solid rgba(15, 26, 36, 0.1)',
    '--hairline-strong': '1px solid rgba(15, 26, 36, 0.2)',
    '--bg-grad-1': 'radial-gradient(1200px 600px at 80% -10%, rgba(4,120,87,0.07), transparent 60%)',
    '--bg-grad-2': 'radial-gradient(900px 500px at -10% 110%, rgba(3,105,161,0.05), transparent 60%)',
  },
  chairman: {
    '--color-primary': '#F0E4D0',
    '--color-bg': '#FAF3E5',
    '--color-surface': 'rgba(255, 250, 240, 0.7)',
    '--color-surface-solid': '#FBF6EA',
    '--color-text': '#3A1A1F',
    '--color-muted': '#7A6850',
    '--color-accent': '#8B6F2A',
    '--color-amber': '#A66A1F',
    '--color-rose': '#9B3F30',
    '--color-sapphire': '#3F5F46',
    '--hairline': '1px solid rgba(58, 26, 31, 0.12)',
    '--hairline-strong': '1px solid rgba(58, 26, 31, 0.22)',
    '--bg-grad-1': 'radial-gradient(1200px 600px at 80% -10%, rgba(139,111,42,0.1), transparent 60%)',
    '--bg-grad-2': 'radial-gradient(900px 500px at -10% 110%, rgba(63,95,70,0.05), transparent 60%)',
  },
  bauhaus: {
    '--color-primary': '#F5F5F5',
    '--color-bg': '#FFFFFF',
    '--color-surface': 'rgba(245, 245, 245, 0.8)',
    '--color-surface-solid': '#F5F5F5',
    '--color-text': '#000000',
    '--color-muted': '#525252',
    '--color-accent': '#5C7A00',
    '--color-amber': '#CC5500',
    '--color-rose': '#CC1F1F',
    '--color-sapphire': '#0099CC',
    '--hairline': '1px solid rgba(0, 0, 0, 0.12)',
    '--hairline-strong': '1px solid rgba(0, 0, 0, 0.25)',
    '--bg-grad-1': 'radial-gradient(1200px 600px at 80% -10%, rgba(92,122,0,0.05), transparent 60%)',
    '--bg-grad-2': 'radial-gradient(900px 500px at -10% 110%, rgba(0,153,204,0.04), transparent 60%)',
  },
};

// Apply theme + density + mode to :root
function applyTweaks(theme, density, mode) {
  const t = THEMES[theme] || THEMES.editorial;
  const d = DENSITIES[density] || DENSITIES.editorial;
  const root = document.documentElement;
  // Apply base (dark) theme variables first
  Object.entries(t.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  // Overlay light-mode variables if requested
  if (mode === 'light') {
    const overlay = LIGHT_OVERLAYS[theme] || LIGHT_OVERLAYS.editorial;
    Object.entries(overlay).forEach(([k, v]) => root.style.setProperty(k, v));
  }
  root.style.setProperty('--density-scale', d.scale);
  root.style.setProperty('--density-gap', d.gap);
  root.dataset.mode = mode || 'dark';
  // body bg gradient layers — pick from light overlay if active, else theme default
  const grad1 = (mode === 'light' && LIGHT_OVERLAYS[theme]?.['--bg-grad-1']) || t.vars['--bg-grad-1'];
  const grad2 = (mode === 'light' && LIGHT_OVERLAYS[theme]?.['--bg-grad-2']) || t.vars['--bg-grad-2'];
  document.body.style.setProperty('--bg-grad-1', grad1);
  document.body.style.setProperty('--bg-grad-2', grad2);
}

Object.assign(window, { THEMES, DENSITIES, VOICES, LIGHT_OVERLAYS, applyTweaks });
