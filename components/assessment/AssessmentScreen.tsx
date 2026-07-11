"use client";
import { useEffect, useMemo, useState } from "react";
import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";
import { getAssessmentQuestions, MODULES, type ModuleId } from "@/data/questions";
import { scoreAssessment, type OnboardingTurn } from "@/lib/assessmentScoring";
import { load, remove, save } from "@/lib/storage";
import { ChatOnboarding } from "./ChatOnboarding";
import { INITIAL_RUNNER_STATE, ModuleRunner, type RunnerState } from "./ModuleRunner";
import { ResultsDashboard } from "./ResultsDashboard";

const STORE_KEY = "em.assessment.v1";

type Stage = "intro" | "chat" | "questions" | "results";

interface PersistedState {
  stage: Stage;
  turns: OnboardingTurn[];
  profile: Record<string, unknown> | null;
  runner: RunnerState;
}

function Intro({ onBegin }: { onBegin: () => void }) {
  const moduleIds = Object.keys(MODULES).map(Number) as ModuleId[];
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
      <Kicker accent>Full assessment · 7 modules · ~35 minutes</Kicker>
      <h1
        className="h-serif"
        style={{ fontSize: "clamp(36px, 5vw, 54px)", lineHeight: 1.1, margin: "20px 0 16px", fontWeight: 500 }}
      >
        Who you are, <em>measured properly.</em>
      </h1>
      <p style={{ fontSize: 15, color: "var(--color-muted)", maxWidth: 560, lineHeight: 1.6, marginBottom: 32 }}>
        A conversation with Arya, then six short modules — aptitude, interests, personality, pressure, learning
        style, and values. Your progress saves automatically, so you can leave and come back.
      </p>
      <div style={{ display: "grid", gap: 8, marginBottom: 40 }}>
        {moduleIds.map((id) => (
          <div key={id} style={{ display: "flex", gap: 14, alignItems: "baseline", fontSize: 14 }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--color-accent)", flexShrink: 0 }}>
              0{id}
            </span>
            <span>{MODULES[id].name}</span>
            <span style={{ color: "var(--color-muted)", fontSize: 12 }}>{MODULES[id].count} questions</span>
          </div>
        ))}
      </div>
      <div>
        <CTA icon="arrowRight" onClick={onBegin}>
          Start with Arya
        </CTA>
      </div>
    </div>
  );
}

export default function AssessmentScreen() {
  // Rendered client-only (dynamic ssr:false), so reading storage in the lazy
  // initializer is safe. A "chat" stage is not resumable mid-conversation —
  // restart it from the intro instead.
  const [stage, setStage] = useState<Stage>(() => {
    const stored = load<Partial<PersistedState>>(STORE_KEY, {});
    const s = stored.stage;
    if (!s || s === "chat") return "intro";
    // A persisted qIndex past the end would leave the runner with nothing to
    // render — treat that state as a finished assessment.
    if (s === "questions" && (stored.runner?.qIndex ?? 0) >= getAssessmentQuestions().length) {
      return "results";
    }
    return s;
  });
  const [turns, setTurns] = useState<OnboardingTurn[]>(
    () => load<Partial<PersistedState>>(STORE_KEY, {}).turns ?? [],
  );
  const [profile, setProfile] = useState<Record<string, unknown> | null>(
    () => load<Partial<PersistedState>>(STORE_KEY, {}).profile ?? null,
  );
  const [runner, setRunner] = useState<RunnerState>(
    () => load<Partial<PersistedState>>(STORE_KEY, {}).runner ?? INITIAL_RUNNER_STATE,
  );

  useEffect(() => {
    save<PersistedState>(STORE_KEY, { stage, turns, profile, runner });
  }, [stage, turns, profile, runner]);

  const result = useMemo(
    () => (stage === "results" ? scoreAssessment(runner) : null),
    [stage, runner],
  );

  const reset = () => {
    if (!window.confirm("Restart the full assessment from the beginning?")) return;
    remove(STORE_KEY);
    setStage("intro");
    setTurns([]);
    setProfile(null);
    setRunner(INITIAL_RUNNER_STATE);
  };

  if (stage === "intro") {
    return <Intro onBegin={() => setStage("chat")} />;
  }

  if (stage === "chat") {
    return (
      <ChatOnboarding
        onComplete={(t, p) => {
          setTurns(t);
          setProfile(p);
          setStage("questions");
        }}
      />
    );
  }

  if (stage === "questions") {
    return (
      <ModuleRunner
        initial={runner}
        onProgress={setRunner}
        onComplete={(s) => {
          setRunner(s);
          setStage("results");
        }}
      />
    );
  }

  return result ? <ResultsDashboard result={result} onRetake={reset} /> : null;
}
