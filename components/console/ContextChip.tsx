"use client";
import { useState, type ReactNode } from "react";

export function ContextChip({ children }: { children: ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontSize: 11,
        padding: "4px 10px",
        border: "1px solid rgba(16,185,129,0.4)",
        background: hover ? "var(--color-accent)" : "transparent",
        color: hover ? "var(--color-bg)" : "var(--color-text)",
        cursor: "pointer",
        transition: "all 0.16s",
      }}
    >
      {children}
    </span>
  );
}
