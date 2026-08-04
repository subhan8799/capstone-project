import { NavLink } from 'react-router-dom';
import { Clapperboard, Film, Flame, Heart, House, Sparkles, Tv, UserCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { cn } from '../../utils/cn';

const sections = [
  {
    title: 'Browse',
    links: [
      { path: '/', label: 'Home', icon: House },
      { path: '/movies', label: 'Movies', icon: Clapperboard },
      { path: '/tv-shows', label: 'TV Shows', icon: Tv },
      { path: '/new-popular', label: 'New & Popular', icon: Flame },
    ],
  },
  {
    title: 'Library',
    links: [
      { path: '/my-list', label: 'My List', icon: Film },
      { path: '/favorites', label: 'Favorites', icon: Heart },
      { path: '/profile', label: 'Profile', icon: UserCircle },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onEscape);
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close navigation overlay"
          />

          <motion.aside
            className="fixed inset-y-0 left-0 z-50 w-[84vw] max-w-80 bg-slate-950/95 p-5 shadow-2xl md:hidden"
            aria-hidden={!open}
            initial={{ x: -320, opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0.6 }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Film className="text-brand-500" /> MiniFlix
              </div>
              <button className="rounded-full p-2 transition hover:bg-white/10" onClick={onClose} aria-label="Close menu">
                <X size={18} />
              </button>
            </div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-brand-200">
              <Sparkles className="h-3.5 w-3.5" /> Browse Hub
            </div>

            <nav className="space-y-5">
              {sections.map((section) => (
                <div key={section.title}>
                  <p className="mb-2 px-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">{section.title}</p>
                  <div className="space-y-1">
                    {section.links.map((link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition',
                            'hover:bg-white/10 hover:text-white',
                            isActive && 'bg-brand-600/25 text-white',
                          )
                        }
                      >
                        <link.icon size={18} /> {link.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}