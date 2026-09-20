"use client";

import { motion } from "motion/react";
import { Clock, Calendar } from "lucide-react";
import { TimelineItem, Citation } from "../../lib/types";
import { CitationChip } from "./CitationChip";

interface TimelineTrackProps {
  timeline: TimelineItem[];
  citations: Citation[];
  onSelectCitation: (citation: Citation) => void;
}

export function TimelineTrack({ timeline, citations, onSelectCitation }: TimelineTrackProps) {
  if (timeline.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-[var(--accent-saffron)]" />
        <h3 className="font-serif text-lg font-bold text-[var(--text-ink)]">
          Statutory Response Timeline
        </h3>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-paper)]">
        {timeline.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative flex items-start justify-between gap-4 p-3.5 rounded-xl bg-[var(--card-paper)] border border-[var(--card-border)] shadow-2xs"
          >
            {/* Circle Node */}
            <div className="absolute -left-[27px] top-4 h-3.5 w-3.5 rounded-full bg-[var(--accent-saffron)] border-2 border-[var(--bg-paper)] shadow-2xs" />

            <div className="space-y-1">
              <span className="font-semibold text-sm text-[var(--text-ink)] flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[var(--accent-saffron)]" />
                Day {item.days}: {item.label}
              </span>
            </div>

            <div className="flex gap-1 shrink-0">
              {item.citation_ids.map((cid) => (
                <CitationChip
                  key={cid}
                  citationId={cid}
                  citations={citations}
                  onSelectCitation={onSelectCitation}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
