"use client";
import { useEffect, useRef, useState } from "react";
import { boardroom } from "@/lib/voice";
import { claude } from "@/lib/mockAI";
import { load, save, remove } from "@/lib/storage";
import { SEED_DOSSIER } from "@/data/dossier";
import type { Dossier, Message } from "@/types";
import { ChatBubble } from "./ChatBubble";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { Dossier as DossierPanel } from "./Dossier";
import { OnboardingFlow } from "./OnboardingFlow";
import { Suggestions } from "./Suggestions";
import { ThinkingIndicator } from "./ThinkingIndicator";

const STORE_KEY = "em.console.v1";

interface PersistedState {
  onboarded: boolean;
  messages: Message[];
  dossier: Dossier;
}

const INITIAL: PersistedState = {
  onboarded: false,
  messages: [
    {
      role: "ai",
      header: boardroom.welcomeHeader,
      body: boardroom.welcomeBody,
    },
  ],
  dossier: SEED_DOSSIER,
};

function AdminViewOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        top: 78,
        right: 24,
        padding: "8px 12px",
        background: "rgba(245,158,11,0.08)",
        border: "1px solid rgba(245,158,11,0.3)",
        fontSize: 11,
        color: "var(--color-amber)",
        fontFamily: "var(--font-mono)",
        maxWidth: 320,
        lineHeight: 1.5,
        zIndex: 5,
      }}
    >
      Your admin sees themes &amp; readiness — never transcripts. Below is exactly their view.
    </div>
  );
}

export default function ConsoleScreen() {
  const [hydrated, setHydrated] = useState(false);
  const [onboarded, setOnboarded] = useState<boolean>(INITIAL.onboarded);
  const [messages, setMessages] = useState<Message[]>(INITIAL.messages);
  const [dossier, setDossier] = useState<Dossier>(INITIAL.dossier);
  const [adminView, setAdminView] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = load<Partial<PersistedState>>(STORE_KEY, {});
    if (stored.onboarded) setOnboarded(true);
    if (stored.messages?.length) setMessages(stored.messages);
    if (stored.dossier) setDossier(stored.dossier);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    save(STORE_KEY, { onboarded, messages, dossier });
  }, [hydrated, onboarded, messages, dossier]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const resetSession = () => {
    if (!window.confirm("Clear this session and re-run onboarding?")) return;
    remove(STORE_KEY);
    setOnboarded(false);
    setMessages([{ role: "ai", header: boardroom.welcomeHeader, body: boardroom.welcomeBody }]);
    setDossier(SEED_DOSSIER);
  };

  const send = async (textOverride?: string) => {
    const text = textOverride ?? input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Message = { role: "user", body: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const baseSys = boardroom.sysPrompt;
      const dossierStr = JSON.stringify({
        goals: dossier.goals.map((g) => g.label),
        skills: dossier.skills,
        signals: dossier.signals,
      });
      const sys = `${baseSys}\n\nThe user is ${dossier.member}, ${dossier.role}, ${dossier.tenure}. Current dossier: ${dossierStr}\n\nIMPORTANT: After your prose response, on its own line at the very end, output a single JSON object on one line in this exact shape:\n<<<DOSSIER>>>{"skill_deltas":[{"label":"<existing skill label>","delta":<-5..+5 integer>}], "new_signal":"<short observation or null>"}<<<END>>>\n\nOnly include skills already in the dossier. Pick at most 2 deltas tied to what was discussed. The signal should be a sharp 8-12 word observation about the user revealed by THIS exchange, or null.`;
      const reply = await claude.complete({
        messages: [
          {
            role: "user",
            content: `${sys}\n\nConversation so far:\n${next
              .map((m) => `${m.role === "user" ? "User" : "M"}: ${m.body}`)
              .join("\n")}\n\nM:`,
          },
        ],
      });

      let prose = reply || "";
      let deltas: { label: string; delta: number }[] = [];
      let newSignal: string | null = null;
      const m = prose.match(/<<<DOSSIER>>>(.*?)<<<END>>>/s);
      if (m) {
        prose = prose.replace(m[0], "").trim();
        try {
          const parsed = JSON.parse(m[1].trim());
          deltas = parsed.skill_deltas || [];
          newSignal = parsed.new_signal && parsed.new_signal !== "null" ? parsed.new_signal : null;
        } catch {
          // ignore parse errors
        }
      }

      const lines = prose.trim().split(/\n\s*\n/);
      const header = lines[0]?.replace(/^\s*[#>*\-\d.]+\s*/, "").trim() || "Continuing.";
      const body = (lines.slice(1).join("\n\n") || lines[0] || "").trim();

      setMessages((prev) => [...prev, { role: "ai", header, body }]);
      setDossier((d) => {
        const newSkills = d.skills.map((s) => {
          const hit = deltas.find((x) => x.label?.toLowerCase() === s.label.toLowerCase());
          return hit ? { ...s, conf: Math.max(0, Math.min(100, s.conf + (hit.delta | 0))) } : s;
        });
        const signals = newSignal ? [newSignal, ...d.signals].slice(0, 5) : d.signals;
        return { ...d, skills: newSkills, signals };
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", header: "Connection issue.", body: "I lost the thread for a moment. Try again — I have your context." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!onboarded) {
    return (
      <OnboardingFlow
        onDone={(answers) => {
          const seed = `Onboarding answers — Target: ${answers.q1}. Avoiding: ${answers.q2}. Studying: ${answers.q3}.`;
          setMessages([
            { role: "ai", header: boardroom.welcomeHeader, body: boardroom.welcomeBody },
            { role: "user", body: seed },
          ]);
          setOnboarded(true);
          setTimeout(() => send(seed), 100);
        }}
      />
    );
  }

  return (
    <div
      style={{
        maxWidth: 1440,
        margin: "0 auto",
        padding: "24px 32px",
        display: "grid",
        gridTemplateColumns: "1fr 380px",
        gap: 24,
        height: "calc(100vh - 70px)",
      }}
    >
      <div className="glass" style={{ display: "flex", flexDirection: "column", minHeight: 0, position: "relative" }}>
        <ChatHeader adminView={adminView} setAdminView={setAdminView} onReset={resetSession} />
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "32px 40px", minHeight: 0 }}>
          {messages.length === 1 && <Suggestions onPick={(p) => send(p.title + ". " + p.body)} />}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {messages.map((msg, i) => (
              <ChatBubble key={i} {...msg} adminView={adminView} />
            ))}
            {loading && <ThinkingIndicator />}
          </div>
        </div>
        <ChatInput value={input} onChange={setInput} onSend={() => send()} disabled={loading} adminView={adminView} />
        {adminView && <AdminViewOverlay />}
      </div>

      <DossierPanel dossier={dossier} adminView={adminView} />
    </div>
  );
}
