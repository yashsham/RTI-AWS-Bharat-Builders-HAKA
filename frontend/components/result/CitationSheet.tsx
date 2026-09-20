"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, ShieldCheck, BookOpen } from "lucide-react";
import { Citation } from "../../lib/types";

interface CitationSheetProps {
  citation: Citation | null;
  onClose: () => void;
}

export function CitationSheet({ citation, onClose }: CitationSheetProps) {
  if (!citation) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
        {/* Backdrop Click */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Sheet Content */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative z-10 w-full max-w-lg h-full bg-[var(--bg-paper)] border-l border-[var(--border-paper)] shadow-2xl p-6 overflow-y-auto flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-paper)] pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)]">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-mono text-xs font-semibold text-[var(--accent-indigo)] uppercase tracking-wider">
                    RTI Act 2005 Corpus
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[var(--text-ink)]">
                    Section {citation.section}{citation.sub ? `(${citation.sub})` : ""}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--mono-bg)] hover:text-[var(--text-ink)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Title */}
            <div className="mb-4">
              <h4 className="text-base font-semibold text-[var(--text-ink)]">
                {citation.title}
              </h4>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent-green)] bg-[var(--accent-green)]/10 px-2.5 py-1 rounded-full border border-[var(--accent-green)]/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Verbatim Gazette Text</span>
              </div>
            </div>

            {/* Verbatim Text Box */}
            <div className="my-6 p-4 rounded-xl bg-[var(--card-paper)] border border-[var(--border-paper)] shadow-2xs font-mono text-xs leading-relaxed text-[var(--text-ink)] whitespace-pre-wrap">
              "{citation.text}"
            </div>
          </div>

          {/* Footer Source URL */}
          <div className="pt-4 border-t border-[var(--border-paper)] flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Source: Official Gazette / India Code</span>
            <a
              href={citation.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--accent-indigo)] hover:underline font-medium"
            >
              <span>Verify on India Code</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
