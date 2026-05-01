import { TICKER_ITEMS } from "@/data/ticker";

export function InvestorTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--color-bg)",
        opacity: 0.92,
        backdropFilter: "blur(12px)",
        borderTop: "var(--hairline)",
        padding: "10px 0",
        overflow: "hidden",
        zIndex: 40,
      }}
    >
      <div
        className="mono"
        style={{
          display: "flex",
          gap: 48,
          animation: "tickerScroll 60s linear infinite",
          whiteSpace: "nowrap",
          width: "max-content",
        }}
      >
        {items.map(([l, v, d], i) => (
          <span key={i} style={{ fontSize: 12, color: "var(--color-muted)", display: "inline-flex", gap: 10 }}>
            <span className="uc" style={{ fontSize: 10 }}>
              {l}
            </span>
            <span style={{ color: "var(--color-text)" }}>{v}</span>
            {d && <span style={{ color: "var(--color-accent)" }}>{d}</span>}
            <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
