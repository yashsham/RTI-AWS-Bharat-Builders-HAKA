"use client";

import { motion, AnimatePresence } from "motion/react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { StepEvent } from "../../lib/types";

interface StepTimelineProps {
  steps: StepEvent[];
}

export function StepTimeline({ steps }: StepTimelineProps) {
  if (steps.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto my-6 p-5 rounded-2xl border border-[var(--border-paper)] bg-[var(--card-paper)] shadow-sm">
      <h3 className="text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)] mb-4 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-saffron)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-saffron)]"></span>
        </span>
        Strands Agent Execution Steps
      </h3>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-3 text-sm"
            >
              <div className="mt-0.5 shrink-0">
                {step.status === "running" && (
                  <Loader2 className="h-4 w-4 animate-spin text-[var(--accent-saffron)]" />
                )}
                {step.status === "done" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
                    <CheckCircle2 className="h-4 w-4 text-[var(--accent-green)]" />
                  </motion.div>
                )}
                {step.status === "error" && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--mono-bg)] text-[var(--text-muted)] border border-[var(--border-paper)]">
                    {step.tool}
                  </span>
                  <span className="font-medium text-[var(--text-ink)]">{step.label}</span>
                </div>
                {step.detail && (
                  <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed pl-1">
                    {step.detail}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
