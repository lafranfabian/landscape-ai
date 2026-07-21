import { FiDatabase, FiGithub, FiGlobe, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">LandPriceAI</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">AI-native valuation platform for modern real estate decisions.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <FiDatabase className="h-4 w-4" />
          <span>Powered by LightGBM and FastAPI</span>
        </div>
        <div className="flex items-center gap-3">
          {[
            { href: 'https://github.com', icon: <FiGithub className="h-4 w-4" />, label: 'GitHub' },
            { href: 'https://twitter.com', icon: <FiTwitter className="h-4 w-4" />, label: 'Twitter' },
            { href: 'https://google.com', icon: <FiGlobe className="h-4 w-4" />, label: 'Website' },
          ].map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300" aria-label={item.label}>
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
