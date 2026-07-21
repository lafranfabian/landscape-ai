import { motion } from 'framer-motion';

export default function PredictionCard({ title, value, caption, accent = 'text-primary-600', icon }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900/80"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        {icon ? <div className={`rounded-2xl ${accent} bg-slate-100 p-2 dark:bg-slate-800`}>{icon}</div> : null}
      </div>
      <p className={`mt-4 text-2xl font-semibold tracking-tight ${accent}`}>{value}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{caption}</p>
    </motion.div>
  );
}
