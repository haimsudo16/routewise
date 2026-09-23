import React from 'react';
import Logo from '../common/Logo.jsx';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 lg:flex-row lg:px-8">
        <Logo />
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} RouteWise. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-slate-500">
          <a href="#product" className="hover:text-slate-300">
            Product
          </a>
          <a href="#how-it-works" className="hover:text-slate-300">
            How it Works
          </a>
          <a href="#features" className="hover:text-slate-300">
            Features
          </a>
        </div>
      </div>
    </footer>
  );
}
