"use client";
import { useState } from "react";
import { CTA } from "@/components/shared/CTA";
import { COHORT_DATA, SKILL_HEATMAP } from "@/data/cohort";
import type { CohortMember, MetricId } from "@/types";
import { CohortTable } from "./CohortTable";
import { DashHeader } from "./DashHeader";
import { DrilldownOverlay } from "./DrilldownOverlay";
import { MetricRibbon } from "./MetricRibbon";
import { NarrativePanel } from "./NarrativePanel";
import { PrivacyBanner } from "./PrivacyBanner";
import { SkillHeatmap } from "./SkillHeatmap";
import { TrajectoryChart } from "./TrajectoryChart";

export default function DashboardScreen() {
  const [activeMetric, setActiveMetric] = useState<MetricId>("engagement");
  const [tab, setTab] = useState<"cohort" | "skills">("cohort");
  const [drilldown, setDrilldown] = useState<CohortMember | null>(null);

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px 32px 80px" }}>
      <DashHeader />
      <PrivacyBanner />
      <MetricRibbon active={activeMetric} onSelect={setActiveMetric} />

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 24,
        }}
      >
        <TrajectoryChart metric={activeMetric} />
        <NarrativePanel />
      </div>

      <div
        style={{
          marginTop: 24,
          display: "flex",
          gap: 8,
          alignItems: "center",
          borderBottom: "var(--hairline)",
        }}
      >
        {([
          ["cohort", "Cohort table"],
          ["skills", "Skill gap analysis"],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: "14px 20px",
              background: "transparent",
              border: 0,
              borderBottom: "2px solid " + (tab === id ? "var(--color-accent)" : "transparent"),
              color: tab === id ? "var(--color-text)" : "var(--color-muted)",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.06em",
              marginBottom: -1,
              transition: "all 0.18s",
            }}
          >
            {label}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, paddingBottom: 8 }}>
          <CTA size="sm" variant="ghost" icon="filter">
            Filter
          </CTA>
          <CTA size="sm" variant="ghost" icon="download">
            Export
          </CTA>
        </div>
      </div>

      {tab === "cohort" ? (
        <CohortTable data={COHORT_DATA} onOpen={setDrilldown} />
      ) : (
        <SkillHeatmap data={SKILL_HEATMAP} />
      )}

      {drilldown && <DrilldownOverlay member={drilldown} onClose={() => setDrilldown(null)} />}
    </div>
  );
}
