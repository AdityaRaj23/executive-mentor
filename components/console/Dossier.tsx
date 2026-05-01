import { Kicker } from "@/components/shared/Kicker";
import type { Dossier as DossierShape } from "@/types";
import { Section } from "./Section";
import { ContextChip } from "./ContextChip";

export function Dossier({ dossier, adminView }: { dossier: DossierShape; adminView: boolean }) {
  return (
    <div
      className="glass"
      style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24, overflowY: "auto" }}
    >
      <div>
        <Kicker accent>{adminView ? "Admin sees" : "Live dossier"}</Kicker>
        <div
          className="h-serif"
          style={{ fontSize: 26, fontWeight: 600, marginTop: 14, lineHeight: 1.1 }}
        >
          {adminView ? "Member · #4821" : dossier.member}
        </div>
        <div style={{ fontSize: 13, color: "var(--color-muted)", marginTop: 4 }}>
          {adminView ? "Identity hidden in cohort view" : dossier.role}
        </div>
        <div className="mono" style={{ fontSize: 11, color: "var(--color-accent)", marginTop: 6 }}>
          {dossier.tenure}
        </div>
      </div>

      <Section title={adminView ? "Aggregate goals" : "Active goals"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {dossier.goals.map((g, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: "rgba(16,185,129,0.05)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--color-accent)",
                  boxShadow: "0 0 8px var(--color-accent)",
                }}
              />
              <span style={{ fontSize: 13 }}>{g.label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Skill profile">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {dossier.skills.map((s, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                <span>{s.label}</span>
                <span className="mono" style={{ color: "var(--color-muted)" }}>
                  {adminView ? "—" : s.conf}
                </span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.05)" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${adminView ? Math.round(s.conf / 10) * 10 : s.conf}%`,
                    background:
                      s.conf >= 70
                        ? "var(--color-accent)"
                        : s.conf >= 50
                          ? "var(--color-amber)"
                          : "var(--color-muted)",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {!adminView && (
        <Section title="Signals">
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {dossier.signals.map((s, i) => (
              <li
                key={i}
                style={{
                  fontSize: 12,
                  color: "var(--color-muted)",
                  lineHeight: 1.5,
                  paddingLeft: 14,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 8,
                    width: 6,
                    height: 1,
                    background: "var(--color-accent)",
                  }}
                />
                {s}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {adminView && (
        <Section title="What admin gets">
          <div
            style={{
              fontSize: 12,
              color: "var(--color-muted)",
              lineHeight: 1.6,
              padding: 12,
              background: "rgba(245,158,11,0.04)",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            Skill levels rounded to nearest 10%. Identity replaced with cohort ID. Conversation themes only — no transcripts. Min cohort size of 5 enforced for all reports.
          </div>
        </Section>
      )}

      <Section title="Context chips">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {(adminView
            ? ["Skill themes", "Goal categories", "Engagement frequency"]
            : ["1:1 transcripts (12)", "Promo packets (3)", "Org chart", "Compa-ratio", "Recent perf reviews"]
          ).map((c, i) => (
            <ContextChip key={i}>{c}</ContextChip>
          ))}
        </div>
      </Section>
    </div>
  );
}
