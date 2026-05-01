// First Year — fresh-grad / starting-out persona
// Three integrated zones: Diagnostic (one-time) → Cartography (archetype map) →
// Talent Stack + 30-Day Brief (the daily home).

const FY_STORE = 'em.firstyear.v1';
const fyLoad = () => { try { return JSON.parse(localStorage.getItem(FY_STORE)) || {}; } catch { return {}; } };
const fySave = (d) => { try { localStorage.setItem(FY_STORE, JSON.stringify(d)); } catch {} };

const DIAGNOSTIC = [
  { id: 'background', q: 'What did you study, and where do you start from?', placeholder: 'CS, BFA, mechanical eng, self-taught, bootcamp — anything goes.', kind: 'text' },
  { id: 'lostInTime', q: 'When have you most lost track of time?', placeholder: 'Be specific — what were you doing, what hooked you?', kind: 'text' },
  { id: 'energy', q: 'What energizes you in a group?', placeholder: '', kind: 'choice', options: [
    'Building the thing',
    'Connecting people & ideas',
    'Finding patterns in data',
    'Telling the story',
    'Running the operation',
    'Going deep alone',
  ]},
  { id: 'stakes', q: 'What kind of risk feels like home right now?', placeholder: '', kind: 'choice', options: [
    'Salary & stability — I need to land',
    'Steady job, but learning fast',
    'Lower pay, faster growth',
    'High variance — I want a shot',
  ]},
  { id: 'constraints', q: 'Any hard constraints I should know?', placeholder: 'Geography, visa, family, debt, health — be honest.', kind: 'text' },
];

const ARCHETYPES = [
  {
    id: 'builder', label: 'The Builder',
    tag: 'Make it real',
    blurb: 'Compounds through artifacts. Best year-1 move: ship something visible.',
    yr1: 'Junior eng / IC at fast-growing co or solo project shipping monthly.',
    yr5: 'Senior IC, tech lead, or indie founder with a portfolio of shipped work.',
    yr10: 'Staff engineer, CTO of a small co, or built something that pays you forever.',
    salary: '$70–110k → $180–350k',
    daily: 'Heads-down work, code reviews, design docs, occasional war rooms.',
    examplePeople: 'Jane Manchun Wong, Pieter Levels, early-career Patrick McKenzie',
    entry: ['New-grad SWE', 'Founding engineer (seed/Series A)', 'Build-in-public solo'],
    skills: ['Shipping cadence', 'Systems thinking', 'Async writing'],
  },
  {
    id: 'synthesizer', label: 'The Synthesizer',
    tag: 'Connect the dots',
    blurb: 'Compounds through cross-disciplinary range. Best year-1 move: get into rooms.',
    yr1: 'APM / strategy / chief-of-staff / consulting analyst — generalist on purpose.',
    yr5: 'PM, BizOps lead, founder, or strategy at a defining company.',
    yr10: 'GM, founder, VC partner, or operator-investor.',
    salary: '$80–130k → $220–500k',
    daily: 'Meetings, frameworks, decks, glue work, negotiation.',
    examplePeople: 'Shishir Mehrotra (early), Lulu Cheng Meservey, generalists at Stripe',
    entry: ['APM programs (Stripe / Figma / Asana)', 'Mgmt consulting', 'Chief of staff role', 'Ops at hypergrowth co'],
    skills: ['Frameworks', 'Stakeholder mgmt', 'Synthesis writing'],
  },
  {
    id: 'analyst', label: 'The Analyst',
    tag: 'Find the truth in noise',
    blurb: 'Compounds through depth on a hard question. Best year-1 move: pick a domain.',
    yr1: 'Data analyst, quant, research assoc, ML eng, equity research.',
    yr5: 'Senior DS, quant trader, ML lead, founding research engineer.',
    yr10: 'Director of research, partner at a quant fund, lab founder.',
    salary: '$85–140k → $250–700k',
    daily: 'Notebooks, models, papers, long debug loops, focused calm.',
    examplePeople: 'Chris Olah, Erika Cheung, early Renaissance quants',
    entry: ['Quant trading desks', 'AI lab residencies', 'Data team at a tier-1 co'],
    skills: ['Statistical literacy', 'Model intuition', 'Patience'],
  },
  {
    id: 'storyteller', label: 'The Storyteller',
    tag: 'Make people care',
    blurb: 'Compounds through audience. Best year-1 move: publish weekly, in public.',
    yr1: 'Content / brand / DevRel / journalist / designer-writer hybrid.',
    yr5: 'Head of content, brand lead, columnist, popular newsletter author.',
    yr10: 'CMO, editor-in-chief, owns a media property, or sells thought-leadership.',
    salary: '$55–95k → $150–400k',
    daily: 'Drafting, interviewing, reviewing, performing, publishing rhythms.',
    examplePeople: 'Casey Newton, Packy McCormick (early), early Anu Atluru',
    entry: ['DevRel / dev-marketing', 'Newsroom fellowships', 'Brand at fast-growing co'],
    skills: ['Voice', 'Cadence', 'Editing'],
  },
  {
    id: 'operator', label: 'The Operator',
    tag: 'Make systems run',
    blurb: 'Compounds through ownership. Best year-1 move: own one process end-to-end.',
    yr1: 'Ops, recruiting, finance, customer success, program mgmt.',
    yr5: 'Head of Ops / People / Finance, COO of a small startup.',
    yr10: 'COO, CFO, GM of a major business unit, or your own services firm.',
    salary: '$65–105k → $200–450k',
    daily: 'Dashboards, 1:1s, escalations, processes, calm-in-storms.',
    examplePeople: 'Claire Hughes Johnson, early Bret Taylor (ops side)',
    entry: ['Ops rotation programs', 'BizOps at a hypergrowth co', 'CS / recruiting'],
    skills: ['Process design', 'Calm authority', 'Spreadsheets'],
  },
  {
    id: 'crafter', label: 'The Craftsperson',
    tag: 'Master one thing deeply',
    blurb: 'Compounds through taste. Best year-1 move: study the masters, ship daily.',
    yr1: 'Apprentice / junior at a place known for craft (small studio, top team).',
    yr5: 'Senior IC at a top firm, or own studio with reputation.',
    yr10: 'Acknowledged master of craft — hire-of-record in your domain.',
    salary: '$55–95k → $180–400k',
    daily: 'Long tool-time, critique, iteration, reference-building.',
    examplePeople: 'Frank Chimero, Jonas Downey, master IC engineers',
    entry: ['Top-tier studio apprenticeship', 'Senior IC mentorship', 'Solo studio'],
    skills: ['Taste', 'Reps', 'Self-critique'],
  },
];

const FirstYearScreen = () => {
  const stored = useMemo(fyLoad, []);
  const [stage, setStage] = useState(stored.stage || 'diagnostic'); // diagnostic | result
  const [answers, setAnswers] = useState(stored.answers || {});
  const [topMatches, setTopMatches] = useState(stored.topMatches || null);
  const [selectedArch, setSelectedArch] = useState(stored.selectedArch || null);
  const [stack, setStack] = useState(stored.stack || null);
  const [brief, setBrief] = useState(stored.brief || null);

  useEffect(() => {
    fySave({ stage, answers, topMatches, selectedArch, stack, brief });
  }, [stage, answers, topMatches, selectedArch, stack, brief]);

  const reset = () => {
    if (!confirm('Restart from the diagnostic?')) return;
    localStorage.removeItem(FY_STORE);
    setStage('diagnostic'); setAnswers({}); setTopMatches(null); setSelectedArch(null); setStack(null); setBrief(null);
  };

  if (stage === 'diagnostic') {
    return <Diagnostic onComplete={(ans) => {
      setAnswers(ans);
      // Heuristic-rank archetypes based on answers
      const ranked = rankArchetypes(ans);
      setTopMatches(ranked);
      setSelectedArch(ranked[0].id);
      setStage('result');
    }} />;
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 100px' }}>
      <ResultHeader name={answers.background || 'You'} onReset={reset} />
      <Cartography matches={topMatches} all={ARCHETYPES} selected={selectedArch} onSelect={setSelectedArch} />
      <ArchetypeDeepDive archetype={ARCHETYPES.find(a => a.id === selectedArch)} answers={answers} />
      <TalentStack answers={answers} stack={stack} setStack={setStack} archetype={ARCHETYPES.find(a => a.id === selectedArch)} />
      <ThirtyDayBrief answers={answers} brief={brief} setBrief={setBrief} archetype={ARCHETYPES.find(a => a.id === selectedArch)} />
    </div>
  );
};

// ─── Heuristic ranking from diagnostic answers ─────────────────────────────
function rankArchetypes(ans) {
  const e = ans.energy || '';
  const s = ans.stakes || '';
  const weights = ARCHETYPES.map(a => ({ ...a, w: 0 }));

  const bump = (id, n) => { const m = weights.find(x => x.id === id); if (m) m.w += n; };

  if (e.startsWith('Building')) { bump('builder', 3); bump('crafter', 2); }
  if (e.startsWith('Connecting')) { bump('synthesizer', 3); bump('storyteller', 1); bump('operator', 1); }
  if (e.startsWith('Finding')) { bump('analyst', 3); bump('builder', 1); }
  if (e.startsWith('Telling')) { bump('storyteller', 3); bump('synthesizer', 1); }
  if (e.startsWith('Running')) { bump('operator', 3); bump('synthesizer', 1); }
  if (e.startsWith('Going deep')) { bump('crafter', 3); bump('analyst', 2); bump('builder', 1); }

  if (s.startsWith('Salary')) { bump('operator', 1); bump('analyst', 1); }
  if (s.startsWith('High variance')) { bump('builder', 1); bump('synthesizer', 1); bump('storyteller', 1); }

  // baseline jitter so ties resolve
  weights.forEach((w, i) => w.w += (i * 0.01));
  return weights.sort((a, b) => b.w - a.w);
}

// ─── Diagnostic flow ───────────────────────────────────────────────────────
const Diagnostic = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [text, setText] = useState('');
  const q = DIAGNOSTIC[step];
  const isLast = step === DIAGNOSTIC.length - 1;
  const value = q.kind === 'text' ? text : answers[q.id];

  const advance = (val) => {
    const next = { ...answers, [q.id]: val };
    setAnswers(next);
    setText('');
    if (isLast) onComplete(next);
    else setStep(step + 1);
  };

  return (
    <div style={{
      maxWidth: 760, margin: '0 auto',
      padding: '60px 32px', minHeight: 'calc(100vh - 70px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      animation: 'fadeIn 0.5s ease',
    }}>
      <Kicker accent>First-year diagnostic · {step + 1} of {DIAGNOSTIC.length}</Kicker>
      <div style={{ display: 'flex', gap: 4, marginTop: 14, marginBottom: 40 }}>
        {DIAGNOSTIC.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 2,
            background: i <= step ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <div className="h-serif" style={{
        fontSize: 'clamp(32px, 4.5vw, 48px)', lineHeight: 1.15, fontWeight: 500, fontStyle: 'italic',
        marginBottom: 32, letterSpacing: '-0.01em',
      }}>{q.q}</div>

      {q.kind === 'text' ? (
        <>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && text.trim()) advance(text.trim()); }}
            placeholder={q.placeholder}
            autoFocus rows={4}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius)',
              padding: 18, fontSize: 16,
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text)',
              outline: 'none', resize: 'none',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--color-muted)' }}>⌘↵ to continue</span>
            <CTA size="sm" icon="arrowRight" onClick={() => text.trim() && advance(text.trim())}>
              {isLast ? 'See my map' : 'Continue'}
            </CTA>
          </div>
        </>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: q.options.length > 4 ? 'repeat(2, 1fr)' : '1fr', gap: 10 }}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => advance(opt)}
              style={{
                textAlign: 'left', padding: '18px 22px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius)',
                color: 'var(--color-text)',
                fontFamily: 'inherit', fontSize: 15, fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.08)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Result header ─────────────────────────────────────────────────────────
const ResultHeader = ({ name, onReset }) => (
  <header style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
    <div style={{ minWidth: 0, flex: '1 1 auto', maxWidth: 720 }}>
      <Kicker accent>First Year · personalized for you</Kicker>
      <h1 className="h-serif" style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.05, margin: '20px 0 14px', fontWeight: 500 }}>
        Six paths, <em>your map.</em>
      </h1>
      <p style={{ fontSize: 15, color: 'var(--color-muted)', maxWidth: 560, margin: 0, lineHeight: 1.6 }}>
        You don't need a five-year plan. You need to know which directions are alive for you, and what to do this month. Click any archetype to drill in.
      </p>
    </div>
    <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
      <CTA variant="ghost" size="sm" onClick={onReset}>Re-take diagnostic</CTA>
    </div>
  </header>
);

// ─── Cartography (archetype map) ───────────────────────────────────────────
const Cartography = ({ matches, all, selected, onSelect }) => {
  const matchMap = {};
  matches.forEach((m, i) => { matchMap[m.id] = i; });
  const sorted = [...all].sort((a, b) => matchMap[a.id] - matchMap[b.id]);

  return (
    <div style={{ marginBottom: 48 }}>
      <Kicker>Your archetype map · ranked by fit</Kicker>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 14, marginTop: 18,
      }}>
        {sorted.map((a, i) => {
          const fit = i === 0 ? 'Strongest match' : i === 1 ? 'Strong match' : i === 2 ? 'Worth exploring' : 'Distant';
          const isPrimary = i === 0;
          const isSel = selected === a.id;
          return (
            <button
              key={a.id}
              onClick={() => onSelect(a.id)}
              className="glass"
              style={{
                textAlign: 'left', padding: 20, cursor: 'pointer',
                borderColor: isSel ? 'rgba(16,185,129,0.6)' : isPrimary ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)',
                background: isSel ? 'rgba(16,185,129,0.06)' : isPrimary ? 'rgba(16,185,129,0.03)' : 'var(--color-surface)',
                transition: 'all 0.2s', fontFamily: 'inherit', color: 'inherit',
                opacity: i > 2 ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="uc" style={{
                  fontSize: 9, padding: '3px 8px',
                  background: isPrimary ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                  color: isPrimary ? 'var(--color-accent)' : 'var(--color-muted)',
                  letterSpacing: '0.14em',
                }}>{fit}</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--color-muted)' }}>0{i + 1}</span>
              </div>
              <div className="h-serif" style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.1, marginBottom: 4 }}>
                {a.label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-accent)', fontStyle: 'italic', marginBottom: 10 }}>{a.tag}</div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.5 }}>{a.blurb}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Archetype deep dive ───────────────────────────────────────────────────
const ArchetypeDeepDive = ({ archetype: a, answers }) => {
  if (!a) return null;
  return (
    <div className="glass" style={{ padding: 40, marginBottom: 48 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <Kicker accent>What life looks like as · {a.label}</Kicker>
          <div className="h-serif" style={{ fontSize: 38, fontWeight: 500, fontStyle: 'italic', marginTop: 14, lineHeight: 1.05 }}>
            {a.tag}.
          </div>
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--color-accent)' }}>
          ● live preview
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: 'var(--hairline)', marginBottom: 32 }}>
        {[
          { label: 'Year 1', body: a.yr1 },
          { label: 'Year 5', body: a.yr5 },
          { label: 'Year 10', body: a.yr10 },
        ].map((step, i) => (
          <div key={i} style={{
            padding: '22px 24px',
            borderRight: i < 2 ? 'var(--hairline)' : 'none',
            position: 'relative',
          }}>
            <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)', letterSpacing: '0.14em' }}>{step.label}</div>
            <div style={{ fontSize: 14, lineHeight: 1.55, marginTop: 12 }}>{step.body}</div>
            {i < 2 && (
              <div style={{
                position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)',
                width: 16, height: 16, borderRadius: '50%',
                background: 'var(--color-bg)',
                border: '1px solid rgba(16,185,129,0.4)',
                display: 'grid', placeItems: 'center',
                color: 'var(--color-accent)', fontSize: 10, zIndex: 2,
              }}>→</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
        <DataBlock label="Comp arc · year 1 → year 10" value={a.salary} mono />
        <DataBlock label="Daily texture" value={a.daily} />
        <DataBlock label="Real people on this path" value={a.examplePeople} />
        <DataBlock label="Skills you'd compound" tags={a.skills} />
      </div>

      <div style={{ marginTop: 28, paddingTop: 28, borderTop: 'var(--hairline)' }}>
        <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)', marginBottom: 14 }}>Entry points still open to you</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {a.entry.map((e, i) => (
            <span key={i} style={{
              fontSize: 12, padding: '8px 14px',
              background: 'rgba(16,185,129,0.06)',
              border: '1px solid rgba(16,185,129,0.25)',
              color: 'var(--color-text)',
            }}>{e}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const DataBlock = ({ label, value, mono, tags }) => (
  <div>
    <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)', marginBottom: 10 }}>{label}</div>
    {tags ? (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {tags.map((t, i) => (
          <span key={i} style={{ fontSize: 12, padding: '4px 10px', background: 'rgba(16,185,129,0.1)', color: 'var(--color-accent)' }}>{t}</span>
        ))}
      </div>
    ) : (
      <div style={{ fontSize: mono ? 14 : 13, fontFamily: mono ? 'var(--font-mono)' : 'inherit', color: 'var(--color-text)', lineHeight: 1.55 }}>
        {value}
      </div>
    )}
  </div>
);

// ─── Talent Stack ───────────────────────────────────────────────────────────
const TalentStack = ({ answers, stack, setStack, archetype }) => {
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const sys = `You are M, a career mentor. Based on the user's diagnostic answers, surface their TALENT STACK — concrete strengths and signals, framed generously but specifically. They are early-career, possibly fresh out of school. Most fresh grads systematically undervalue themselves; your job is to NAME their latent assets with evidence.

Diagnostic answers: ${JSON.stringify(answers)}
They're exploring archetype: ${archetype.label} (${archetype.tag}).

Output ONLY valid JSON, no prose, no markdown. Schema:
{
  "headline": "<one short evidence-based statement, like 'You have an unusual combination of X + Y + Z that 87% of grads don't.'>",
  "strengths": [{"label":"<short>", "evidence":"<10-18 word specific reason from their answers>"}, ... 4 items],
  "latent": [{"label":"<latent strength they undervalue>", "why":"<1 sentence>"}, ... 2 items],
  "weak_signals_to_strengthen": [{"label":"<thing missing>", "first_step":"<concrete step this month>"}, ... 2 items]
}`;
      const reply = await window.claude.complete({ messages: [{ role: 'user', content: sys }] });
      const m = reply.match(/\{[\s\S]*\}/);
      if (m) setStack(JSON.parse(m[0]));
    } catch (e) {
      alert('M had trouble generating your stack. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <Kicker accent>Your talent stack</Kicker>
          <div className="h-serif" style={{ fontSize: 32, fontWeight: 500, marginTop: 12, lineHeight: 1.2 }}>
            What you already have.
          </div>
        </div>
        {!stack && <CTA size="sm" icon="sparkle" onClick={generate}>{loading ? 'M is reading…' : 'Generate stack'}</CTA>}
        {stack && <CTA variant="ghost" size="sm" onClick={generate}>{loading ? 'Re-reading…' : 'Re-generate'}</CTA>}
      </div>

      {!stack && !loading && (
        <div className="glass" style={{ padding: 32, textAlign: 'center', color: 'var(--color-muted)', fontSize: 14, lineHeight: 1.6 }}>
          M will analyze your diagnostic answers and surface specific strengths most fresh grads can't articulate about themselves.
        </div>
      )}

      {loading && (
        <div className="glass shimmer" style={{ padding: 60, height: 220 }} />
      )}

      {stack && !loading && (
        <div className="glass" style={{ padding: 32 }}>
          <div className="h-serif" style={{ fontSize: 22, fontStyle: 'italic', fontWeight: 500, lineHeight: 1.35, marginBottom: 28, color: 'var(--color-accent)' }}>
            "{stack.headline}"
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
            <div>
              <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)', marginBottom: 14 }}>Confirmed strengths</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(stack.strengths || []).map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14 }}>
                    <div style={{
                      width: 4, alignSelf: 'stretch',
                      background: 'var(--color-accent)',
                    }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4, lineHeight: 1.5 }}>{s.evidence}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)', marginBottom: 14 }}>Latent — under-claimed</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {(stack.latent || []).map((s, i) => (
                  <div key={i} style={{
                    padding: 14,
                    background: 'rgba(14,165,233,0.04)',
                    border: '1px solid rgba(14,165,233,0.25)',
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-sapphire)' }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4, lineHeight: 1.5 }}>{s.why}</div>
                  </div>
                ))}
              </div>
              <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)', marginBottom: 12 }}>Weak signals · worth strengthening</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(stack.weak_signals_to_strengthen || []).map((s, i) => (
                  <div key={i} style={{
                    padding: 12,
                    border: '1px dashed rgba(245,158,11,0.4)',
                    background: 'rgba(245,158,11,0.04)',
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-amber)' }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4, lineHeight: 1.5 }}>→ {s.first_step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── 30-Day Brief ───────────────────────────────────────────────────────────
const ThirtyDayBrief = ({ answers, brief, setBrief, archetype }) => {
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const sys = `You are M, a career mentor for fresh grads. Generate a concrete 30-DAY STARTER PLAN for someone exploring archetype "${archetype.label} — ${archetype.tag}". Their diagnostic: ${JSON.stringify(answers)}.

Goal: cut paralysis. Specific is better than ambitious. Output ONLY valid JSON.

Schema:
{
  "north_star": "<one sentence: what success in 30 days looks like>",
  "ship_one_thing": {"title":"<concrete artifact to make>", "why":"<1 sentence>", "first_three_steps":["s1","s2","s3"]},
  "talk_to_five": [{"who":"<archetype of person>", "how":"<concrete script or channel>"}, ... 5 items],
  "two_applications": [{"target":"<role / category>", "where":"<concrete companies or programs>"}, ... 2 items],
  "weekly_micro": ["<week 1 micro-action>", "<week 2>", "<week 3>", "<week 4>"]
}`;
      const reply = await window.claude.complete({ messages: [{ role: 'user', content: sys }] });
      const m = reply.match(/\{[\s\S]*\}/);
      if (m) setBrief({ ...JSON.parse(m[0]), generatedFor: archetype.id, _doneTalk: [], _doneApps: [], _doneShip: [], _doneWeeks: [] });
    } catch (e) {
      alert('M had trouble drafting your brief. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key, idx) => {
    setBrief(b => {
      const arr = b[key] || [];
      return { ...b, [key]: arr.includes(idx) ? arr.filter(i => i !== idx) : [...arr, idx] };
    });
  };

  const stale = brief && brief.generatedFor !== archetype.id;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <Kicker accent>Your next 30 days</Kicker>
          <div className="h-serif" style={{ fontSize: 32, fontWeight: 500, marginTop: 12, lineHeight: 1.2 }}>
            One first move.
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 8, maxWidth: 540 }}>
            Don't plan five years. Plan thirty days. Check things off as you go.
          </div>
        </div>
        {!brief && <CTA size="sm" icon="sparkle" onClick={generate}>{loading ? 'M is drafting…' : 'Draft my 30 days'}</CTA>}
        {brief && <CTA variant="ghost" size="sm" onClick={generate}>{loading ? 'Re-drafting…' : (stale ? 'Re-draft for new archetype' : 'Re-draft')}</CTA>}
      </div>

      {stale && (
        <div style={{
          padding: '10px 14px', marginBottom: 20,
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.3)',
          fontSize: 12, color: 'var(--color-amber)',
        }}>
          You changed archetype — this brief is from a previous selection. Re-draft for a fresh plan.
        </div>
      )}

      {!brief && !loading && (
        <div className="glass" style={{ padding: 40, textAlign: 'center', color: 'var(--color-muted)', fontSize: 14, lineHeight: 1.6 }}>
          One artifact to ship. Five people to talk to. Two applications. Four weekly check-ins. That's it.
        </div>
      )}

      {loading && <div className="glass shimmer" style={{ padding: 60, height: 320 }} />}

      {brief && !loading && (
        <div>
          <div className="glass" style={{ padding: 28, marginBottom: 16, borderColor: 'rgba(16,185,129,0.3)' }}>
            <div className="uc" style={{ fontSize: 10, color: 'var(--color-accent)', letterSpacing: '0.14em' }}>North star · 30 days from now</div>
            <div className="h-serif" style={{ fontSize: 24, fontStyle: 'italic', fontWeight: 500, lineHeight: 1.3, marginTop: 12 }}>
              "{brief.north_star}"
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 16 }}>
            {/* Ship one thing */}
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span className="uc" style={{ fontSize: 10, color: 'var(--color-muted)' }}>Ship one thing</span>
                <Icon name="bolt" size={14} />
              </div>
              <div className="h-serif" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.2, marginBottom: 6 }}>
                {brief.ship_one_thing?.title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 16, lineHeight: 1.55 }}>
                {brief.ship_one_thing?.why}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(brief.ship_one_thing?.first_three_steps || []).map((s, i) => (
                  <CheckRow key={i} text={s} done={(brief._doneShip || []).includes(i)} onToggle={() => toggle('_doneShip', i)} />
                ))}
              </div>
            </div>

            {/* Two apps */}
            <div className="glass" style={{ padding: 24 }}>
              <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)', marginBottom: 14 }}>Two applications · in flight</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(brief.two_applications || []).map((a, i) => {
                  const done = (brief._doneApps || []).includes(i);
                  return (
                    <button key={i} onClick={() => toggle('_doneApps', i)} style={{
                      textAlign: 'left', padding: 12,
                      background: done ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
                      border: '1px solid ' + (done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'),
                      cursor: 'pointer', fontFamily: 'inherit', color: 'inherit',
                      opacity: done ? 0.6 : 1,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 600, textDecoration: done ? 'line-through' : 'none' }}>{a.target}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4 }}>{a.where}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Talk to five */}
          <div className="glass" style={{ padding: 24, marginBottom: 16 }}>
            <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)', marginBottom: 14 }}>Talk to five · this month</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {(brief.talk_to_five || []).map((p, i) => {
                const done = (brief._doneTalk || []).includes(i);
                return (
                  <button key={i} onClick={() => toggle('_doneTalk', i)} style={{
                    textAlign: 'left', padding: 14,
                    background: done ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid ' + (done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'),
                    cursor: 'pointer', fontFamily: 'inherit', color: 'inherit',
                    opacity: done ? 0.55 : 1,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{
                        width: 16, height: 16, marginTop: 1, flexShrink: 0,
                        border: '1.5px solid ' + (done ? 'var(--color-accent)' : 'var(--color-muted)'),
                        background: done ? 'var(--color-accent)' : 'transparent',
                        display: 'grid', placeItems: 'center', color: 'var(--color-bg)',
                      }}>{done && <Icon name="check" size={10} stroke={3} />}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, textDecoration: done ? 'line-through' : 'none' }}>{p.who}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4, lineHeight: 1.5 }}>{p.how}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weekly micro */}
          <div className="glass" style={{ padding: 24 }}>
            <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)', marginBottom: 14 }}>Weekly micro-actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, position: 'relative' }}>
              {(brief.weekly_micro || []).map((w, i) => {
                const done = (brief._doneWeeks || []).includes(i);
                return (
                  <button key={i} onClick={() => toggle('_doneWeeks', i)} style={{
                    padding: '18px 16px',
                    borderRight: i < 3 ? 'var(--hairline)' : 'none',
                    background: done ? 'rgba(16,185,129,0.04)' : 'transparent',
                    border: 0, borderRadius: 0,
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'inherit', color: 'inherit',
                  }}>
                    <div className="mono" style={{ fontSize: 10, color: done ? 'var(--color-accent)' : 'var(--color-muted)', marginBottom: 8 }}>
                      Week {i + 1}
                    </div>
                    <div style={{
                      fontSize: 13, lineHeight: 1.45,
                      textDecoration: done ? 'line-through' : 'none',
                      opacity: done ? 0.6 : 1,
                    }}>{w}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckRow = ({ text, done, onToggle }) => (
  <button onClick={onToggle} style={{
    display: 'flex', alignItems: 'flex-start', gap: 10,
    padding: '8px 10px',
    background: done ? 'rgba(16,185,129,0.06)' : 'transparent',
    border: '1px solid ' + (done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'),
    cursor: 'pointer', fontFamily: 'inherit', color: 'inherit', textAlign: 'left',
  }}>
    <div style={{
      width: 14, height: 14, marginTop: 2, flexShrink: 0,
      border: '1.5px solid ' + (done ? 'var(--color-accent)' : 'var(--color-muted)'),
      background: done ? 'var(--color-accent)' : 'transparent',
      display: 'grid', placeItems: 'center', color: 'var(--color-bg)',
    }}>{done && <Icon name="check" size={9} stroke={3} />}</div>
    <span style={{ fontSize: 12, lineHeight: 1.5, textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1 }}>{text}</span>
  </button>
);

Object.assign(window, { FirstYearScreen });
