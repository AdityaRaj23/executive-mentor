"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";
import { getAssessmentQuestions, MODULES, type ModuleId } from "@/data/questions";
import { APTITUDE_TIME_LIMIT_SECONDS } from "@/lib/assessmentScoring";

const QS = getAssessmentQuestions();

export interface RunnerState {
  qIndex: number;
  mcq: Record<number, string>;
  sliders: Record<number, number>;
  aptitudeSeconds: Record<number, number>;
}

export const INITIAL_RUNNER_STATE: RunnerState = {
  qIndex: 0,
  mcq: {},
  sliders: {},
  aptitudeSeconds: {},
};

const MODULE_BLURBS: Partial<Record<ModuleId, string>> = {
  2: `Timed section: ${APTITUDE_TIME_LIMIT_SECONDS} seconds per question. Answering correctly in under 10 seconds earns a speed bonus. If time runs out, we move on.`,
  3: "No right answers here — pick whichever option you would genuinely rather do.",
  4: "Answer honestly, not aspirationally. The honest answer is the useful one.",
  5: "Slide to wherever feels true. This section is private and drives no judgement — only support.",
  6: "How do you actually learn best? Pick what you really do, not what teachers recommend.",
  7: "Hard trade-offs on purpose. Choosing what you'd give up last reveals what you value most.",
};

function ModuleIntro({ moduleId, onBegin }: { moduleId: ModuleId; onBegin: () => void }) {
  const meta = MODULES[moduleId];
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
      <Kicker accent>Module {moduleId} of 7</Kicker>
      <div
        className="h-serif"
        style={{
          fontSize: "clamp(32px, 4.5vw, 48px)",
          lineHeight: 1.15,
          fontWeight: 500,
          fontStyle: "italic",
          margin: "20px 0 16px",
        }}
      >
        {meta.name}
      </div>
      <p style={{ fontSize: 15, color: "var(--color-muted)", lineHeight: 1.6, maxWidth: 560, marginBottom: 32 }}>
        {meta.count} questions. {MODULE_BLURBS[moduleId] ?? ""}
      </p>
      <div>
        <CTA icon="arrowRight" onClick={onBegin}>
          Begin
        </CTA>
      </div>
    </div>
  );
}

export function ModuleRunner({
  initial,
  onProgress,
  onComplete,
}: {
  initial: RunnerState;
  onProgress: (s: RunnerState) => void;
  onComplete: (s: RunnerState) => void;
}) {
  const [state, setState] = useState<RunnerState>(initial);
  const [introFor, setIntroFor] = useState<ModuleId | null>(QS[initial.qIndex]?.module ?? null);
  const [remaining, setRemaining] = useState(APTITUDE_TIME_LIMIT_SECONDS);
  const [sliderVal, setSliderVal] = useState(50);
  const [sliderTouched, setSliderTouched] = useState(false);
  const startRef = useRef(0);

  const q = QS[state.qIndex];
  const timed = Boolean(q && q.module === 2 && introFor === null);

  const advance = useCallback(
    (key: string | null, slider?: number) => {
      if (!q) return;
      const next: RunnerState = {
        qIndex: state.qIndex + 1,
        mcq: key ? { ...state.mcq, [q.id]: key } : state.mcq,
        sliders: typeof slider === "number" ? { ...state.sliders, [q.id]: slider } : state.sliders,
        aptitudeSeconds:
          q.module === 2
            ? {
                ...state.aptitudeSeconds,
                [q.id]: Math.min(
                  APTITUDE_TIME_LIMIT_SECONDS,
                  Math.round((Date.now() - startRef.current) / 1000),
                ),
              }
            : state.aptitudeSeconds,
      };
      if (next.qIndex >= QS.length) {
        onComplete(next);
        return;
      }
      setState(next);
      onProgress(next);
      setSliderVal(50);
      setSliderTouched(false);
      setRemaining(APTITUDE_TIME_LIMIT_SECONDS);
      startRef.current = Date.now();
      const nq = QS[next.qIndex];
      if (nq.module !== q.module) setIntroFor(nq.module);
    },
    [q, state, onComplete, onProgress],
  );

  const advanceRef = useRef(advance);
  useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  useEffect(() => {
    if (!timed) return;
    const deadline = setTimeout(
      () => advanceRef.current(null),
      APTITUDE_TIME_LIMIT_SECONDS * 1000,
    );
    const tick = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => {
      clearTimeout(deadline);
      clearInterval(tick);
    };
  }, [state.qIndex, timed]);

  if (!q) return null;

  if (introFor !== null) {
    return (
      <ModuleIntro
        moduleId={introFor}
        onBegin={() => {
          setIntroFor(null);
          setRemaining(APTITUDE_TIME_LIMIT_SECONDS);
          startRef.current = Date.now();
        }}
      />
    );
  }

  const answeredCount = state.qIndex;
  const moduleQs = QS.filter((x) => x.module === q.module);
  const moduleIndex = moduleQs.findIndex((x) => x.id === q.id);

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
        animation: "fadeIn 0.4s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Kicker accent>
          {q.module_name} · {moduleIndex + 1} of {moduleQs.length}
        </Kicker>
        {timed && (
          <span
            className="mono"
            style={{
              fontSize: 13,
              color: remaining <= 10 ? "#ef4444" : "var(--color-muted)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            0:{String(Math.max(0, remaining)).padStart(2, "0")}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 4, marginTop: 14, marginBottom: 40 }}>
        <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.08)" }}>
          <div
            style={{
              width: `${(answeredCount / QS.length) * 100}%`,
              height: "100%",
              background: "var(--color-accent)",
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>

      <div
        className="h-serif"
        style={{
          fontSize: "clamp(26px, 3.6vw, 38px)",
          lineHeight: 1.2,
          fontWeight: 500,
          fontStyle: "italic",
          marginBottom: 32,
          letterSpacing: "-0.01em",
        }}
      >
        {q.question}
      </div>

      {q.type === "slider" ? (
        <>
          <input
            type="range"
            min={0}
            max={100}
            value={sliderVal}
            onChange={(e) => {
              setSliderVal(Number(e.target.value));
              setSliderTouched(true);
            }}
            style={{ width: "100%", accentColor: "var(--color-accent)" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 24,
              marginTop: 12,
              fontSize: 13,
              color: "var(--color-muted)",
              lineHeight: 1.5,
            }}
          >
            <span style={{ maxWidth: "45%" }}>{q.anchor_lo}</span>
            <span style={{ maxWidth: "45%", textAlign: "right" }}>{q.anchor_hi}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
            <span className="mono" style={{ fontSize: 22, color: "var(--color-accent)" }}>
              {sliderVal}
            </span>
            <CTA size="sm" icon="arrowRight" onClick={() => advance(null, sliderVal)} disabled={!sliderTouched}>
              Continue
            </CTA>
          </div>
        </>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
          {q.options?.map((opt) => (
            <button
              key={opt.key}
              onClick={() => advance(opt.key)}
              style={{
                textAlign: "left",
                padding: "16px 20px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "var(--radius)",
                color: "var(--color-text)",
                fontFamily: "inherit",
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.18s",
                display: "flex",
                gap: 14,
                alignItems: "baseline",
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
              <span className="mono" style={{ fontSize: 12, color: "var(--color-muted)", flexShrink: 0 }}>
                {opt.key}
              </span>
              {opt.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
