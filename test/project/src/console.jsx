// AI Mentorship Console — split pane chat + dossier
// Now with: onboarding diagnostic, admin-view privacy toggle, localStorage persistence,
// and structured dossier updates parsed from M's responses.

const SUGGESTION_PROMPTS = [
  { title: 'Map my path to VP', body: 'Surface the moves that compound over 4 years.' },
  { title: 'Plan a pivot', body: 'Translate my current leverage into a new domain.' },
  { title: 'Negotiate a raise', body: 'Build a leverage map and a counter-offer script.' },
];

const SEED_DOSSIER = {
  member: 'Eliot Cho',
  role: 'Senior Engineer · Platform',
  tenure: '5y · 2 promos',
  goals: [
    { label: 'Director track by 2027', status: 'active' },
    { label: 'Public technical brand', status: 'active' },
  ],
  skills: [
    { label: 'Distributed systems', conf: 92 },
    { label: 'Org design', conf: 64 },
    { label: 'Executive presence', conf: 41 },
    { label: 'Hiring & retention', conf: 58 },
  ],
  signals: [
    'High IC depth, low cross-functional surface area',
    'No public artifacts in 18 months',
    'Manager turnover blocking visibility',
  ],
};

const ONBOARDING_QUESTIONS = [
  { id: 'q1', q: "What role are you targeting in 3 years?", placeholder: 'e.g. Director of Platform Eng' },
  { id: 'q2', q: "What's the work you've been avoiding?", placeholder: 'Be specific — name the conversation, the artifact, the meeting.' },
  { id: 'q3', q: "Who are 2 people whose careers you'd like to study?", placeholder: 'Names + why' },
];

const STORE_KEY = 'em.console.v1';
const loadStore = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; } };
const saveStore = (data) => { try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {} };

const ConsoleScreen = ({ voice = 'boardroom' }) => {
  const voiceCfg = (window.VOICES && window.VOICES[voice]) || null;
  const stored = useMemo(loadStore, []);

  const [onboarded, setOnboarded] = useState(stored.onboarded || false);
  const [adminView, setAdminView] = useState(false);
  const [messages, setMessages] = useState(stored.messages?.length ? stored.messages : [
    { role: 'ai', header: voiceCfg?.welcomeHeader || 'Welcome back, Eliot.', body: voiceCfg?.welcomeBody || "I've been reviewing your last quarter. Three things changed your trajectory — pick one and I'll dig in. Or ask me anything." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dossier, setDossier] = useState(stored.dossier || SEED_DOSSIER);
  const scrollRef = useRef(null);

  // Persist
  useEffect(() => { saveStore({ onboarded, messages, dossier }); }, [onboarded, messages, dossier]);

  // Voice change resets the welcome only when no real conversation yet
  useEffect(() => {
    if (!voiceCfg) return;
    window.__activeVoiceThinking = voiceCfg.thinking;
    if (messages.length <= 1) {
      setMessages([{ role: 'ai', header: voiceCfg.welcomeHeader, body: voiceCfg.welcomeBody }]);
    }
  }, [voice]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const resetSession = () => {
    if (!confirm('Clear this session and re-run onboarding?')) return;
    localStorage.removeItem(STORE_KEY);
    setOnboarded(false);
    setMessages([{ role: 'ai', header: voiceCfg?.welcomeHeader || 'Welcome back.', body: voiceCfg?.welcomeBody || '' }]);
    setDossier(SEED_DOSSIER);
  };

  const send = async (textOverride) => {
    const text = textOverride ?? input.trim();
    if (!text || loading) return;
    setInput('');
    const userMsg = { role: 'user', body: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const baseSys = voiceCfg?.sysPrompt || `You are "M", an executive career mentor. Open with an 8-word header, blank line, then the substance.`;
      const dossierStr = JSON.stringify({ goals: dossier.goals.map(g => g.label), skills: dossier.skills, signals: dossier.signals });
      const sys = `${baseSys}\n\nThe user is ${dossier.member}, ${dossier.role}, ${dossier.tenure}. Current dossier: ${dossierStr}\n\nIMPORTANT: After your prose response, on its own line at the very end, output a single JSON object on one line in this exact shape:\n<<<DOSSIER>>>{"skill_deltas":[{"label":"<existing skill label>","delta":<-5..+5 integer>}], "new_signal":"<short observation or null>"}<<<END>>>\n\nOnly include skills already in the dossier. Pick at most 2 deltas tied to what was discussed. The signal should be a sharp 8-12 word observation about the user revealed by THIS exchange, or null.`;
      const reply = await window.claude.complete({
        messages: [
          { role: 'user', content: `${sys}\n\nConversation so far:\n${next.map(m => `${m.role === 'user' ? 'User' : 'M'}: ${m.body}`).join('\n')}\n\nM:` },
        ],
      });

      // Extract structured tail
      let prose = reply || '';
      let deltas = [], newSignal = null;
      const m = prose.match(/<<<DOSSIER>>>(.*?)<<<END>>>/s);
      if (m) {
        prose = prose.replace(m[0], '').trim();
        try {
          const parsed = JSON.parse(m[1].trim());
          deltas = parsed.skill_deltas || [];
          newSignal = parsed.new_signal && parsed.new_signal !== 'null' ? parsed.new_signal : null;
        } catch {}
      }

      const lines = prose.trim().split(/\n\s*\n/);
      const header = lines[0]?.replace(/^\s*[#>*\-\d.]+\s*/, '').trim() || 'Continuing.';
      const body = (lines.slice(1).join('\n\n') || lines[0] || '').trim();

      setMessages(m => [...m, { role: 'ai', header, body }]);

      // Apply structured updates
      setDossier(d => {
        const newSkills = d.skills.map(s => {
          const hit = deltas.find(x => x.label?.toLowerCase() === s.label.toLowerCase());
          return hit ? { ...s, conf: Math.max(0, Math.min(100, s.conf + (hit.delta | 0))) } : s;
        });
        const signals = newSignal ? [newSignal, ...d.signals].slice(0, 5) : d.signals;
        return { ...d, skills: newSkills, signals };
      });
    } catch (e) {
      setMessages(m => [...m, { role: 'ai', header: 'Connection issue.', body: 'I lost the thread for a moment. Try again — I have your context.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Onboarding flow takes over the chat surface
  if (!onboarded) {
    return <OnboardingFlow voice={voiceCfg} onDone={(answers) => {
      // Seed first M message from the answers
      const seed = `Onboarding answers — Target: ${answers.q1}. Avoiding: ${answers.q2}. Studying: ${answers.q3}.`;
      setMessages([
        { role: 'ai', header: voiceCfg?.welcomeHeader || 'Welcome.', body: voiceCfg?.welcomeBody || '' },
        { role: 'user', body: seed },
      ]);
      setOnboarded(true);
      // kick off M's first real response
      setTimeout(() => send(seed), 100);
    }} />;
  }

  return (
    <div style={{
      maxWidth: 1440, margin: '0 auto',
      padding: '24px 32px',
      display: 'grid', gridTemplateColumns: '1fr 380px',
      gap: 24,
      height: 'calc(100vh - 70px)',
    }}>
      <div className="glass" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
        <ChatHeader adminView={adminView} setAdminView={setAdminView} onReset={resetSession} />
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', minHeight: 0 }}>
          {messages.length === 1 && <Suggestions voice={voice} onPick={(p) => send(p.title + '. ' + p.body)} />}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {messages.map((msg, i) => <ChatBubble key={i} {...msg} adminView={adminView} />)}
            {loading && <ThinkingIndicator />}
          </div>
        </div>
        <ChatInput value={input} onChange={setInput} onSend={() => send()} disabled={loading} adminView={adminView} />
        {adminView && <AdminViewOverlay />}
      </div>

      <Dossier dossier={dossier} adminView={adminView} />
    </div>
  );
};

// ── Onboarding diagnostic ──────────────────────────────────────────────────
const OnboardingFlow = ({ voice, onDone }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [text, setText] = useState('');
  const q = ONBOARDING_QUESTIONS[step];
  const isLast = step === ONBOARDING_QUESTIONS.length - 1;

  const submit = () => {
    if (!text.trim()) return;
    const next = { ...answers, [q.id]: text.trim() };
    setAnswers(next);
    setText('');
    if (isLast) onDone(next);
    else setStep(step + 1);
  };

  return (
    <div style={{
      maxWidth: 720, margin: '0 auto',
      padding: '80px 32px', minHeight: 'calc(100vh - 70px)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      animation: 'fadeIn 0.5s ease',
    }}>
      <div style={{ marginBottom: 40 }}>
        <Kicker accent>First session · {step + 1} of {ONBOARDING_QUESTIONS.length}</Kicker>
        <div style={{
          display: 'flex', gap: 4, marginTop: 14,
        }}>
          {ONBOARDING_QUESTIONS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 2,
              background: i <= step ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
      </div>

      <div className="h-serif" style={{
        fontSize: 44, lineHeight: 1.15, fontWeight: 500, fontStyle: 'italic',
        marginBottom: 32, letterSpacing: '-0.01em',
      }}>{q.q}</div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(); }}
        placeholder={q.placeholder}
        autoFocus
        rows={4}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius)',
          padding: 18,
          fontSize: 16,
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text)',
          outline: 'none',
          resize: 'none',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--color-muted)' }}>
          ⌘↵ to continue · Skip will use defaults
        </span>
        <div style={{ display: 'flex', gap: 10 }}>
          {step < ONBOARDING_QUESTIONS.length - 1 && (
            <CTA variant="ghost" size="sm" onClick={() => onDone({ q1: '', q2: '', q3: '' })}>Skip</CTA>
          )}
          <CTA size="sm" icon="arrowRight" onClick={submit}>{isLast ? 'Begin session' : 'Continue'}</CTA>
        </div>
      </div>
    </div>
  );
};

// ── Header ─────────────────────────────────────────────────────────────────
const ChatHeader = ({ adminView, setAdminView, onReset }) => (
  <div style={{
    padding: '18px 24px',
    borderBottom: 'var(--hairline)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 36, height: 36,
        background: 'var(--color-primary)',
        border: '1px solid rgba(16,185,129,0.4)',
        display: 'grid', placeItems: 'center',
        fontFamily: 'var(--font-heading)', fontStyle: 'italic',
        fontWeight: 600, color: 'var(--color-accent)', fontSize: 22,
        lineHeight: 1, paddingBottom: 2,
      }}>M</div>
      <div>
        <div className="h-serif" style={{ fontSize: 18, fontStyle: 'italic' }}>M · Mentor</div>
        <div className="mono" style={{ fontSize: 11, color: adminView ? 'var(--color-amber)' : 'var(--color-accent)' }}>
          {adminView ? '◆ admin preview · session redacted' : '● live · context refreshed 2m ago'}
        </div>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <button
        onClick={() => setAdminView(!adminView)}
        title="Preview what the admin sees"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px',
          background: adminView ? 'rgba(245,158,11,0.12)' : 'transparent',
          border: '1px solid ' + (adminView ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.16)'),
          color: adminView ? 'var(--color-amber)' : 'var(--color-muted)',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', borderRadius: 'var(--radius)',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <Icon name="lock" size={12} />
        {adminView ? 'Admin view on' : 'Show admin view'}
      </button>
      <CTA variant="ghost" size="sm" onClick={onReset}>New session</CTA>
    </div>
  </div>
);

const AdminViewOverlay = () => (
  <div style={{
    position: 'absolute', top: 78, right: 24,
    padding: '8px 12px',
    background: 'rgba(245,158,11,0.08)',
    border: '1px solid rgba(245,158,11,0.3)',
    fontSize: 11, color: 'var(--color-amber)',
    fontFamily: 'var(--font-mono)',
    maxWidth: 320, lineHeight: 1.5,
    zIndex: 5,
  }}>
    Your admin sees themes & readiness — never transcripts. Below is exactly their view.
  </div>
);

const Suggestions = ({ onPick, voice }) => {
  const prompts = (window.VOICES && window.VOICES[voice]?.suggestions) || SUGGESTION_PROMPTS;
  return (
    <div style={{ marginBottom: 32 }}>
      <Kicker accent>Try one</Kicker>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16 }}>
        {prompts.map((p, i) => (
          <SuggestionChip key={voice + i} {...p} onClick={() => onPick(p)} />
        ))}
      </div>
    </div>
  );
};

const SuggestionChip = ({ title, body, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: 'left', padding: 18,
        background: hover ? 'var(--color-accent)' : 'transparent',
        border: '1px solid ' + (hover ? 'var(--color-accent)' : 'rgba(16,185,129,0.4)'),
        color: hover ? 'var(--color-bg)' : 'var(--color-text)',
        borderRadius: 'var(--radius)', cursor: 'pointer',
        transition: 'all 0.18s ease', fontFamily: 'inherit',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}
    >
      <div className="h-serif" style={{ fontSize: 18, fontWeight: 600, fontStyle: 'italic', lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 12, color: hover ? 'var(--color-bg)' : 'var(--color-muted)', opacity: hover ? 0.7 : 1, lineHeight: 1.45 }}>{body}</div>
    </button>
  );
};

// ── Chat bubble (with privacy redaction) ───────────────────────────────────
const ChatBubble = ({ role, header, body, adminView }) => {
  const isUser = role === 'user';
  const redacted = adminView && isUser;

  return (
    <div style={{
      display: 'flex', gap: 14,
      flexDirection: isUser ? 'row-reverse' : 'row',
      animation: 'slideUp 0.35s ease',
    }}>
      <div style={{
        width: 40, height: 40, flexShrink: 0,
        background: isUser ? 'rgba(255,255,255,0.04)' : 'var(--color-primary)',
        border: isUser ? 'var(--hairline)' : '1px solid rgba(16,185,129,0.4)',
        display: 'grid', placeItems: 'center',
        fontFamily: isUser ? 'var(--font-body)' : 'var(--font-heading)',
        fontStyle: isUser ? 'normal' : 'italic',
        fontWeight: 600,
        color: isUser ? 'var(--color-muted)' : 'var(--color-accent)',
        fontSize: isUser ? 12 : 22,
        lineHeight: 1, paddingBottom: isUser ? 0 : 2,
      }}>{isUser ? 'EC' : 'M'}</div>
      <div style={{
        maxWidth: '78%', padding: '14px 18px',
        background: isUser ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)',
        border: isUser ? '1px solid rgba(16,185,129,0.2)' : 'var(--hairline)',
        borderRadius: 'var(--radius)',
        position: 'relative',
      }}>
        {redacted ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--color-muted)', fontStyle: 'italic' }}>
            <Icon name="lock" size={14} />
            Member message — encrypted, not visible to admins
          </div>
        ) : (
          <>
            {header && (
              <div className="h-serif" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.25, marginBottom: 8 }}>
                {header}
              </div>
            )}
            <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{body}</div>
          </>
        )}
      </div>
    </div>
  );
};

const ThinkingIndicator = () => (
  <div style={{ display: 'flex', gap: 14, animation: 'fadeIn 0.3s ease' }}>
    <div style={{
      width: 40, height: 40,
      background: 'var(--color-primary)',
      border: '1px solid rgba(16,185,129,0.4)',
      display: 'grid', placeItems: 'center',
      fontFamily: 'var(--font-heading)', fontStyle: 'italic',
      fontWeight: 600, color: 'var(--color-accent)', fontSize: 22,
      lineHeight: 1, paddingBottom: 2,
    }}>M</div>
    <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: 'var(--hairline)' }}>
      <div className="h-serif" style={{
        fontSize: 16, fontStyle: 'italic', color: 'var(--color-muted)',
        animation: 'pulse 1.4s ease-in-out infinite',
      }}>{(window.__activeVoiceThinking) || 'Analyzing trajectory…'}</div>
    </div>
  </div>
);

const ChatInput = ({ value, onChange, onSend, disabled, adminView }) => {
  const [focus, setFocus] = useState(false);
  if (adminView) {
    return (
      <div style={{
        padding: '20px 24px', borderTop: 'var(--hairline)',
        background: 'rgba(245,158,11,0.05)',
        textAlign: 'center', fontSize: 12, color: 'var(--color-muted)',
        fontFamily: 'var(--font-mono)',
      }}>
        Admin cannot see or send messages in this session.
      </div>
    );
  }
  return (
    <div style={{ padding: '18px 24px', borderTop: 'var(--hairline)', background: 'var(--color-surface)' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '4px 4px 4px 18px',
        background: 'rgba(255,255,255,0.03)',
        border: focus ? '1px solid rgba(16,185,129,0.5)' : 'var(--hairline)',
        borderRadius: 'var(--radius)', transition: 'border 0.18s',
      }}>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
          placeholder="Ask M anything · Cmd+K for shortcuts"
          disabled={disabled}
          style={{ flex: 1, background: 'transparent', border: 0, outline: 'none', fontSize: 15, padding: '14px 0', color: 'var(--color-text)' }}
        />
        <button
          onClick={onSend} disabled={disabled || !value.trim()}
          style={{
            width: 40, height: 40,
            background: value.trim() && !disabled ? 'var(--color-accent)' : 'rgba(16,185,129,0.15)',
            color: value.trim() && !disabled ? 'var(--color-bg)' : 'var(--color-accent)',
            border: 0, borderRadius: 'var(--radius)',
            cursor: value.trim() && !disabled ? 'pointer' : 'default',
            display: 'grid', placeItems: 'center', transition: 'all 0.18s',
            boxShadow: value.trim() && !disabled ? '0 0 24px rgba(16,185,129,0.3)' : 'none',
          }}
        ><Icon name="send" size={16} /></button>
      </div>
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-muted)' }}>
        <span>Powered by claude-haiku-4-5 · End-to-end encrypted</span>
        <span className="mono">↵ to send · ⇧↵ for newline</span>
      </div>
    </div>
  );
};

// ── Dossier (with redaction) ────────────────────────────────────────────────
const Dossier = ({ dossier, adminView }) => (
  <div className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' }}>
    <div>
      <Kicker accent>{adminView ? 'Admin sees' : 'Live dossier'}</Kicker>
      <div className="h-serif" style={{ fontSize: 26, fontWeight: 600, marginTop: 14, lineHeight: 1.1 }}>
        {adminView ? 'Member · #4821' : dossier.member}
      </div>
      <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>
        {adminView ? 'Identity hidden in cohort view' : dossier.role}
      </div>
      <div className="mono" style={{ fontSize: 11, color: 'var(--color-accent)', marginTop: 6 }}>{dossier.tenure}</div>
    </div>

    <Section title={adminView ? 'Aggregate goals' : 'Active goals'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {dossier.goals.map((g, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px',
            background: 'rgba(16,185,129,0.05)',
            border: '1px solid rgba(16,185,129,0.2)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', boxShadow: '0 0 8px var(--color-accent)' }} />
            <span style={{ fontSize: 13 }}>{g.label}</span>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Skill profile">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {dossier.skills.map((s, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span>{s.label}</span>
              <span className="mono" style={{ color: 'var(--color-muted)' }}>{adminView ? '—' : s.conf}</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.05)' }}>
              <div style={{
                height: '100%',
                width: `${adminView ? Math.round(s.conf / 10) * 10 : s.conf}%`,
                background: s.conf >= 70 ? 'var(--color-accent)' : s.conf >= 50 ? 'var(--color-amber)' : 'var(--color-muted)',
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        ))}
      </div>
    </Section>

    {!adminView && (
      <Section title="Signals">
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dossier.signals.map((s, i) => (
            <li key={i} style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.5, paddingLeft: 14, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, top: 8, width: 6, height: 1, background: 'var(--color-accent)' }} />
              {s}
            </li>
          ))}
        </ul>
      </Section>
    )}

    {adminView && (
      <Section title="What admin gets">
        <div style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.6, padding: 12, background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.2)' }}>
          Skill levels rounded to nearest 10%. Identity replaced with cohort ID. Conversation themes only — no transcripts. Min cohort size of 5 enforced for all reports.
        </div>
      </Section>
    )}

    <Section title="Context chips">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {(adminView ? ['Skill themes', 'Goal categories', 'Engagement frequency'] : ['1:1 transcripts (12)', 'Promo packets (3)', 'Org chart', 'Compa-ratio', 'Recent perf reviews']).map((c, i) => (
          <ContextChip key={i}>{c}</ContextChip>
        ))}
      </div>
    </Section>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)', marginBottom: 12 }}>{title}</div>
    {children}
  </div>
);

const ContextChip = ({ children }) => {
  const [hover, setHover] = useState(false);
  return (
    <span
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        fontSize: 11, padding: '4px 10px',
        border: '1px solid rgba(16,185,129,0.4)',
        background: hover ? 'var(--color-accent)' : 'transparent',
        color: hover ? 'var(--color-bg)' : 'var(--color-text)',
        cursor: 'pointer', transition: 'all 0.16s',
      }}
    >{children}</span>
  );
};

Object.assign(window, { ConsoleScreen });
