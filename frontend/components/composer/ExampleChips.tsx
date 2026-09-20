"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface ExampleChipsProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

const EXAMPLES = [
  {
    title: "Pothole / Road Repair",
    query: "The road outside my house was repaired last year but the pothole is back. Who approved the work, and what was the budget?",
  },
  {
    title: "Pending Scholarship",
    query: "My college scholarship application has been pending for 8 months without any reason given. Why?",
  },
  {
    title: "Ration Shop Denials",
    query: "The local fair price ration shop owner is denying grain allocation claiming stock is empty for the third month.",
  },
  {
    title: "Police FIR Status",
    query: "I filed a complaint at the local police station 3 weeks ago regarding theft, but no update or FIR copy has been given.",
  },
];

export function ExampleChips({ onSelect, disabled }: ExampleChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="text-xs font-medium text-[var(--text-muted)] flex items-center gap-1 mr-1">
        <Sparkles className="h-3 w-3 text-[var(--accent-saffron)]" />
        Examples:
      </span>
      {EXAMPLES.map((ex, idx) => (
        <motion.button
          key={idx}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(ex.query)}
          className="text-xs px-3 py-1.5 rounded-full bg-[var(--card-paper)] border border-[var(--border-paper)] text-[var(--text-ink)] hover:border-[var(--accent-indigo)] hover:text-[var(--accent-indigo)] shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
        >
          {ex.title}
        </motion.button>
      ))}
    </div>
  );
}
