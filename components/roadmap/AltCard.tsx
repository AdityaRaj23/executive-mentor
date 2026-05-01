"use client";
import { useState } from "react";
import type { Milestone } from "@/types";

export function AltCard({
  milestone: m,
  selected,
  onSelect,
}: {
  milestone: Milestone;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: "left",
        padding: 18,
        width: "100%",
        cursor: "pointer",
        background: "rgba(14,165,233,0.04)",
        border: "1px dashed " + (selected || hover ? "rgba(14,165,233,0.7)" : "rgba(14,165,233,0.35)"),
        borderRadius: "var(--radius)",
        transition: "all 0.2s",
        fontFamily: "inherit",
        color: "inherit",
        opacity: selected ? 1 : 0.85,
      }}
    >
      <div className="uc" style={{ fontSize: 9, color: "var(--color-sapphire)", letterSpacing: "0.14em", marginBottom: 8 }}>
        What-if · alt
      </div>
      <div className="h-serif" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.2, fontStyle: "italic", marginBottom: 6 }}>
        {m.title}
      </div>
      <p style={{ fontSize: 12, color: "var(--color-muted)", lineHeight: 1.5, margin: 0 }}>{m.body}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
        {m.skills.map((s, i) => (
          <span
            key={i}
            style={{
              fontSize: 10,
              padding: "2px 7px",
              background: "rgba(14,165,233,0.1)",
              color: "var(--color-sapphire)",
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </button>
  );
}
