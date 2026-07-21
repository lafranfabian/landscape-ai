export default function Toast({ message, type = 'info' }) {
  const styles = {
    info: 'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-300',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300',
    danger: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300'
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm ${styles[type]}`}>
      {message}
    </div>
  );
}
