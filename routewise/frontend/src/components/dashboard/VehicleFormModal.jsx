import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';

const FUEL_TYPES = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'CNG'];

const DEFAULT_FORM = {
  name: '',
  fuelType: 'PETROL',
  fuelEfficiencyKmPerLitre: '',
  fuelPricePerUnit: '',
  isDefault: false,
};

export default function VehicleFormModal({ open, onClose, onSubmit, initialVehicle }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        initialVehicle
          ? {
              name: initialVehicle.name,
              fuelType: initialVehicle.fuelType,
              fuelEfficiencyKmPerLitre: initialVehicle.fuelEfficiencyKmPerLitre,
              fuelPricePerUnit: initialVehicle.fuelPricePerUnit,
              isDefault: initialVehicle.isDefault,
            }
          : DEFAULT_FORM
      );
      setError('');
    }
  }, [open, initialVehicle]);

  const handleSubmit = async () => {
    if (!form.name.trim()) return setError('Give this vehicle a name.');
    if (!form.fuelEfficiencyKmPerLitre || Number(form.fuelEfficiencyKmPerLitre) <= 0) {
      return setError('Enter a valid fuel efficiency.');
    }
    if (form.fuelPricePerUnit === '' || Number(form.fuelPricePerUnit) < 0) {
      return setError('Enter a valid fuel price.');
    }
    setError('');
    setSaving(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        fuelType: form.fuelType,
        fuelEfficiencyKmPerLitre: Number(form.fuelEfficiencyKmPerLitre),
        fuelPricePerUnit: Number(form.fuelPricePerUnit),
        isDefault: form.isDefault,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving}>
            Save Vehicle
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">Vehicle Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Delivery Van 1"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">Fuel Type</label>
          <select
            value={form.fuelType}
            onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
          >
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">Efficiency (km/L)</label>
            <input
              type="number"
              step="0.1"
              value={form.fuelEfficiencyKmPerLitre}
              onChange={(e) => setForm({ ...form, fuelEfficiencyKmPerLitre: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">Price / unit</label>
            <input
              type="number"
              step="0.01"
              value={form.fuelPricePerUnit}
              onChange={(e) => setForm({ ...form, fuelPricePerUnit: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            className="h-4 w-4 rounded border-white/20 bg-white/5 accent-accent"
          />
          Set as default vehicle
        </label>

        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    </Modal>
  );
}
