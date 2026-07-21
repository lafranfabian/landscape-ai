import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, theme, toggleTheme }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_30%),linear-gradient(135deg,_#f8fafc_0%,_#f8fbff_45%,_#f8fafc_100%)] text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#020617_100%)] dark:text-slate-100">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
