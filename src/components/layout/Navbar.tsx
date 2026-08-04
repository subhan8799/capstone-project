import { motion } from 'framer-motion';
import { Film, LogOut, Menu, UserCircle } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { Sidebar } from './Sidebar';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, signOutUser } = useAuth();

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/movies', label: 'Movies' },
    { to: '/tv-shows', label: 'TV Shows' },
    { to: '/new-popular', label: 'New & Popular' },
    { to: '/my-list', label: 'My List' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-md"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-3">
            <button
              className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10 md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu />
            </button>
            <Link to="/" className="flex items-center gap-2 text-base font-semibold sm:text-lg">
              <Film className="text-brand-500" /> MiniFlix
            </Link>
          </div>
          <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-sm text-slate-300 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-full bg-brand-600/25 px-3 py-1.5 text-white'
                    : 'rounded-full px-3 py-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            {user ? (
              <>
                <div className="hidden items-center gap-2 lg:flex">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User avatar" className="h-8 w-8 rounded-full" />
                  ) : (
                    <UserCircle className="text-slate-300" />
                  )}
                  <span className="max-w-32 truncate text-sm text-slate-200">{user.displayName ?? user.email}</span>
                </div>
                <Button variant="ghost" onClick={() => void signOutUser()} aria-label="Logout">
                  <LogOut size={16} />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="px-3">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </motion.header>
      <Sidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
}