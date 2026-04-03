import type { DateRange } from '../../types';

interface DateRangePickerProps {
  value: DateRange | null;
  onChange: (range: DateRange | null) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const start = value?.start ?? '';
  const end = value?.end ?? '';
  const isInvalid = start && end && end < start;

  const handleStart = (s: string) => {
    if (!s && !end) {
      onChange(null);
    } else {
      onChange({ start: s, end: end || s });
    }
  };

  const handleEnd = (e: string) => {
    if (!e && !start) {
      onChange(null);
    } else {
      onChange({ start: start || e, end: e });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 w-12 flex-shrink-0">
          From
        </label>
        <input
          type="date"
          value={start}
          onChange={(e) => handleStart(e.target.value)}
          className="w-full sm:w-auto bg-white/[0.07] border border-white/[0.15] rounded-lg text-slate-100 text-sm px-3 py-2 focus:outline-none focus:border-cyan-400/40 transition-colors"
        />
        <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500 w-12 flex-shrink-0">
          To
        </label>
        <input
          type="date"
          value={end}
          onChange={(e) => handleEnd(e.target.value)}
          className="w-full sm:w-auto bg-white/[0.07] border border-white/[0.15] rounded-lg text-slate-100 text-sm px-3 py-2 focus:outline-none focus:border-cyan-400/40 transition-colors"
        />
        {value && (
          <button
            onClick={() => onChange(null)}
            className="text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      {isInvalid && (
        <p className="text-xs text-red-400 font-mono">End date must be on or after start date</p>
      )}
    </div>
  );
}
