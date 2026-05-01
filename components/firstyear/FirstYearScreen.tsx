"use client";
import { useEffect, useState } from "react";
import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";
import { ARCHETYPES, rankArchetypes } from "@/data/archetypes";
import { load, remove, save } from "@/lib/storage";
import type { Archetype, DiagnosticAnswers, TalentStack as TalentStackShape, ThirtyDayBrief as BriefShape } from "@/types";
import { ArchetypeDeepDive } from "./ArchetypeDeepDive";
import { Cartography } from "./Cartography";
import { Diagnostic } from "./Diagnostic";
import { TalentStack } from "./TalentStack";
import { ThirtyDayBrief } from "./ThirtyDayBrief";

const STORE_KEY = "em.firstyear.v1";

interface PersistedState {
  stage: "diagnostic" | "result";
  answers: DiagnosticAnswers;
  topMatches: Archetype[] | null;
  selectedArch: string | null;
  stack: TalentStackShape | null;
  brief: BriefShape | null;
}

function ResultHeader({ onReset }: { onReset: () => void }) {
  return (
    <header
      style={{
        marginBottom: 48,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      <div style={{ minWidth: 0, flex: "1 1 auto", maxWidth: 720 }}>
        <Kicker accent>First Year · personalized for you</Kicker>
        <h1
          className="h-serif"
          style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.05, margin: "20px 0 14px", fontWeight: 500 }}
        >
          Six paths, <em>your map.</em>
        </h1>
        <p style={{ fontSize: 15, color: "var(--color-muted)", maxWidth: 560, margin: 0, lineHeight: 1.6 }}>
          You don&apos;t need a five-year plan. You need to know which directions are alive for you, and what to do this month. Click any archetype to drill in.
        </p>
      </div>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <CTA variant="ghost" size="sm" onClick={onReset}>
          Re-take diagnostic
        </CTA>
      </div>
    </header>
  );
}

export default function FirstYearScreen() {
  const [hydrated, setHydrated] = useState(false);
  const [stage, setStage] = useState<"diagnostic" | "result">("diagnostic");
  const [answers, setAnswers] = useState<DiagnosticAnswers>({});
  const [topMatches, setTopMatches] = useState<Archetype[] | null>(null);
  const [selectedArch, setSelectedArch] = useState<string | null>(null);
  const [stack, setStack] = useState<TalentStackShape | null>(null);
  const [brief, setBrief] = useState<BriefShape | null>(null);

  useEffect(() => {
    const stored = load<Partial<PersistedState>>(STORE_KEY, {});
    if (stored.stage) setStage(stored.stage);
    if (stored.answers) setAnswers(stored.answers);
    if (stored.topMatches) setTopMatches(stored.topMatches);
    if (stored.selectedArch) setSelectedArch(stored.selectedArch);
    if (stored.stack) setStack(stored.stack);
    if (stored.brief) setBrief(stored.brief);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    save<PersistedState>(STORE_KEY, { stage, answers, topMatches, selectedArch, stack, brief });
  }, [hydrated, stage, answers, topMatches, selectedArch, stack, brief]);

  const reset = () => {
    if (!window.confirm("Restart from the diagnostic?")) return;
    remove(STORE_KEY);
    setStage("diagnostic");
    setAnswers({});
    setTopMatches(null);
    setSelectedArch(null);
    setStack(null);
    setBrief(null);
  };

  if (stage === "diagnostic") {
    return (
      <Diagnostic
        onComplete={(ans) => {
          setAnswers(ans);
          const ranked = rankArchetypes(ans);
          setTopMatches(ranked);
          setSelectedArch(ranked[0].id);
          setStage("result");
        }}
      />
    );
  }

  const archetype = ARCHETYPES.find((a) => a.id === selectedArch);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px 100px" }}>
      <ResultHeader onReset={reset} />
      {topMatches && (
        <Cartography matches={topMatches} all={ARCHETYPES} selected={selectedArch} onSelect={setSelectedArch} />
      )}
      <ArchetypeDeepDive archetype={archetype} />
      <TalentStack answers={answers} stack={stack} setStack={setStack} archetype={archetype} />
      <ThirtyDayBrief answers={answers} brief={brief} setBrief={setBrief} archetype={archetype} />
    </div>
  );
}
