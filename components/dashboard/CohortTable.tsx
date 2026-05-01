"use client";
import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import type { CohortMember } from "@/types";
import { ReadinessBadge } from "./ReadinessBadge";

export function CohortTable({
  data,
  onOpen,
}: {
  data: CohortMember[];
  onOpen: (m: CohortMember) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div style={{ marginTop: 24, animation: "fadeIn 0.3s ease" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 2fr 1fr 1.5fr 1fr 60px",
          padding: "14px 20px",
          borderBottom: "var(--hairline-strong)",
          fontSize: 10,
          letterSpacing: "0.14em",
          color: "var(--color-muted)",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        <div>Member</div>
        <div>Track</div>
        <div>Readiness</div>
        <div>Top skill gap</div>
        <div>Last session</div>
        <div></div>
      </div>
      {data.map((r, i) => (
        <div
          key={i}
          onClick={() => onOpen(r)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1fr 1.5fr 1fr 60px",
            padding: "16px 20px",
            borderBottom: "var(--hairline)",
            background: hovered === i ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.01)",
            cursor: "pointer",
            transition: "background 0.15s",
            alignItems: "center",
            fontSize: 13,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-bg))",
                border: "1px solid var(--hairline-strong)",
                display: "grid",
                placeItems: "center",
                fontSize: 10,
                fontWeight: 600,
                color: "var(--color-accent)",
              }}
            >
              {r.name
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </div>
            <span>{r.name}</span>
          </div>
          <div style={{ color: "var(--color-muted)" }}>{r.track}</div>
          <div>
            <ReadinessBadge score={r.readiness} />
          </div>
          <div style={{ color: r.gap === "—" ? "var(--color-muted)" : "var(--color-text)" }}>{r.gap}</div>
          <div className="mono" style={{ fontSize: 11, color: "var(--color-muted)" }}>
            {r.last} ago
          </div>
          <div style={{ textAlign: "right", color: "var(--color-muted)" }}>
            <Icon name="chevronRight" size={14} />
          </div>
        </div>
      ))}
    </div>
  );
}
