"use client";

import Link from "next/link";
import { FileText, ShieldCheck, ExternalLink } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-paper)] bg-[var(--bg-paper)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-[var(--accent-indigo)]">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-indigo)] text-white shadow-sm">
            <FileText className="h-5 w-5" />
          </div>
          <span className="font-serif text-2xl tracking-tight text-[var(--text-ink)]">
            RTI<span className="text-[var(--accent-saffron)]">Kit</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <div className="hidden sm:flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[var(--mono-bg)] text-[var(--text-muted)] border border-[var(--border-paper)]">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent-green)]" />
            <span>Verified from RTI Act 2005</span>
          </div>

          <Link
            href="/about"
            className="text-[var(--text-muted)] hover:text-[var(--text-ink)] transition-colors px-3 py-1.5 rounded-md hover:bg-[var(--mono-bg)]"
          >
            How it works
          </Link>
        </nav>
      </div>
    </header>
  );
}
