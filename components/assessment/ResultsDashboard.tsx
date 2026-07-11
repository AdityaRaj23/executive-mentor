"use client";
import type { ReactNode } from "react";
import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";
import type { AssessmentResult } from "@/lib/assessmentScoring";
import type { HollandCode, PressureDimension } from "@/data/questions";

const HOLLAND_LABELS: Record<HollandCode, string> = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

const VARK_LABELS: Record<string, string> = {
  V: "Visual",
  A: "Aural",
  R: "Read/Write",
  K: "Kinesthetic",
};

const PRESSURE_LABELS: Record<PressureDimension, string> = {
  Family_Pressure_Score: "Family pressure",
  Desire_Gap_Score: "Desire gap (you vs family)",
  Suppression_Score: "Suppression",
  Fear_Disappointment_Score: "Fear of disappointing",
  Personal_Clarity_Score: "Personal clarity",
  Peer_Pressure_Score: "Peer pressure",
  Authenticity_Score: "Authenticity",
  Suppression_Detection_Score: "Hidden preference signal",
  Career_Anxiety_Score: "Career anxiety",
  Adult_Support_Score: "Adult support",
};

// For these dimensions a HIGH score is healthy; for the rest high = concern.
const POSITIVE_PRESSURE = new Set<PressureDimension>([
  "Personal_Clarity_Score",
  "Authenticity_Score",
  "Adult_Support_Score",
]);

function pressureColor(dim: PressureDimension, value: number) {
  const concern = POSITIVE_PRESSURE.has(dim) ? 100 - value : value;
  if (concern > 60) return "#ef4444";
  if (concern > 30) return "#f59e0b";
  return "var(--color-accent)";
}

function Bar({
  label,
  pct,
  right,
  color,
}: {
  label: string;
  pct: number;
  right?: string;
  color?: string;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
        <span>{label}</span>
        <span className="mono" style={{ fontSize: 11, color: "var(--color-muted)" }}>
          {right}
        </span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
        <div
          style={{
            width: `${Math.min(100, Math.max(0, pct))}%`,
            height: "100%",
            background: color ?? "var(--color-accent)",
            borderRadius: 3,
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}

function Section({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  return (
    <section className="glass" style={{ padding: 28, borderRadius: "var(--radius)" }}>
      <Kicker accent>{kicker}</Kicker>
      <h2 className="h-serif" style={{ fontSize: 24, fontWeight: 500, margin: "14px 0 20px" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ResultsDashboard({
  result,
  onRetake,
}: {
  result: AssessmentResult;
  onRetake: () => void;
}) {
  const topArchetype = result.archetypes[0];
  const topValues = result.values.slice(0, 3);

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 32px 100px", animation: "fadeIn 0.5s ease" }}>
      <header
        style={{
          marginBottom: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <Kicker accent>Full assessment · results</Kicker>
          <h1
            className="h-serif"
            style={{ fontSize: "clamp(36px, 5vw, 54px)", lineHeight: 1.05, margin: "18px 0 12px", fontWeight: 500 }}
          >
            The {topArchetype.key}, <em>code {result.hollandCode}.</em>
          </h1>
          <p style={{ fontSize: 15, color: "var(--color-muted)", maxWidth: 560, margin: 0, lineHeight: 1.6 }}>
            Your dominant archetype is the {topArchetype.key} ({topArchetype.pct}%), your Holland interest code is{" "}
            {result.hollandCode} ({HOLLAND_LABELS[result.holland[0].key]} + {HOLLAND_LABELS[result.holland[1].key]}
            ), and you learn best {VARK_LABELS[result.dominantVark].toLowerCase()}-first.
          </p>
        </div>
        <CTA variant="ghost" size="sm" onClick={onRetake}>
          Retake assessment
        </CTA>
      </header>

      {result.flags.length > 0 && (
        <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
          {result.flags.map((f) => (
            <div
              key={f.id}
              style={{
                padding: "16px 20px",
                borderRadius: "var(--radius)",
                border: "1px solid rgba(239,68,68,0.4)",
                background: "rgba(239,68,68,0.07)",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#ef4444", marginBottom: 6 }}>
                {f.label}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-text)" }}>{f.detail}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 24 }}>
        <Section kicker="Module 4" title="Archetypes">
          {result.archetypes.map((a) => (
            <Bar key={a.key} label={a.key} pct={a.pct} right={`${a.pct}%`} />
          ))}
        </Section>

        <Section kicker="Module 3" title={`Interest code · ${result.hollandCode}`}>
          {result.holland.map((h) => (
            <Bar key={h.key} label={`${h.key} · ${HOLLAND_LABELS[h.key]}`} pct={h.pct} right={`${h.pct}%`} />
          ))}
        </Section>

        <Section kicker="Module 2" title={`Aptitude · ${result.aptitudeCorrect}/20 correct`}>
          {result.aptitude.map((a) => (
            <Bar key={a.key} label={a.key} pct={a.pct} right={`${a.correct}/5 correct`} />
          ))}
        </Section>

        <Section kicker="Module 6" title={`Learning style · ${VARK_LABELS[result.dominantVark]}`}>
          {result.vark.map((v) => (
            <Bar key={v.key} label={VARK_LABELS[v.key]} pct={v.pct} right={`${v.pct}%`} />
          ))}
        </Section>

        <Section kicker="Module 7" title="What you value most">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
            {topValues.map((v) => (
              <span
                key={v.key}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(16,185,129,0.4)",
                  background: "rgba(16,185,129,0.08)",
                  color: "var(--color-accent)",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {v.key}
              </span>
            ))}
          </div>
          {result.values.map((v) => (
            <Bar key={v.key} label={v.key} pct={(v.raw / Math.max(1, result.values[0].raw)) * 100} right={`${v.raw} pts`} />
          ))}
        </Section>

        <Section kicker="Module 5" title="Pressure gauge">
          {(Object.keys(PRESSURE_LABELS) as PressureDimension[]).map((dim) => (
            <Bar
              key={dim}
              label={PRESSURE_LABELS[dim]}
              pct={result.pressure[dim]}
              right={`${result.pressure[dim]}/100`}
              color={pressureColor(dim, result.pressure[dim])}
            />
          ))}
        </Section>
      </div>
    </div>
  );
}
