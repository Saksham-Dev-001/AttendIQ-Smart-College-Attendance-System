import React, { useState, useEffect } from 'react';
import { db } from '../../db/store';
import {
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  Calendar,
  AlertTriangle,
  TrendingUp,
  MapPin,
  History,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    studentsCount: 0,
    teachersCount: 0,
    subjectsCount: 0,
    classroomsCount: 0,
    slotsToday: 0,
    totalRecords: 0,
    averageAttendance: 88,
    lowAttendanceCount: 0,
  });

  const sync = () => {
    const students = db.getStudents();
    const teachers = db.getTeachers();
    const subjects = db.getSubjects();
    const classrooms = db.getClassrooms();
    const timetables = db.getTimetables();
    const records = db.getAttendanceRecords();
    const settings = db.getSettings();

    const todayDayIndex = new Date().getDay() === 0 ? 1 : new Date().getDay();
    const todaySlots = timetables.filter((t) => t.dayOfWeek === todayDayIndex);

    // Compute real average attendance % per student across all subjects
    let totalPct = 0;
    let countedStudents = 0;
    let lowCount = 0;

    students.forEach((st) => {
      const myRecs = records.filter((r) => r.studentId === st.id);
      if (myRecs.length === 0) return;
      // Count distinct sessions held for this student's section per subject
      const sectionRecs = records.filter((r) => r.sectionId === st.sectionId);
      let stuPresent = 0;
      let stuHeld = 0;
      subjects.forEach((sub) => {
        const heldSessions = new Set(sectionRecs.filter((r) => r.subjectId === sub.id).map((r) => r.sessionId));
        const presentCount = myRecs.filter((r) => r.subjectId === sub.id && (r.status === 'present' || r.status === 'late')).length;
        stuPresent += presentCount;
        stuHeld += Math.max(heldSessions.size, presentCount);
      });
      const pct = stuHeld > 0 ? (stuPresent / stuHeld) * 100 : 100;
      totalPct += pct;
      countedStudents++;
      if (pct < settings.minAttendancePercentage) lowCount++;
    });

    const averageAttendance = countedStudents > 0
      ? Math.round((totalPct / countedStudents) * 10) / 10
      : 0;

    setStats({
      studentsCount: students.length,
      teachersCount: teachers.length,
      subjectsCount: subjects.length,
      classroomsCount: classrooms.length,
      slotsToday: todaySlots.length,
      totalRecords: records.length,
      averageAttendance,
      lowAttendanceCount: lowCount,
    });
  };

  useEffect(() => {
    sync();
    const unsub = db.subscribe(sync);
    return () => unsub();
  }, []);

  const auditLogs = db.getAuditLogs().slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-xs font-semibold mb-3 text-rose-200">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Campus Management & Verification Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-['Plus_Jakarta_Sans']">
              Institutional Admin Console
            </h1>
            <p className="mt-1 text-xs md:text-sm text-slate-300 max-w-xl">
              Real-time monitoring of campus attendance, timetable scheduling, geofence radius, and immutable audit logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('reports')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md transition-all flex items-center gap-2 border border-white/20"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>View Reports</span>
            </button>
            <button
              onClick={() => onNavigate('geofence')}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/30 transition-all flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>Geofence Rules</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Enrolled Students
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-2">
            {stats.studentsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">100% Biometric Enrolled</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Teaching Faculty
            </span>
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-2">
            {stats.teachersCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across 2 Departments</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Classes Today
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono mt-2">
            {stats.slotsToday}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">From Dynamic Timetable</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Attendance Shortage
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-600 font-mono mt-2">
            {stats.lowAttendanceCount}
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">&lt; 75% threshold</div>
        </div>
      </div>

      {/* Quick Launch Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('academics')}
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all text-left group"
        >
          <div className="flex justify-between items-center">
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 mt-3 font-['Plus_Jakarta_Sans']">
            Manage College Structure
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Configure departments, courses, semester sections, classrooms, and courses.
          </p>
        </button>

        <button
          onClick={() => onNavigate('timetable')}
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all text-left group"
        >
          <div className="flex justify-between items-center">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 mt-3 font-['Plus_Jakarta_Sans']">
            Timetable Scheduler
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Assign periods, faculties, sections, and classroom rooms for automated daily display.
          </p>
        </button>

        <button
          onClick={() => onNavigate('audit')}
          className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all text-left group"
        >
          <div className="flex justify-between items-center">
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <History className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 mt-3 font-['Plus_Jakarta_Sans']">
            Audit Trail & Logs
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Review immutable system logs: attendance corrections, rule changes, and overrides.
          </p>
        </button>
      </div>

      {/* Recent Audit Trail Activity */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Recent System & Correction Audits
            </h3>
          </div>
          <button
            onClick={() => onNavigate('audit')}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            View All Logs ➔
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-3 flex justify-between items-start text-xs gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{log.actorName}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-600">
                    {log.actorRole}
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    action: {log.action}
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5">{log.reason}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono shrink-0">
                {new Date(log.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

