import React from 'react';

/** Minimal location-pin + route-line mark, used in the navbar and sidebar. */
export default function Logo({ compact = false, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 text-left ${className}`}
      aria-label="RouteWise home"
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 24C10 24 10 18 14 18C18 18 18 12 22 12"
          stroke="#3ddcf7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 5.5"
        />
        <path
          d="M22 4C18.134 4 15 7.134 15 11C15 15.5 22 22 22 22C22 22 29 15.5 29 11C29 7.134 25.866 4 22 4Z"
          fill="#3ddcf7"
          fillOpacity="0.15"
          stroke="#3ddcf7"
          strokeWidth="1.6"
        />
        <circle cx="22" cy="11" r="3" fill="#3ddcf7" />
      </svg>
      {!compact && (
        <span className="text-lg font-bold tracking-tight text-white">
          Route<span className="text-accent">Wise</span>
        </span>
      )}
    </button>
  );
}
