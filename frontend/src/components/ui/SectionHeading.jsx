export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-600 dark:text-primary-400">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}
