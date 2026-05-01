"use client";
import type { Branch, Milestone } from "@/types";
import { AltCard } from "./AltCard";
import { Card } from "./Card";

function MilestoneRow({
  milestone: m,
  altMilestone,
  selected,
  altSelected,
  onSelect,
  onSelectAlt,
}: {
  milestone: Milestone;
  altMilestone?: Milestone;
  selected: boolean;
  altSelected: boolean;
  onSelect: () => void;
  onSelectAlt: (() => void) | null;
}) {
  const isLeft = m.side === "left";
  const isCurrent = m.status === "current";
  const isDone = m.status === "done";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", alignItems: "center", gap: 0 }}>
      <div style={{ paddingRight: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        {isLeft && <Card milestone={m} selected={selected} onSelect={onSelect} />}
        {isLeft && altMilestone && onSelectAlt && (
          <AltCard milestone={altMilestone} selected={altSelected} onSelect={onSelectAlt} />
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
        <button
          onClick={onSelect}
          aria-label={m.title}
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: isDone || isCurrent ? "var(--color-accent)" : "var(--color-surface-solid)",
            border:
              "2px solid " + (isDone || isCurrent ? "var(--color-accent)" : "var(--color-muted)"),
            boxShadow: isCurrent ? "0 0 0 4px rgba(16,185,129,0.15)" : "none",
            animation: isCurrent ? "pulseRing 2s ease-out infinite" : "none",
            cursor: "pointer",
            padding: 0,
            position: "relative",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            [isLeft ? "right" : "left"]: "calc(50% + 18px)",
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--color-muted)",
            whiteSpace: "nowrap",
            opacity: 0.5,
          }}
        >
          {m.year} · {m.quarter}
        </div>
      </div>
      <div style={{ paddingLeft: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        {!isLeft && <Card milestone={m} selected={selected} onSelect={onSelect} />}
        {!isLeft && altMilestone && onSelectAlt && (
          <AltCard milestone={altMilestone} selected={altSelected} onSelect={onSelectAlt} />
        )}
      </div>
    </div>
  );
}

export function Timeline({
  milestones,
  branch,
  selected,
  onSelect,
}: {
  milestones: Milestone[];
  branch: Branch | null;
  selected: number;
  onSelect: (id: number) => void;
}) {
  return (
    <div style={{ position: "relative", paddingTop: 8 }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 1,
          background:
            "linear-gradient(to bottom, transparent, var(--color-muted) 8%, var(--color-muted) 92%, transparent)",
          transform: "translateX(-0.5px)",
          opacity: 0.4,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
        {milestones.map((m) => {
          const altPair = branch?.milestones?.find((am) => am.id === m.id + 100);
          return (
            <MilestoneRow
              key={m.id}
              milestone={m}
              altMilestone={altPair}
              selected={selected === m.id}
              onSelect={() => onSelect(m.id)}
              onSelectAlt={altPair ? () => onSelect(altPair.id) : null}
              altSelected={!!altPair && selected === altPair.id}
            />
          );
        })}
      </div>
    </div>
  );
}
