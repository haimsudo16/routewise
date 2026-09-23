import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Plus, Pencil, Trash2, LogOut, User as UserIcon, Fuel, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { userService } from '../services/userService';
import { vehicleService } from '../services/vehicleService';
import { extractErrorMessage } from '../services/api';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import VehicleFormModal from '../components/dashboard/VehicleFormModal.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { fadeUp } from '../animations/variants';

function SectionCard({ icon: Icon, title, children }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass-panel rounded-2xl border border-white/8 p-6">
      <div className="mb-5 flex items-center gap-2.5">
        <Icon size={17} className="text-accent" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

export default function SettingsPage() {
  const { user, setUser, logout } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [distanceUnit, setDistanceUnit] = useState(user?.distanceUnit || 'KM');
  const [timeFormat, setTimeFormat] = useState(user?.timeFormat || 'HOUR_24');
  const [savingProfile, setSavingProfile] = useState(false);

  const [vehicles, setVehicles] = useState([]);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    vehicleService
      .list()
      .then(setVehicles)
      .catch(() => {});
  }, []);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const updated = await userService.updateMe({ fullName, distanceUnit, timeFormat });
      setUser(updated);
      toast.success('Settings saved.');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not save your settings.'));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleVehicleSubmit = async (payload) => {
    try {
      if (editingVehicle) {
        const updated = await vehicleService.update(editingVehicle.id, payload);
        setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)).map((v) => (payload.isDefault && v.id !== updated.id ? { ...v, isDefault: false } : v)));
      } else {
        const created = await vehicleService.create(payload);
        setVehicles((prev) => [created, ...prev].map((v) => (payload.isDefault && v.id !== created.id ? { ...v, isDefault: false } : v)));
      }
      toast.success('Vehicle saved.');
      setVehicleModalOpen(false);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not save this vehicle.'));
      throw err;
    }
  };

  const handleDeleteVehicle = async () => {
    try {
      await vehicleService.remove(deleteTarget.id);
      setVehicles((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      toast.success('Vehicle removed.');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not remove this vehicle.'));
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-slate-400">Manage your profile, vehicles, and preferences.</p>
      </motion.div>

      <SectionCard icon={UserIcon} title="Profile">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">Full Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">Email</label>
            <input
              value={user?.email || ''}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-sm text-slate-500"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={SlidersHorizontal} title="Preferences">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">Distance Unit</label>
            <select
              value={distanceUnit}
              onChange={(e) => setDistanceUnit(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
            >
              <option value="KM">Kilometers</option>
              <option value="MILES">Miles</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-500">Time Format</label>
            <select
              value={timeFormat}
              onChange={(e) => setTimeFormat(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
            >
              <option value="HOUR_24">24-hour</option>
              <option value="HOUR_12">12-hour</option>
            </select>
          </div>
        </div>

        <Button onClick={handleSaveProfile} loading={savingProfile} className="mt-5">
          Save Changes
        </Button>
      </SectionCard>

      <SectionCard icon={Fuel} title="Vehicles">
        <div className="mb-4 flex justify-end">
          <Button
            size="sm"
            variant="secondary"
            icon={Plus}
            onClick={() => {
              setEditingVehicle(null);
              setVehicleModalOpen(true);
            }}
          >
            Add Vehicle
          </Button>
        </div>

        {vehicles.length === 0 ? (
          <EmptyState
            icon={Car}
            title="No vehicles yet."
            description="Add a vehicle to get fuel usage and cost estimates on your routes."
          />
        ) : (
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
              >
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-white">
                    {vehicle.name}
                    {vehicle.isDefault && (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] uppercase text-accent">Default</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500">
                    {vehicle.fuelType} · {vehicle.fuelEfficiencyKmPerLitre} km/L · {vehicle.fuelPricePerUnit}/unit
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingVehicle(vehicle);
                      setVehicleModalOpen(true);
                    }}
                    className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-accent"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(vehicle)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard icon={LogOut} title="Account">
        <Button variant="danger" icon={LogOut} onClick={() => setLogoutOpen(true)}>
          Log Out
        </Button>
      </SectionCard>

      <VehicleFormModal
        open={vehicleModalOpen}
        onClose={() => setVehicleModalOpen(false)}
        onSubmit={handleVehicleSubmit}
        initialVehicle={editingVehicle}
      />

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove this vehicle?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteVehicle}>
              Remove
            </Button>
          </>
        }
      >
        This won't affect routes that already used this vehicle for their fuel estimate.
      </Modal>

      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Log out of RouteWise?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setLogoutOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => logout()}>
              Log Out
            </Button>
          </>
        }
      >
        You'll need to sign back in to access your routes and analytics.
      </Modal>
    </div>
  );
}
