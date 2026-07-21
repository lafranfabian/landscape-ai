import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiActivity, FiInfo, FiMapPin, FiMenu, FiTrendingUp, FiX } from 'react-icons/fi';
import { FiClock } from 'react-icons/fi';
import ThemeToggle from './ui/ThemeToggle';

export default function Navbar({ theme, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: <FiTrendingUp className="mr-2" /> },
    { name: 'Prediksi', path: '/predict', icon: <FiMapPin className="mr-2" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <FiActivity className="mr-2" /> },
    { name: 'Riwayat', path: '/history', icon: <FiClock className="mr-2" /> },
    { name: 'Tentang', path: '/about', icon: <FiInfo className="mr-2" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 p-2.5 text-white shadow-lg">
            <FiTrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">LandPriceAI</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Premium valuation intelligence</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center rounded-full px-4 py-2 text-sm font-medium transition ${isActive(item.path) ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button onClick={() => setIsOpen((value) => !value)} className="rounded-full border border-slate-200 p-2.5 text-slate-700 dark:border-slate-700 dark:text-slate-200">
            {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white/90 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`flex items-center rounded-2xl px-3 py-3 text-sm font-medium ${isActive(item.path) ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-300'}`}>
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
