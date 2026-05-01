"use client";
import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import type { Milestone } from "@/types";
import { StatusBadge } from "./StatusBadge";

export function Card({
  milestone: m,
  selected,
  onSelect,
}: {
  milestone: Milestone;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hover, setHover] = useState(false);
  const isCurrent = m.status === "current";
  const isDone = m.status === "done";
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="glass"
      style={{
        textAlign: "left",
        padding: 20,
        width: "100%",
        cursor: "pointer",
        transition: "all 0.25s ease",
        borderColor: selected
          ? "rgba(240,244,248,0.4)"
          : hover
            ? "rgba(16,185,129,0.4)"
            : isCurrent
              ? "rgba(16,185,129,0.3)"
              : "rgba(255,255,255,0.08)",
        transform: selected ? "translateY(-2px)" : "none",
        boxShadow: selected ? "var(--shadow-card)" : "none",
        fontFamily: "inherit",
        color: "inherit",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <StatusBadge status={m.status} />
        {isDone && <Icon name="check" size={14} stroke={2} />}
      </div>
      <div className="h-serif" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.2, marginBottom: 8 }}>
        {m.title}
      </div>
      <p style={{ fontSize: 13, color: "var(--color-muted)", lineHeight: 1.55, margin: 0 }}>{m.body}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
        {m.skills.map((s, i) => (
          <span
            key={i}
            style={{
              fontSize: 11,
              padding: "3px 8px",
              background: "rgba(16,185,129,0.1)",
              color: "var(--color-accent)",
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </button>
  );
}
