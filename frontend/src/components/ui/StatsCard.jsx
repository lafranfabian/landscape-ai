import { motion } from 'framer-motion';

export default function StatsCard({ label, value, hint, icon, accent = 'from-primary-500 to-accent-500' }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
    >
      <div className={`inline-flex rounded-2xl bg-gradient-to-br ${accent} p-3 text-white shadow-lg`}>
        {icon}
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{value}</p>
      {hint ? <p className="mt-2 text-sm text-emerald-500">{hint}</p> : null}
    </motion.div>
  );
}
