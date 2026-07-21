export default function Loading({ label = 'Preparing experience...' }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-[1.75rem] border border-slate-200/70 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="h-3 w-3 animate-bounce rounded-full bg-gradient-to-r from-primary-500 to-accent-500" style={{ animationDelay: `${dot * 120}ms` }} />
          ))}
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}
