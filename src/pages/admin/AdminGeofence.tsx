import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/store';
import { SystemSettings } from '../../types';
import { MapPin, ShieldCheck, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const AdminGeofence: React.FC = () => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState<SystemSettings>(db.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setSettings(db.getSettings());
    });
    return () => unsub();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings(
      settings,
      currentUser?.id || 'admin01',
      currentUser?.name || 'Administrator'
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-600" />
          <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Geofence & Attendance Rules Configuration
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Define institutional campus boundaries, dynamic QR refresh cycle, session durations, and late arrival policies.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>System configuration updated and recorded in the audit trail.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Geofence Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Campus Boundary & GPS Coordinates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Name</label>
              <input
                type="text"
                required
                value={settings.campusName}
                onChange={(e) => setSettings({ ...settings, campusName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Name</label>
              <input
                type="text"
                required
                value={settings.collegeName}
                onChange={(e) => setSettings({ ...settings, collegeName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Anchor Latitude (°N)</label>
              <input
                type="number"
                step="any"
                required
                value={settings.campusLatitude}
                onChange={(e) => setSettings({ ...settings, campusLatitude: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Anchor Longitude (°E)</label>
              <input
                type="number"
                step="any"
                required
                value={settings.campusLongitude}
                onChange={(e) => setSettings({ ...settings, campusLongitude: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Permitted Radius: <span className="font-bold text-indigo-600">{settings.campusRadiusMeters} meters</span>
              </label>
              <input
                type="range"
                min={50}
                max={500}
                step={10}
                value={settings.campusRadiusMeters}
                onChange={(e) => setSettings({ ...settings, campusRadiusMeters: parseInt(e.target.value, 10) })}
                className="w-full accent-indigo-600 cursor-pointer mt-2"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="geofenceMandatory"
              checked={settings.geofenceMandatory}
              onChange={(e) => setSettings({ ...settings, geofenceMandatory: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="geofenceMandatory" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Strict Geofence Enforcement: Reject attendance submissions outside permitted campus perimeter
            </label>
          </div>
        </div>

        {/* Dynamic QR & Policy Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Anti-Proxy Security & Attendance Policies</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dynamic QR Token Refresh (Seconds)
              </label>
              <input
                type="number"
                min={15}
                max={60}
                value={settings.qrRefreshSeconds}
                onChange={(e) => setSettings({ ...settings, qrRefreshSeconds: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Screenshots expire after this window</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Session Duration (Minutes)
              </label>
              <input
                type="number"
                min={3}
                max={30}
                value={settings.defaultSessionDurationMinutes}
                onChange={(e) => setSettings({ ...settings, defaultSessionDurationMinutes: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Class attendance window</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Late Grace Period (Minutes)
              </label>
              <input
                type="number"
                min={1}
                max={15}
                value={settings.lateThresholdMinutes}
                onChange={(e) => setSettings({ ...settings, lateThresholdMinutes: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Marked as 'Late' instead of 'Present'</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Minimum Attendance Threshold Required (%)
              </label>
              <input
                type="number"
                min={50}
                max={95}
                value={settings.minAttendancePercentage}
                onChange={(e) => setSettings({ ...settings, minAttendancePercentage: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Triggers low-attendance shortage alert below this value</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Academic Term
              </label>
              <input
                type="text"
                value={settings.academicSession}
                onChange={(e) => setSettings({ ...settings, academicSession: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Save Institutional Rules</span>
          </button>
        </div>
      </form>
    </div>
  );
};

