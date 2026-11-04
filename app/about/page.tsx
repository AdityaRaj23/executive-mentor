import { Kicker } from "@/components/shared/Kicker";

export default function AboutPage() {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "80px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 64,
      }}
    >
      {/* Hero */}
      <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Kicker>Who we are</Kicker>
        <h1
          className="h-serif"
          style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.1, fontStyle: "italic", margin: 0 }}
        >
          Brainlytic Technologies
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.75, color: "var(--color-muted)", maxWidth: 640 }}>
          An Indian startup building an AI-powered, science-based career-guidance platform for school
          students in Classes 8–12. We were founded to fix a problem most Indians recognise but few
          have solved properly: students choosing careers blindly, without any real understanding of
          who they are.
        </p>
      </section>

      {/* Problem */}
      <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Kicker>The problem we&apos;re solving</Kicker>
        <h2 className="h-serif" style={{ fontSize: 28, fontStyle: "italic", margin: 0 }}>
          A decision made at 15, with almost no guidance
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            "54% of Indian graduates work in a field unrelated to their degree (India Skills Report, 2024).",
            "School counsellors serve over 1,200 students each — against a recommended ratio of 1:250.",
            "Private counselling costs ₹5,000–10,000 a session, out of reach for most families.",
            "DMIT — the most popular \"career test\" sold to families — is a fingerprint-based product with zero scientific validity, formally denounced by the Indian Psychiatric Society.",
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                padding: "16px 20px",
                background: "rgba(255,255,255,0.03)",
                border: "var(--hairline)",
                borderRadius: "var(--radius)",
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  color: "var(--color-accent)",
                  fontWeight: 600,
                }}
              >
                {i + 1}
              </span>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "var(--color-muted)" }}>
                {stat}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What we do */}
      <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Kicker>What we do</Kicker>
        <h2 className="h-serif" style={{ fontSize: 28, fontStyle: "italic", margin: 0 }}>
          Career choice as evidence, not guesswork
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--color-muted)", margin: 0 }}>
          Brainlytic gives every student a 30-minute AI-guided assessment built on validated
          psychology — the <strong style={{ color: "var(--color-text)" }}>Big Five (OCEAN)</strong>{" "}
          personality model,{" "}
          <strong style={{ color: "var(--color-text)" }}>Holland&apos;s RIASEC </strong> interest
          framework, and established aptitude science. The output is a personalised report: the
          student&apos;s real strengths, best-fit career directions, and a concrete roadmap.
        </p>
      </section>

      {/* Differentiator */}
      <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Kicker>What makes us different</Kicker>
        <div
          style={{
            padding: "28px 32px",
            background: "rgba(16, 185, 129, 0.05)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "var(--radius)",
          }}
        >
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "var(--color-text)", margin: 0 }}>
            We are the only platform in India built to tell families the scientifically validated
            truth — while competitors are either counsellors with no time, or fingerprint tests with
            no science. Our methodology is being developed in consultation with academic researchers
            in psychology.
          </p>
        </div>
      </section>

      {/* Who we serve */}
      <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Kicker>Who we serve</Kicker>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            {
              label: "Students",
              detail: "Ages 13–18 in Classes 8–12, delivered directly and through schools.",
            },
            {
              label: "Parents",
              detail: "Families who want an evidence-based answer, not a costly guess.",
            },
            {
              label: "Schools",
              detail: "Institutions looking to meet NEP 2020's early career-guidance mandate.",
            },
            {
              label: "Market",
              detail: "India adds 5 million new Class-10 students to this decision every year.",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: "20px 24px",
                background: "rgba(255,255,255,0.03)",
                border: "var(--hairline)",
                borderRadius: "var(--radius)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-accent)" }}>
                {item.label}
              </span>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--color-muted)" }}>
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Aim */}
      <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Kicker>Our aim</Kicker>
        <h2 className="h-serif" style={{ fontSize: 28, fontStyle: "italic", margin: 0 }}>
          India&apos;s trusted career-decision layer
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--color-muted)", margin: 0 }}>
          To become India&apos;s trusted career-decision layer — and in doing so, help build a
          generation that works in the right fields, not the wrong ones.
        </p>
      </section>
    </div>
  );
}
