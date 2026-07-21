import { motion } from 'framer-motion';
import { FiActivity } from 'react-icons/fi';

export default function PredictionForm({ children, onSubmit, title = 'Spesifikasi Tanah', subtitle }) {
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.45)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 p-3 text-white">
          <FiActivity className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
          {subtitle ? <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </motion.div>
  );
}
