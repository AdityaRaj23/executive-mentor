"use client";
import Link from "next/link";
import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";
import { DemoTerminal } from "./DemoTerminal";
import { Stat } from "./Stat";

export function Hero() {
  return (
    <section
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "80px 32px 60px",
        animation: "fadeIn 0.8s ease",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 64, alignItems: "center" }}>
        <div>
          <Kicker accent>Series A · Closing Q3 2026</Kicker>
          <h1
            className="h-serif"
            style={{
              fontSize: 92,
              lineHeight: 0.98,
              margin: "24px 0 0",
              letterSpacing: "-0.025em",
              fontWeight: 500,
            }}
          >
            Wisdom
            <br />
            <em style={{ color: "var(--color-accent)", fontWeight: 500 }}>at scale.</em>
          </h1>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.5,
              color: "var(--color-muted)",
              margin: "32px 0 0",
              maxWidth: 540,
            }}
          >
            Executive Mentor brings the boardroom advisor to every ambitious professional —
            and gives institutions a mirror into the trajectory of their workforce.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
            <Link href="/console">
              <CTA size="lg" icon="arrowRight">Try the console</CTA>
            </Link>
            <Link href="/dashboard">
              <CTA size="lg" variant="ghost">See institutional view</CTA>
            </Link>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 56, color: "var(--color-muted)", fontSize: 12 }}>
            <Stat label="Cohorts deployed" value="184" />
            <Stat label="Members guided" value="62,400" />
            <Stat label="Avg. promo lift" value="2.3×" />
          </div>
        </div>
        <DemoTerminal />
      </div>
    </section>
  );
}
