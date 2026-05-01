import { Icon } from "@/components/shared/Icon";
import { Kicker } from "@/components/shared/Kicker";

const ACTIONS: [string, string][] = [
  ["Schedule writing workshop", "34% of cohort flagged"],
  ["Pair Marcus + Anya for shadow", "Cross-track signal"],
  ["Send Q2 readiness summary", "Auto-draft ready"],
];

export function NarrativePanel() {
  return (
    <div className="glass" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <Kicker accent>M&apos;s read on the cohort</Kicker>
        <div
          className="h-serif"
          style={{
            fontSize: 22,
            lineHeight: 1.3,
            fontWeight: 500,
            marginTop: 14,
            fontStyle: "italic",
          }}
        >
          &quot;Engagement is healthy, but a third of the cohort is hiding from public artifacts. Push three of them to publish before Q3.&quot;
        </div>
      </div>

      <div style={{ borderTop: "var(--hairline)", paddingTop: 18 }}>
        <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)", marginBottom: 12 }}>
          Suggested actions
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ACTIONS.map(([t, s], i) => (
            <div
              key={i}
              style={{
                padding: "10px 12px",
                background: "rgba(16,185,129,0.04)",
                border: "1px solid rgba(16,185,129,0.2)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{t}</div>
                <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 2 }}>{s}</div>
              </div>
              <Icon name="arrowRight" size={14} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
