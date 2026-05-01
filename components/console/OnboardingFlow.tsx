"use client";
import { useState } from "react";
import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";
import { ONBOARDING_QUESTIONS } from "@/data/dossier";

export function OnboardingFlow({ onDone }: { onDone: (answers: Record<string, string>) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [text, setText] = useState("");
  const q = ONBOARDING_QUESTIONS[step];
  const isLast = step === ONBOARDING_QUESTIONS.length - 1;

  const submit = () => {
    if (!text.trim()) return;
    const next = { ...answers, [q.id]: text.trim() };
    setAnswers(next);
    setText("");
    if (isLast) onDone(next);
    else setStep(step + 1);
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "80px 32px",
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        animation: "fadeIn 0.5s ease",
      }}
    >
      <div style={{ marginBottom: 40 }}>
        <Kicker accent>
          First session · {step + 1} of {ONBOARDING_QUESTIONS.length}
        </Kicker>
        <div style={{ display: "flex", gap: 4, marginTop: 14 }}>
          {ONBOARDING_QUESTIONS.map((_, i) => (
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
      </div>

      <div
        className="h-serif"
        style={{
          fontSize: 44,
          lineHeight: 1.15,
          fontWeight: 500,
          fontStyle: "italic",
          marginBottom: 32,
          letterSpacing: "-0.01em",
        }}
      >
        {q.q}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
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
          ⌘↵ to continue · Skip will use defaults
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          {step < ONBOARDING_QUESTIONS.length - 1 && (
            <CTA variant="ghost" size="sm" onClick={() => onDone({ q1: "", q2: "", q3: "" })}>
              Skip
            </CTA>
          )}
          <CTA size="sm" icon="arrowRight" onClick={submit}>
            {isLast ? "Begin session" : "Continue"}
          </CTA>
        </div>
      </div>
    </div>
  );
}
