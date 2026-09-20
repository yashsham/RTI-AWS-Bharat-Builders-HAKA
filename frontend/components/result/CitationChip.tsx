"use client";

import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { Citation } from "../../lib/types";

interface CitationChipProps {
  citationId: string;
  citations: Citation[];
  onSelectCitation: (citation: Citation) => void;
}

export function CitationChip({ citationId, citations, onSelectCitation }: CitationChipProps) {
  const found = citations.find((c) => c.id === citationId);
  const label = found
    ? `§${found.section}${found.sub ? `(${found.sub})` : ""}`
    : citationId;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (found) {
      onSelectCitation(found);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded-md bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)] border border-[var(--accent-indigo)]/20 font-semibold hover:bg-[var(--accent-indigo)] hover:text-white transition-all cursor-pointer shadow-2xs"
      title={found ? found.title : "View statutory clause"}
    >
      <BookOpen className="h-3 w-3" />
      <span>{label}</span>
    </motion.button>
  );
}
