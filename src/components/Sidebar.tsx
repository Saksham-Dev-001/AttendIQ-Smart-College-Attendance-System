import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  MapPin,
  FileSpreadsheet,
  History,
  QrCode,
  Sparkles,
  BookOpen,
  CalendarDays,
  CheckSquare,
  Building2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { db } from '../db/store';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { currentRole, studentProfile, teacherProfile, currentUser } = useAuth();
  const settings = db.getSettings();

  const getMenuItems = () => {
    switch (currentRole) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Admin Overview', icon: LayoutDashboard },
          { id: 'academics', label: 'College Structure', icon: BookOpen },
          { id: 'users', label: 'Users Directory', icon: Users },
          { id: 'timetable', label: 'Timetable Scheduler', icon: Calendar },
          { id: 'geofence', label: 'Geofence & Rules', icon: MapPin },
          { id: 'reports', label: 'Attendance Reports', icon: FileSpreadsheet },
          { id: 'audit', label: 'Audit Trail & Logs', icon: History },
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: "Today's Schedule", icon: CalendarDays },
          { id: 'session', label: 'Live Session & QR', icon: QrCode, badge: 'Active' },
          { id: 'history', label: 'Class History & Log', icon: CheckSquare },
          { id: 'reports', label: 'Subject Analytics', icon: FileSpreadsheet },
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'My Attendance', icon: LayoutDashboard },
          { id: 'scan', label: 'Mark Attendance', icon: Sparkles, badge: 'Scan' },
          { id: 'timetable', label: 'Weekly Timetable', icon: Calendar },
          { id: 'history', label: 'Attendance Log', icon: History },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/90 py-5 px-3.5 shrink-0 justify-between min-h-[calc(100vh-4rem)] select-none">
      <div className="space-y-4">
        {/* Navigation Heading */}
        <div className="px-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span>Portal Navigation</span>
          <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded-md">
            {currentRole?.toUpperCase()}
          </span>
        </div>

        {/* Menu Buttons List */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {isActive && !item.badge && (
                  <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Institutional Context Card */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
          <div className="flex items-center gap-2 text-slate-800 font-bold mb-1">
            <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">{settings.collegeName}</span>
          </div>
          <div className="text-[11px] text-slate-500 leading-tight">
            {currentRole === 'student' && studentProfile ? (
              <span>
                Enrolled: <strong className="text-slate-700">{studentProfile.rollNo}</strong>
                <br />
                Branch: {studentProfile.branch || 'B.Tech'} • {studentProfile.batch || 'Batch A'}
              </span>
            ) : currentRole === 'teacher' && teacherProfile ? (
              <span>
                Emp ID: <strong className="text-slate-700">{teacherProfile.employeeId}</strong>
                <br />
                Dept: First Year Engineering
              </span>
            ) : (
              <span>
                Role: <strong className="text-slate-700">Administrator</strong>
                <br />
                Academic Term: AY 2026-27
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
