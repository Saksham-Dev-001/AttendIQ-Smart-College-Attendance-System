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
  ChevronDown,
  ChevronUp,
  CheckCircle2,
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
  const [showGuidelines, setShowGuidelines] = useState(false);

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

  const handleFillSample = (id: string, defaultPass: string) => {
    setIdentifier(id);
    setPassword(defaultPass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError(`Please enter your ${selectedRole === 'student' ? 'Roll Number or College Email' : selectedRole === 'teacher' ? 'Employee ID or Email' : 'Admin Email'}.`);
      return;
    }
    if (!password) {
      setError('Please enter your account password.');
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
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleInfo = () => {
    switch (selectedRole) {
      case 'student':
        return {
          title: 'Student Portal',
          subtitle: 'Sign in to scan attendance QR codes, verify geofence & view records',
          icon: GraduationCap,
          inputLabel: 'Roll Number / College Email',
          inputPlaceholder: 'e.g. 26SBCETCSE001 or student@sbcet.ac.in',
          sampleId: '26SBCETCSE001',
          samplePass: 'student123',
          badgeText: 'Student Attendance Verification',
        };
      case 'teacher':
        return {
          title: 'Faculty Portal',
          subtitle: 'Sign in to initiate encrypted QR sessions, monitor check-ins & update records',
          icon: Briefcase,
          inputLabel: 'Employee ID / Faculty Email',
          inputPlaceholder: 'e.g. EMP-T201 or aastha@sbcet.ac.in',
          sampleId: 'EMP-T201',
          samplePass: 'teacher123',
          badgeText: 'Live Classroom Attendance Host',
        };
      case 'admin':
        return {
          title: 'Administrator Console',
          subtitle: 'Institutional governance, geofence anchors, timetable & compliance logs',
          icon: ShieldCheck,
          inputLabel: 'Administrator Email / Username',
          inputPlaceholder: 'e.g. admin@sbcet.ac.in',
          sampleId: 'admin@sbcet.ac.in',
          samplePass: 'admin123',
          badgeText: 'Institutional Administration',
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Subtle Background Lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* College Identity & Term Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center z-10">
        <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-500/25 mb-3">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
          Attend<span className="text-indigo-400">IQ</span>
        </h1>
        <div className="flex items-center justify-center gap-1.5 text-slate-300 text-xs sm:text-sm font-semibold mt-1">
          <Building2 className="w-4 h-4 text-indigo-400" />
          <span>{settings.collegeName}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-medium text-indigo-300 mt-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Academic Term 2026-27 • B.Tech 1st Year (I Semester)</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
          {/* Institutional Portal Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'student'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('teacher')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'teacher'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Portal Title & Subtitle */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                {roleInfo.title}
              </h2>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {roleInfo.badgeText}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {roleInfo.subtitle}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {roleInfo.inputLabel}
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
                  placeholder={roleInfo.inputPlaceholder}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">
                  Default: <span className="font-mono font-semibold text-slate-600">{roleInfo.samplePass}</span>
                </span>
              </div>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your institutional password"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
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

            {/* Remember Me & Help */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span>Remember identifier</span>
              </label>

              <button
                type="button"
                onClick={() => handleFillSample(roleInfo.sampleId, roleInfo.samplePass)}
                className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
              >
                Autofill test credentials
              </button>
            </div>

            {/* Submit Button */}
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

          {/* Institutional Directory Accordion (Clean & Expandable) */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowGuidelines(!showGuidelines)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                <span>SBCET Portal Directory & Sample Logins</span>
              </div>
              {showGuidelines ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showGuidelines && (
              <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-3">
                <div>
                  <div className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Student Logins (114 Enrolled):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                    <div
                      onClick={() => handleFillSample('26SBCETCSE001', 'student123')}
                      className="p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors"
                    >
                      <div className="font-bold text-indigo-700 font-mono">26SBCETCSE001</div>
                      <div className="text-slate-500">Aayush Sharma (CSE, Sec A)</div>
                    </div>
                    <div
                      onClick={() => handleFillSample('26SBCETAI001', 'student123')}
                      className="p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors"
                    >
                      <div className="font-bold text-indigo-700 font-mono">26SBCETAI001</div>
                      <div className="text-slate-500">Akash Babu (AI, Sec B)</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80">
                  <div className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Faculty Logins (11 Instructors):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                    <div
                      onClick={() => {
                        setSelectedRole('teacher');
                        handleFillSample('EMP-T201', 'teacher123');
                      }}
                      className="p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors"
                    >
                      <div className="font-bold text-indigo-700 font-mono">EMP-T201</div>
                      <div className="text-slate-500">Dr. Aastha Pareek (Chemistry)</div>
                    </div>
                    <div
                      onClick={() => {
                        setSelectedRole('teacher');
                        handleFillSample('EMP-T202', 'teacher123');
                      }}
                      className="p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors"
                    >
                      <div className="font-bold text-indigo-700 font-mono">EMP-T202</div>
                      <div className="text-slate-500">Dr. A. H. Khan (Mathematics)</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80">
                  <div className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Administrator:</span>
                  </div>
                  <div
                    onClick={() => {
                      setSelectedRole('admin');
                      handleFillSample('admin@sbcet.ac.in', 'admin123');
                    }}
                    className="p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-rose-300 transition-colors text-[11px]"
                  >
                    <div className="font-bold text-rose-700 font-mono">admin@sbcet.ac.in</div>
                    <div className="text-slate-500">Dr. Surendra Singh (Principal & Registrar) • Password: <span className="font-mono font-bold">admin123</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security & Encryption Notice */}
        <p className="mt-4 text-center text-[11px] text-slate-500">
          Attendance validation enforced with 25s Rotating QR, Campus Geofence & Liveness Checks.
        </p>
      </div>
    </div>
  );
};
