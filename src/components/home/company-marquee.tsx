"use client";

import { COMPANY_STYLES } from "@/lib/constants";

/** Infinite, seamless marquee of target company names (Apple-style logo strip). */
export function CompanyMarquee() {
  const items = [...COMPANY_STYLES, ...COMPANY_STYLES];
  return (
    <div className="group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="marquee gap-3">
        {items.map((c, i) => (
          <span
            key={`${c}-${i}`}
            className="whitespace-nowrap rounded-full border border-white/8 bg-white/[0.03] px-5 py-2 font-display text-sm font-medium tracking-tight text-slate-400 transition-colors hover:border-white/20 hover:text-white"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
