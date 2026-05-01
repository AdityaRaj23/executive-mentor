"use client";
import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { Kicker } from "@/components/shared/Kicker";

const FEATURES = [
  {
    kicker: "01 / Mentorship",
    title: "A boardroom voice in the IDE.",
    body: "Context-aware sessions trained on senior leadership patterns. Members negotiate, pivot, and pressure-test decisions in real time.",
    tag: "Console",
  },
  {
    kicker: "02 / Trajectory",
    title: "Roadmaps that adapt as life does.",
    body: "Milestones rebuild themselves around layoffs, promotions, parental leave, market shifts. The plan is never the plan.",
    tag: "Roadmap",
  },
  {
    kicker: "03 / Oversight",
    title: "Cohort intelligence, not surveillance.",
    body: "Aggregate readiness scores, skill-gap heatmaps, and promotion forecasts — without ever exposing a single private session.",
    tag: "Dashboard",
  },
];

function FeatureCard({ kicker, title, body, tag }: (typeof FEATURES)[number]) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="glass"
      style={{
        padding: 28,
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.3s ease",
        borderColor: hover ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)",
        transform: hover ? "translateY(-2px)" : "none",
      }}
    >
      <div>
        <div className="mono" style={{ fontSize: 11, color: "var(--color-accent)", letterSpacing: "0.1em" }}>
          {kicker}
        </div>
        <h3 className="h-serif" style={{ fontSize: 30, lineHeight: 1.15, margin: "24px 0 16px", fontWeight: 500 }}>
          {title}
        </h3>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-muted)", margin: 0 }}>{body}</p>
      </div>
      <div
        style={{
          marginTop: 32,
          paddingTop: 20,
          borderTop: "var(--hairline)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span className="uc" style={{ fontSize: 10, color: "var(--color-muted)" }}>
          Surface · {tag}
        </span>
        <Icon name="arrowRight" size={14} />
      </div>
    </div>
  );
}

export function FeatureGrid() {
  return (
    <section style={{ maxWidth: 1280, margin: "120px auto 0", padding: "0 32px" }}>
      <div style={{ marginBottom: 56, maxWidth: 720 }}>
        <Kicker>What ships in v1</Kicker>
        <h2 className="h-serif" style={{ fontSize: 56, lineHeight: 1.05, margin: "20px 0 0", fontWeight: 500 }}>
          Three surfaces, <em>one institution</em>.
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {FEATURES.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>
    </section>
  );
}
