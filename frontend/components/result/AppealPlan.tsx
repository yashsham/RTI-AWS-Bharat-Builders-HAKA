"use client";

import { AlertTriangle, ChevronRight } from "lucide-react";
import { AppealStage, Citation } from "../../lib/types";
import { CitationChip } from "./CitationChip";

interface AppealPlanProps {
  appealPlan: AppealStage[];
  citations: Citation[];
  onSelectCitation: (citation: Citation) => void;
}

export function AppealPlan({ appealPlan, citations, onSelectCitation }: AppealPlanProps) {
  if (appealPlan.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-[var(--accent-indigo)]" />
        <h3 className="font-serif text-lg font-bold text-[var(--text-ink)]">
          Escalation & Appeal Roadmap
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {appealPlan.map((stage, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[var(--card-paper)] border border-[var(--card-border)] shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent-indigo)]">
                {stage.stage}
              </span>
              <div className="flex gap-1">
                {stage.citation_ids.map((cid) => (
                  <CitationChip
                    key={cid}
                    citationId={cid}
                    citations={citations}
                    onSelectCitation={onSelectCitation}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-[var(--text-ink)] font-medium">
              Target Authority: <span className="text-[var(--text-muted)]">{stage.to}</span>
            </p>

            <div className="text-xs font-mono px-2.5 py-1 rounded bg-[var(--mono-bg)] text-[var(--text-ink)] inline-block">
              Window: Within {stage.deadline_days} Days
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
