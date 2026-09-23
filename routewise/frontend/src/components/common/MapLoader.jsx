import React from 'react';
import { MapPin } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner.jsx';

export default function MapLoader({ label = 'Loading map…' }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-base-900/80 rounded-2xl">
      <div className="relative">
        <MapPin className="text-accent/40" size={32} />
        <LoadingSpinner size={48} className="absolute -inset-2" />
      </div>
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
    </div>
  );
}
