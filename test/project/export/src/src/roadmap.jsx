// Career Roadmap — interactive vertical timeline with what-if branching
const SEED_MILESTONES = [
  { id: 1, year: '2021', quarter: 'Q1', side: 'left', title: 'Joined as L4 Engineer', body: 'Platform infrastructure team. First 90 days focused on core service reliability.', skills: ['Distributed systems', 'On-call ops'], status: 'done' },
  { id: 2, year: '2022', quarter: 'Q3', side: 'right', title: 'Promoted to Senior Engineer', body: 'Owned migration of legacy queue infra. Mentored two new hires.', skills: ['Mentorship', 'Migration design'], status: 'done' },
  { id: 3, year: '2024', quarter: 'Q2', side: 'left', title: 'Tech Lead — billing platform', body: 'Cross-team RFC on idempotency. First exposure to product leadership.', skills: ['RFC authorship', 'Product partnership'], status: 'done' },
  { id: 4, year: '2026', quarter: 'Q2', side: 'right', title: 'Now · Audit your reach', body: 'M recommends a 6-week cross-functional shadow rotation with platform-PM and design-systems before pursuing Staff.', skills: ['Cross-fn reach', 'Visibility'], status: 'current', tasks: ['Shadow platform PM for 6 weeks', 'Publish one RFC outside billing', 'Co-host monthly arch review'] },
  { id: 5, year: '2027', quarter: 'Q1', side: 'left', title: 'Staff Engineer track', body: 'Visible artifact (talk, RFC, OSS) plus a hiring tree of 3+. Performance signal: drives a multi-team initiative.', skills: ['Public brand', 'Hiring'], status: 'future' },
  { id: 6, year: '2028', quarter: 'Q3', side: 'right', title: 'Director of Platform Eng', body: 'Leads 25+ org. Owns roadmap for billing + identity. Board-level visibility on availability metrics.', skills: ['Org design', 'Executive presence'], status: 'future' },
];

const RM_STORE_KEY = 'em.roadmap.v1';
const rmLoad = () => { try { return JSON.parse(localStorage.getItem(RM_STORE_KEY)) || {}; } catch { return {}; } };
const rmSave = (data) => { try { localStorage.setItem(RM_STORE_KEY, JSON.stringify(data)); } catch {} };

const RoadmapScreen = () => {
  const stored = useMemo(rmLoad, []);
  const [selected, setSelected] = useState(stored.selected || 4);
  const [milestones, setMilestones] = useState(stored.milestones || SEED_MILESTONES);
  const [branch, setBranch] = useState(stored.branch || null); // alt-trajectory
  const [showRePlan, setShowRePlan] = useState(false);
  const [replanText, setReplanText] = useState('');
  const [replanning, setReplanning] = useState(false);

  useEffect(() => { rmSave({ selected, milestones, branch }); }, [selected, milestones, branch]);

  const current = milestones.find(m => m.id === selected);

  const toggleTask = (idx) => {
    setMilestones(ms => ms.map(m => {
      if (m.id !== selected || !m.tasks) return m;
      const done = m._doneTasks || [];
      return { ...m, _doneTasks: done.includes(idx) ? done.filter(i => i !== idx) : [...done, idx] };
    }));
  };

  const replan = async () => {
    if (!replanText.trim() || replanning) return;
    setReplanning(true);
    try {
      const futureMs = milestones.filter(m => m.status === 'future');
      const sys = `You are a career strategist re-planning a path. The user's locked past milestones (do NOT change): ${milestones.filter(m => m.status !== 'future').map(m => `${m.year} ${m.quarter}: ${m.title}`).join('; ')}.

Their current future plan: ${futureMs.map(m => `${m.year} ${m.quarter}: ${m.title} — ${m.body}`).join('\n')}.

What-if scenario: "${replanText}"

Generate ${futureMs.length} alt-trajectory future milestones. Output ONLY a JSON array, no prose, no markdown fences. Schema:
[{"year":"YYYY","quarter":"QN","title":"<short>","body":"<1-2 sentences>","skills":["s1","s2"]}]`;
      const reply = await window.claude.complete({ messages: [{ role: 'user', content: sys }] });
      const m = reply.match(/\[[\s\S]*\]/);
      if (m) {
        const alts = JSON.parse(m[0]);
        const altMilestones = futureMs.map((orig, i) => ({
          ...orig,
          id: orig.id + 100,
          year: alts[i]?.year || orig.year,
          quarter: alts[i]?.quarter || orig.quarter,
          title: alts[i]?.title || orig.title,
          body: alts[i]?.body || orig.body,
          skills: alts[i]?.skills || orig.skills,
          status: 'alt',
        }));
        setBranch({ label: replanText, milestones: altMilestones });
        setShowRePlan(false);
        setReplanText('');
      }
    } catch (e) {
      alert('M couldn\'t re-plan right now. Try again.');
    } finally {
      setReplanning(false);
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px' }}>
      <header style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 640, minWidth: 0, flex: '1 1 auto' }}>
          <Kicker accent>Eliot Cho · Career roadmap</Kicker>
          <h1 className="h-serif" style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.05, margin: '20px 0 14px', fontWeight: 500 }}>
            Seven years, <em>one trajectory.</em>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--color-muted)', maxWidth: 560, margin: 0 }}>
            Click any milestone to expand. Ask M to re-plan around a shock — layoff, pivot, leave — and see an alt-trajectory ghost the timeline.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          {branch && <CTA variant="ghost" size="sm" onClick={() => setBranch(null)}>Clear what-if</CTA>}
          <CTA variant="accent" size="sm" icon="sparkle" onClick={() => setShowRePlan(true)}>Re-plan with M</CTA>
        </div>
      </header>

      {branch && (
        <div className="glass" style={{
          padding: '12px 18px', marginBottom: 24,
          background: 'rgba(14,165,233,0.06)',
          border: '1px solid rgba(14,165,233,0.3)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-sapphire)' }} />
          <div style={{ flex: 1 }}>
            <div className="uc" style={{ fontSize: 10, color: 'var(--color-sapphire)' }}>What-if scenario</div>
            <div className="h-serif" style={{ fontSize: 16, fontStyle: 'italic', marginTop: 2 }}>"{branch.label}"</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'flex-start' }}>
        <Timeline milestones={milestones} branch={branch} selected={selected} onSelect={setSelected} />
        <DetailPanel milestone={current} onToggleTask={toggleTask} />
      </div>

      {showRePlan && <RePlanModal text={replanText} setText={setReplanText} onClose={() => setShowRePlan(false)} onSubmit={replan} loading={replanning} />}
    </div>
  );
};

const RePlanModal = ({ text, setText, onClose, onSubmit, loading }) => (
  <div onClick={onClose} style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'grid', placeItems: 'center', zIndex: 100,
    backdropFilter: 'blur(8px)', animation: 'fadeIn 0.25s ease',
  }}>
    <div onClick={e => e.stopPropagation()} className="glass" style={{ padding: 36, maxWidth: 560, width: '90%', boxShadow: 'var(--shadow-card)' }}>
      <Kicker accent>Re-plan with M</Kicker>
      <h2 className="h-serif" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.15, margin: '14px 0 18px' }}>
        What changed?
      </h2>
      <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: '0 0 18px' }}>
        Describe a shock, a pivot, or a curiosity. M will draft an alt-trajectory and overlay it as a ghost path on your timeline.
      </p>
      <textarea
        value={text} onChange={e => setText(e.target.value)} autoFocus rows={3}
        placeholder='e.g. "I want to pivot to PM" · "Got laid off, need to re-enter" · "Going solo as an indie consultant"'
        style={{
          width: '100%', background: 'rgba(255,255,255,0.03)',
          border: 'var(--hairline)', borderRadius: 'var(--radius)',
          padding: 14, fontSize: 14, fontFamily: 'var(--font-body)',
          color: 'var(--color-text)', outline: 'none', resize: 'none',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
        <CTA variant="ghost" size="sm" onClick={onClose}>Cancel</CTA>
        <CTA size="sm" icon={loading ? null : 'sparkle'} onClick={onSubmit}>
          {loading ? 'Drafting…' : 'Generate alt-path'}
        </CTA>
      </div>
    </div>
  </div>
);

const Timeline = ({ milestones, branch, selected, onSelect }) => (
  <div style={{ position: 'relative', paddingTop: 8 }}>
    <div style={{
      position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1,
      background: 'linear-gradient(to bottom, transparent, var(--color-muted) 8%, var(--color-muted) 92%, transparent)',
      transform: 'translateX(-0.5px)', opacity: 0.4,
    }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
      {milestones.map(m => {
        const altPair = branch?.milestones?.find(am => am.id === m.id + 100);
        return <MilestoneRow key={m.id} milestone={m} altMilestone={altPair} selected={selected === m.id} onSelect={() => onSelect(m.id)} onSelectAlt={altPair ? () => onSelect(altPair.id) : null} altSelected={altPair && selected === altPair.id} />;
      })}
    </div>
  </div>
);

const MilestoneRow = ({ milestone: m, altMilestone, selected, onSelect, onSelectAlt, altSelected }) => {
  const isLeft = m.side === 'left';
  const isCurrent = m.status === 'current';
  const isDone = m.status === 'done';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', alignItems: 'center', gap: 0 }}>
      <div style={{ paddingRight: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {isLeft && <Card milestone={m} selected={selected} onSelect={onSelect} />}
        {isLeft && altMilestone && <AltCard milestone={altMilestone} selected={altSelected} onSelect={onSelectAlt} />}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <button onClick={onSelect} style={{
          width: 18, height: 18, borderRadius: '50%',
          background: isDone ? 'var(--color-accent)' : isCurrent ? 'var(--color-accent)' : 'var(--color-surface-solid)',
          border: '2px solid ' + (isDone ? 'var(--color-accent)' : isCurrent ? 'var(--color-accent)' : 'var(--color-muted)'),
          boxShadow: isCurrent ? '0 0 0 4px rgba(16,185,129,0.15)' : 'none',
          animation: isCurrent ? 'pulseRing 2s ease-out infinite' : 'none',
          cursor: 'pointer', padding: 0, position: 'relative', zIndex: 2,
        }} />
        <div style={{
          position: 'absolute', [isLeft ? 'right' : 'left']: 'calc(50% + 18px)',
          top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-muted)',
          whiteSpace: 'nowrap', opacity: 0.5,
        }}>{m.year} · {m.quarter}</div>
      </div>
      <div style={{ paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {!isLeft && <Card milestone={m} selected={selected} onSelect={onSelect} />}
        {!isLeft && altMilestone && <AltCard milestone={altMilestone} selected={altSelected} onSelect={onSelectAlt} />}
      </div>
    </div>
  );
};

const Card = ({ milestone: m, selected, onSelect }) => {
  const [hover, setHover] = useState(false);
  const isCurrent = m.status === 'current';
  const isDone = m.status === 'done';
  return (
    <button onClick={onSelect} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="glass"
      style={{
        textAlign: 'left', padding: 20, width: '100%', cursor: 'pointer',
        transition: 'all 0.25s ease',
        borderColor: selected ? 'rgba(240,244,248,0.4)' : hover ? 'rgba(16,185,129,0.4)' : isCurrent ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)',
        transform: selected ? 'translateY(-2px)' : 'none',
        boxShadow: selected ? 'var(--shadow-card)' : 'none',
        fontFamily: 'inherit', color: 'inherit',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <StatusBadge status={m.status} />
        {isDone && <Icon name="check" size={14} stroke={2} />}
      </div>
      <div className="h-serif" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.2, marginBottom: 8 }}>{m.title}</div>
      <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.55, margin: 0 }}>{m.body}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
        {m.skills.map((s, i) => (
          <span key={i} style={{ fontSize: 11, padding: '3px 8px', background: 'rgba(16,185,129,0.1)', color: 'var(--color-accent)' }}>{s}</span>
        ))}
      </div>
    </button>
  );
};

const AltCard = ({ milestone: m, selected, onSelect }) => {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onSelect} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        textAlign: 'left', padding: 18, width: '100%', cursor: 'pointer',
        background: 'rgba(14,165,233,0.04)',
        border: '1px dashed ' + (selected || hover ? 'rgba(14,165,233,0.7)' : 'rgba(14,165,233,0.35)'),
        borderRadius: 'var(--radius)',
        transition: 'all 0.2s', fontFamily: 'inherit', color: 'inherit',
        opacity: selected ? 1 : 0.85,
      }}>
      <div className="uc" style={{ fontSize: 9, color: 'var(--color-sapphire)', letterSpacing: '0.14em', marginBottom: 8 }}>What-if · alt</div>
      <div className="h-serif" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.2, fontStyle: 'italic', marginBottom: 6 }}>{m.title}</div>
      <p style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.5, margin: 0 }}>{m.body}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        {m.skills.map((s, i) => (
          <span key={i} style={{ fontSize: 10, padding: '2px 7px', background: 'rgba(14,165,233,0.1)', color: 'var(--color-sapphire)' }}>{s}</span>
        ))}
      </div>
    </button>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = {
    done: { label: 'Completed', color: 'var(--color-muted)', bg: 'rgba(130,154,177,0.1)' },
    current: { label: 'Active now', color: 'var(--color-accent)', bg: 'rgba(16,185,129,0.12)' },
    future: { label: 'Forecast', color: 'var(--color-muted)', bg: 'rgba(255,255,255,0.04)' },
    alt: { label: 'Alt path', color: 'var(--color-sapphire)', bg: 'rgba(14,165,233,0.12)' },
  }[status];
  return <span className="uc" style={{ fontSize: 9, padding: '3px 8px', background: cfg.bg, color: cfg.color, letterSpacing: '0.14em' }}>{cfg.label}</span>;
};

const DetailPanel = ({ milestone, onToggleTask }) => {
  if (!milestone) return null;
  return (
    <div className="glass" style={{ padding: 24, position: 'sticky', top: 100, maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>
      <Kicker accent>Milestone detail</Kicker>
      <div className="h-serif" style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.15, margin: '14px 0 8px' }}>{milestone.title}</div>
      <div className="mono" style={{ fontSize: 11, color: 'var(--color-muted)' }}>{milestone.year} · {milestone.quarter}</div>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text)', marginTop: 18 }}>{milestone.body}</p>
      {milestone.tasks && (
        <div style={{ marginTop: 24 }}>
          <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)', marginBottom: 12 }}>Action items</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {milestone.tasks.map((t, i) => {
              const done = (milestone._doneTasks || []).includes(i);
              return (
                <button key={i} onClick={() => onToggleTask(i)} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 12px',
                  background: done ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
                  border: '1px solid ' + (done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'),
                  borderRadius: 'var(--radius)', cursor: 'pointer',
                  fontFamily: 'inherit', color: 'inherit', textAlign: 'left',
                }}>
                  <div style={{
                    width: 16, height: 16, marginTop: 1, flexShrink: 0,
                    border: '1.5px solid ' + (done ? 'var(--color-accent)' : 'var(--color-muted)'),
                    background: done ? 'var(--color-accent)' : 'transparent',
                    display: 'grid', placeItems: 'center', color: 'var(--color-bg)',
                  }}>{done && <Icon name="check" size={11} stroke={3} />}</div>
                  <span style={{ fontSize: 13, textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.5 : 1 }}>{t}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div style={{ marginTop: 24, paddingTop: 24, borderTop: 'var(--hairline)' }}>
        <div className="uc" style={{ fontSize: 10, color: 'var(--color-muted)', marginBottom: 12 }}>Skills tagged</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {milestone.skills.map((s, i) => (
            <span key={i} style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(16,185,129,0.1)', color: 'var(--color-accent)' }}>{s}</span>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <CTA size="sm" icon="sparkle" style={{ width: '100%', justifyContent: 'center' }}>Discuss with M</CTA>
      </div>
    </div>
  );
};

Object.assign(window, { RoadmapScreen });
