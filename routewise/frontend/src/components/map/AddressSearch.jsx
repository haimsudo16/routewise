import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { geocodeService } from '../../services/geocodeService';

/**
 * Free-text address input with debounced backend geocoding suggestions.
 * Calling onSelect hands back { formattedAddress, latitude, longitude }.
 */
export default function AddressSearch({ placeholder = 'Search an address…', onSelect, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (value) => {
    setQuery(value);
    clearTimeout(debounceRef.current);

    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await geocodeService.search(value);
        setSuggestions(results);
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleSelect = (result) => {
    setQuery(result.formattedAddress);
    setOpen(false);
    setSuggestions([]);
    onSelect?.(result);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
        <input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-9 text-sm text-white placeholder:text-slate-600 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-slate-500" size={15} />}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="glass-panel absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-white/10 shadow-card">
          {suggestions.map((result, i) => (
            <li key={`${result.latitude}-${result.longitude}-${i}`}>
              <button
                type="button"
                onClick={() => handleSelect(result)}
                className="flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left text-sm text-slate-300 hover:bg-white/5"
              >
                <MapPin size={14} className="mt-0.5 shrink-0 text-accent" />
                <span className="line-clamp-2">{result.formattedAddress}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
