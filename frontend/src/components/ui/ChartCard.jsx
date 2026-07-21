import { motion } from 'framer-motion';

export default function ChartCard({ title, description, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-[1.75rem] border border-slate-200/70 bg-white/80 p-5 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.45)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        {description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
      </div>
      {children}
    </motion.div>
  );
}
