import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Pencil,
  Trash2,
  Sparkles,
  PlayCircle,
  Gauge,
  Clock,
  MapPin,
  Fuel,
  DollarSign,
  XCircle,
} from 'lucide-react';
import { routeService, stopService } from '../services/routeService';
import { useToast } from '../context/ToastContext.jsx';
import { extractErrorMessage } from '../services/api';
import RouteMap from '../components/map/RouteMap.jsx';
import RouteTimeline from '../components/dashboard/RouteTimeline.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import MapLoader from '../components/common/MapLoader.jsx';
import OptimizationLoader from '../components/common/OptimizationLoader.jsx';
import { formatDate, formatKm, formatMinutes, formatCurrency } from '../utils/format';
import { fadeUp } from '../animations/variants';

function StatBox({ icon: Icon, label, value }) {
  return (
    <div className="glass-panel rounded-2xl border border-white/8 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={14} />
        <p className="text-[10px] uppercase tracking-widest">{label}</p>
      </div>
      <p className="mt-2 font-mono-tabular text-xl font-bold text-white">{value}</p>
    </div>
  );
}

export default function RouteDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [starting, setStarting] = useState(false);
  const [busyStopId, setBusyStopId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    return routeService
      .getById(id)
      .then(setRoute)
      .catch((err) => toast.error(extractErrorMessage(err, 'Could not load this route.')));
  };

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleOptimize = async () => {
    setOptimizing(true);
    try {
      const result = await routeService.optimize(id);
      setRoute(result.route);
      toast.success('Route optimized.');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not optimize this route.'));
    } finally {
      setOptimizing(false);
    }
  };

  const handleStart = async () => {
    setStarting(true);
    try {
      const updated = await routeService.start(id);
      setRoute(updated);
      toast.success('Route started. Safe travels.');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not start this route.'));
    } finally {
      setStarting(false);
    }
  };

  const handleCancel = async () => {
    try {
      const updated = await routeService.cancel(id);
      setRoute(updated);
      toast.info('Route cancelled.');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not cancel this route.'));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await routeService.remove(id);
      toast.success('Route deleted.');
      navigate('/dashboard/routes');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not delete this route.'));
      setDeleting(false);
    }
  };

  const handleCompleteStop = async (stopId) => {
    setBusyStopId(stopId);
    try {
      await stopService.complete(stopId);
      await load();
      toast.success('Stop completed.');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not complete this stop.'));
    } finally {
      setBusyStopId(null);
    }
  };

  const handleSkipStop = async (stopId) => {
    setBusyStopId(stopId);
    try {
      await stopService.skip(stopId);
      await load();
      toast.info('Stop skipped.');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not skip this stop.'));
    } finally {
      setBusyStopId(null);
    }
  };

  if (loading || !route) {
    return (
      <div className="relative h-96">
        <MapLoader label="Loading route…" />
      </div>
    );
  }

  const settledCount = route.stops.filter((s) => s.status === 'COMPLETED' || s.status === 'SKIPPED').length;
  const progressPercent = route.totalStopCount ? Math.round((settledCount / route.totalStopCount) * 100) : 0;

  return (
    <div>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{route.name}</h1>
            <StatusBadge status={route.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">Created {formatDate(route.createdAt)}</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {route.status === 'DRAFT' && (
            <Button variant="secondary" icon={Sparkles} loading={optimizing} onClick={handleOptimize}>
              Optimize
            </Button>
          )}
          {route.status === 'OPTIMIZED' && (
            <Button icon={PlayCircle} loading={starting} onClick={handleStart}>
              Start Route
            </Button>
          )}
          {(route.status === 'DRAFT' || route.status === 'OPTIMIZED') && (
            <Button variant="secondary" icon={XCircle} onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Link to={`/dashboard/routes/${id}/edit`}>
            <Button variant="secondary" icon={Pencil}>
              Edit
            </Button>
          </Link>
          <Button variant="danger" icon={Trash2} onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        </div>
      </motion.div>

      {optimizing && (
        <div className="glass-panel mb-6 rounded-2xl border border-white/8">
          <OptimizationLoader active={optimizing} />
        </div>
      )}

      {route.status === 'IN_PROGRESS' && (
        <div className="glass-panel mb-6 rounded-2xl border border-white/8 p-5">
          <div className="flex items-center justify-between text-sm">
            <p className="text-slate-300">
              {settledCount} / {route.totalStopCount} STOPS COMPLETED
            </p>
            <p className="font-mono-tabular text-accent">{progressPercent}%</p>
          </div>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatBox icon={Gauge} label="Distance" value={formatKm(route.distanceKm)} />
        <StatBox icon={Clock} label="Duration" value={formatMinutes(route.durationMinutes)} />
        <StatBox icon={MapPin} label="Stops" value={route.totalStopCount} />
        <StatBox icon={Fuel} label="Fuel" value={route.fuelUsedLitres ? `${route.fuelUsedLitres} L` : '—'} />
        <StatBox icon={DollarSign} label="Cost" value={route.fuelCost ? formatCurrency(route.fuelCost) : '—'} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
        <RouteMap stops={route.stops} height="520px" />

        <div className="glass-panel rounded-2xl border border-white/8 p-5">
          <h3 className="mb-5 text-sm font-semibold text-white">Stop Timeline</h3>
          <RouteTimeline
            stops={route.stops}
            routeStatus={route.status}
            onComplete={handleCompleteStop}
            onSkip={handleSkipStop}
            busyStopId={busyStopId}
          />
        </div>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete this route?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Delete Route
            </Button>
          </>
        }
      >
        This will permanently delete "{route.name}" and all of its stops. This cannot be undone.
      </Modal>
    </div>
  );
}
