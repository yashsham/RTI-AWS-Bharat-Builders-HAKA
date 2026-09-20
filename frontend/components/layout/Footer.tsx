"use client";

import { ShieldCheck, Scale, Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border-paper)] bg-[var(--mono-bg)]/40 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3 text-[var(--accent-indigo)] font-semibold">
              <ShieldCheck className="h-5 w-5 text-[var(--accent-green)]" />
              <span>Verified Legal Corpus</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Every statutory claim, timeline, and fee exemption comes strictly from official section text of the Right to Information Act 2005. Zero legal hallucination.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 text-[var(--accent-indigo)] font-semibold">
              <Cpu className="h-5 w-5 text-[var(--accent-saffron)]" />
              <span>Strands Agents & Amazon Bedrock</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Powered by AWS open-source Strands Agents SDK and Amazon Bedrock Claude models, delivering agentic tool execution with live step-by-step transparency.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 text-[var(--accent-indigo)] font-semibold">
              <Scale className="h-5 w-5 text-[var(--accent-indigo)]" />
              <span>Important Disclaimer</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              RTIKit generates information requests based on the RTI Act 2005. It is an educational citizen tool and does not constitute formal legal representation.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border-paper)] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[var(--text-muted)]">
          <div>
            RTIKit © 2026 • Built for citizens and open governance.
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono">RTI Act 2005 Corpus v1.0</span>
            <span>•</span>
            <span className="font-mono">AWS Bedrock Powered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
