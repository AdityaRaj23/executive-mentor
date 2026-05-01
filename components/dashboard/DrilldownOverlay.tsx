"use client";
import { useEffect } from "react";
import { CTA } from "@/components/shared/CTA";
import { Icon } from "@/components/shared/Icon";
import { Kicker } from "@/components/shared/Kicker";
import { MEMBER_THEMES } from "@/data/cohort";
import type { CohortMember } from "@/types";
import { Block } from "./Block";
import { Stat } from "./Stat";

const INTERVENTIONS = [
  { title: "Pair on cross-track shadow", body: "Match with a peer flagged on complementary signal.", cta: "Suggest pairing" },
  { title: "Sponsor a public artifact", body: "Offer a slot at the next all-hands or write-up.", cta: "Draft offer" },
  { title: "Schedule a stretch project review", body: "Quarterly 1:1 to validate trajectory and readiness.", cta: "Add to calendar" },
];

export function DrilldownOverlay({ member, onClose }: { member: CohortMember; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const memberId = "#" + (4000 + member.name.length * 37 + member.readiness).toString().slice(0, 4);
  const sessionsThisMo = 4 + (member.readiness % 6);
  const cadence = sessionsThisMo >= 8 ? "High" : sessionsThisMo >= 4 ? "Steady" : "Light";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 200,
        animation: "fadeIn 0.25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 580,
          maxWidth: "92vw",
          height: "100%",
          background: "var(--color-surface-solid)",
          borderLeft: "var(--hairline-strong)",
          overflowY: "auto",
          animation: "slideInRight 0.3s ease",
        }}
      >
        <div
          style={{
            padding: "24px 32px",
            borderBottom: "var(--hairline)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <Kicker accent>Member drilldown</Kicker>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-bg))",
                  border: "1px solid rgba(16,185,129,0.3)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-accent)",
                }}
              >
                {member.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </div>
              <div>
                <div className="h-serif" style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.1 }}>
                  {member.name}
                </div>
                <div className="mono" style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 4 }}>
                  Member {memberId} · {member.track}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 32,
              height: 32,
              background: "transparent",
              border: "var(--hairline)",
              color: "var(--color-muted)",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              fontFamily: "inherit",
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            padding: "14px 32px",
            background: "rgba(14,165,233,0.04)",
            borderBottom: "1px solid rgba(14,165,233,0.2)",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            fontSize: 12,
            color: "var(--color-muted)",
            lineHeight: 1.5,
          }}
        >
          <Icon name="lock" size={14} />
          <span>
            You see <strong style={{ color: "var(--color-text)" }}>themes, cadence, readiness</strong>. You do{" "}
            <strong style={{ color: "var(--color-text)" }}>not</strong> see transcripts, raw answers, or 1:1 source material. {member.name} controls disclosure.
          </span>
        </div>

        <div
          style={{
            padding: "24px 32px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            borderBottom: "var(--hairline)",
          }}
        >
          <Stat
            label="Readiness"
            value={member.readiness}
            accent={member.readiness >= 80 ? "accent" : member.readiness >= 50 ? "amber" : "rose"}
          />
          <Stat label="Sessions / 30d" value={sessionsThisMo} suffix="" />
          <Stat label="Cadence" value={cadence} text />
        </div>

        <Block title="Conversation themes" sub="Auto-clustered from session topics. Min cohort size of 5 enforced.">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MEMBER_THEMES.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span>{t.theme}</span>
                    <span className="mono" style={{ color: "var(--color-muted)" }}>
                      {Math.round(t.weight * 100)}%
                    </span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,0.05)" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${t.weight * 100}%`,
                        background: i === 0 ? "var(--color-accent)" : "rgba(16,185,129,0.4)",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Top skill gap" sub="Surfaced from M's structured assessments — only when ≥5 cohort peers share signal.">
          <div
            style={{
              padding: 18,
              background: "rgba(245,158,11,0.06)",
              border: "1px solid rgba(245,158,11,0.3)",
            }}
          >
            <div className="uc" style={{ fontSize: 10, color: "var(--color-amber)", letterSpacing: "0.14em" }}>
              Flagged gap
            </div>
            <div className="h-serif" style={{ fontSize: 22, fontWeight: 600, marginTop: 8, fontStyle: "italic" }}>
              {member.gap}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 10, lineHeight: 1.6 }}>
              Shared by 34% of {member.track.split(" · ")[0]} track. Pattern detected over the last 6 weeks of sessions.
            </div>
          </div>
        </Block>

        <Block
          title="Recommended interventions"
          sub="Drafts to send — member sees them as suggestions from their admin, not surveillance."
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {INTERVENTIONS.map((a, i) => (
              <div
                key={i}
                style={{
                  padding: 14,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 4 }}>{a.body}</div>
                </div>
                <CTA size="sm" variant="ghost">
                  {a.cta}
                </CTA>
              </div>
            ))}
          </div>
        </Block>

        <div style={{ padding: "24px 32px 40px", display: "flex", gap: 10 }}>
          <CTA size="sm" variant="ghost" icon="download" style={{ flex: 1, justifyContent: "center" }}>
            Export themes
          </CTA>
          <CTA size="sm" icon="sparkle" style={{ flex: 1, justifyContent: "center" }}>
            Ask M about {member.name.split(" ")[0]}
          </CTA>
        </div>
      </div>
    </div>
  );
}
