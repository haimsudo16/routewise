import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, PlusCircle, ChevronLeft, ChevronRight, Route as RouteIcon } from 'lucide-react';
import { routeService } from '../services/routeService';
import { useToast } from '../context/ToastContext.jsx';
import { extractErrorMessage } from '../services/api';
import StatusBadge from '../components/common/StatusBadge.jsx';
import Button from '../components/common/Button.jsx';
import SkeletonTable from '../components/common/SkeletonTable.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { formatDate, formatKm, formatMinutes } from '../utils/format';
import { fadeUp } from '../animations/variants';

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'OPTIMIZED', label: 'Optimized' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'distance', label: 'Longest distance' },
  { value: 'name', label: 'Name (A–Z)' },
];

export default function HistoryPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [status, setStatus] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setLoading(true);
    routeService
      .list({ status, search, sort, page, size: 8 })
      .then(setData)
      .catch((err) => toast.error(extractErrorMessage(err, 'Could not load route history.')))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search, sort, page]);

  const routes = data?.content || [];
  const hasResults = routes.length > 0;

  return (
    <div>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Route History</h1>
          <p className="mt-1 text-slate-400">Every route your team has planned, optimized, or completed.</p>
        </div>
        <Link to="/dashboard/routes/new">
          <Button icon={PlusCircle}>Create Route</Button>
        </Link>
      </motion.div>

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatus(f.value);
                setPage(0);
              }}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                status === f.value
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-white/10 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search routes…"
              className="w-52 rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={6} cols={6} />
      ) : !hasResults ? (
        <EmptyState
          icon={RouteIcon}
          title="No routes found."
          description="Try a different filter or search, or create your first route."
          action={
            <Link to="/dashboard/routes/new">
              <Button icon={PlusCircle}>Create Route</Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="glass-panel hidden overflow-x-auto rounded-2xl border border-white/8 md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/8 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3.5 font-medium">Route</th>
                  <th className="px-5 py-3.5 font-medium">Stops</th>
                  <th className="px-5 py-3.5 font-medium">Distance</th>
                  <th className="px-5 py-3.5 font-medium">Duration</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium">Date</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-medium text-white">{route.name}</td>
                    <td className="px-5 py-4 text-slate-400">{route.totalStopCount}</td>
                    <td className="px-5 py-4 font-mono-tabular text-slate-300">{formatKm(route.distanceKm)}</td>
                    <td className="px-5 py-4 font-mono-tabular text-slate-300">{formatMinutes(route.durationMinutes)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={route.status} />
                    </td>
                    <td className="px-5 py-4 text-slate-400">{formatDate(route.createdAt)}</td>
                    <td className="px-5 py-4 text-right">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/dashboard/routes/${route.id}`)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {routes.map((route) => (
              <button
                key={route.id}
                onClick={() => navigate(`/dashboard/routes/${route.id}`)}
                className="glass-panel w-full rounded-2xl border border-white/8 p-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{route.name}</p>
                  <StatusBadge status={route.status} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span>{route.totalStopCount} stops</span>
                  <span className="font-mono-tabular">{formatKm(route.distanceKm)}</span>
                  <span className="font-mono-tabular">{formatMinutes(route.durationMinutes)}</span>
                  <span>{formatDate(route.createdAt)}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
            <p>
              Page {data.page + 1} of {Math.max(data.totalPages, 1)} · {data.totalElements} routes
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                icon={ChevronLeft}
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
              >
                Prev
              </Button>
              <Button
                size="sm"
                variant="secondary"
                icon={ChevronRight}
                disabled={data.last}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
