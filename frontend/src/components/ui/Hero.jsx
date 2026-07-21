import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { FiSun } from 'react-icons/fi';

export default function Hero({ title, subtitle, primaryAction, secondaryAction, badge, children }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-primary-50/70 p-8 shadow-[0_30px_100px_-40px_rgba(37,99,235,0.45)] dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900/90 sm:p-12 lg:p-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.18),_transparent_35%)]" />
      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {badge ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-primary-50/70 px-3 py-1 text-sm font-medium text-primary-700 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-300">
              <FiSun className="h-4 w-4" />
              {badge}
            </div>
          ) : null}
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryAction ? <div>{primaryAction}</div> : null}
            {secondaryAction ? <div>{secondaryAction}</div> : null}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
