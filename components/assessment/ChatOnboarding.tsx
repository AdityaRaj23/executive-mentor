"use client";
import { useEffect, useRef, useState } from "react";
import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";
import { getOnboardingQuestions } from "@/data/questions";
import type { OnboardingTurn } from "@/lib/assessmentScoring";

const QS = getOnboardingQuestions();
const GREETING =
  "Hi, I'm Arya. Before the assessment begins, I'd like to get to know you a little — ten quick questions, no wrong answers. Ready?";

function Bubble({ who, children }: { who: "arya" | "user"; children: string }) {
  const isUser = who === "user";
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "78%",
          padding: "12px 16px",
          borderRadius: "var(--radius)",
          fontSize: 15,
          lineHeight: 1.55,
          background: isUser ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)",
          border: isUser ? "1px solid rgba(16,185,129,0.35)" : "1px solid rgba(255,255,255,0.08)",
          color: "var(--color-text)",
          whiteSpace: "pre-wrap",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function ChatOnboarding({
  onComplete,
}: {
  onComplete: (turns: OnboardingTurn[], profile: Record<string, unknown> | null) => void;
}) {
  const [turns, setTurns] = useState<OnboardingTurn[]>([]);
  const [text, setText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const idx = turns.length;
  const current = QS[idx];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [idx, extracting]);

  const send = async () => {
    if (!text.trim() || !current || extracting) return;
    const next: OnboardingTurn[] = [
      ...turns,
      { id: current.id, question: current.question, answer: text.trim() },
    ];
    setTurns(next);
    setText("");

    if (next.length === QS.length) {
      setExtracting(true);
      let profile: Record<string, unknown> | null = null;
      try {
        const res = await fetch("/api/assessment/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ turns: next }),
        });
        if (res.ok) {
          const data = (await res.json()) as { profile?: Record<string, unknown> };
          profile = data.profile ?? null;
        }
      } catch {
        // proceed without an extracted profile
      }
      onComplete(next, profile);
    }
  };

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "40px 32px 32px",
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 0.5s ease",
      }}
    >
      <Kicker accent>
        Module 1 · Conversational onboarding · {Math.min(idx + 1, QS.length)} of {QS.length}
      </Kicker>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, marginTop: 28, overflowY: "auto" }}>
        <Bubble who="arya">{GREETING}</Bubble>
        {turns.map((t) => (
          <div key={t.id} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Bubble who="arya">{t.question}</Bubble>
            <Bubble who="user">{t.answer}</Bubble>
          </div>
        ))}
        {current && !extracting && <Bubble who="arya">{current.question}</Bubble>}
        {extracting && (
          <>
            <Bubble who="arya">That&apos;s everything I need. Give me a moment to read you in…</Bubble>
            <div className="glass shimmer" style={{ height: 56 }} />
          </>
        )}
        <div ref={endRef} />
      </div>

      {!extracting && (
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Type your answer…"
            autoFocus
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "var(--radius)",
              padding: "14px 16px",
              fontSize: 15,
              fontFamily: "var(--font-body)",
              color: "var(--color-text)",
              outline: "none",
            }}
          />
          <CTA size="sm" icon="arrowRight" onClick={send} disabled={!text.trim()}>
            Send
          </CTA>
        </div>
      )}
    </div>
  );
}
