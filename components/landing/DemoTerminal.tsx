"use client";
import { useEffect, useState } from "react";
import { DEMO_SCRIPT } from "@/data/ticker";

function DemoBubble({ role, text, typing }: { role: "user" | "ai"; text: string; typing?: boolean }) {
  const isUser = role === "user";
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        flexDirection: isUser ? "row-reverse" : "row",
        animation: "fadeIn 0.4s ease",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          flexShrink: 0,
          background: isUser ? "rgba(255,255,255,0.04)" : "var(--color-primary)",
          border: isUser ? "var(--hairline)" : "1px solid rgba(16,185,129,0.4)",
          display: "grid",
          placeItems: "center",
          fontFamily: isUser ? "var(--font-body)" : "var(--font-heading)",
          fontSize: isUser ? 11 : 18,
          fontStyle: isUser ? "normal" : "italic",
          fontWeight: 600,
          color: isUser ? "var(--color-muted)" : "var(--color-accent)",
        }}
      >
        {isUser ? "EC" : "M"}
      </div>
      <div
        style={{
          background: isUser ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.03)",
          border: isUser ? "1px solid rgba(16,185,129,0.2)" : "var(--hairline)",
          padding: "12px 16px",
          maxWidth: "78%",
          fontSize: 14,
          lineHeight: 1.55,
          color: "var(--color-text)",
        }}
      >
        {text}
        {typing && (
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 14,
              marginLeft: 2,
              background: "var(--color-accent)",
              verticalAlign: "middle",
              animation: "blink 1s steps(1) infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}

export function DemoTerminal() {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (step >= DEMO_SCRIPT.length) {
      setDone(true);
      return;
    }
    const target = DEMO_SCRIPT[step].text;
    let i = 0;
    setTyped("");
    const speed = DEMO_SCRIPT[step].role === "user" ? 28 : 18;
    const t = setInterval(() => {
      i++;
      setTyped(target.slice(0, i));
      if (i >= target.length) {
        clearInterval(t);
        setTimeout(() => setStep((s) => s + 1), 700);
      }
    }, speed);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => {
        setDone(false);
        setStep(0);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [done]);

  return (
    <div
      className="glass"
      style={{
        padding: 4,
        boxShadow: "var(--shadow-card)",
        transform: "perspective(1400px) rotateY(-4deg) rotateX(2deg)",
        transformOrigin: "center",
      }}
    >
      <div
        className="mono"
        style={{
          background: "var(--color-bg)",
          opacity: 0.6,
          padding: "14px 18px",
          borderBottom: "var(--hairline)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 11,
          color: "var(--color-muted)",
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent)" }} />
        executive-mentor / live session · 02:14
        <span style={{ marginLeft: "auto" }}>encrypted</span>
      </div>
      <div style={{ padding: "24px 22px", minHeight: 360, display: "flex", flexDirection: "column", gap: 18 }}>
        {DEMO_SCRIPT.slice(0, step).map((m, i) => (
          <DemoBubble key={i} {...m} />
        ))}
        {step < DEMO_SCRIPT.length && <DemoBubble role={DEMO_SCRIPT[step].role} text={typed} typing />}
      </div>
    </div>
  );
}
