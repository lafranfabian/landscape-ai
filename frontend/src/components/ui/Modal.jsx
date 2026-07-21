export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
          </div>
          <button onClick={onClose} className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">Close</button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
