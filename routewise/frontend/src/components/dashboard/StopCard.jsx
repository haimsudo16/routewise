import React from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Pencil, Trash2, Flag, MapPin } from 'lucide-react';
import { listItem } from '../../animations/variants';

const PRIORITY_COLORS = {
  HIGH: 'text-danger border-danger/30 bg-danger/10',
  NORMAL: 'text-accent border-accent/30 bg-accent/10',
  LOW: 'text-slate-400 border-slate-500/30 bg-slate-500/10',
};

export default function StopCard({
  stop,
  index,
  draggable = false,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onEdit,
  onDelete,
  fixed = false,
}) {
  const isOrigin = stop.stopType === 'ORIGIN';
  const isDestination = stop.stopType === 'DESTINATION';

  return (
    <motion.div
      layout
      variants={listItem}
      initial="hidden"
      animate="visible"
      exit="exit"
      draggable={draggable && !fixed}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`glass-panel flex items-center gap-3 rounded-xl border p-3.5 ${
        isOrigin ? 'border-success/25' : isDestination ? 'border-danger/25' : 'border-white/8'
      }`}
    >
      {draggable && !fixed ? (
        <GripVertical size={16} className="shrink-0 cursor-grab text-slate-600 active:cursor-grabbing" />
      ) : (
        <Flag size={16} className={`shrink-0 ${isOrigin ? 'text-success' : 'text-danger'}`} />
      )}

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 font-mono text-xs text-slate-300">
        {isOrigin ? 'S' : isDestination ? 'D' : String(index).padStart(2, '0')}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{stop.label}</p>
        <p className="flex items-center gap-1 truncate text-xs text-slate-500">
          <MapPin size={10} />
          {stop.formattedAddress}
        </p>
      </div>

      {stop.priority && !isOrigin && !isDestination && (
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase ${PRIORITY_COLORS[stop.priority]}`}>
          {stop.priority}
        </span>
      )}

      {!fixed && (
        <div className="flex shrink-0 items-center gap-1">
          <button onClick={onEdit} className="rounded-lg p-1.5 text-slate-500 hover:bg-white/5 hover:text-accent" aria-label="Edit stop">
            <Pencil size={14} />
          </button>
          {!isOrigin && !isDestination && (
            <button onClick={onDelete} className="rounded-lg p-1.5 text-slate-500 hover:bg-danger/10 hover:text-danger" aria-label="Delete stop">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
