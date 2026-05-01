"use client";
import { Kicker } from "@/components/shared/Kicker";
import type { Archetype } from "@/types";

export function Cartography({
  matches,
  all,
  selected,
  onSelect,
}: {
  matches: Archetype[];
  all: Archetype[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const matchMap: Record<string, number> = {};
  matches.forEach((m, i) => {
    matchMap[m.id] = i;
  });
  const sorted = [...all].sort((a, b) => matchMap[a.id] - matchMap[b.id]);

  return (
    <div style={{ marginBottom: 48 }}>
      <Kicker>Your archetype map · ranked by fit</Kicker>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 14,
          marginTop: 18,
        }}
      >
        {sorted.map((a, i) => {
          const fit =
            i === 0
              ? "Strongest match"
              : i === 1
                ? "Strong match"
                : i === 2
                  ? "Worth exploring"
                  : "Distant";
          const isPrimary = i === 0;
          const isSel = selected === a.id;
          return (
            <button
              key={a.id}
              onClick={() => onSelect(a.id)}
              className="glass"
              style={{
                textAlign: "left",
                padding: 20,
                cursor: "pointer",
                borderColor: isSel
                  ? "rgba(16,185,129,0.6)"
                  : isPrimary
                    ? "rgba(16,185,129,0.3)"
                    : "rgba(255,255,255,0.08)",
                background: isSel
                  ? "rgba(16,185,129,0.06)"
                  : isPrimary
                    ? "rgba(16,185,129,0.03)"
                    : "var(--color-surface)",
                transition: "all 0.2s",
                fontFamily: "inherit",
                color: "inherit",
                opacity: i > 2 ? 0.6 : 1,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span
                  className="uc"
                  style={{
                    fontSize: 9,
                    padding: "3px 8px",
                    background: isPrimary ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
                    color: isPrimary ? "var(--color-accent)" : "var(--color-muted)",
                    letterSpacing: "0.14em",
                  }}
                >
                  {fit}
                </span>
                <span className="mono" style={{ fontSize: 11, color: "var(--color-muted)" }}>
                  0{i + 1}
                </span>
              </div>
              <div className="h-serif" style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.1, marginBottom: 4 }}>
                {a.label}
              </div>
              <div style={{ fontSize: 12, color: "var(--color-accent)", fontStyle: "italic", marginBottom: 10 }}>
                {a.tag}
              </div>
              <div style={{ fontSize: 13, color: "var(--color-muted)", lineHeight: 1.5 }}>{a.blurb}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
