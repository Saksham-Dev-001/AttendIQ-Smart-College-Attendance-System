import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/store';
import { TimetableSlot, AttendanceSession } from '../../types';
import {
  Play,
  Clock,
  MapPin,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface TeacherDashboardProps {
  onStartSession: (session: AttendanceSession) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onStartSession }) => {
  const { teacherProfile } = useAuth();
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>([]);
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);

  const subjects = db.getSubjects();
  const sections = db.getSections();
  const classrooms = db.getClassrooms();

  const syncData = () => {
    if (!teacherProfile) return;
    const allSlots = db.getTimetables();
    // Filter slots assigned to this teacher
    const mySlots = allSlots.filter((s) => s.teacherId === teacherProfile.id);
    setTimetableSlots(mySlots);

    // Check if there is an existing active session
    const sessions = db.getSessions();
    const live = sessions.find(
      (s) => s.teacherId === teacherProfile.id && s.status === 'active' && new Date() < new Date(s.expiresAt)
    );
    setActiveSession(live || null);
  };

  useEffect(() => {
    syncData();
    const unsubscribe = db.subscribe(syncData);
    return () => unsubscribe();
  }, [teacherProfile]);

  const handleStartAttendance = (slotId: string) => {
    if (!teacherProfile) return;
    try {
      const session = db.startAttendanceSession(slotId, teacherProfile.id);
      onStartSession(session);
    } catch (err: any) {
      alert(err.message || 'Failed to start attendance session');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Stats Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-indigo-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Faculty Command Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-['Plus_Jakarta_Sans']">
            Welcome back, {teacherProfile?.name}!
          </h1>
          <p className="mt-1 text-sm text-indigo-100 max-w-xl">
            Launch one-tap dynamic QR attendance for your scheduled classes today. Students will self-verify via geofence and biometric checks.
          </p>

          {activeSession && (
            <div className="mt-5 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <div className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                    Live Session Active
                  </div>
                  <div className="text-sm font-bold text-white">
                    {subjects.find((s) => s.id === activeSession.subjectId)?.name} (Dynamic QR Active)
                  </div>
                </div>
              </div>
              <button
                onClick={() => onStartSession(activeSession)}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Resume Live Screen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Today's Classes List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Today's Scheduled Classes
            </h2>
            <p className="text-xs text-slate-500">
              Synchronized automatically from the institutional timetable engine.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {timetableSlots.length} Classes Assigned
          </span>
        </div>

        {timetableSlots.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-xs">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No scheduled classes today</p>
            <p className="text-xs text-slate-400 mt-1">
              Check back tomorrow or ask the institutional administrator to assign timetable slots.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timetableSlots.map((slot) => {
              const subject = subjects.find((s) => s.id === slot.subjectId);
              const section = sections.find((s) => s.id === slot.sectionId);
              const classroom = classrooms.find((c) => c.id === slot.classroomId);
              const isSlotActiveSession = activeSession?.timetableId === slot.id;

              return (
                <div
                  key={slot.id}
                  className={`bg-white rounded-2xl p-5 border transition-all shadow-xs hover:shadow-md ${
                    isSlotActiveSession
                      ? 'border-emerald-300 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {subject?.code || 'SUB'}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>
                        {slot.startTime} – {slot.endTime}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-3 font-['Plus_Jakarta_Sans']">
                    {subject?.name}
                  </h3>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{section?.name || 'Class Section'}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {classroom?.name} ({classroom?.building})
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      Security: <span className="font-semibold text-slate-600">Dynamic QR + Geofence + Face</span>
                    </div>
                    {isSlotActiveSession ? (
                      <button
                        onClick={() => onStartSession(activeSession)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>View Live Screen</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartAttendance(slot.id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Attendance</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

