const METRICS: [string, string, string][] = [
  ["Avg. weekly engagement", "4.6 hrs", "+18% MoM"],
  ["Career goal completion", "71%", "cohort 24Q1"],
  ["Net promoter (NPS)", "74", "enterprise tier"],
  ["ARR · Q1 2026", "$8.4M", "+312% YoY"],
];

export function MetricsRibbon() {
  return (
    <section style={{ maxWidth: 1280, margin: "40px auto 0", padding: "0 32px" }}>
      <div
        className="glass"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          borderRadius: 0,
        }}
      >
        {METRICS.map(([label, value, sub], i) => (
          <div
            key={i}
            style={{
              padding: "24px 28px",
              borderRight: i < 3 ? "var(--hairline)" : "none",
            }}
          >
            <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)" }}>
              {label}
            </div>
            <div className="h-serif" style={{ fontSize: 36, lineHeight: 1.1, marginTop: 10 }}>
              {value}
            </div>
            <div className="mono" style={{ fontSize: 11, color: "var(--color-accent)", marginTop: 6 }}>
              {sub}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
