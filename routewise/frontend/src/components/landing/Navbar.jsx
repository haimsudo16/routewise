import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '../common/Logo.jsx';
import Button from '../common/Button.jsx';

const LINKS = [
  { href: '#product', label: 'Product' },
  { href: '#how-it-works', label: 'How it Works' },
  { href: '#features', label: 'Features' },
  { href: '#analytics', label: 'Analytics' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-panel border-b border-white/10 shadow-card' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Logo onClick={() => navigate('/')} />

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cursor-hover
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Start Planning</Button>
          </Link>
        </div>

        <button className="text-slate-200 lg:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-panel border-t border-white/10 px-5 py-4 lg:hidden"
        >
          <div className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="text-sm text-slate-300">
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex gap-3">
              <Link to="/login" className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link to="/register" className="flex-1">
                <Button size="sm" className="w-full">
                  Start Planning
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
