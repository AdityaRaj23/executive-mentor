"use client";
import { useState } from "react";
import { Kicker } from "@/components/shared/Kicker";
import { boardroom } from "@/lib/voice";
import type { Suggestion } from "@/types";

function SuggestionChip({ title, body, onClick }: Suggestion & { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: "left",
        padding: 18,
        background: hover ? "var(--color-accent)" : "transparent",
        border: "1px solid " + (hover ? "var(--color-accent)" : "rgba(16,185,129,0.4)"),
        color: hover ? "var(--color-bg)" : "var(--color-text)",
        borderRadius: "var(--radius)",
        cursor: "pointer",
        transition: "all 0.18s ease",
        fontFamily: "inherit",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div className="h-serif" style={{ fontSize: 18, fontWeight: 600, fontStyle: "italic", lineHeight: 1.2 }}>
        {title}
      </div>
      <div
        style={{
          fontSize: 12,
          color: hover ? "var(--color-bg)" : "var(--color-muted)",
          opacity: hover ? 0.7 : 1,
          lineHeight: 1.45,
        }}
      >
        {body}
      </div>
    </button>
  );
}

export function Suggestions({ onPick }: { onPick: (s: Suggestion) => void }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <Kicker accent>Try one</Kicker>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 }}>
        {boardroom.suggestions.map((p, i) => (
          <SuggestionChip key={i} {...p} onClick={() => onPick(p)} />
        ))}
      </div>
    </div>
  );
}
