import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../db/store';
import {
  ShieldCheck,
  GraduationCap,
  Briefcase,
  LogOut,
  Clock,
  Building2,
  FileText,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { currentUser, currentRole, studentProfile, teacherProfile, logout } = useAuth();
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Admin Console
          </span>
        );
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" /> Faculty Portal
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> Student Portal
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand & Institutional Identity */}
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
              <div className="text-xs text-slate-500 hidden sm:flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-medium text-slate-600">{settings.collegeName}</span>
              </div>
            </div>
          </div>

          {/* Right section: System Time & Authenticated User Profile */}
          <div className="flex items-center gap-3">
            {/* Live Synchronized System Clock */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 text-slate-700 text-xs font-semibold border border-slate-200 font-mono shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>{time || '--:--:--'}</span>
            </div>

            {/* Official Project Report PDF Download */}
            <a
              href="/AttendIQ_Project_Report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="AttendIQ_Project_Report.pdf"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 shadow-2xs transition-all"
              title="Download official comprehensive Project Report PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Project Report (PDF)</span>
            </a>

            {/* Authenticated User Details */}
            {currentUser && (
              <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-slate-200">
                <div className="text-right hidden md:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {currentRole === 'student' && studentProfile ? (
                      <span className="text-indigo-600 font-semibold font-mono">
                        {studentProfile.rollNo} • {studentProfile.branch || 'B.Tech'}
                      </span>
                    ) : currentRole === 'teacher' && teacherProfile ? (
                      <span className="text-indigo-600 font-semibold font-mono">
                        {teacherProfile.employeeId} • Faculty
                      </span>
                    ) : (
                      <span className="text-rose-600 font-semibold">
                        Registrar / Principal
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-300/80 flex items-center justify-center text-slate-800 font-bold text-xs shadow-xs">
                  {currentUser.name.charAt(0)}
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
