import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Route as RouteIcon, CheckCircle2, Gauge, Clock, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { analyticsService } from '../services/analyticsService';
import { routeService } from '../services/routeService';
import { extractErrorMessage } from '../services/api';
import StatCard from '../components/dashboard/StatCard.jsx';
import RouteCard from '../components/dashboard/RouteCard.jsx';
import SkeletonCard from '../components/common/SkeletonCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Button from '../components/common/Button.jsx';
import { staggerContainer, fadeUp } from '../animations/variants';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning.';
  if (hour < 18) return 'Good afternoon.';
  return 'Good evening.';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [overview, setOverview] = useState(null);
  const [recentRoutes, setRecentRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [overviewData, recent] = await Promise.all([analyticsService.overview(), routeService.recent()]);
        if (!cancelled) {
          setOverview(overviewData);
          setRecentRoutes(recent);
        }
      } catch (err) {
        toast.error(extractErrorMessage(err, 'Could not load your dashboard.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {greeting()} {user?.fullName?.split(' ')[0]}
          </h1>
          <p className="mt-1 text-slate-400">Here's how your routes are performing.</p>
        </div>
        <Link to="/dashboard/routes/new">
          <Button icon={PlusCircle}>Create Route</Button>
        </Link>
      </motion.div>

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="visible"
        className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {loading || !overview ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard icon={RouteIcon} label="Total Routes" value={overview.totalRoutes} />
            <StatCard icon={CheckCircle2} label="Completed" value={overview.completedRoutes} accent />
            <StatCard icon={Gauge} label="Total Distance" value={overview.totalDistanceKm} suffix="KM" decimals={1} />
            <StatCard
              icon={Clock}
              label="Time Saved"
              value={(overview.totalTimeSavedMinutes || 0) / 60}
              suffix="HRS"
              decimals={1}
            />
          </>
        )}
      </motion.div>

      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Routes</h2>
          <Link to="/dashboard/routes" className="text-sm text-accent hover:text-accent-glow">
            View all
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} className="h-32" />)
          ) : recentRoutes.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState
                icon={RouteIcon}
                title="No routes yet."
                description="Create your first optimized route to see it here."
                action={
                  <Link to="/dashboard/routes/new">
                    <Button icon={PlusCircle}>Create Route</Button>
                  </Link>
                }
              />
            </div>
          ) : (
            recentRoutes.map((route) => <RouteCard key={route.id} route={route} />)
          )}
        </div>
      </div>
    </div>
  );
}
