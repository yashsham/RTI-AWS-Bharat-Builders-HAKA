"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Send, FileText, Check, AlertCircle } from "lucide-react";
import { ExampleChips } from "./ExampleChips";
import { DraftOptions } from "../../lib/types";

interface ComposerProps {
  onSubmit: (query: string, options: DraftOptions) => void;
  isLoading?: boolean;
}

const INDIAN_STATES = [
  "Central / All India",
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Delhi (NCT)",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal"
];

export function Composer({ onSubmit, isLoading }: ComposerProps) {
  const [query, setQuery] = useState("");
  const [selectedState, setSelectedState] = useState("Central / All India");
  const [isBpl, setIsBpl] = useState(false);
  const [bplCardNo, setBplCardNo] = useState("");

  const charCount = query.length;
  const isValid = charCount >= 10 && charCount <= 2000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    onSubmit(query, {
      state: selectedState,
      applicant_is_bpl: isBpl,
      bpl_card_no: bplCardNo.trim() || undefined,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative rounded-2xl border border-[var(--border-paper)] bg-[var(--card-paper)] p-4 sm:p-5 shadow-sm focus-within:border-[var(--accent-indigo)] focus-within:ring-2 focus-within:ring-[var(--accent-indigo)]/10 transition-all">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            placeholder="Describe your issue or what information you need from the government... (e.g., 'The pothole outside my house was repaired last year but broke again. Who approved the contractor and what was the budget?')"
            rows={4}
            className="w-full resize-none bg-transparent text-base sm:text-lg text-[var(--text-ink)] placeholder-[var(--text-muted)]/60 focus:outline-none"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--border-paper)]/60">
            <div className="flex items-center gap-4 text-xs">
              <span className={`font-mono ${charCount > 2000 ? "text-red-500" : "text-[var(--text-muted)]"}`}>
                {charCount}/2000 chars
              </span>

              {charCount > 0 && charCount < 10 && (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Please type at least 10 characters
                </span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!isValid || isLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent-indigo)] text-white font-medium text-sm shadow-md hover:bg-[var(--accent-indigo)]/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>{isLoading ? "Analyzing Legal Corpus..." : "Draft My RTI Application"}</span>
            </motion.button>
          </div>
        </div>

        {/* Options Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-3 text-xs">
            <label className="text-[var(--text-muted)] font-medium">State Jurisdiction:</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              disabled={isLoading}
              className="px-2.5 py-1.5 rounded-lg border border-[var(--border-paper)] bg-[var(--card-paper)] text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-indigo)]"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[var(--text-ink)]">
              <input
                type="checkbox"
                checked={isBpl}
                onChange={(e) => setIsBpl(e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 rounded border-[var(--border-paper)] text-[var(--accent-saffron)] focus:ring-[var(--accent-saffron)]"
              />
              <span className="font-medium">Below Poverty Line (BPL) - Fee Exempt</span>
            </label>

            {isBpl && (
              <input
                type="text"
                value={bplCardNo}
                onChange={(e) => setBplCardNo(e.target.value)}
                placeholder="BPL Card No (Optional)"
                className="px-2 py-1 rounded-md border border-[var(--border-paper)] bg-[var(--card-paper)] text-xs text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-indigo)]"
              />
            )}
          </div>
        </div>

        <ExampleChips onSelect={(q) => setQuery(q)} disabled={isLoading} />
      </form>
    </div>
  );
}
