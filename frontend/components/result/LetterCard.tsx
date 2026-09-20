"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Copy, Download, Printer, Check, FileText } from "lucide-react";
import { toast } from "sonner";
import { ApplicationDraft } from "../../lib/types";

interface LetterCardProps {
  application: ApplicationDraft;
}

export function LetterCard({ application }: LetterCardProps) {
  const [copied, setCopied] = useState(false);
  const [editedBody, setEditedBody] = useState(application.body_text);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedBody);
    setCopied(true);
    toast.success("RTI Application copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([editedBody], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `RTI_Application_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("RTI Application downloaded as text file.");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)]">
            <FileText className="h-4 w-4" />
          </div>
          <span className="font-serif text-base font-bold text-[var(--text-ink)]">
            Formal RTI Application Preview
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-paper)] bg-[var(--card-paper)] text-[var(--text-ink)] hover:border-[var(--accent-indigo)] hover:text-[var(--accent-indigo)] transition-colors cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[var(--accent-green)]" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-paper)] bg-[var(--card-paper)] text-[var(--text-ink)] hover:border-[var(--accent-indigo)] hover:text-[var(--accent-indigo)] transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download .txt</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-indigo)] text-white hover:bg-[var(--accent-indigo)]/90 transition-colors cursor-pointer shadow-2xs font-medium"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Application</span>
          </button>
        </div>
      </div>

      {/* Formal Letter Paper Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rti-printable-letter relative rounded-2xl border border-[var(--border-paper)] bg-white dark:bg-[#14171E] p-8 sm:p-12 shadow-lg space-y-6 text-[var(--text-ink)]"
      >
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4 flex justify-between items-start">
          <div>
            <span className="font-mono text-xs font-semibold text-[var(--accent-indigo)] uppercase tracking-wider">
              FORMAL REQUEST UNDER SECTION 6(1)
            </span>
            <h2 className="font-serif text-2xl font-bold text-[var(--text-ink)] mt-1">
              Right to Information Application
            </h2>
          </div>
          <div className="text-right text-xs font-mono text-[var(--text-muted)] hidden sm:block">
            Act Reference: RTI Act 2005<br />
            Jurisdiction: India
          </div>
        </div>

        {/* Editable Letter Body */}
        <textarea
          value={editedBody}
          onChange={(e) => setEditedBody(e.target.value)}
          rows={22}
          className="w-full resize-y font-mono text-xs sm:text-sm leading-relaxed bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-[var(--accent-indigo)]/30 rounded-lg p-2 text-[var(--text-ink)]"
        />

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 text-xs text-[var(--text-muted)] italic flex justify-between items-center">
          <span>Tip: Click inside the text area above to edit applicant details before printing or copying.</span>
          <span className="font-mono">RTIKit Verified Format</span>
        </div>
      </motion.div>
    </div>
  );
}
