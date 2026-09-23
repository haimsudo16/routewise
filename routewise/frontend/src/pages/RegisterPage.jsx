import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { extractErrorMessage } from '../services/api';
import Button from '../components/common/Button.jsx';
import Logo from '../components/common/Logo.jsx';
import { fadeUp } from '../animations/variants';

export default function RegisterPage() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (form.fullName.trim().length < 2) next.fullName = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (form.password.length < 8) next.password = 'Password must be at least 8 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created. Welcome to RouteWise.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not create your account.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-base-950 px-4 grid-bg">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="glass-panel relative w-full max-w-md rounded-2xl border border-white/10 p-8 shadow-card"
      >
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center text-2xl font-bold text-white">Start planning smarter</h1>
        <p className="mt-1 text-center text-sm text-slate-400">Create your RouteWise account in seconds.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500" htmlFor="fullName">
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                id="fullName"
                autoComplete="name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
                placeholder="Jordan Alvarez"
              />
            </div>
            {errors.fullName && <p className="mt-1 text-xs text-danger">{errors.fullName}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
                placeholder="you@company.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
                placeholder="At least 8 characters"
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-danger">{errors.password}</p>}
          </div>

          <Button type="submit" loading={loading} className="w-full" icon={ArrowRight}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-accent-glow">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
