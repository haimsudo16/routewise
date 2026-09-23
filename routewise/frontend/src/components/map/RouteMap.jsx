import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Maximize2 } from 'lucide-react';

const DEFAULT_CENTER = [24.8607, 67.0011]; // Karachi - sensible default when no stops exist yet

function buildIcon(stop, index) {
  const isOrigin = stop.stopType === 'ORIGIN';
  const isDestination = stop.stopType === 'DESTINATION';
  const bg = isOrigin ? '#34d399' : isDestination ? '#f87171' : '#3ddcf7';
  const label = isOrigin ? 'S' : isDestination ? 'D' : index;

  return L.divIcon({
    className: '',
    html: `<div style="
      width:28px;height:28px;border-radius:9999px;
      background:${bg};color:#050810;font-weight:700;font-size:12px;
      display:flex;align-items:center;justify-content:center;
      border:2px solid rgba(255,255,255,0.85);
      box-shadow:0 0 12px ${bg}66;
      font-family:'JetBrains Mono',monospace;">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function FitToRoute({ stops }) {
  const map = useMap();

  useEffect(() => {
    const valid = stops.filter((s) => s.latitude && s.longitude);
    if (valid.length === 0) return;
    if (valid.length === 1) {
      map.setView([valid[0].latitude, valid[0].longitude], 13);
      return;
    }
    const bounds = L.latLngBounds(valid.map((s) => [s.latitude, s.longitude]));
    map.fitBounds(bounds, { padding: [48, 48] });
  }, [stops, map]);

  return null;
}

export function FitToRouteButton({ stops }) {
  const map = useMap();
  const handleClick = () => {
    const valid = stops.filter((s) => s.latitude && s.longitude);
    if (!valid.length) return;
    const bounds = L.latLngBounds(valid.map((s) => [s.latitude, s.longitude]));
    map.fitBounds(bounds, { padding: [48, 48] });
  };
  return (
    <button
      onClick={handleClick}
      className="glass-panel absolute right-3 top-3 z-[400] rounded-lg border border-white/10 p-2 text-slate-300 hover:text-accent"
      title="Fit to route"
      type="button"
    >
      <Maximize2 size={16} />
    </button>
  );
}

export default function RouteMap({ stops = [], className = '', height = '100%' }) {
  const orderedStops = useMemo(
    () => [...stops].sort((a, b) => (a.sequenceOrder ?? 0) - (b.sequenceOrder ?? 0)),
    [stops]
  );
  const waypointCounter = useRef(0);
  waypointCounter.current = 0;

  const polylinePositions = orderedStops
    .filter((s) => s.latitude && s.longitude)
    .map((s) => [s.latitude, s.longitude]);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 ${className}`} style={{ height }}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={12}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {polylinePositions.length > 1 && (
          <Polyline positions={polylinePositions} pathOptions={{ color: '#3ddcf7', weight: 3, opacity: 0.85 }} />
        )}

        {orderedStops.map((stop) => {
          const isWaypoint = stop.stopType === 'WAYPOINT';
          if (isWaypoint) waypointCounter.current += 1;
          if (!stop.latitude || !stop.longitude) return null;
          return (
            <Marker
              key={stop.id || `${stop.latitude}-${stop.longitude}-${stop.label}`}
              position={[stop.latitude, stop.longitude]}
              icon={buildIcon(stop, waypointCounter.current)}
            >
              <Popup>
                <div className="text-xs">
                  <p className="font-semibold">{stop.label}</p>
                  <p className="text-slate-400">{stop.formattedAddress}</p>
                  {stop.priority && <p className="mt-1">Priority: {stop.priority}</p>}
                  {stop.status && <p>Status: {stop.status}</p>}
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FitToRoute stops={orderedStops} />
        <FitToRouteButton stops={orderedStops} />
      </MapContainer>
    </div>
  );
}
