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
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { currentRole } = useAuth();

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
          { id: 'session', label: 'Live Session & QR', icon: QrCode },
          { id: 'history', label: 'Class History & Log', icon: CheckSquare },
          { id: 'reports', label: 'Subject Analytics', icon: FileSpreadsheet },
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'My Attendance', icon: LayoutDashboard },
          { id: 'scan', label: 'Mark Attendance', icon: Sparkles },
          { id: 'timetable', label: 'Weekly Timetable', icon: Calendar },
          { id: 'history', label: 'Attendance Log', icon: History },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 py-4 px-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
      <div className="hidden md:block px-3 pb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        Navigation Menu
      </div>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs border border-indigo-100'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Icon
              className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
              }`}
            />
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};

