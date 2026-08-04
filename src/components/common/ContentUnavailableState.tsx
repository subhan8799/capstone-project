import { Clapperboard } from 'lucide-react';

interface ContentUnavailableStateProps {
  title?: string;
  message?: string;
  compact?: boolean;
}

export function ContentUnavailableState({
  title = 'This feature is coming soon',
  message = 'Fresh content is on the way. Please check back shortly.',
  compact = false,
}: ContentUnavailableStateProps) {
  return (
    <div
      className={
        compact
          ? 'flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300'
          : 'grid min-h-48 place-items-center rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-6 py-8 text-center'
      }
      role="status"
      aria-live="polite"
    >
      <div className={compact ? 'inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10' : 'mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10'}>
        <Clapperboard className="h-5 w-5 text-brand-200" />
      </div>
      <div>
        <p className="font-semibold text-slate-100">{title}</p>
        <p className="text-slate-300">{message}</p>
      </div>
    </div>
  );
}