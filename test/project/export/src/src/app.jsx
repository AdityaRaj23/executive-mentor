// App entry — routes between the four screens + Tweaks panel
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "editorial",
  "voice": "boardroom",
  "density": "editorial",
  "mode": "dark"
}/*EDITMODE-END*/;

const App = () => {
  const parseHash = () => {
    const h = window.location.hash.replace('#', '').trim();
    return SCREENS.find(s => s.id === h)?.id || 'landing';
  };
  const [screen, setScreen] = useState(parseHash());
  const [persona, setPersona] = useState('individual');
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply theme + density + mode to root on every change
  useEffect(() => {
    applyTweaks(tweaks.theme, tweaks.density, tweaks.mode);
  }, [tweaks.theme, tweaks.density, tweaks.mode]);

  useEffect(() => {
    const onHash = () => setScreen(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (id) => {
    window.location.hash = id;
    setScreen(id);
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (id === 'dashboard') setPersona('admin');
    if (id === 'console' || id === 'roadmap') setPersona('individual');
    if (id === 'firstyear') setPersona('grad');
  };

  // Density-driven CSS scale wrapper
  const d = DENSITIES[tweaks.density] || DENSITIES.editorial;

  let content = null;
  if (screen === 'landing') content = <LandingScreen onNavigate={navigate} />;
  else if (screen === 'firstyear') content = <FirstYearScreen />;
  else if (screen === 'console') content = <ConsoleScreen voice={tweaks.voice} />;
  else if (screen === 'roadmap') content = <RoadmapScreen />;
  else if (screen === 'dashboard') content = <DashboardScreen />;

  return (
    <div data-screen-label={SCREENS.find(s => s.id === screen)?.label || screen}
         style={{ fontSize: `calc(16px * ${d.scale})` }}>
      <TopNav current={screen} onNavigate={navigate} persona={persona} setPersona={setPersona} mode={tweaks.mode} setMode={(m) => setTweak('mode', m)} />
      <main key={screen} style={{ animation: 'fadeIn 0.4s ease' }}>
        {content}
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Mode" />
        <TweakRadio
          label=""
          value={tweaks.mode}
          options={['dark', 'light']}
          labels={['Dark', 'Light']}
          onChange={(v) => setTweak('mode', v)}
        />

        <TweakSection label="Aesthetic" />
        <ThemeRadio value={tweaks.theme} onChange={(v) => setTweak('theme', v)} />

        <TweakSection label="M's voice" />
        <VoiceRadio value={tweaks.voice} onChange={(v) => setTweak('voice', v)} />

        <TweakSection label="Density" />
        <TweakRadio
          label=""
          value={tweaks.density}
          options={Object.keys(DENSITIES)}
          labels={Object.values(DENSITIES).map(d => d.label)}
          onChange={(v) => setTweak('density', v)}
        />
        <div style={{ fontSize: 10.5, color: 'rgba(41,38,27,.55)', lineHeight: 1.4, marginTop: -4 }}>
          {DENSITIES[tweaks.density].sub}
        </div>
      </TweaksPanel>
    </div>
  );
};

// Custom radio for theme — shows label + subtitle + a swatch
const ThemeRadio = ({ value, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {Object.entries(THEMES).map(([id, t]) => {
      const active = value === id;
      return (
        <button
          key={id}
          onClick={() => onChange(id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px',
            background: active ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.4)',
            border: '0.5px solid ' + (active ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.08)'),
            borderRadius: 7,
            cursor: 'pointer', textAlign: 'left',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ display: 'flex', gap: 3 }}>
            <span style={{ width: 12, height: 18, background: t.vars['--color-bg'], borderRadius: 2, border: '0.5px solid rgba(0,0,0,0.1)' }} />
            <span style={{ width: 12, height: 18, background: t.vars['--color-accent'], borderRadius: 2 }} />
            <span style={{ width: 12, height: 18, background: t.vars['--color-text'], borderRadius: 2, border: '0.5px solid rgba(0,0,0,0.1)' }} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 11.5, color: '#29261b' }}>{t.label}</div>
            <div style={{ fontSize: 10, color: 'rgba(41,38,27,0.55)', lineHeight: 1.3 }}>{t.sub}</div>
          </div>
        </button>
      );
    })}
  </div>
);

const VoiceRadio = ({ value, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {Object.entries(VOICES).map(([id, v]) => {
      const active = value === id;
      return (
        <button
          key={id}
          onClick={() => onChange(id)}
          style={{
            padding: '8px 10px',
            background: active ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.4)',
            border: '0.5px solid ' + (active ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.08)'),
            borderRadius: 7,
            cursor: 'pointer', textAlign: 'left',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 11.5, color: '#29261b' }}>{v.label}</div>
          <div style={{ fontSize: 10, color: 'rgba(41,38,27,0.55)', lineHeight: 1.35, marginTop: 2 }}>{v.sub}</div>
        </button>
      );
    })}
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
