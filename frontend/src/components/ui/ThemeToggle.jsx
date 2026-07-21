import { FiMoon, FiSun } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/70 bg-white/80 text-slate-700 shadow-sm backdrop-blur transition hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
    </motion.button>
  );
}
