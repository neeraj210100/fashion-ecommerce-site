export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16"
      role="status"
      aria-live="polite"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/15 border-t-ink" />
      <span className="text-xs uppercase tracking-[0.2em] text-ink/45">
        {label}
      </span>
    </div>
  );
}
