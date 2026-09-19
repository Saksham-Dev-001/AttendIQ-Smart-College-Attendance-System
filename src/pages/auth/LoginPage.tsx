import React, { useState } from 'react';
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
  Sparkles,
} from 'lucide-react';
import { db } from '../../db/store';

export const LoginPage: React.FC = () => {
  const { loginWithCredentials, switchDemoRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('26SBCETCSE001');
  const [password, setPassword] = useState('student123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const settings = db.getSettings();

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'student') {
      setIdentifier('26SBCETCSE001');
      setPassword('student123');
    } else if (role === 'teacher') {
      setIdentifier('EMP-T201');
      setPassword('teacher123');
    } else {
      setIdentifier('admin@sbcet.ac.in');
      setPassword('admin123');
    }
  };

  const handleQuickStudentLogin = (roll: string) => {
    setSelectedRole('student');
    setIdentifier(roll);
    setPassword('student123');
    setError(null);
    loginWithCredentials(roll, 'student123', 'student');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your ID or registered college email.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await loginWithCredentials(identifier, password, selectedRole);
      if (!res.success) {
        setError(res.message);
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
          title: 'Student Portal Access',
          subtitle: 'Enter your Roll Number or College Email to mark attendance.',
          icon: GraduationCap,
          inputLabel: 'Roll No / Enrollment / Email',
          inputPlaceholder: 'e.g. 26SBCETCSE001 or student@sbcet.ac.in',
          accentColor: 'indigo',
          badge: 'Self Attendance & Records',
        };
      case 'teacher':
        return {
          title: 'Faculty Portal Access',
          subtitle: 'Enter your Employee ID or Email to start class sessions.',
          icon: Briefcase,
          inputLabel: 'Employee ID / Email',
          inputPlaceholder: 'e.g. EMP-T201 or aastha@sbcet.ac.in',
          accentColor: 'violet',
          badge: 'Dynamic QR & Live Counter',
        };
      case 'admin':
        return {
          title: 'Administrator Console',
          subtitle: 'Full institution control, geofence, audit trails, and reporting.',
          icon: ShieldCheck,
          inputLabel: 'Admin ID / Official Email',
          inputPlaceholder: 'e.g. admin@sbcet.ac.in',
          accentColor: 'rose',
          badge: 'System Governance & Rules',
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* College & Project Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-xl shadow-indigo-500/25 mb-3">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
          AttendIQ
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
          {settings.collegeName}
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-indigo-400 mt-2">
          <span>B.Tech 1st Year (I Sem) • Academic Term 2026-27</span>
        </div>
      </div>

      {/* Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg z-10 px-4 sm:px-0">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedRole === 'student'
                  ? 'bg-white text-indigo-700 shadow-sm'
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
                  ? 'bg-white text-violet-700 shadow-sm'
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
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          {/* Role Context Heading */}
          <div className="mb-6 flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
              <roleInfo.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  {roleInfo.title}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                  {roleInfo.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {roleInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {roleInfo.inputLabel}
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={roleInfo.inputPlaceholder}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
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
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md shadow-indigo-600/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In to {selectedRole.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Footer with Branch Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Quick Role & Branch Logins</span>
            </div>

            {/* Quick Student Branch Selector */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Student Portals by Branch:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickStudentLogin('26SBCETCSE001')}
                  className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-left transition-colors"
                >
                  <div className="text-[10px] font-bold">CSE (Batch A1)</div>
                  <div className="text-[9px] font-mono text-slate-500 truncate">Aayush Sharma</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickStudentLogin('26SBCETCS001')}
                  className="p-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 text-left transition-colors"
                >
                  <div className="text-[10px] font-bold">CS (Batch A2)</div>
                  <div className="text-[9px] font-mono text-slate-500 truncate">Aayush Sharma CS</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickStudentLogin('26SBCETAI001')}
                  className="p-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 text-left transition-colors"
                >
                  <div className="text-[10px] font-bold">AI (Batch B1)</div>
                  <div className="text-[9px] font-mono text-slate-500 truncate">Akash Babu</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickStudentLogin('26SBCETDS001')}
                  className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-left transition-colors"
                >
                  <div className="text-[10px] font-bold">CSE-DS (Batch B2)</div>
                  <div className="text-[9px] font-mono text-slate-500 truncate">Abhishek Pandey</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickStudentLogin('26SBCETME001')}
                  className="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 text-left transition-colors"
                >
                  <div className="text-[10px] font-bold">Mech (Batch B2)</div>
                  <div className="text-[9px] font-mono text-slate-500 truncate">Rahul Kumawat</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickStudentLogin('26SBCETCSE034')}
                  className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-left transition-colors"
                >
                  <div className="text-[10px] font-bold">CSE (Batch A2)</div>
                  <div className="text-[9px] font-mono text-slate-500 truncate">Preetam Kushwah</div>
                </button>
              </div>

              {/* Faculty and Admin Quick Links */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => switchDemoRole('teacher')}
                  className="text-violet-600 hover:underline font-semibold text-[11px]"
                >
                  👨‍🏫 Faculty (Dr. Aastha Pareek) ➔
                </button>
                <button
                  type="button"
                  onClick={() => switchDemoRole('admin')}
                  className="text-rose-600 hover:underline font-semibold text-[11px]"
                >
                  🛡️ Admin (Principal) ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
