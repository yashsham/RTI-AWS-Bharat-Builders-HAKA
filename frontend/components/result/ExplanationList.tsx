"use client";

import { Scale, CheckCircle2 } from "lucide-react";
import { LegalExplanation, Citation } from "../../lib/types";
import { CitationChip } from "./CitationChip";

interface ExplanationListProps {
  explanations: LegalExplanation[];
  citations: Citation[];
  onSelectCitation: (citation: Citation) => void;
}

export function ExplanationList({ explanations, citations, onSelectCitation }: ExplanationListProps) {
  if (explanations.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Scale className="h-4 w-4 text-[var(--accent-indigo)]" />
        <h3 className="font-serif text-lg font-bold text-[var(--text-ink)]">
          Why This Works (Statutory Guarantees)
        </h3>
      </div>

      <div className="space-y-3">
        {explanations.map((exp, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[var(--card-paper)] border border-[var(--card-border)] shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-sm text-[var(--text-ink)] flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[var(--accent-green)]" />
                {exp.point}
              </span>

              <div className="flex flex-wrap gap-1">
                {exp.citation_ids.map((cid) => (
                  <CitationChip
                    key={cid}
                    citationId={cid}
                    citations={citations}
                    onSelectCitation={onSelectCitation}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-5">
              {exp.plain_language}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
