"use client";

import { Reveal, CountUp } from "@/components/shared/reveal";

const STATS = [
  { to: 23, suffix: "+", label: "Domains covered", sub: "AI · SaaS · Security · Agents" },
  { to: 5, suffix: "", label: "Impact scores", sub: "per generated idea", decimals: 0 },
  { to: 7, suffix: "", label: "Vibe platforms", sub: "Lovable · Bolt · Cursor · v0" },
  { to: 100, suffix: "%", label: "Free-tier path", sub: "no paid-only services" },
];

export function StatBand() {
  return (
    <section className="relative w-full">
      <Reveal>
        <div className="glass-strong grid grid-cols-2 gap-px overflow-hidden rounded-3xl md:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="relative flex flex-col items-center justify-center gap-1 px-4 py-8 text-center md:py-10"
            >
              <span className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                <CountUp to={s.to} suffix={s.suffix} decimals={s.decimals} />
              </span>
              <span className="mt-1 text-sm font-medium text-slate-200">{s.label}</span>
              <span className="text-[11px] text-slate-500">{s.sub}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
