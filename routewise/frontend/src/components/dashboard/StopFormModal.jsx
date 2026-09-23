import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import AddressSearch from '../map/AddressSearch.jsx';

const PRIORITIES = ['LOW', 'NORMAL', 'HIGH'];

export default function StopFormModal({ open, onClose, onSubmit, initialStop, title = 'Add Stop' }) {
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState(null);
  const [priority, setPriority] = useState('NORMAL');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setLabel(initialStop?.label || '');
      setAddress(
        initialStop
          ? {
              formattedAddress: initialStop.formattedAddress,
              latitude: initialStop.latitude,
              longitude: initialStop.longitude,
            }
          : null
      );
      setPriority(initialStop?.priority || 'NORMAL');
      setNotes(initialStop?.notes || '');
      setError('');
    }
  }, [open, initialStop]);

  const handleSubmit = () => {
    if (!label.trim()) return setError('Give this stop a short label.');
    if (!address) return setError('Search for and select an address.');
    setError('');
    onSubmit({
      label: label.trim(),
      formattedAddress: address.formattedAddress,
      latitude: address.latitude,
      longitude: address.longitude,
      priority,
      notes: notes.trim() || null,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Stop</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">Label</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Clifton Block 2"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">Address</label>
          <AddressSearch initialValue={address?.formattedAddress || ''} onSelect={setAddress} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">Priority</label>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium uppercase transition-colors ${
                  priority === p ? 'border-accent/40 bg-accent/10 text-accent' : 'border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Gate code, delivery instructions…"
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
          />
        </div>

        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    </Modal>
  );
}
