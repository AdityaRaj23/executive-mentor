import { Kicker } from "@/components/shared/Kicker";
import { CHART_DATA, METRICS } from "@/data/cohort";
import type { MetricId } from "@/types";

const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

export function TrajectoryChart({ metric }: { metric: MetricId }) {
  const data = CHART_DATA[metric] || CHART_DATA.engagement;
  const w = 720,
    h = 260,
    pad = { l: 40, r: 20, t: 20, b: 36 };
  const min = Math.min(...data),
    max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = pad.l + (i / (data.length - 1)) * (w - pad.l - pad.r);
    const y = pad.t + (1 - (v - min) / range) * (h - pad.t - pad.b);
    return [x, y] as [number, number];
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  const area = `${path} L ${points[points.length - 1][0]} ${h - pad.b} L ${points[0][0]} ${h - pad.b} Z`;

  return (
    <div className="glass" style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <Kicker>12-month trajectory</Kicker>
          <div
            className="h-serif"
            style={{ fontSize: 26, fontWeight: 600, marginTop: 10, textTransform: "capitalize" }}
          >
            {METRICS.find((m) => m.id === metric)?.label || metric}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          {["1M", "3M", "12M", "YTD"].map((p, i) => (
            <button
              key={p}
              style={{
                padding: "4px 10px",
                background: i === 2 ? "rgba(16,185,129,0.1)" : "transparent",
                border: "1px solid " + (i === 2 ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"),
                color: i === 2 ? "var(--color-accent)" : "var(--color-muted)",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                borderRadius: "var(--radius)",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 260, marginTop: 8 }}>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1={pad.l}
            x2={w - pad.r}
            y1={pad.t + p * (h - pad.t - pad.b)}
            y2={pad.t + p * (h - pad.t - pad.b)}
            stroke="rgba(130,154,177,0.1)"
            strokeDasharray="2 4"
          />
        ))}
        <path d={area} fill="url(#chartFill)" />
        <path d={path} fill="none" stroke="#10B981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r={i === points.length - 1 ? 5 : 0}
            fill="var(--color-accent)"
            stroke="var(--color-bg)"
            strokeWidth="2"
          />
        ))}
        {MONTHS.map(
          (m, i) =>
            i % 2 === 0 && (
              <text
                key={i}
                x={pad.l + (i / (data.length - 1)) * (w - pad.l - pad.r)}
                y={h - 12}
                fontSize="10"
                fill="var(--color-muted)"
                fontFamily="var(--font-mono)"
                textAnchor="middle"
              >
                {m}
              </text>
            )
        )}
      </svg>
    </div>
  );
}
