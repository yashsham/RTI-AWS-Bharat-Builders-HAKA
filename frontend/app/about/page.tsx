"use client";

import Link from "next/link";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { ShieldCheck, Scale, Cpu, FileText, ArrowLeft, ExternalLink } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-paper)] text-[var(--text-ink)]">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-indigo)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to RTI Generator</span>
        </Link>

        <div className="space-y-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
            The Trust Principle & Architecture
          </h1>
          <p className="text-lg text-[var(--text-muted)] leading-relaxed">
            India's Right to Information Act 2005 gives every citizen the right to inspect public records. RTIKit ensures your application is legally sound and backed by verbatim statutory clauses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="p-6 rounded-2xl border border-[var(--border-paper)] bg-[var(--card-paper)] shadow-2xs space-y-3">
            <ShieldCheck className="h-8 w-8 text-[var(--accent-green)]" />
            <h3 className="font-serif text-xl font-bold">Verified, Not Hallucinated</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              The AI model is strictly prohibited from generating legal rules from memory. Every statutory claim must be retrieved from our verbatim gazette corpus, exposing citation chips directly in the UI.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[var(--border-paper)] bg-[var(--card-paper)] shadow-2xs space-y-3">
            <Cpu className="h-8 w-8 text-[var(--accent-saffron)]" />
            <h3 className="font-serif text-xl font-bold">AWS & Strands Agent SDK</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Built on the open-source Strands Agents SDK and Amazon Bedrock Claude models, utilizing tools for authority identification, legal corpus retrieval, and application drafting.
            </p>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-[var(--mono-bg)]/60 border border-[var(--border-paper)] space-y-4">
          <h3 className="font-serif text-2xl font-bold">Key Statutory Protections</h3>
          <ul className="space-y-3 text-sm leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-mono text-xs font-bold text-[var(--accent-indigo)] shrink-0">Sec 6(2):</span>
              <span><strong>No reason required:</strong> Citizens do not need to explain why they are requesting information.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-xs font-bold text-[var(--accent-indigo)] shrink-0">Sec 7(1):</span>
              <span><strong>30-Day Deadline:</strong> PIOs must respond within 30 days (or 48 hours for life and liberty).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-xs font-bold text-[var(--accent-indigo)] shrink-0">Sec 7(5):</span>
              <span><strong>Fee Exemption:</strong> Below Poverty Line (BPL) applicants are exempt from application fees.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-xs font-bold text-[var(--accent-indigo)] shrink-0">Sec 19(1):</span>
              <span><strong>First Appeal:</strong> Aggrieved citizens can appeal to a senior officer within 30 days.</span>
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
