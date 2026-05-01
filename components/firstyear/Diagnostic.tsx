"use client";
import { useState } from "react";
import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";
import { DIAGNOSTIC } from "@/data/archetypes";
import type { DiagnosticAnswers } from "@/types";

export function Diagnostic({ onComplete }: { onComplete: (a: DiagnosticAnswers) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswers>({});
  const [text, setText] = useState("");
  const q = DIAGNOSTIC[step];
  const isLast = step === DIAGNOSTIC.length - 1;

  const advance = (val: string) => {
    const next = { ...answers, [q.id]: val };
    setAnswers(next);
    setText("");
    if (isLast) onComplete(next);
    else setStep(step + 1);
  };

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "60px 32px",
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        animation: "fadeIn 0.5s ease",
      }}
    >
      <Kicker accent>
        First-year diagnostic · {step + 1} of {DIAGNOSTIC.length}
      </Kicker>
      <div style={{ display: "flex", gap: 4, marginTop: 14, marginBottom: 40 }}>
        {DIAGNOSTIC.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 2,
              background: i <= step ? "var(--color-accent)" : "rgba(255,255,255,0.08)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>

      <div
        className="h-serif"
        style={{
          fontSize: "clamp(32px, 4.5vw, 48px)",
          lineHeight: 1.15,
          fontWeight: 500,
          fontStyle: "italic",
          marginBottom: 32,
          letterSpacing: "-0.01em",
        }}
      >
        {q.q}
      </div>

      {q.kind === "text" ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && text.trim()) advance(text.trim());
            }}
            placeholder={q.placeholder}
            autoFocus
            rows={4}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "var(--radius)",
              padding: 18,
              fontSize: 16,
              fontFamily: "var(--font-body)",
              color: "var(--color-text)",
              outline: "none",
              resize: "none",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--color-muted)" }}>
              ⌘↵ to continue
            </span>
            <CTA size="sm" icon="arrowRight" onClick={() => text.trim() && advance(text.trim())}>
              {isLast ? "See my map" : "Continue"}
            </CTA>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: q.options && q.options.length > 4 ? "repeat(2, 1fr)" : "1fr",
            gap: 10,
          }}
        >
          {q.options?.map((opt, i) => (
            <button
              key={i}
              onClick={() => advance(opt)}
              style={{
                textAlign: "left",
                padding: "18px 22px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "var(--radius)",
                color: "var(--color-text)",
                fontFamily: "inherit",
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(16,185,129,0.08)";
                e.currentTarget.style.borderColor = "rgba(16,185,129,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
