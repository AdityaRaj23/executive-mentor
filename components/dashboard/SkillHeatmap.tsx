import type { SkillRow } from "@/types";

const TRACKS: (keyof SkillRow["tracks"])[] = ["eng", "product", "design", "data"];

export function SkillHeatmap({ data }: { data: SkillRow[] }) {
  return (
    <div style={{ marginTop: 24, animation: "fadeIn 0.3s ease" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr repeat(4, 1fr)",
          padding: "14px 20px",
          borderBottom: "var(--hairline-strong)",
          fontSize: 10,
          letterSpacing: "0.14em",
          color: "var(--color-muted)",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        <div>Skill</div>
        {TRACKS.map((t) => (
          <div key={t} style={{ textAlign: "center" }}>
            {t}
          </div>
        ))}
      </div>
      {data.map((r, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr repeat(4, 1fr)",
            padding: "14px 20px",
            borderBottom: "var(--hairline)",
            alignItems: "center",
            fontSize: 13,
          }}
        >
          <div>{r.skill}</div>
          {TRACKS.map((t) => {
            const v = r.tracks[t];
            const colorBase = v >= 0.7 ? "rgba(16,185,129," : v >= 0.5 ? "rgba(245,158,11," : "rgba(239,68,68,";
            const textColor = v >= 0.7 ? "var(--color-accent)" : v >= 0.5 ? "var(--color-amber)" : "var(--color-rose)";
            return (
              <div key={t} style={{ padding: "0 8px" }}>
                <div
                  style={{
                    background: colorBase + (0.1 + v * 0.4) + ")",
                    border: "1px solid " + colorBase + "0.3)",
                    padding: "8px 12px",
                    textAlign: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: textColor,
                  }}
                >
                  {Math.round(v * 100)}%
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
