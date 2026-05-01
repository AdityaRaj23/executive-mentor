// Shared components and utilities
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─── Icons (minimal stroke set) ─────────────────────────────────────────────
const Icon = ({ name, size = 16, stroke = 1.5 }) => {
  const paths = {
    arrowRight: 'M5 12h14M13 6l6 6-6 6',
    send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
    sparkle: 'M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8',
    chat: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
    map: 'M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3zM9 7v13M15 4v13',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    home: 'M3 12l9-9 9 9M5 10v10h14V10',
    check: 'M5 12l5 5L20 6',
    user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
    trend: 'M3 17l6-6 4 4 8-8M14 7h7v7',
    target: 'M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0M12 12m-5 0a5 5 0 1010 0 5 5 0 10-10 0M12 12m-1 0a1 1 0 102 0 1 1 0 10-2 0',
    plus: 'M12 5v14M5 12h14',
    filter: 'M3 4h18l-7 9v7l-4-2v-5L3 4z',
    download: 'M12 3v12M7 10l5 5 5-5M3 21h18',
    bell: 'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
    search: 'M11 11m-8 0a8 8 0 1016 0 8 8 0 10-16 0M21 21l-4.3-4.3',
    chevronRight: 'M9 6l6 6-6 6',
    chevronDown: 'M6 9l6 6 6-6',
    spark: 'M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z',
    bolt: 'M13 2L3 14h7l-1 8 10-12h-7l1-8z',
    book: 'M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z',
    lock: 'M5 11h14v10H5zM8 11V7a4 4 0 018 0v4',
    close: 'M18 6L6 18M6 6l12 12',
    menu: 'M3 6h18M3 12h18M3 18h18',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d={paths[name] || paths.arrowRight} />
    </svg>
  );
};

// ─── Logo mark ──────────────────────────────────────────────────────────────
const LogoMark = ({ size = 32 }) => (
  <div style={{
    width: size, height: size,
    background: 'var(--color-primary)',
    border: '1px solid rgba(16,185,129,0.4)',
    display: 'grid', placeItems: 'center',
    fontFamily: 'var(--font-heading)',
    fontSize: size * 0.62,
    fontWeight: 600,
    fontStyle: 'italic',
    color: 'var(--color-accent)',
    letterSpacing: '-0.04em',
    lineHeight: 1,
    paddingBottom: 2,
  }}>M</div>
);

// ─── Top navigation ─────────────────────────────────────────────────────────
const SCREENS = [
  { id: 'landing', label: 'Pitch', icon: 'home' },
  { id: 'firstyear', label: 'First Year', icon: 'spark' },
  { id: 'console', label: 'Console', icon: 'chat' },
  { id: 'roadmap', label: 'Roadmap', icon: 'map' },
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
];

const TopNav = ({ current, onNavigate, persona, setPersona, mode, setMode }) => {
  const isLight = mode === 'light';
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: 'var(--hairline)',
      background: isLight ? 'rgba(247, 244, 238, 0.78)' : 'rgba(5, 10, 15, 0.72)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }}>
      <div style={{
        maxWidth: 1440, margin: '0 auto', padding: '14px 32px',
        display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
      }}>
        <button onClick={() => onNavigate('landing')} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'transparent', border: 0, padding: 0, cursor: 'pointer', color: 'inherit',
        }}>
          <LogoMark size={28} />
          <div style={{ whiteSpace: 'nowrap' }}>
            <div className="h-serif" style={{ fontSize: 18, lineHeight: 1, fontStyle: 'italic', whiteSpace: 'nowrap' }}>Executive Mentor</div>
            <div className="uc" style={{ fontSize: 9, color: 'var(--color-muted)', marginTop: 3, whiteSpace: 'nowrap' }}>Wisdom at scale</div>
          </div>
        </button>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 4 }}>
          {SCREENS.map(s => (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px',
                background: current === s.id ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                border: current === s.id ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                borderRadius: 'var(--radius)',
                color: current === s.id ? 'var(--color-accent)' : 'var(--color-muted)',
                cursor: 'pointer',
                fontSize: 13, fontWeight: 500,
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => { if (current !== s.id) e.currentTarget.style.color = 'var(--color-text)'; }}
              onMouseLeave={e => { if (current !== s.id) e.currentTarget.style.color = 'var(--color-muted)'; }}
            >
              <Icon name={s.icon} size={14} />
              {s.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {setMode && <ModeToggle mode={mode} setMode={setMode} />}
          <PersonaToggle persona={persona} setPersona={setPersona} />
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-bg))',
            border: 'var(--hairline-strong)',
            display: 'grid', placeItems: 'center',
            fontSize: 12, fontWeight: 600,
            color: 'var(--color-accent)',
          }}>
            {persona === 'admin' ? 'AK' : persona === 'grad' ? 'NV' : 'EC'}
          </div>
        </div>
      </div>
    </nav>
  );
};

const ModeToggle = ({ mode, setMode }) => {
  const isLight = mode === 'light';
  return (
    <button
      onClick={() => setMode(isLight ? 'dark' : 'light')}
      title={isLight ? 'Switch to dark' : 'Switch to light'}
      style={{
        width: 32, height: 32,
        background: 'transparent',
        border: 'var(--hairline-strong)',
        borderRadius: 'var(--radius)',
        color: 'var(--color-muted)',
        cursor: 'pointer',
        display: 'grid', placeItems: 'center',
        transition: 'all 0.18s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted)'; }}
    >
      {isLight ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
    </button>
  );
};

const PersonaToggle = ({ persona, setPersona }) => (
  <div style={{
    display: 'flex',
    border: 'var(--hairline)',
    borderRadius: 'var(--radius)',
    padding: 2,
    background: 'rgba(255,255,255,0.02)',
  }}>
    {['individual', 'grad', 'admin'].map(p => (
      <button
        key={p}
        onClick={() => setPersona(p)}
        style={{
          padding: '6px 10px',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          background: persona === p ? 'var(--color-accent)' : 'transparent',
          color: persona === p ? 'var(--color-bg)' : 'var(--color-muted)',
          border: 0,
          borderRadius: '2px',
          cursor: 'pointer',
          transition: 'all 0.16s',
        }}
      >{p === 'individual' ? 'Member' : p === 'grad' ? 'Grad' : 'Admin'}</button>
    ))}
  </div>
);

// ─── Reusable button ────────────────────────────────────────────────────────
const CTA = ({ children, onClick, variant = 'primary', size = 'md', icon, style: overrideStyle }) => {
  const [hover, setHover] = useState(false);
  const sizes = {
    sm: { padding: '8px 16px', fontSize: 12 },
    md: { padding: '14px 28px', fontSize: 13 },
    lg: { padding: '18px 36px', fontSize: 14 },
  };
  const variants = {
    primary: {
      background: hover ? 'var(--color-sapphire)' : 'var(--color-accent)',
      color: 'var(--color-bg)',
      border: 0,
    },
    ghost: {
      background: hover ? 'rgba(255,255,255,0.06)' : 'transparent',
      color: 'var(--color-text)',
      border: 'var(--hairline-strong)',
    },
    accent: {
      background: hover ? 'rgba(16,185,129,0.16)' : 'rgba(16,185,129,0.08)',
      color: 'var(--color-accent)',
      border: '1px solid rgba(16,185,129,0.4)',
    },
  };
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...sizes[size], ...variants[variant],
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        borderRadius: 'var(--radius)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'inline-flex', alignItems: 'center', gap: 10,
        ...overrideStyle,
      }}
    >
      {children}
      {icon && <Icon name={icon} size={14} />}
    </button>
  );
};

// ─── Section heading kicker ─────────────────────────────────────────────────
const Kicker = ({ children, accent }) => (
  <div className="uc" style={{
    fontSize: 11,
    color: accent ? 'var(--color-accent)' : 'var(--color-muted)',
    display: 'flex', alignItems: 'center', gap: 10,
  }}>
    <span style={{ width: 24, height: 1, background: accent ? 'var(--color-accent)' : 'var(--color-muted)' }} />
    {children}
  </div>
);

// expose
Object.assign(window, { Icon, LogoMark, TopNav, ModeToggle, CTA, Kicker, SCREENS });
