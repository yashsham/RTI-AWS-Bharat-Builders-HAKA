"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "sonner";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Composer } from "../components/composer/Composer";
import { StepTimeline } from "../components/agent/StepTimeline";
import { StreamText } from "../components/agent/StreamText";
import { LetterCard } from "../components/result/LetterCard";
import { ExplanationList } from "../components/result/ExplanationList";
import { TimelineTrack } from "../components/result/TimelineTrack";
import { AppealPlan } from "../components/result/AppealPlan";
import { UnsuitableCard } from "../components/result/UnsuitableCard";
import { CitationSheet } from "../components/result/CitationSheet";
import { useRtiStream } from "../hooks/useRtiStream";
import { Citation, DraftOptions } from "../lib/types";

export default function Home() {
  const { status, steps, tokens, result, error, start, reset } = useRtiStream();
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [activeTab, setActiveTab] = useState<"explanations" | "timeline" | "appeal">("explanations");

  const handleComposerSubmit = (query: string, options: DraftOptions) => {
    start(query, options);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-paper)] text-[var(--text-ink)] selection:bg-[var(--accent-indigo)]/20">
      <Toaster position="top-right" richColors />
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)] text-xs font-semibold tracking-wide border border-[var(--accent-indigo)]/20"
          >
            <span>Verified Legal Corpus • RTI Act 2005</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl font-bold tracking-tight leading-tight"
          >
            Ask the government.<br />
            <span className="italic font-normal text-[var(--accent-indigo)]">In the right words.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed"
          >
            Describe your problem in plain language. RTIKit retrieves verified statutory clauses, drafts a ready-to-file application, and lays out your statutory 30-day timeline.
          </motion.p>
        </div>

        {/* Query Composer */}
        <Composer onSubmit={handleComposerSubmit} isLoading={status === "running"} />

        {/* Error Feedback */}
        {error && (
          <div className="max-w-3xl mx-auto p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={reset} className="font-semibold underline text-xs">Try again</button>
          </div>
        )}

        {/* Live Agent Execution Timeline & Reasoning Stream */}
        <StepTimeline steps={steps} />
        <StreamText tokens={tokens} />

        {/* Results View */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8 pt-4 border-t border-[var(--border-paper)]"
            >
              {!result.suitable_for_rti ? (
                <UnsuitableCard
                  result={result}
                  onSelectCitation={(c) => setSelectedCitation(c)}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Formal RTI Letter (7 cols) */}
                  <div className="lg:col-span-7">
                    {result.application && (
                      <LetterCard application={result.application} />
                    )}
                  </div>

                  {/* Right Column: Legal Proofs, Timeline, Appeal (5 cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Authority Summary Card */}
                    <div className="p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--card-paper)] shadow-2xs space-y-2">
                      <span className="font-mono text-[10px] uppercase font-bold text-[var(--accent-indigo)] tracking-wider">
                        Target Public Authority
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[var(--text-ink)]">
                        {result.authority.name}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)]">
                        Department: <span className="font-medium text-[var(--text-ink)]">{result.authority.department}</span>
                      </p>
                      {result.authority.note && (
                        <p className="text-xs text-[var(--text-muted)] italic pt-2 border-t border-[var(--border-paper)]">
                          {result.authority.note}
                        </p>
                      )}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-[var(--border-paper)] text-sm font-medium gap-6">
                      <button
                        onClick={() => setActiveTab("explanations")}
                        className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                          activeTab === "explanations"
                            ? "border-[var(--accent-indigo)] text-[var(--accent-indigo)] font-semibold"
                            : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-ink)]"
                        }`}
                      >
                        Legal Guarantees ({result.explanations.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("timeline")}
                        className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                          activeTab === "timeline"
                            ? "border-[var(--accent-indigo)] text-[var(--accent-indigo)] font-semibold"
                            : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-ink)]"
                        }`}
                      >
                        30-Day Timeline
                      </button>
                      <button
                        onClick={() => setActiveTab("appeal")}
                        className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                          activeTab === "appeal"
                            ? "border-[var(--accent-indigo)] text-[var(--accent-indigo)] font-semibold"
                            : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-ink)]"
                        }`}
                      >
                        Appeal Roadmap
                      </button>
                    </div>

                    {/* Tab Panels */}
                    <div>
                      {activeTab === "explanations" && (
                        <ExplanationList
                          explanations={result.explanations}
                          citations={result.citations}
                          onSelectCitation={(c) => setSelectedCitation(c)}
                        />
                      )}
                      {activeTab === "timeline" && (
                        <TimelineTrack
                          timeline={result.timeline}
                          citations={result.citations}
                          onSelectCitation={(c) => setSelectedCitation(c)}
                        />
                      )}
                      {activeTab === "appeal" && (
                        <AppealPlan
                          appealPlan={result.appeal_plan}
                          citations={result.citations}
                          onSelectCitation={(c) => setSelectedCitation(c)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      {/* Verbatim Citation Side Sheet */}
      <CitationSheet
        citation={selectedCitation}
        onClose={() => setSelectedCitation(null)}
      />
    </div>
  );
}
