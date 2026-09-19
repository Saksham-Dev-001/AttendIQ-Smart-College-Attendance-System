import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../db/store';
import {
  ShieldCheck,
  GraduationCap,
  Briefcase,
  LogOut,
  RefreshCw,
  Clock,
  UserCheck,
  Building2,
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { currentUser, currentRole, studentProfile, teacherProfile, switchDemoRole, logout } = useAuth();
  const [time, setTime] = useState<string>('');
  const settings = db.getSettings();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRoleBadge = () => {
    switch (currentRole) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
          </span>
        );
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Briefcase className="w-3.5 h-3.5" /> Faculty Portal
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <GraduationCap className="w-3.5 h-3.5" /> Student Portal
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand & College */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 font-bold text-lg tracking-wider">
              AIQ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans']">
                  Attend<span className="text-indigo-600">IQ</span>
                </span>
                {getRoleBadge()}
              </div>
              <div className="text-xs text-slate-500 hidden sm:flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                <span>{settings.collegeName}</span>
              </div>
            </div>
          </div>

          {/* Right section: Quick Switcher & User Details */}
          <div className="flex items-center gap-3">
            {/* Live Clock */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>{time}</span>
            </div>

            {/* Quick Demo Role Switcher */}
            <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-medium">
              <span className="text-slate-400 px-2 flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Quick Switch:
              </span>
              {(['student', 'teacher', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchDemoRole(r)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    currentRole === r
                      ? 'bg-white shadow-sm font-bold text-indigo-700 border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* User Info & Logout */}
            {currentUser && (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {currentRole === 'student' && studentProfile ? (
                      <span>Roll: {studentProfile.rollNo} • B.Tech I Sem</span>
                    ) : currentRole === 'teacher' && teacherProfile ? (
                      <span>Emp: {teacherProfile.employeeId}</span>
                    ) : (
                      <span>System Administrator</span>
                    )}
                  </div>
                </div>

                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs shadow-sm">
                  {currentUser.name.charAt(0)}
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

