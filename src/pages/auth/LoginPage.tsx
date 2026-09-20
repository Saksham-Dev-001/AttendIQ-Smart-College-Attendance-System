import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  HelpCircle,
  X,
  CheckCircle2,
  Phone,
  Mail,
  Award,
} from 'lucide-react';
import { db } from '../../db/store';

export const LoginPage: React.FC = () => {
  const { loginWithCredentials } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const settings = db.getSettings();

  // Load saved remember-me identifier if available
  useEffect(() => {
    const saved = localStorage.getItem(`attendiq_remember_${selectedRole}`);
    if (saved) {
      setIdentifier(saved);
    } else {
      setIdentifier('');
    }
    setPassword('');
    setError(null);
  }, [selectedRole]);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError(
        `Please enter your ${
          selectedRole === 'student'
            ? 'College Roll Number or Registered Email'
            : selectedRole === 'teacher'
            ? 'Faculty Employee ID or Official Email'
            : 'Administrator Email'
        }.`
      );
      return;
    }
    if (!password) {
      setError('Please enter your institutional password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await loginWithCredentials(identifier, password, selectedRole);
      if (!res.success) {
        setError(res.message);
      } else {
        if (rememberMe) {
          localStorage.setItem(`attendiq_remember_${selectedRole}`, identifier.trim());
        } else {
          localStorage.removeItem(`attendiq_remember_${selectedRole}`);
        }
      }
    } catch {
      setError('Authentication failed. Please verify your credentials or contact the college IT cell.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleConfig = () => {
    switch (selectedRole) {
      case 'student':
        return {
          title: 'Student Portal',
          subtitle: 'Sign in to verify classroom attendance, review attendance records & timetable',
          icon: GraduationCap,
          inputLabel: 'Roll Number / Enrollment / Email',
          inputPlaceholder: 'e.g. 26SBCETCSE001 or student@sbcet.ac.in',
          badgeText: 'Digital Student Portal',
          accentGradient: 'from-indigo-600 to-indigo-700',
          accentText: 'text-indigo-600',
        };
      case 'teacher':
        return {
          title: 'Faculty Portal',
          subtitle: 'Sign in to initiate encrypted QR sessions, track live classroom headcounts & manage records',
          icon: Briefcase,
          inputLabel: 'Faculty Employee ID / Email',
          inputPlaceholder: 'e.g. EMP-T201 or aastha@sbcet.ac.in',
          badgeText: 'Faculty Command Center',
          accentGradient: 'from-indigo-600 to-indigo-700',
          accentText: 'text-indigo-600',
        };
      case 'admin':
        return {
          title: 'Administrator Console',
          subtitle: 'Executive governance, geofence radius settings, timetable management & audit trail',
          icon: ShieldCheck,
          inputLabel: 'Administrator Email / Username',
          inputPlaceholder: 'e.g. admin@sbcet.ac.in',
          badgeText: 'Registrar & Administration',
          accentGradient: 'from-rose-600 to-rose-700',
          accentText: 'text-rose-600',
        };
    }
  };

  const roleConfig = getRoleConfig();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans select-none">
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-10 left-1/4 w-[32rem] h-[32rem] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[32rem] h-[32rem] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Institutional Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center z-10 pt-2 sm:pt-4">
        <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-500/25 mb-3 border border-indigo-400/30">
          <GraduationCap className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
          Attend<span className="text-indigo-400">IQ</span>
        </h1>

        <div className="flex items-center justify-center gap-1.5 text-slate-200 text-xs sm:text-sm font-semibold mt-1">
          <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{settings.collegeName}</span>
        </div>

        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
          Approved by AICTE • Affiliated to Rajasthan Technical University (RTU)
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-semibold text-indigo-300 mt-2.5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Academic Session 2026-27 • B.Tech 1st Year (I Semester)</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="my-6 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100/90">
          {/* Portal Switcher Segmented Control */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-2xl mb-6 border border-slate-200/60">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'student'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('teacher')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'teacher'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white text-rose-700 shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          {/* Portal Context Heading */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                {roleConfig.title}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {roleConfig.badgeText}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {roleConfig.subtitle}
            </p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {roleConfig.inputLabel}
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={roleConfig.inputPlaceholder}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-slate-500" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Helpdesk Link */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="font-medium">Remember this browser</span>
              </label>

              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
              >
                Need Help?
              </button>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md shadow-indigo-600/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying credentials...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to {selectedRole.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Institutional Compliance Indicators */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dynamic QR Encryption</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Campus Geofence</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Liveness Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                    Institutional Portal Assistance
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sri Balaji College of Engg & Tech • IT Services Desk
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Student Roll Number Format:</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  All enrolled students use their 13-character official college roll number formatted as:
                  <span className="font-mono font-bold text-indigo-700 block mt-1 bg-white p-2 rounded-lg border border-slate-200">
                    26SBCET[BRANCH][NUMBER] — e.g. 26SBCETCSE001
                  </span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Branches: CSE (Computer Science), CS (CS Core), AI (Artificial Intelligence), DS (Data Science), ME (Mechanical).
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>Faculty & Administration Access:</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Faculty members sign in using their issued Employee ID (<span className="font-mono font-semibold">EMP-T...</span>) or official college email (<span className="font-mono font-semibold">@sbcet.ac.in</span>).
                </p>
              </div>

              <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-indigo-900">
                  <Phone className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold">IT Helpdesk: Ext. 204 • Block A Ground Floor</span>
                </div>
                <span className="text-indigo-700 font-bold">Mon–Sat, 9 AM–5 PM</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Close Assistance Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Institutional Footer */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center z-10 pt-4 pb-2">
        <p className="text-[11px] text-slate-500">
          AttendIQ Platform • Sri Balaji College of Engineering & Technology, Jaipur
        </p>
        <p className="text-[10px] text-slate-600 mt-0.5">
          Campus Geofence: 26.9855° N, 75.7725° E • Real-Time Attendance Engine
        </p>
      </div>
    </div>
  );
};
