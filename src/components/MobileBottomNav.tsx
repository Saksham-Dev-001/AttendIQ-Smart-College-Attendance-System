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

interface MobileBottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, onSelectTab }) => {
  const { currentRole } = useAuth();

  const getMenuItems = () => {
    switch (currentRole) {
      case 'student':
        return [
          { id: 'dashboard', label: 'Attendance', icon: LayoutDashboard },
          { id: 'scan', label: 'Scan & Mark', icon: Sparkles, highlight: true },
          { id: 'timetable', label: 'Timetable', icon: Calendar },
          { id: 'history', label: 'History', icon: History },
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Classes', icon: CalendarDays },
          { id: 'session', label: 'Live QR', icon: QrCode, highlight: true },
          { id: 'history', label: 'History', icon: CheckSquare },
          { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'timetable', label: 'Schedule', icon: Calendar },
          { id: 'geofence', label: 'Geofence', icon: MapPin },
          { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
        ];
      default:
        return [];
    }
  };

  const items = getMenuItems();
  if (items.length === 0) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center -mt-5 transition-transform active:scale-95`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-tr from-indigo-600 via-indigo-700 to-indigo-500 text-white ring-4 ring-indigo-100 shadow-indigo-500/30'
                      : 'bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white shadow-indigo-500/20'
                  }`}
                >
                  <Icon className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-bold text-indigo-700 mt-1 tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive ? 'bg-indigo-50' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

