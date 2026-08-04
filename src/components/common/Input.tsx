import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id, error, className, ...props },
  ref,
) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-200">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        className={cn(
          'w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none',
          className,
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  );
});