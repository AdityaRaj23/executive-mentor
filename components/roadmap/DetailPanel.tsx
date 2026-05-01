"use client";
import { CTA } from "@/components/shared/CTA";
import { Icon } from "@/components/shared/Icon";
import { Kicker } from "@/components/shared/Kicker";
import type { Milestone } from "@/types";

export function DetailPanel({
  milestone,
  onToggleTask,
}: {
  milestone: Milestone | undefined;
  onToggleTask: (idx: number) => void;
}) {
  if (!milestone) return null;
  return (
    <div
      className="glass"
      style={{
        padding: 24,
        position: "sticky",
        top: 100,
        maxHeight: "calc(100vh - 140px)",
        overflowY: "auto",
      }}
    >
      <Kicker accent>Milestone detail</Kicker>
      <div className="h-serif" style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.15, margin: "14px 0 8px" }}>
        {milestone.title}
      </div>
      <div className="mono" style={{ fontSize: 11, color: "var(--color-muted)" }}>
        {milestone.year} · {milestone.quarter}
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-text)", marginTop: 18 }}>{milestone.body}</p>
      {milestone.tasks && (
        <div style={{ marginTop: 24 }}>
          <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)", marginBottom: 12 }}>
            Action items
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {milestone.tasks.map((t, i) => {
              const done = (milestone._doneTasks || []).includes(i);
              return (
                <button
                  key={i}
                  onClick={() => onToggleTask(i)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "10px 12px",
                    background: done ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)",
                    border: "1px solid " + (done ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)"),
                    borderRadius: "var(--radius)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    color: "inherit",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      marginTop: 1,
                      flexShrink: 0,
                      border: "1.5px solid " + (done ? "var(--color-accent)" : "var(--color-muted)"),
                      background: done ? "var(--color-accent)" : "transparent",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--color-bg)",
                    }}
                  >
                    {done && <Icon name="check" size={11} stroke={3} />}
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      textDecoration: done ? "line-through" : "none",
                      opacity: done ? 0.5 : 1,
                    }}
                  >
                    {t}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div style={{ marginTop: 24, paddingTop: 24, borderTop: "var(--hairline)" }}>
        <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)", marginBottom: 12 }}>
          Skills tagged
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {milestone.skills.map((s, i) => (
            <span
              key={i}
              style={{
                fontSize: 11,
                padding: "4px 10px",
                background: "rgba(16,185,129,0.1)",
                color: "var(--color-accent)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <CTA size="sm" icon="sparkle" style={{ width: "100%", justifyContent: "center" }}>
          Discuss with M
        </CTA>
      </div>
    </div>
  );
}
