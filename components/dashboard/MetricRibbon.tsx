import { METRICS } from "@/data/cohort";
import type { MetricId } from "@/types";

export function MetricRibbon({
  active,
  onSelect,
}: {
  active: MetricId;
  onSelect: (id: MetricId) => void;
}) {
  return (
    <div className="glass" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
      {METRICS.map((m, i) => {
        const isActive = active === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            style={{
              padding: "24px 28px",
              borderRight: i < 3 ? "var(--hairline)" : "none",
              background: isActive ? "rgba(16,185,129,0.05)" : "transparent",
              border: 0,
              borderBottom: "2px solid " + (isActive ? "var(--color-accent)" : "transparent"),
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
              color: "inherit",
              fontFamily: "inherit",
            }}
          >
            <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)" }}>
              {m.label}
            </div>
            <div className="h-serif" style={{ fontSize: 38, lineHeight: 1.1, marginTop: 10, fontWeight: 500 }}>
              {m.value}
            </div>
            <div className="mono" style={{ fontSize: 11, color: m.deltaColor, marginTop: 8 }}>
              {m.delta}
            </div>
          </button>
        );
      })}
    </div>
  );
}
