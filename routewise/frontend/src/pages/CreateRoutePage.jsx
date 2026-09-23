import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Save, Sparkles, ArrowRight, Flag, MapPin as MapPinIcon } from 'lucide-react';
import { routeService } from '../services/routeService';
import { vehicleService } from '../services/vehicleService';
import { useToast } from '../context/ToastContext.jsx';
import { extractErrorMessage } from '../services/api';
import AddressSearch from '../components/map/AddressSearch.jsx';
import RouteMap from '../components/map/RouteMap.jsx';
import StopCard from '../components/dashboard/StopCard.jsx';
import StopFormModal from '../components/dashboard/StopFormModal.jsx';
import Button from '../components/common/Button.jsx';
import OptimizationLoader from '../components/common/OptimizationLoader.jsx';
import MapLoader from '../components/common/MapLoader.jsx';
import { formatKm, formatMinutes } from '../utils/format';
import { fadeUp } from '../animations/variants';

function uid() {
  return `local-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export default function CreateRoutePage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [routeId, setRouteId] = useState(id || null);

  const [name, setName] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [waypoints, setWaypoints] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);

  const [optimizationResult, setOptimizationResult] = useState(null);

  useEffect(() => {
    vehicleService
      .list()
      .then(setVehicles)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    routeService
      .getById(id)
      .then((route) => {
        setName(route.name);
        setVehicleId(route.vehicleId || '');
        const originStop = route.stops.find((s) => s.stopType === 'ORIGIN');
        const destinationStop = route.stops.find((s) => s.stopType === 'DESTINATION');
        const waypointStops = route.stops
          .filter((s) => s.stopType === 'WAYPOINT')
          .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
        setOrigin(originStop ? { ...originStop } : null);
        setDestination(destinationStop ? { ...destinationStop } : null);
        setWaypoints(waypointStops.map((s) => ({ ...s, clientId: s.id })));
      })
      .catch((err) => toast.error(extractErrorMessage(err, 'Could not load this route.')))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const mapStops = useMemo(() => {
    const list = [];
    if (origin) list.push({ ...origin, stopType: 'ORIGIN', sequenceOrder: 0 });
    waypoints.forEach((w, i) => list.push({ ...w, stopType: 'WAYPOINT', sequenceOrder: i + 1 }));
    if (destination) list.push({ ...destination, stopType: 'DESTINATION', sequenceOrder: waypoints.length + 1 });
    return list;
  }, [origin, waypoints, destination]);

  const openAddStop = () => {
    setEditingStop(null);
    setModalOpen(true);
  };

  const openEditStop = (stop) => {
    setEditingStop(stop);
    setModalOpen(true);
  };

  const handleStopSubmit = (values) => {
    if (editingStop) {
      setWaypoints((prev) => prev.map((w) => (w.clientId === editingStop.clientId ? { ...w, ...values } : w)));
    } else {
      setWaypoints((prev) => [...prev, { ...values, clientId: uid() }]);
    }
    setModalOpen(false);
  };

  const handleDeleteStop = (clientId) => {
    setWaypoints((prev) => prev.filter((w) => w.clientId !== clientId));
  };

  const handleDragStart = (index) => () => setDragIndex(index);
  const handleDragEnter = (index) => () => {
    if (dragIndex === null || dragIndex === index) return;
    setWaypoints((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

  const buildPayload = () => ({
    name: name.trim(),
    vehicleId: vehicleId || null,
    origin: {
      label: origin.label || 'Start Location',
      formattedAddress: origin.formattedAddress,
      latitude: origin.latitude,
      longitude: origin.longitude,
    },
    waypoints: waypoints.map((w) => ({
      label: w.label,
      formattedAddress: w.formattedAddress,
      latitude: w.latitude,
      longitude: w.longitude,
      priority: w.priority,
      notes: w.notes,
    })),
    destination: {
      label: destination.label || 'Destination',
      formattedAddress: destination.formattedAddress,
      latitude: destination.latitude,
      longitude: destination.longitude,
    },
  });

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Give your route a name.');
    if (!origin) return toast.error('Set a start location.');
    if (!destination) return toast.error('Set a destination.');

    setSaving(true);
    try {
      const payload = buildPayload();
      const response = routeId ? await routeService.update(routeId, payload) : await routeService.create(payload);
      setRouteId(response.id);
      setOptimizationResult(null);
      toast.success(routeId ? 'Route updated.' : 'Route created successfully.');
      if (!isEditing) {
        navigate(`/dashboard/routes/${response.id}/edit`, { replace: true });
      }
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not save this route.'));
    } finally {
      setSaving(false);
    }
  };

  const handleOptimize = async () => {
    if (!routeId) return toast.error('Save the route before optimizing.');
    setOptimizing(true);
    setOptimizationResult(null);
    try {
      const result = await routeService.optimize(routeId);
      const stops = result.route.stops;
      setOrigin(stops.find((s) => s.stopType === 'ORIGIN'));
      setDestination(stops.find((s) => s.stopType === 'DESTINATION'));
      setWaypoints(
        stops
          .filter((s) => s.stopType === 'WAYPOINT')
          .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
          .map((s) => ({ ...s, clientId: s.id }))
      );
      setOptimizationResult(result);
      toast.success('Route optimized.');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not optimize this route.'));
    } finally {
      setOptimizing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <MapLoader label="Loading route…" />
      </div>
    );
  }

  return (
    <div>
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-3xl font-bold text-white">{isEditing ? 'Edit Route' : 'Create Route'}</h1>
        <p className="mt-1 text-slate-400">Build a multi-stop route, then let RouteWise find the fastest sequence.</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr] lg:items-start">
        <div className="space-y-5">
          <div className="glass-panel rounded-2xl border border-white/8 p-5">
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">Route Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Karachi Delivery Run"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
            />

            <label className="mb-1.5 mt-4 block text-xs uppercase tracking-wider text-slate-500">Vehicle (optional)</label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
            >
              <option value="">No vehicle / skip fuel estimate</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div className="glass-panel rounded-2xl border border-white/8 p-5">
            <label className="mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-wider text-success">
              <Flag size={12} /> Start Location
            </label>
            <AddressSearch initialValue={origin?.formattedAddress || ''} onSelect={(r) => setOrigin({ ...r, label: 'Start Location' })} />

            <label className="mb-1.5 mt-4 flex items-center gap-1.5 text-xs uppercase tracking-wider text-danger">
              <MapPinIcon size={12} /> Destination
            </label>
            <AddressSearch initialValue={destination?.formattedAddress || ''} onSelect={(r) => setDestination({ ...r, label: 'Destination' })} />
          </div>

          <div className="glass-panel rounded-2xl border border-white/8 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Stops ({waypoints.length})</h3>
              <Button size="sm" variant="secondary" icon={PlusCircle} onClick={openAddStop}>
                Add Stop
              </Button>
            </div>

            <div className="space-y-2.5">
              <AnimatePresence initial={false}>
                {waypoints.map((stop, index) => (
                  <StopCard
                    key={stop.clientId}
                    stop={stop}
                    index={index + 1}
                    draggable
                    onDragStart={handleDragStart(index)}
                    onDragEnter={handleDragEnter(index)}
                    onDragEnd={handleDragEnd}
                    onEdit={() => openEditStop(stop)}
                    onDelete={() => handleDeleteStop(stop.clientId)}
                  />
                ))}
              </AnimatePresence>
              {waypoints.length === 0 && (
                <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-xs text-slate-500">
                  No stops yet. Add your first stop to build the route.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleSave} loading={saving} icon={Save} className="w-full">
              {routeId ? 'Save Changes' : 'Save Route'}
            </Button>
            <Button
              onClick={handleOptimize}
              loading={optimizing}
              disabled={!routeId}
              variant="secondary"
              icon={Sparkles}
              className="w-full"
            >
              Optimize Route
            </Button>
          </div>

          {optimizing && (
            <div className="glass-panel rounded-2xl border border-white/8">
              <OptimizationLoader active={optimizing} />
            </div>
          )}

          <AnimatePresence>
            {optimizationResult && !optimizing && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-panel rounded-2xl border border-success/25 bg-success/5 p-5"
              >
                <p className="text-xs uppercase tracking-widest text-success">Route Optimized</p>
                <div className="mt-3 grid grid-cols-2 gap-4 font-mono-tabular">
                  <div>
                    <p className="text-[10px] text-slate-500">Distance</p>
                    <p className="text-slate-500 line-through">{formatKm(optimizationResult.originalDistanceKm)}</p>
                    <p className="text-lg font-bold text-white">{formatKm(optimizationResult.optimizedDistanceKm)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Duration</p>
                    <p className="text-slate-500 line-through">{formatMinutes(optimizationResult.originalDurationMinutes)}</p>
                    <p className="text-lg font-bold text-white">{formatMinutes(optimizationResult.optimizedDurationMinutes)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ArrowRight}
                  className="mt-4"
                  onClick={() => navigate(`/dashboard/routes/${routeId}`)}
                >
                  View Route Details
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <RouteMap stops={mapStops} height="720px" />
      </div>

      <StopFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleStopSubmit}
        initialStop={editingStop}
        title={editingStop ? 'Edit Stop' : 'Add Stop'}
      />
    </div>
  );
}
