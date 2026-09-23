import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Route as RouteIcon, Gauge, Clock, DollarSign, BarChart3 } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { useToast } from '../context/ToastContext.jsx';
import { extractErrorMessage } from '../services/api';
import StatCard from '../components/dashboard/StatCard.jsx';
import SkeletonCard from '../components/common/SkeletonCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import AreaTrendChart from '../components/charts/AreaTrendChart.jsx';
import BarTrendChart from '../components/charts/BarTrendChart.jsx';
import StatusPieChart from '../components/charts/StatusPieChart.jsx';
import { fadeUp, staggerContainer } from '../animations/variants';

function ChartCard({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel rounded-2xl border border-white/8 p-5"
    >
      <h3 className="mb-4 text-sm font-semibold text-white">{title}</h3>
      {children}
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const toast = useToast();
  const [overview, setOverview] = useState(null);
  const [routesData, setRoutesData] = useState(null);
  const [distanceData, setDistanceData] = useState(null);
  const [timeSavedData, setTimeSavedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsService.overview(),
      analyticsService.routes(),
      analyticsService.distance(),
      analyticsService.timeSaved(),
    ])
      .then(([overviewRes, routesRes, distanceRes, timeSavedRes]) => {
        setOverview(overviewRes);
        setRoutesData(routesRes);
        setDistanceData(distanceRes);
        setTimeSavedData(timeSavedRes);
      })
      .catch((err) => toast.error(extractErrorMessage(err, 'Could not load analytics.')))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!overview || overview.totalRoutes === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Complete a few routes to see analytics."
        description="Once you've run some routes, trends for distance, time saved, and completion rate will show up here."
      />
    );
  }

  const distancePoints = (distanceData?.distancePerWeek || []).map((p) => ({ label: p.label, value: Number(p.value) }));
  const timeSavedPoints = (timeSavedData?.timeSavedPerWeek || []).map((p) => ({ label: p.label, value: Number(p.value) }));
  const routesPerWeek = (routesData?.routesPerWeek || []).map((p) => ({ label: p.label, value: Number(p.value) }));
  const completionByStatus = routesData?.completionRateByStatus || [];

  return (
    <div>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-slate-400">Performance trends across every route you've run.</p>
      </motion.div>

      <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={RouteIcon} label="Routes" value={overview.totalRoutes} />
        <StatCard icon={Gauge} label="Distance" value={overview.totalDistanceKm} suffix="KM" decimals={1} />
        <StatCard icon={Clock} label="Time Saved" value={(overview.totalTimeSavedMinutes || 0) / 60} suffix="HRS" decimals={1} accent />
        <StatCard icon={DollarSign} label="Fuel Cost" value={overview.totalFuelCost} decimals={2} />
      </motion.div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <ChartCard title="Routes per week">
          <BarTrendChart data={routesPerWeek} suffix="routes" color="#3ddcf7" />
        </ChartCard>
        <ChartCard title="Distance traveled (km)" delay={0.05}>
          <AreaTrendChart data={distancePoints} suffix="km" color="#34d399" />
        </ChartCard>
        <ChartCard title="Time saved (minutes)" delay={0.1}>
          <AreaTrendChart data={timeSavedPoints} suffix="min" color="#fbbf24" />
        </ChartCard>
        <ChartCard title="Completion rate" delay={0.15}>
          {completionByStatus.length > 0 ? (
            <StatusPieChart data={completionByStatus} />
          ) : (
            <p className="py-10 text-center text-sm text-slate-500">Not enough data yet.</p>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
