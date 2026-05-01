// Landing Pitch — investor-optimized showcase
const LandingScreen = ({ onNavigate }) => {
  return (
    <div style={{ paddingBottom: 80 }}>
      <Hero onNavigate={onNavigate} />
      <MetricsRibbon />
      <FeatureGrid />
      <PullQuote />
      <ClosingCTA onNavigate={onNavigate} />
      <InvestorTicker />
    </div>
  );
};

// ── Hero ────────────────────────────────────────────────────────────────────
const Hero = ({ onNavigate }) => {
  return (
    <section style={{
      maxWidth: 1280, margin: '0 auto', padding: '80px 32px 60px',
      animation: 'fadeIn 0.8s ease',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 64, alignItems: 'center' }}>
        <div>
          <Kicker accent>Series A · Closing Q3 2026</Kicker>
          <h1 className="h-serif" style={{
            fontSize: 92, lineHeight: 0.98, margin: '24px 0 0',
            letterSpacing: '-0.025em',
            fontWeight: 500,
          }}>
            Wisdom<br/>
            <em style={{ color: 'var(--color-accent)', fontWeight: 500 }}>at scale.</em>
          </h1>
          <p style={{
            fontSize: 19, lineHeight: 1.5, color: 'var(--color-muted)',
            margin: '32px 0 0', maxWidth: 540,
          }}>
            Executive Mentor brings the boardroom advisor to every ambitious professional —
            and gives institutions a mirror into the trajectory of their workforce.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
            <CTA size="lg" icon="arrowRight" onClick={() => onNavigate('console')}>
              Try the console
            </CTA>
            <CTA size="lg" variant="ghost" onClick={() => onNavigate('dashboard')}>
              See institutional view
            </CTA>
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 56, color: 'var(--color-muted)', fontSize: 12 }}>
            <Stat label="Cohorts deployed" value="184" />
            <Stat label="Members guided" value="62,400" />
            <Stat label="Avg. promo lift" value="2.3×" />
          </div>
        </div>
        <DemoTerminal />
      </div>
    </section>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <div className="h-serif" style={{ fontSize: 32, color: 'var(--color-text)', lineHeight: 1 }}>{value}</div>
    <div className="uc" style={{ fontSize: 10, marginTop: 6 }}>{label}</div>
  </div>
);

// ── Demo terminal (auto-types) ──────────────────────────────────────────────
const DEMO_SCRIPT = [
  { role: 'user', text: 'Map my path to VP of Engineering in 4 years.' },
  { role: 'ai', text: 'Three structural moves stand out. Increase platform-org exposure now; trade pure-IC depth for cross-functional reach by year two; cultivate a board-visible artifact (RFC, public talk, hiring tree) by year three.' },
];

const DemoTerminal = () => {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (step >= DEMO_SCRIPT.length) { setDone(true); return; }
    const target = DEMO_SCRIPT[step].text;
    let i = 0;
    setTyped('');
    const speed = DEMO_SCRIPT[step].role === 'user' ? 28 : 18;
    const t = setInterval(() => {
      i++;
      setTyped(target.slice(0, i));
      if (i >= target.length) {
        clearInterval(t);
        setTimeout(() => setStep(s => s + 1), 700);
      }
    }, speed);
    return () => clearInterval(t);
  }, [step]);

  // Restart on completion
  useEffect(() => {
    if (done) {
      const t = setTimeout(() => { setDone(false); setStep(0); }, 4000);
      return () => clearTimeout(t);
    }
  }, [done]);

  return (
    <div className="glass" style={{
      padding: 4,
      boxShadow: 'var(--shadow-card)',
      transform: 'perspective(1400px) rotateY(-4deg) rotateX(2deg)',
      transformOrigin: 'center',
    }}>
      <div style={{
        background: 'var(--color-bg)',
        opacity: 0.6,
        padding: '14px 18px',
        borderBottom: 'var(--hairline)',
        display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 11, color: 'var(--color-muted)',
      }} className="mono">
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)' }} />
        executive-mentor / live session · 02:14
        <span style={{ marginLeft: 'auto' }}>encrypted</span>
      </div>
      <div style={{ padding: '24px 22px', minHeight: 360, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {DEMO_SCRIPT.slice(0, step).map((m, i) => <DemoBubble key={i} {...m} />)}
        {step < DEMO_SCRIPT.length && (
          <DemoBubble role={DEMO_SCRIPT[step].role} text={typed} typing />
        )}
      </div>
    </div>
  );
};

const DemoBubble = ({ role, text, typing }) => {
  const isUser = role === 'user';
  return (
    <div style={{
      display: 'flex', gap: 12,
      flexDirection: isUser ? 'row-reverse' : 'row',
      animation: 'fadeIn 0.4s ease',
    }}>
      <div style={{
        width: 32, height: 32, flexShrink: 0,
        background: isUser ? 'rgba(255,255,255,0.04)' : 'var(--color-primary)',
        border: isUser ? 'var(--hairline)' : '1px solid rgba(16,185,129,0.4)',
        display: 'grid', placeItems: 'center',
        fontFamily: isUser ? 'var(--font-body)' : 'var(--font-heading)',
        fontSize: isUser ? 11 : 18,
        fontStyle: isUser ? 'normal' : 'italic',
        fontWeight: 600,
        color: isUser ? 'var(--color-muted)' : 'var(--color-accent)',
      }}>{isUser ? 'EC' : 'M'}</div>
      <div style={{
        background: isUser ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)',
        border: isUser ? '1px solid rgba(16,185,129,0.2)' : 'var(--hairline)',
        padding: '12px 16px',
        maxWidth: '78%',
        fontSize: 14,
        lineHeight: 1.55,
        color: isUser ? 'var(--color-text)' : 'var(--color-text)',
        fontFamily: isUser ? 'var(--font-body)' : 'var(--font-body)',
      }}>
        {text}
        {typing && <span style={{
          display: 'inline-block', width: 7, height: 14, marginLeft: 2,
          background: 'var(--color-accent)', verticalAlign: 'middle',
          animation: 'blink 1s steps(1) infinite',
        }} />}
      </div>
    </div>
  );
};

// ── Metrics ribbon ──────────────────────────────────────────────────────────
const MetricsRibbon = () => (
  <section style={{
    maxWidth: 1280, margin: '40px auto 0', padding: '0 32px',
  }}>
    <div className="glass" style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      borderRadius: 0,
    }}>
      {[
        ['Avg. weekly engagement', '4.6 hrs', '+18% MoM'],
        ['Career goal completion', '71%', 'cohort 24Q1'],
        ['Net promoter (NPS)', '74', 'enterprise tier'],
        ['ARR · Q1 2026', '$8.4M', '+312% YoY'],
      ].map(([label, value, sub], i) => (
        <div key={i} style={{
          padding: '24px 28px',
          borderRight: i < 3 ? 'var(--hairline)' : 'none',
        }}>
          <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)' }}>{label}</div>
          <div className="h-serif" style={{ fontSize: 36, lineHeight: 1.1, marginTop: 10 }}>{value}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--color-accent)', marginTop: 6 }}>{sub}</div>
        </div>
      ))}
    </div>
  </section>
);

// ── Feature grid ────────────────────────────────────────────────────────────
const FeatureGrid = () => {
  const features = [
    {
      kicker: '01 / Mentorship',
      title: 'A boardroom voice in the IDE.',
      body: 'Context-aware sessions trained on senior leadership patterns. Members negotiate, pivot, and pressure-test decisions in real time.',
      tag: 'Console',
    },
    {
      kicker: '02 / Trajectory',
      title: 'Roadmaps that adapt as life does.',
      body: 'Milestones rebuild themselves around layoffs, promotions, parental leave, market shifts. The plan is never the plan.',
      tag: 'Roadmap',
    },
    {
      kicker: '03 / Oversight',
      title: 'Cohort intelligence, not surveillance.',
      body: 'Aggregate readiness scores, skill-gap heatmaps, and promotion forecasts — without ever exposing a single private session.',
      tag: 'Dashboard',
    },
  ];
  return (
    <section style={{ maxWidth: 1280, margin: '120px auto 0', padding: '0 32px' }}>
      <div style={{ marginBottom: 56, maxWidth: 720 }}>
        <Kicker>What ships in v1</Kicker>
        <h2 className="h-serif" style={{ fontSize: 56, lineHeight: 1.05, margin: '20px 0 0', fontWeight: 500 }}>
          Three surfaces, <em>one institution</em>.
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {features.map((f, i) => <FeatureCard key={i} {...f} />)}
      </div>
    </section>
  );
};

const FeatureCard = ({ kicker, title, body, tag }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="glass"
      style={{
        padding: 28, minHeight: 320,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        transition: 'all 0.3s ease',
        borderColor: hover ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)',
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
    >
      <div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--color-accent)', letterSpacing: '0.1em' }}>{kicker}</div>
        <h3 className="h-serif" style={{ fontSize: 30, lineHeight: 1.15, margin: '24px 0 16px', fontWeight: 500 }}>
          {title}
        </h3>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-muted)', margin: 0 }}>{body}</p>
      </div>
      <div style={{ marginTop: 32, paddingTop: 20, borderTop: 'var(--hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="uc" style={{ fontSize: 10, color: 'var(--color-muted)' }}>Surface · {tag}</span>
        <Icon name="arrowRight" size={14} />
      </div>
    </div>
  );
};

// ── Pull quote ──────────────────────────────────────────────────────────────
const PullQuote = () => (
  <section style={{ maxWidth: 1100, margin: '120px auto 0', padding: '0 32px', textAlign: 'center' }}>
    <div style={{ fontSize: 60, fontFamily: 'var(--font-heading)', color: 'var(--color-accent)', lineHeight: 0.6, marginBottom: 20 }}>“</div>
    <blockquote className="h-serif" style={{
      fontSize: 38, lineHeight: 1.3, fontStyle: 'italic', fontWeight: 400,
      margin: 0, letterSpacing: '-0.01em',
    }}>
      Every operator in our portfolio gets one of these now. It's the closest thing to a fractional COO any of them have ever had.
    </blockquote>
    <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-bg))',
        border: '1px solid rgba(16,185,129,0.3)',
      }} />
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>Lena Aldrich</div>
        <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Managing Partner · Northvane Capital</div>
      </div>
    </div>
  </section>
);

// ── Closing CTA ─────────────────────────────────────────────────────────────
const ClosingCTA = ({ onNavigate }) => (
  <section style={{ maxWidth: 1280, margin: '120px auto 0', padding: '0 32px' }}>
    <div className="glass" style={{
      padding: '72px 64px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      gap: 64,
      background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(20,30,40,0.6) 100%)',
    }}>
      <div>
        <Kicker accent>Investor preview · NDA</Kicker>
        <h2 className="h-serif" style={{ fontSize: 48, lineHeight: 1.1, margin: '16px 0 0', fontWeight: 500 }}>
          See what an institution<br/>looks like from the inside.
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 240 }}>
        <CTA size="lg" icon="arrowRight" onClick={() => onNavigate('console')}>Open the console</CTA>
        <CTA size="lg" variant="ghost" icon="download" onClick={() => alert('Deck would download here.')}>Investor deck</CTA>
      </div>
    </div>
  </section>
);

// ── Investor ticker (fixed bottom) ─────────────────────────────────────────
const TICKER_ITEMS = [
  ['ARR', '$8.4M', '+312%'],
  ['MoM growth', '24.6%'],
  ['Cohorts live', '184'],
  ['Members', '62,400'],
  ['Avg. session', '14m 22s'],
  ['Retention · 90d', '78%'],
  ['Enterprise pilots', '11'],
  ['Net revenue retention', '141%'],
  ['Avg. promotion lift', '2.3×'],
  ['Pipeline · Q2', '$22M'],
];

const InvestorTicker = () => (
  <div style={{
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: 'var(--color-bg)',
    opacity: 0.92,
    backdropFilter: 'blur(12px)',
    borderTop: 'var(--hairline)',
    padding: '10px 0',
    overflow: 'hidden',
    zIndex: 40,
  }}>
    <div style={{
      display: 'flex', gap: 48,
      animation: 'tickerScroll 60s linear infinite',
      whiteSpace: 'nowrap',
      width: 'max-content',
    }} className="mono">
      {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map(([l, v, d], i) => (
        <span key={i} style={{ fontSize: 12, color: 'var(--color-muted)', display: 'inline-flex', gap: 10 }}>
          <span className="uc" style={{ fontSize: 10 }}>{l}</span>
          <span style={{ color: 'var(--color-text)' }}>{v}</span>
          {d && <span style={{ color: 'var(--color-accent)' }}>{d}</span>}
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
        </span>
      ))}
    </div>
    <style>{`@keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }`}</style>
  </div>
);

Object.assign(window, { LandingScreen });
