import { motion } from 'framer-motion';

export default function FeatureImportance({ title, items, accent = 'from-primary-500 to-accent-500' }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <motion.div key={`${item.label}-${index}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-2xl border border-slate-200/60 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
              <span className={`font-semibold bg-gradient-to-r ${accent} bg-clip-text text-transparent`}>{item.value}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div className={`h-2 rounded-full bg-gradient-to-r ${accent}`} style={{ width: `${Math.min(100, Math.max(12, item.value * 100))}%` }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
