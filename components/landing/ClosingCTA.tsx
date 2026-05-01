"use client";
import Link from "next/link";
import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";

export function ClosingCTA() {
  return (
    <section style={{ maxWidth: 1280, margin: "120px auto 0", padding: "0 32px" }}>
      <div
        className="glass"
        style={{
          padding: "72px 64px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 64,
          background: "linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(20,30,40,0.6) 100%)",
        }}
      >
        <div>
          <Kicker accent>Investor preview · NDA</Kicker>
          <h2 className="h-serif" style={{ fontSize: 48, lineHeight: 1.1, margin: "16px 0 0", fontWeight: 500 }}>
            See what an institution
            <br />
            looks like from the inside.
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 240 }}>
          <Link href="/console" style={{ display: "block" }}>
            <CTA size="lg" icon="arrowRight">Open the console</CTA>
          </Link>
          <CTA size="lg" variant="ghost" icon="download" onClick={() => alert("Deck would download here.")}>
            Investor deck
          </CTA>
        </div>
      </div>
    </section>
  );
}
