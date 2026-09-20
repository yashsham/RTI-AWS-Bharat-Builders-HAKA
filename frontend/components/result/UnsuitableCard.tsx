"use client";

import { motion } from "motion/react";
import { AlertCircle, ExternalLink, HelpCircle, ShieldAlert } from "lucide-react";
import { RTIResult, Citation } from "../../lib/types";
import { CitationChip } from "./CitationChip";

interface UnsuitableCardProps {
  result: RTIResult;
  onSelectCitation: (citation: Citation) => void;
}

export function UnsuitableCard({ result, onSelectCitation }: UnsuitableCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-3xl mx-auto my-8 p-6 sm:p-8 rounded-2xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm space-y-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-serif text-xl font-bold text-[var(--text-ink)]">
            This may not be an RTI Matter
          </h3>
          <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">
            The Right to Information Act 2005 covers existing public records. It cannot mandate action on personal grievances or access exempt security records.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[var(--card-paper)] border border-[var(--border-paper)] space-y-2 text-xs">
        <span className="font-semibold text-[var(--text-ink)] uppercase tracking-wider text-[10px]">
          Statutory Reason:
        </span>
        <p className="text-[var(--text-ink)] leading-relaxed">
          {result.unsuitable_reason || "Request falls outside Section 2(f) record access scope or is exempt under Section 24."}
        </p>
      </div>

      {/* Suggested Alternative */}
      <div className="pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[var(--text-ink)]">
          <HelpCircle className="h-4 w-4 text-[var(--accent-indigo)]" />
          <span>Recommended Alternative: File a formal grievance on CPGRAMS</span>
        </div>

        <a
          href="https://pgportal.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent-indigo)] text-white text-xs font-medium shadow-2xs hover:bg-[var(--accent-indigo)]/90 transition-all"
        >
          <span>Visit CPGRAMS Portal</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </motion.div>
  );
}
