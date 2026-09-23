import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Gauge } from 'lucide-react';
import StatusBadge from '../common/StatusBadge.jsx';
import { formatDate, formatKm, formatMinutes } from '../../utils/format';
import { cardHover } from '../../animations/variants';

export default function RouteCard({ route }) {
  const navigate = useNavigate();

  return (
    <motion.button
      layout
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardHover}
      data-cursor-hover
      onClick={() => navigate(`/dashboard/routes/${route.id}`)}
      className="glass-panel w-full rounded-2xl border border-white/8 p-5 text-left transition-colors hover:border-accent/25"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{route.name}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{formatDate(route.createdAt)}</p>
        </div>
        <StatusBadge status={route.status} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
        <span className="flex items-center gap-1.5">
          <MapPin size={14} className="text-slate-500" />
          {route.totalStopCount} stops
        </span>
        <span className="flex items-center gap-1.5 font-mono-tabular">
          <Gauge size={14} className="text-slate-500" />
          {formatKm(route.distanceKm)}
        </span>
        <span className="flex items-center gap-1.5 font-mono-tabular">
          <Clock size={14} className="text-slate-500" />
          {formatMinutes(route.durationMinutes)}
        </span>
      </div>
    </motion.button>
  );
}
