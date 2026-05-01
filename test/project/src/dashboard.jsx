// Institutional Dashboard — admin macro view
const COHORT_DATA = [
  { name: 'Maya Okafor',    track: 'Product · Senior PM',   readiness: 87, gap: 'Exec presence',     last: '2h' },
  { name: 'Jonas Pereira',  track: 'Eng · Staff candidate',  readiness: 72, gap: 'Cross-fn reach',    last: '1d' },
  { name: 'Anya Volkov',    track: 'Design · Director',      readiness: 91, gap: '—',                last: '4h' },
  { name: 'Marcus Hale',    track: 'Eng · Senior',           readiness: 64, gap: 'Org design',        last: '3h' },
  { name: 'Priya Raman',    track: 'Data · Lead',            readiness: 78, gap: 'Hiring',            last: '6h' },
  { name: 'Kenji Ito',      track: 'Eng · IC4',              readiness: 41, gap: 'Public artifacts',  last: '12h' },
  { name: 'Sofia Marchetti', track: 'Product · Group PM',    readiness: 83, gap: 'Board comms',       last: '1d' },
  { name: 'David Ouwasanmi', track: 'Eng · Manager',         readiness: 55, gap: 'Strategic depth',   last: '2d' },
];

const SKILL_HEATMAP = [
  { skill: 'Cross-functional reach', tracks: { eng: 0.42, product: 0.78, design: 0.65, data: 0.51 } },
  { skill: 'Public technical brand', tracks: { eng: 0.31, product: 0.55, design: 0.72, data: 0.48 } },
  { skill: 'Org design',             tracks: { eng: 0.58, product: 0.81, design: 0.62, data: 0.44 } },
  { skill: 'Executive presence',     tracks: { eng: 0.44, product: 0.69, design: 0.71, data: 0.52 } },
  { skill: 'Hiring & retention',     tracks: { eng: 0.61, product: 0.74, design: 0.58, data: 0.56 } },
];

const DashboardScreen = () => {
  const [activeMetric, setActiveMetric] = useState('engagement');
  const [tab, setTab] = useState('cohort');
  const [drilldown, setDrilldown] = useState(null); // member object or null

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '32px 32px 80px' }}>
      <DashHeader />
      <PrivacyBanner />
      <MetricRibbon active={activeMetric} onSelect={setActiveMetric} />

      <div style={{
        marginTop: 24,
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr',
        gap: 24,
      }}>
        <TrajectoryChart metric={activeMetric} />
        <NarrativePanel />
      </div>

      <div style={{ marginTop: 24, display: 'flex', gap: 8, alignItems: 'center', borderBottom: 'var(--hairline)' }}>
        {[['cohort', 'Cohort table'], ['skills', 'Skill gap analysis']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: '14px 20px',
              background: 'transparent',
              border: 0,
              borderBottom: '2px solid ' + (tab === id ? 'var(--color-accent)' : 'transparent'),
              color: tab === id ? 'var(--color-text)' : 'var(--color-muted)',
              cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              letterSpacing: '0.06em',
              marginBottom: -1,
              transition: 'all 0.18s',
            }}
          >{label}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, paddingBottom: 8 }}>
          <CTA size="sm" variant="ghost" icon="filter">Filter</CTA>
          <CTA size="sm" variant="ghost" icon="download">Export</CTA>
        </div>
      </div>

      {tab === 'cohort' ? <CohortTable data={COHORT_DATA} onOpen={setDrilldown} /> : <SkillHeatmap data={SKILL_HEATMAP} />}

      {drilldown && <DrilldownOverlay member={drilldown} onClose={() => setDrilldown(null)} />}
    </div>
  );
};

const PrivacyBanner = () => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 16px', marginBottom: 24,
    background: 'rgba(14,165,233,0.05)',
    border: '1px solid rgba(14,165,233,0.25)',
    borderRadius: 'var(--radius)',
    fontSize: 12, color: 'var(--color-muted)',
  }}>
    <Icon name="lock" size={14} />
    <span><strong style={{ color: 'var(--color-text)' }}>Privacy-first analytics.</strong> Themes &amp; readiness only — no transcripts. Cohort min size of 5. Member identities visible only to admins of record.</span>
  </div>
);

const DashHeader = () => (
  <header style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
    <div style={{ minWidth: 0, flex: '1 1 auto' }}>
      <Kicker accent>Northvane Capital · Spring '26 cohort</Kicker>
      <h1 className="h-serif" style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', lineHeight: 1.1, margin: '16px 0 8px', fontWeight: 500 }}>
        Cohort intelligence
      </h1>
      <div className="mono" style={{ fontSize: 12, color: 'var(--color-muted)', margin: 0 }}>
        Last sync · 2m ago · 1,284 members in scope
      </div>
    </div>
    <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
      <CTA variant="ghost" size="sm">Last 30 days</CTA>
      <CTA variant="accent" size="sm" icon="bell">Alerts (3)</CTA>
    </div>
  </header>
);

// ── Top metric ribbon ──────────────────────────────────────────────────────
const METRICS = [
  { id: 'users', label: 'Total members', value: '1,284', delta: '+42 this week', deltaColor: 'var(--color-accent)' },
  { id: 'engagement', label: 'Engagement rate', value: '78%', delta: '+4.2% MoM', deltaColor: 'var(--color-accent)' },
  { id: 'gap', label: 'Top skill gap', value: 'Exec presence', delta: '34% of cohort', deltaColor: 'var(--color-amber)' },
  { id: 'placement', label: 'Placement probability', value: '0.71', delta: 'within 12 months', deltaColor: 'var(--color-muted)' },
];

const MetricRibbon = ({ active, onSelect }) => (
  <div className="glass" style={{
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
  }}>
    {METRICS.map((m, i) => {
      const isActive = active === m.id;
      return (
        <button
          key={m.id}
          onClick={() => onSelect(m.id)}
          style={{
            padding: '24px 28px',
            borderRight: i < 3 ? 'var(--hairline)' : 'none',
            background: isActive ? 'rgba(16,185,129,0.05)' : 'transparent',
            border: 0,
            borderBottom: '2px solid ' + (isActive ? 'var(--color-accent)' : 'transparent'),
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
            color: 'inherit', fontFamily: 'inherit',
          }}
        >
          <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)' }}>{m.label}</div>
          <div className="h-serif" style={{ fontSize: 38, lineHeight: 1.1, marginTop: 10, fontWeight: 500 }}>{m.value}</div>
          <div className="mono" style={{ fontSize: 11, color: m.deltaColor, marginTop: 8 }}>{m.delta}</div>
        </button>
      );
    })}
  </div>
);

// ── Trajectory line chart (SVG) ─────────────────────────────────────────────
const CHART_DATA = {
  engagement: [62, 64, 63, 67, 71, 70, 73, 75, 74, 76, 78, 78],
  users:      [820, 880, 920, 970, 1020, 1080, 1110, 1150, 1180, 1220, 1260, 1284],
  gap:        [42, 41, 40, 39, 38, 37, 36, 35, 35, 34, 34, 34],
  placement:  [0.58, 0.60, 0.61, 0.63, 0.64, 0.66, 0.67, 0.68, 0.69, 0.70, 0.70, 0.71],
};

const TrajectoryChart = ({ metric }) => {
  const data = CHART_DATA[metric] || CHART_DATA.engagement;
  const w = 720, h = 260, pad = { l: 40, r: 20, t: 20, b: 36 };
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = pad.l + (i / (data.length - 1)) * (w - pad.l - pad.r);
    const y = pad.t + (1 - (v - min) / range) * (h - pad.t - pad.b);
    return [x, y];
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const area = `${path} L ${points[points.length - 1][0]} ${h - pad.b} L ${points[0][0]} ${h - pad.b} Z`;

  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

  return (
    <div className="glass" style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <Kicker>12-month trajectory</Kicker>
          <div className="h-serif" style={{ fontSize: 26, fontWeight: 600, marginTop: 10, textTransform: 'capitalize' }}>
            {METRICS.find(m => m.id === metric)?.label || metric}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          {['1M', '3M', '12M', 'YTD'].map((p, i) => (
            <button key={p} style={{
              padding: '4px 10px',
              background: i === 2 ? 'rgba(16,185,129,0.1)' : 'transparent',
              border: '1px solid ' + (i === 2 ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'),
              color: i === 2 ? 'var(--color-accent)' : 'var(--color-muted)',
              fontSize: 11, fontFamily: 'var(--font-mono)',
              cursor: 'pointer', borderRadius: 'var(--radius)',
            }}>{p}</button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 260, marginTop: 8 }}>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map(p => (
          <line key={p} x1={pad.l} x2={w - pad.r}
            y1={pad.t + p * (h - pad.t - pad.b)} y2={pad.t + p * (h - pad.t - pad.b)}
            stroke="rgba(130,154,177,0.1)" strokeDasharray="2 4" />
        ))}
        <path d={area} fill="url(#chartFill)" />
        <path d={path} fill="none" stroke="#10B981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={i === points.length - 1 ? 5 : 0}
            fill="var(--color-accent)" stroke="var(--color-bg)" strokeWidth="2" />
        ))}
        {months.map((m, i) => i % 2 === 0 && (
          <text key={i} x={pad.l + (i / (data.length - 1)) * (w - pad.l - pad.r)} y={h - 12}
            fontSize="10" fill="var(--color-muted)" fontFamily="var(--font-mono)" textAnchor="middle">{m}</text>
        ))}
      </svg>
    </div>
  );
};

// ── Narrative panel (right of chart) ───────────────────────────────────────
const NarrativePanel = () => (
  <div className="glass" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <Kicker accent>M's read on the cohort</Kicker>
      <div className="h-serif" style={{ fontSize: 22, lineHeight: 1.3, fontWeight: 500, marginTop: 14, fontStyle: 'italic' }}>
        "Engagement is healthy, but a third of the cohort is hiding from public artifacts. Push three of them to publish before Q3."
      </div>
    </div>

    <div style={{ borderTop: 'var(--hairline)', paddingTop: 18 }}>
      <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)', marginBottom: 12 }}>Suggested actions</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          ['Schedule writing workshop', '34% of cohort flagged'],
          ['Pair Marcus + Anya for shadow', 'Cross-track signal'],
          ['Send Q2 readiness summary', 'Auto-draft ready'],
        ].map(([t, s], i) => (
          <div key={i} style={{
            padding: '10px 12px',
            background: 'rgba(16,185,129,0.04)',
            border: '1px solid rgba(16,185,129,0.2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{t}</div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>{s}</div>
            </div>
            <Icon name="arrowRight" size={14} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Cohort table ────────────────────────────────────────────────────────────
const CohortTable = ({ data, onOpen }) => {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ marginTop: 24, animation: 'fadeIn 0.3s ease' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 2fr 1fr 1.5fr 1fr 60px',
        padding: '14px 20px',
        borderBottom: 'var(--hairline-strong)',
        fontSize: 10, letterSpacing: '0.14em',
        color: 'var(--color-muted)',
        textTransform: 'uppercase', fontWeight: 600,
      }}>
        <div>Member</div>
        <div>Track</div>
        <div>Readiness</div>
        <div>Top skill gap</div>
        <div>Last session</div>
        <div></div>
      </div>
      {data.map((r, i) => (
        <div
          key={i}
          onClick={() => onOpen && onOpen(r)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr 1.5fr 1fr 60px',
            padding: '16px 20px',
            borderBottom: 'var(--hairline)',
            background: hovered === i ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)',
            cursor: 'pointer',
            transition: 'background 0.15s',
            alignItems: 'center',
            fontSize: 13,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-bg))',
              border: '1px solid var(--hairline-strong)',
              display: 'grid', placeItems: 'center',
              fontSize: 10, fontWeight: 600, color: 'var(--color-accent)',
            }}>{r.name.split(' ').map(p => p[0]).join('')}</div>
            <span>{r.name}</span>
          </div>
          <div style={{ color: 'var(--color-muted)' }}>{r.track}</div>
          <div><ReadinessBadge score={r.readiness} /></div>
          <div style={{ color: r.gap === '—' ? 'var(--color-muted)' : 'var(--color-text)' }}>{r.gap}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--color-muted)' }}>{r.last} ago</div>
          <div style={{ textAlign: 'right', color: 'var(--color-muted)' }}><Icon name="chevronRight" size={14} /></div>
        </div>
      ))}
    </div>
  );
};

const ReadinessBadge = ({ score }) => {
  const color = score >= 80 ? 'var(--color-accent)' : score >= 50 ? 'var(--color-amber)' : 'var(--color-rose)';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 500,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      <span style={{ color }}>{score}</span>
    </span>
  );
};

// ── Skill heatmap ───────────────────────────────────────────────────────────
const SkillHeatmap = ({ data }) => {
  const tracks = ['eng', 'product', 'design', 'data'];
  return (
    <div style={{ marginTop: 24, animation: 'fadeIn 0.3s ease' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr repeat(4, 1fr)',
        padding: '14px 20px',
        borderBottom: 'var(--hairline-strong)',
        fontSize: 10, letterSpacing: '0.14em',
        color: 'var(--color-muted)', textTransform: 'uppercase', fontWeight: 600,
      }}>
        <div>Skill</div>
        {tracks.map(t => <div key={t} style={{ textAlign: 'center' }}>{t}</div>)}
      </div>
      {data.map((r, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '2fr repeat(4, 1fr)',
          padding: '14px 20px',
          borderBottom: 'var(--hairline)',
          alignItems: 'center', fontSize: 13,
        }}>
          <div>{r.skill}</div>
          {tracks.map(t => {
            const v = r.tracks[t];
            const color = v >= 0.7 ? 'rgba(16,185,129,' : v >= 0.5 ? 'rgba(245,158,11,' : 'rgba(239,68,68,';
            return (
              <div key={t} style={{ padding: '0 8px' }}>
                <div style={{
                  background: color + (0.1 + v * 0.4) + ')',
                  border: '1px solid ' + color + '0.3)',
                  padding: '8px 12px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 12,
                  color: v >= 0.7 ? 'var(--color-accent)' : v >= 0.5 ? 'var(--color-amber)' : 'var(--color-rose)',
                }}>
                  {Math.round(v * 100)}%
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ── Drilldown overlay ──────────────────────────────────────────────────────
const MEMBER_THEMES = [
  { theme: 'Visibility & cross-fn reach', count: 7, weight: 0.42 },
  { theme: 'Negotiation prep', count: 4, weight: 0.24 },
  { theme: 'Public artifacts', count: 3, weight: 0.18 },
  { theme: 'Manager dynamics', count: 2, weight: 0.12 },
  { theme: 'Pivot exploration', count: 1, weight: 0.04 },
];

const DrilldownOverlay = ({ member, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const memberId = '#' + (4000 + member.name.length * 37 + member.readiness).toString().slice(0, 4);
  const sessionsThisMo = 4 + (member.readiness % 6);
  const cadence = sessionsThisMo >= 8 ? 'High' : sessionsThisMo >= 4 ? 'Steady' : 'Light';

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'flex-end',
      zIndex: 200, animation: 'fadeIn 0.25s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 580, maxWidth: '92vw', height: '100%',
        background: 'var(--color-surface-solid)',
        borderLeft: 'var(--hairline-strong)',
        overflowY: 'auto',
        animation: 'slideInRight 0.3s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: 'var(--hairline)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <Kicker accent>Member drilldown</Kicker>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-bg))',
                border: '1px solid rgba(16,185,129,0.3)',
                display: 'grid', placeItems: 'center',
                fontSize: 14, fontWeight: 600, color: 'var(--color-accent)',
              }}>{member.name.split(' ').map(p => p[0]).join('')}</div>
              <div>
                <div className="h-serif" style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.1 }}>{member.name}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4 }}>
                  Member {memberId} · {member.track}
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, background: 'transparent',
            border: 'var(--hairline)', color: 'var(--color-muted)',
            cursor: 'pointer', display: 'grid', placeItems: 'center',
            fontFamily: 'inherit', fontSize: 16, lineHeight: 1,
          }}>×</button>
        </div>

        {/* Privacy notice */}
        <div style={{
          padding: '14px 32px',
          background: 'rgba(14,165,233,0.04)',
          borderBottom: '1px solid rgba(14,165,233,0.2)',
          display: 'flex', alignItems: 'flex-start', gap: 10,
          fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.5,
        }}>
          <Icon name="lock" size={14} />
          <span>You see <strong style={{ color: 'var(--color-text)' }}>themes, cadence, readiness</strong>. You do <strong style={{ color: 'var(--color-text)' }}>not</strong> see transcripts, raw answers, or 1:1 source material. {member.name} controls disclosure.</span>
        </div>

        {/* Stat row */}
        <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, borderBottom: 'var(--hairline)' }}>
          <Stat label="Readiness" value={member.readiness} accent={member.readiness >= 80 ? 'accent' : member.readiness >= 50 ? 'amber' : 'rose'} />
          <Stat label="Sessions / 30d" value={sessionsThisMo} suffix="" />
          <Stat label="Cadence" value={cadence} text />
        </div>

        {/* Themes */}
        <Block title="Conversation themes" sub="Auto-clustered from session topics. Min cohort size of 5 enforced.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MEMBER_THEMES.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span>{t.theme}</span>
                    <span className="mono" style={{ color: 'var(--color-muted)' }}>{Math.round(t.weight * 100)}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.05)' }}>
                    <div style={{
                      height: '100%', width: `${t.weight * 100}%`,
                      background: i === 0 ? 'var(--color-accent)' : 'rgba(16,185,129,0.4)',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Block>

        {/* Top gap */}
        <Block title="Top skill gap" sub="Surfaced from M's structured assessments — only when ≥5 cohort peers share signal.">
          <div style={{
            padding: 18,
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.3)',
          }}>
            <div className="uc" style={{ fontSize: 10, color: 'var(--color-amber)', letterSpacing: '0.14em' }}>Flagged gap</div>
            <div className="h-serif" style={{ fontSize: 22, fontWeight: 600, marginTop: 8, fontStyle: 'italic' }}>{member.gap}</div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 10, lineHeight: 1.6 }}>
              Shared by 34% of {member.track.split(' · ')[0]} track. Pattern detected over the last 6 weeks of sessions.
            </div>
          </div>
        </Block>

        {/* Recommended interventions */}
        <Block title="Recommended interventions" sub="Drafts to send — member sees them as suggestions from their admin, not surveillance.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { title: 'Pair on cross-track shadow', body: 'Match with a peer flagged on complementary signal.', cta: 'Suggest pairing' },
              { title: 'Sponsor a public artifact', body: 'Offer a slot at the next all-hands or write-up.', cta: 'Draft offer' },
              { title: 'Schedule a stretch project review', body: 'Quarterly 1:1 to validate trajectory and readiness.', cta: 'Add to calendar' },
            ].map((a, i) => (
              <div key={i} style={{
                padding: 14,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>{a.body}</div>
                </div>
                <CTA size="sm" variant="ghost">{a.cta}</CTA>
              </div>
            ))}
          </div>
        </Block>

        <div style={{ padding: '24px 32px 40px', display: 'flex', gap: 10 }}>
          <CTA size="sm" variant="ghost" icon="download" style={{ flex: 1, justifyContent: 'center' }}>Export themes</CTA>
          <CTA size="sm" icon="sparkle" style={{ flex: 1, justifyContent: 'center' }}>Ask M about {member.name.split(' ')[0]}</CTA>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, suffix, accent, text }) => {
  const color = accent === 'accent' ? 'var(--color-accent)' : accent === 'amber' ? 'var(--color-amber)' : accent === 'rose' ? 'var(--color-rose)' : 'var(--color-text)';
  return (
    <div>
      <div className="uc" style={{ fontSize: 9, color: 'var(--color-muted)', letterSpacing: '0.14em' }}>{label}</div>
      <div className="h-serif" style={{ fontSize: text ? 24 : 32, fontWeight: 500, marginTop: 8, color, lineHeight: 1.1 }}>
        {value}{suffix}
      </div>
    </div>
  );
};

const Block = ({ title, sub, children }) => (
  <div style={{ padding: '24px 32px', borderBottom: 'var(--hairline)' }}>
    <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)', letterSpacing: '0.14em' }}>{title}</div>
    {sub && <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 6, marginBottom: 16, lineHeight: 1.5, opacity: 0.7 }}>{sub}</div>}
    {!sub && <div style={{ marginBottom: 14 }} />}
    {children}
  </div>
);

Object.assign(window, { DashboardScreen });
