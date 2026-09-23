import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Flag, MapPin, SkipForward } from 'lucide-react';
import Button from '../common/Button.jsx';

const DOT_STYLES = {
  COMPLETED: 'bg-success border-success text-base-950',
  SKIPPED: 'bg-warning border-warning text-base-950',
  PENDING: 'bg-base-900 border-white/20 text-slate-400',
};

export default function RouteTimeline({ stops, routeStatus, onComplete, onSkip, busyStopId }) {
  const ordered = [...stops].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  const canAct = routeStatus === 'IN_PROGRESS';

  return (
    <div className="relative pl-2">
      {ordered.map((stop, i) => {
        const isLast = i === ordered.length - 1;
        const isEndpoint = stop.stopType === 'ORIGIN' || stop.stopType === 'DESTINATION';
        const dotClass = DOT_STYLES[stop.status] || DOT_STYLES.PENDING;

        return (
          <div key={stop.id} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px transition-colors duration-500 ${
                  stop.status === 'COMPLETED' ? 'bg-success/50' : 'bg-white/10'
                }`}
              />
            )}

            <motion.div
              initial={false}
              animate={{ scale: stop.status === 'PENDING' ? 1 : [1.15, 1] }}
              className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${dotClass}`}
            >
              {stop.status === 'COMPLETED' ? (
                <Check size={15} />
              ) : stop.status === 'SKIPPED' ? (
                <X size={15} />
              ) : isEndpoint ? (
                <Flag size={13} />
              ) : (
                <MapPin size={13} />
              )}
            </motion.div>

            <div className="flex-1 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    {stop.stopType === 'ORIGIN' ? 'Start' : stop.stopType === 'DESTINATION' ? 'End' : `Stop ${String(i).padStart(2, '0')}`}
                  </p>
                  <p className="font-medium text-white">{stop.label}</p>
                  <p className="text-xs text-slate-500">{stop.formattedAddress}</p>
                </div>

                {canAct && !isEndpoint && stop.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" icon={SkipForward} loading={busyStopId === stop.id} onClick={() => onSkip(stop.id)}>
                      Skip
                    </Button>
                    <Button size="sm" icon={Check} loading={busyStopId === stop.id} onClick={() => onComplete(stop.id)}>
                      Complete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
