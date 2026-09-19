import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/store';
import { AttendanceRecord, Subject, TimetableSlot } from '../../types';
import {
  GraduationCap,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigateToScan: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigateToScan }) => {
  const { studentProfile } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [todaySlots, setTodaySlots] = useState<TimetableSlot[]>([]);

  const settings = db.getSettings();
  const todayDayIndex = new Date().getDay() === 0 ? 1 : new Date().getDay();

  const sync = () => {
    if (!studentProfile) return;
    const allSubs = db.getSubjects().filter((s) => s.courseId === studentProfile.courseId && s.semesterId === studentProfile.semesterId);
    setSubjects(allSubs);

    const myRecs = db.getAttendanceRecords().filter((r) => r.studentId === studentProfile.id);
    setRecords(myRecs);

    const slots = db.getTimetables().filter((t) => t.sectionId === studentProfile.sectionId && t.dayOfWeek === todayDayIndex);
    setTodaySlots(slots);
  };

  useEffect(() => {
    sync();
    const unsub = db.subscribe(sync);
    return () => unsub();
  }, [studentProfile]);

  // Calculate stats — totalHeld computed from actual unique sessions held section-wide
  const allSectionRecords = db.getAttendanceRecords().filter(
    (r) => r.sectionId === studentProfile?.sectionId
  );
  const subjectStats = subjects.map((sub) => {
    const presentInSub = records.filter((r) => r.subjectId === sub.id && (r.status === 'present' || r.status === 'late')).length;
    // Count distinct sessionIds that were held for this subject in this section
    const heldSessions = new Set(
      allSectionRecords.filter((r) => r.subjectId === sub.id).map((r) => r.sessionId)
    );
    const totalHeld = Math.max(heldSessions.size, presentInSub);
    const pct = totalHeld > 0 ? Math.round((presentInSub / totalHeld) * 100) : 100;
    return {
      subject: sub,
      presentCount: presentInSub,
      totalHeld,
      percentage: pct,
      isLow: pct < settings.minAttendancePercentage,
    };
  });

  const totalPresent = subjectStats.reduce((acc, curr) => acc + curr.presentCount, 0);
  const totalHeldAll = subjectStats.reduce((acc, curr) => acc + curr.totalHeld, 0);
  const overallPercentage = totalHeldAll > 0 ? Math.round((totalPresent / totalHeldAll) * 100) : 100;
  const isOverallLow = overallPercentage < settings.minAttendancePercentage;

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-indigo-950/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>B.Tech 1st Year (I Sem)</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold font-mono">
                {studentProfile?.branch || 'CSE'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-bold font-mono">
                Batch {studentProfile?.batch || 'A1'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
                {studentProfile?.sectionId === 'sec_btech_1b' ? 'Section B (SL-4)' : 'Section A (SL1)'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-['Plus_Jakarta_Sans']">
              Hello, {studentProfile?.name}!
            </h1>
            <p className="mt-1 text-xs md:text-sm text-indigo-200">
              Roll No: <span className="font-mono font-bold text-white">{studentProfile?.rollNo}</span> • Enrollment: <span className="font-mono font-bold text-white">{studentProfile?.enrollmentNo}</span>
            </p>
          </div>

          <button
            onClick={onNavigateToScan}
            className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2.5 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mark Attendance Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Percentage Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Overall Attendance
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold text-slate-900 font-mono">
                  {overallPercentage}%
                </span>
                <span className="text-xs text-slate-500">
                  ({totalPresent}/{totalHeldAll} classes)
                </span>
              </div>
            </div>

            <div
              className={`p-3 rounded-2xl ${
                isOverallLow ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            {isOverallLow ? (
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Attendance shortage warning (&lt; {settings.minAttendancePercentage}%)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Good standing (Exceeds {settings.minAttendancePercentage}% threshold)</span>
              </div>
            )}
          </div>
        </div>

        {/* Biometric Status Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Verification Profile
            </span>
            <div className="mt-2 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                {studentProfile?.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Biometric Enrolled</div>
                <div className="text-xs text-slate-500 font-medium">Face & Liveness Active</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500">Geofence Status:</span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              GPS Enabled
            </span>
          </div>
        </div>

        {/* Total Recorded Check-ins */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sessions Completed
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-slate-900 font-mono">{records.length}</span>
              <span className="text-xs text-slate-500">Self check-ins recorded</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500">Academic Term:</span>
            <span className="font-semibold text-slate-700">{settings.academicSession}</span>
          </div>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown Cards */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Subject-Wise Attendance Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Institution requires at least {settings.minAttendancePercentage}% attendance to be eligible for final examinations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectStats.map(({ subject, presentCount, totalHeld, percentage, isLow }) => (
            <div
              key={subject.id}
              className={`bg-white rounded-2xl p-5 border transition-all shadow-xs hover:shadow-md ${
                isLow ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                  {subject.code}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    isLow ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {percentage}%
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-3 font-['Plus_Jakarta_Sans'] line-clamp-1">
                {subject.name}
              </h3>

              <div className="mt-3">
                <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                  <span>
                    Attended {presentCount} of {totalHeld}
                  </span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isLow ? 'bg-rose-500' : 'bg-indigo-600'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {isLow && (
                <div className="mt-3 p-2 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-1.5 text-[10px] font-bold text-rose-700">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Below 75% threshold warning</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Today's Schedule for Student */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans'] mb-3">
          Today's Classes & Timetable
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todaySlots.map((slot) => {
            const sub = subjects.find((s) => s.id === slot.subjectId);
            const teacher = db.getTeachers().find((t) => t.id === slot.teacherId);
            const classroom = db.getClassrooms().find((c) => c.id === slot.classroomId);

            return (
              <div
                key={slot.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      {slot.startTime} – {slot.endTime}
                    </span>
                    <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                      {sub?.code}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2">{sub?.name}</h3>
                  <div className="mt-2 text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>{teacher?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{classroom?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={onNavigateToScan}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Scan for this class</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

