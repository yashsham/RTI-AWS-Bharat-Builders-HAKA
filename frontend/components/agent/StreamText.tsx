"use client";

import { motion } from "motion/react";

interface StreamTextProps {
  tokens: string;
}

export function StreamText({ tokens }: StreamTextProps) {
  if (!tokens) return null;

  return (
    <div className="w-full max-w-3xl mx-auto my-4 p-4 rounded-xl bg-[var(--mono-bg)]/60 border border-[var(--border-paper)] text-sm leading-relaxed text-[var(--text-ink)] font-sans shadow-2xs">
      <div className="flex items-center gap-2 mb-1.5 text-xs text-[var(--text-muted)] font-mono">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-indigo)]" />
        Agent Live Reasoning Stream:
      </div>
      <p className="whitespace-pre-wrap font-serif text-base sm:text-lg">
        {tokens}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block ml-1 w-2 h-4 bg-[var(--accent-saffron)] align-middle rounded-xs"
        />
      </p>
    </div>
  );
}
