export function LoadingSkeleton({ className = 'h-52 w-full' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}