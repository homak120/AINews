import { cn } from '../../utils/cn';

interface BreakdownProps {
  summary: string;
  keyConcepts: string[];
  whyItMatters: string;
  topicAccent?: string;
}

export function Breakdown({ summary, keyConcepts, whyItMatters, topicAccent }: BreakdownProps) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-[11px] font-mono font-semibold tracking-[0.08em] uppercase text-slate-500 mb-3">
          Why It Matters
        </h2>
        <p className="text-sm leading-[1.8] text-slate-400">{whyItMatters}</p>
      </section>

      <section>
        <h2 className="text-[11px] font-mono font-semibold tracking-[0.08em] uppercase text-slate-500 mb-3">
          Summary
        </h2>
        <p className="text-sm leading-[1.8] text-slate-400">{summary}</p>
      </section>

      <section>
        <h2 className="text-[11px] font-mono font-semibold tracking-[0.08em] uppercase text-slate-500 mb-3">
          Key Concepts
        </h2>
        <div className="flex flex-wrap gap-2">
          {keyConcepts.map((concept) => (
            <span
              key={concept}
              className={cn(
                'text-[11px] px-3 py-1 rounded-full border',
                topicAccent ?? 'bg-violet-500/10 border-violet-500/22 text-violet-400'
              )}
            >
              {concept}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
