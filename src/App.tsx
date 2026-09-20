import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LoginPage } from './pages/auth/LoginPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAcademics } from './pages/admin/AdminAcademics';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminTimetable } from './pages/admin/AdminTimetable';
import { AdminGeofence } from './pages/admin/AdminGeofence';
import { AdminAudit } from './pages/admin/AdminAudit';
import { AdminReports } from './pages/admin/AdminReports';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherLiveSession } from './pages/teacher/TeacherLiveSession';
import { TeacherHistory } from './pages/teacher/TeacherHistory';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentScanWizard } from './pages/student/StudentScanWizard';
import { StudentTimetable } from './pages/student/StudentTimetable';
import { StudentHistory } from './pages/student/StudentHistory';

import { AttendanceSession } from './types';
import { db } from './db/store';
import { RotateCcw } from 'lucide-react';

export function App() {
  const { currentUser, currentRole } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [liveTeacherSession, setLiveTeacherSession] = useState<AttendanceSession | null>(null);

  // When role changes, default back to 'dashboard'
  useEffect(() => {
    setCurrentTab('dashboard');
  }, [currentRole]);

  // Sync active live session for teacher
  useEffect(() => {
    if (currentRole === 'teacher') {
      const active = db.getSessions().find((s) => s.status === 'active' && new Date() < new Date(s.expiresAt));
      if (active && !liveTeacherSession) {
        setLiveTeacherSession(active);
      }
    }
  }, [currentRole]);

  if (!currentUser) {
    return <LoginPage />;
  }

  const handleStartTeacherSession = (session: AttendanceSession) => {
    setLiveTeacherSession(session);
    setCurrentTab('session');
  };

  const handleCloseTeacherSession = () => {
    setLiveTeacherSession(null);
    setCurrentTab('dashboard');
  };

  const renderContent = () => {
    if (currentRole === 'admin') {
      switch (currentTab) {
        case 'dashboard':
          return <AdminDashboard onNavigate={(tab) => setCurrentTab(tab)} />;
        case 'academics':
          return <AdminAcademics />;
        case 'users':
          return <AdminUsers />;
        case 'timetable':
          return <AdminTimetable />;
        case 'geofence':
          return <AdminGeofence />;
        case 'reports':
          return <AdminReports />;
        case 'audit':
          return <AdminAudit />;
        default:
          return <AdminDashboard onNavigate={(tab) => setCurrentTab(tab)} />;
      }
    }

    if (currentRole === 'teacher') {
      switch (currentTab) {
        case 'dashboard':
          return <TeacherDashboard onStartSession={handleStartTeacherSession} />;
        case 'session':
          if (liveTeacherSession) {
            return (
              <TeacherLiveSession
                session={liveTeacherSession}
                onClose={handleCloseTeacherSession}
              />
            );
          }
          return <TeacherDashboard onStartSession={handleStartTeacherSession} />;
        case 'history':
          return <TeacherHistory />;
        case 'reports':
          return <AdminReports />;
        default:
          return <TeacherDashboard onStartSession={handleStartTeacherSession} />;
      }
    }

    if (currentRole === 'student') {
      switch (currentTab) {
        case 'dashboard':
          return <StudentDashboard onNavigateToScan={() => setCurrentTab('scan')} />;
        case 'scan':
          return <StudentScanWizard />;
        case 'timetable':
          return <StudentTimetable />;
        case 'history':
          return <StudentHistory />;
        default:
          return <StudentDashboard onNavigateToScan={() => setCurrentTab('scan')} />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto">
          {renderContent()}

          {/* Institutional Status & Maintenance Footer */}
          <footer className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
            <div>
              AttendIQ • Sri Balaji College of Engineering & Technology © 2026. Enforced with Geofence & Biometrics.
            </div>
            <button
              onClick={() => {
                if (window.confirm('Restore SBCET college database to initial academic term defaults?')) {
                  db.resetToDefaults();
                  window.location.reload();
                }
              }}
              className="text-slate-400 hover:text-slate-700 flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restore College Defaults</span>
            </button>
          </footer>
        </main>
      </div>

      {/* Touch-optimized Mobile Bottom Navigation */}
      <MobileBottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />
    </div>
  );
}

export default App;

