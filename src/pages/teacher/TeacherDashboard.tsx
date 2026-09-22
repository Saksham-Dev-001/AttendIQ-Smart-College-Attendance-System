import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/store';
import { TimetableSlot, AttendanceSession, Subject, Section, Classroom } from '../../types';
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
  FileText,
  BarChart3,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  getSessionPdfHtml,
  SessionPdfData,
} from '../../services/pdfService';
import { PdfPreviewModal } from '../../components/PdfPreviewModal';

interface TeacherDashboardProps {
  onStartSession: (session: AttendanceSession) => void;
}

const DAYS_OF_WEEK = [
  { dayNumber: 1, name: 'Monday', short: 'Mon' },
  { dayNumber: 2, name: 'Tuesday', short: 'Tue' },
  { dayNumber: 3, name: 'Wednesday', short: 'Wed' },
  { dayNumber: 4, name: 'Thursday', short: 'Thu' },
  { dayNumber: 5, name: 'Friday', short: 'Fri' },
  { dayNumber: 6, name: 'Saturday', short: 'Sat' },
];

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onStartSession }) => {
  const { teacherProfile, currentUser } = useAuth();
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>([]);
  const [activeSession, setActiveSession] = useState<AttendanceSession | null>(null);
  const [pastSessions, setPastSessions] = useState<AttendanceSession[]>([]);

  // Day filter state (1 = Monday ... 6 = Saturday, 0 = All Days)
  const currentDayOfWeek = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const defaultDay = currentDayOfWeek >= 1 && currentDayOfWeek <= 6 ? currentDayOfWeek : 1;
  const [selectedDay, setSelectedDay] = useState<number>(defaultDay);

  // PDF Preview Modal state
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const subjects = db.getSubjects();
  const sections = db.getSections();
  const classrooms = db.getClassrooms();
  const settings = db.getSettings();

  const syncData = () => {
    if (!teacherProfile) return;
    const allSlots = db.getTimetables();
    // Filter slots assigned to this teacher
    const mySlots = allSlots.filter((s) => s.teacherId === teacherProfile.id);
    setTimetableSlots(mySlots);

    // Check sessions
    const sessions = db.getSessions();
    const live = sessions.find(
      (s) => s.teacherId === teacherProfile.id && s.status === 'active' && new Date() < new Date(s.expiresAt)
    );
    setActiveSession(live || null);

    const myPast = sessions
      .filter((s) => s.teacherId === teacherProfile.id)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    setPastSessions(myPast);
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

  // Open PDF for a past session
  const handleOpenSessionPdf = (session: AttendanceSession) => {
    const sub = subjects.find((s) => s.id === session.subjectId);
    const sec = sections.find((s) => s.id === session.sectionId);
    const cr = classrooms.find((c) => c.id === session.classroomId);
    const allSecStudents = db.getStudents().filter((st) => st.sectionId === session.sectionId);
    const sessionRecords = db.getAttendanceRecords().filter((r) => r.sessionId === session.id);

    const dateObj = new Date(session.startedAt);
    const dateStr = dateObj.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const studentRows = allSecStudents.map((st, idx) => {
      const rec = sessionRecords.find((r) => r.studentId === st.id);
      return {
        sNo: idx + 1,
        rollNo: st.rollNo,
        name: st.name,
        branch: st.branch || 'CSE',
        batch: st.batch || 'A1',
        status: (rec?.status as any) || 'absent',
        markedAt: rec ? new Date(rec.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        verificationSummary: rec
          ? `QR: ${rec.verification.qr}, GPS: ${rec.verification.distanceMeters ?? 18}m, Face: ${rec.verification.face}`
          : undefined,
      };
    });

    const presentCount = sessionRecords.length;
    const totalEnrolled = allSecStudents.length;
    const absentCount = Math.max(0, totalEnrolled - presentCount);
    const percentage = totalEnrolled > 0 ? parseFloat(((presentCount / totalEnrolled) * 100).toFixed(1)) : 0;

    const pdfData: SessionPdfData = {
      collegeName: settings.collegeName,
      campusName: settings.campusName,
      departmentName: 'Department of Applied Sciences & First Year Engineering',
      subjectName: sub?.name || 'Subject',
      subjectCode: sub?.code || 'SUB101',
      facultyName: teacherProfile?.name || 'Faculty Member',
      employeeId: teacherProfile?.employeeId,
      sectionName: sec?.name || 'Section',
      classroomName: cr?.name || 'Lecture Hall',
      dateStr,
      timeStr,
      academicSession: settings.academicSession,
      totalEnrolled,
      presentCount,
      absentCount,
      attendancePercentage: percentage,
      students: studentRows,
    };

    const html = getSessionPdfHtml(pdfData);
    setPreviewHtml(html);
    setPreviewTitle(`Attendance Roll Call Sheet — ${sub?.code} (${dateStr})`);
    setPreviewModalOpen(true);
  };

  // Filter slots by selected day
  const filteredSlots = timetableSlots
    .filter((slot) => selectedDay === 0 || slot.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Compute stats
  const assignedSubjects = subjects.filter((s) => teacherProfile?.assignedSubjectIds.includes(s.id));
  const totalClassesThisWeek = timetableSlots.length;
  const totalSessionsConducted = pastSessions.length;

  return (
    <div className="space-y-6">
      {/* Welcome & Stats Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-indigo-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Faculty Command Center • SBCET College</span>
            </div>
            <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-indigo-900/40 border border-indigo-400/30">
              Emp ID: {teacherProfile?.employeeId || 'EMP-T201'}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold font-['Plus_Jakarta_Sans']">
            Welcome back, {teacherProfile?.name}!
          </h1>
          <p className="mt-1 text-sm text-indigo-100 max-w-2xl">
            Department of Applied Sciences & First Year Engineering. Manage your day-wise schedule, launch dynamic anti-proxy attendance, and export official roll call sheets in PDF format.
          </p>

          {/* KPI Mini Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-[11px] text-indigo-200 font-medium">Assigned Subjects</div>
              <div className="text-xl font-extrabold mt-0.5">{assignedSubjects.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-[11px] text-indigo-200 font-medium">Weekly Lectures</div>
              <div className="text-xl font-extrabold mt-0.5">{totalClassesThisWeek}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-[11px] text-indigo-200 font-medium">Sessions Held</div>
              <div className="text-xl font-extrabold mt-0.5">{totalSessionsConducted}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-[11px] text-indigo-200 font-medium">Verification Status</div>
              <div className="text-xs font-bold mt-1 text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Active Shield</span>
              </div>
            </div>
          </div>

          {/* Active Live Session Alert */}
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

      {/* Day-wise Timetable Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Day-Wise Teaching Schedule
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a day of the week to view assigned lectures and launch dynamic attendance.
            </p>
          </div>

          {/* Day Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
            {DAYS_OF_WEEK.map((d) => {
              const isSelected = selectedDay === d.dayNumber;
              const isToday = currentDayOfWeek === d.dayNumber;
              return (
                <button
                  key={d.dayNumber}
                  onClick={() => setSelectedDay(d.dayNumber)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <span>{d.name}</span>
                  {isToday && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-emerald-300' : 'bg-indigo-600'
                      }`}
                      title="Today"
                    />
                  )}
                </button>
              );
            })}
            <button
              onClick={() => setSelectedDay(0)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDay === 0
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              All Days
            </button>
          </div>
        </div>

        {/* Schedule Cards Grid */}
        {filteredSlots.length === 0 ? (
          <div className="rounded-2xl p-8 text-center bg-slate-50 border border-dashed border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              No classes scheduled for {DAYS_OF_WEEK.find((d) => d.dayNumber === selectedDay)?.name || 'this selection'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Select another day tab above or review your assigned timetable slots.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSlots.map((slot) => {
              const subject = subjects.find((s) => s.id === slot.subjectId);
              const section = sections.find((s) => s.id === slot.sectionId);
              const classroom = classrooms.find((c) => c.id === slot.classroomId);
              const isSlotActiveSession = activeSession?.timetableId === slot.id;

              return (
                <div
                  key={slot.id}
                  className={`rounded-2xl p-5 border transition-all shadow-xs hover:shadow-md ${
                    isSlotActiveSession
                      ? 'border-emerald-300 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                      : 'border-slate-200 bg-white hover:border-indigo-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {subject?.code || 'SUB'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {slot.dayName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
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
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{section?.name}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {classroom?.name} ({classroom?.building})
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      Security: <span className="font-semibold text-slate-600">Dynamic QR + Geofence + Biometric</span>
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

      {/* Recent Completed Sessions with PDF Export */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Recent Lecture Attendance Sheets (PDF)
              </h2>
              <p className="text-xs text-slate-500">
                Directly preview and save official roll call documents for your completed sessions.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
            {pastSessions.length} Archived Sessions
          </span>
        </div>

        {pastSessions.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No completed attendance sessions yet. Start a session from the timetable above.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pastSessions.slice(0, 6).map((s) => {
              const sub = subjects.find((sb) => sb.id === s.subjectId);
              const sec = sections.find((sc) => sc.id === s.sectionId);
              const recCount = db.getAttendanceRecords().filter((r) => r.sessionId === s.id).length;
              const dateObj = new Date(s.startedAt);
              const formattedDate = dateObj.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={s.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span className="font-semibold text-slate-700">{formattedDate}</span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {sub?.code}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-900 mt-1 truncate font-['Plus_Jakarta_Sans']">
                      {sub?.name}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {sec?.name} • <span className="font-semibold text-emerald-700">{recCount} Present</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenSessionPdf(s)}
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-indigo-600 text-indigo-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View & Save PDF</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title={previewTitle}
        htmlContent={previewHtml}
      />
    </div>
  );
};
