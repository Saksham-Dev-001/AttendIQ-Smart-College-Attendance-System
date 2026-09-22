import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/store';
import {
  AttendanceRecord,
  AttendanceSession,
  AttendanceStatus,
  Subject,
  Section,
  StudentProfile,
} from '../../types';
import { exportAttendanceToCSV } from '../../services/exportService';
import {
  getSessionPdfHtml,
  getSubjectCumulativePdfHtml,
  SessionPdfData,
  SubjectCumulativePdfData,
} from '../../services/pdfService';
import { PdfPreviewModal } from '../../components/PdfPreviewModal';
import {
  History,
  FileSpreadsheet,
  FileText,
  Calendar,
  BookOpen,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit3,
  X,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Download,
  Users,
  Clock,
  MapPin,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

export const TeacherHistory: React.FC = () => {
  const { currentUser, teacherProfile } = useAuth();
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);

  // Navigation Tabs: 'daywise' | 'cumulative' | 'corrections'
  const [activeTab, setActiveTab] = useState<'daywise' | 'cumulative' | 'corrections'>('daywise');

  // Filters for Daywise tab
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Filters for Cumulative tab
  const [cumulativeSubjectId, setCumulativeSubjectId] = useState<string>('');
  const [cumulativeSectionId, setCumulativeSectionId] = useState<string>('');
  const [cumulativeSearch, setCumulativeSearch] = useState<string>('');

  // Correction Modal state
  const [correctionTarget, setCorrectionTarget] = useState<AttendanceRecord | null>(null);
  const [newStatus, setNewStatus] = useState<AttendanceStatus>('present');
  const [reason, setReason] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);

  // PDF Preview Modal state
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfHtml, setPdfHtml] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');

  const settings = db.getSettings();

  const sync = () => {
    if (!teacherProfile) return;
    const allSubs = db.getSubjects();
    setSubjects(allSubs);
    setSections(db.getSections());
    setStudents(db.getStudents());

    const mySessions = db
      .getSessions()
      .filter((s) => s.teacherId === teacherProfile.id)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    setSessions(mySessions);

    const allRecs = db.getAttendanceRecords().filter((r) => r.teacherId === teacherProfile.id);
    setRecords(allRecs);

    // Default cumulative subject/section if not set
    if (!cumulativeSubjectId && teacherProfile.assignedSubjectIds.length > 0) {
      setCumulativeSubjectId(teacherProfile.assignedSubjectIds[0]);
    }
    if (!cumulativeSectionId && db.getSections().length > 0) {
      setCumulativeSectionId(db.getSections()[0].id);
    }
  };

  useEffect(() => {
    sync();
    const unsub = db.subscribe(sync);
    return () => unsub();
  }, [teacherProfile]);

  // Handler to export single session PDF
  const handleExportSessionPdf = (session: AttendanceSession) => {
    const sub = subjects.find((s) => s.id === session.subjectId);
    const sec = sections.find((s) => s.id === session.sectionId);
    const cr = db.getClassrooms().find((c) => c.id === session.classroomId);
    const secStudents = students.filter((st) => st.sectionId === session.sectionId);
    const sessionRecs = records.filter((r) => r.sessionId === session.id);

    const dateObj = new Date(session.startedAt);
    const dateStr = dateObj.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const studentRows = secStudents.map((st, idx) => {
      const rec = sessionRecs.find((r) => r.studentId === st.id);
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

    const presentCount = sessionRecs.length;
    const totalEnrolled = secStudents.length;
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
    setPdfHtml(html);
    setPdfTitle(`Official Attendance Roll Call Sheet — ${sub?.code} (${dateStr})`);
    setPdfModalOpen(true);
  };

  // Handler to export Cumulative Subject Register PDF
  const handleExportCumulativePdf = () => {
    const sub = subjects.find((s) => s.id === cumulativeSubjectId);
    const sec = sections.find((s) => s.id === cumulativeSectionId);
    const secStudents = students.filter((st) => st.sectionId === cumulativeSectionId);

    // Find all sessions for this teacher, subject, section
    const subjectSessions = sessions.filter(
      (s) => s.subjectId === cumulativeSubjectId && s.sectionId === cumulativeSectionId
    );
    const totalLectures = subjectSessions.length || 1;

    const studentRows = secStudents.map((st, idx) => {
      const attendedCount = records.filter(
        (r) =>
          r.studentId === st.id &&
          r.subjectId === cumulativeSubjectId &&
          (r.status === 'present' || r.status === 'late')
      ).length;

      const percentage = parseFloat(((attendedCount / totalLectures) * 100).toFixed(1));
      return {
        sNo: idx + 1,
        rollNo: st.rollNo,
        name: st.name,
        branch: st.branch || 'CSE',
        batch: st.batch || 'A1',
        attendedLectures: attendedCount,
        totalLectures,
        percentage,
        isShortage: percentage < 75,
      };
    });

    const pdfData: SubjectCumulativePdfData = {
      collegeName: settings.collegeName,
      campusName: settings.campusName,
      departmentName: 'Department of Applied Sciences & First Year Engineering',
      subjectName: sub?.name || 'Subject',
      subjectCode: sub?.code || 'SUB101',
      facultyName: teacherProfile?.name || 'Faculty Member',
      employeeId: teacherProfile?.employeeId,
      sectionName: sec?.name || 'Section',
      academicSession: settings.academicSession,
      totalLecturesConducted: totalLectures,
      students: studentRows,
    };

    const html = getSubjectCumulativePdfHtml(pdfData);
    setPdfHtml(html);
    setPdfTitle(`Cumulative Attendance Register — ${sub?.code} (${sec?.name})`);
    setPdfModalOpen(true);
  };

  const handleExportCSV = () => {
    const relevantRecords = records.filter((r) => {
      const matchesSub = selectedSubjectId === 'all' || r.subjectId === selectedSubjectId;
      const matchesSec = selectedSectionId === 'all' || r.sectionId === selectedSectionId;
      return matchesSub && matchesSec;
    });
    exportAttendanceToCSV(
      relevantRecords,
      subjects,
      `AttendIQ_${teacherProfile?.employeeId}_Attendance_Report.csv`
    );
  };

  const handleSaveCorrection = () => {
    if (!correctionTarget) return;
    if (!reason.trim() || reason.trim().length < 6) {
      setModalError('Please enter a clear justification reason (minimum 6 characters).');
      return;
    }

    try {
      db.correctAttendanceRecord(correctionTarget.id, newStatus, reason.trim(), {
        id: currentUser?.id || 'tea_101',
        name: currentUser?.name || 'Faculty Member',
        role: 'teacher',
      });
      setCorrectionTarget(null);
      setReason('');
      setModalError(null);
      alert('Attendance record successfully corrected and registered in the immutable institutional audit log.');
    } catch (err: any) {
      setModalError(err.message || 'Failed to correct record.');
    }
  };

  // Filter sessions for Daywise tab
  const filteredSessions = sessions.filter((s) => {
    const matchesSub = selectedSubjectId === 'all' || s.subjectId === selectedSubjectId;
    const matchesSec = selectedSectionId === 'all' || s.sectionId === selectedSectionId;
    const matchesDate = !selectedDate || s.startedAt.startsWith(selectedDate);
    return matchesSub && matchesSec && matchesDate;
  });

  // Cumulative students data calculation
  const cumulativeSecStudents = students.filter((st) => st.sectionId === cumulativeSectionId);
  const cumulativeSessions = sessions.filter(
    (s) => s.subjectId === cumulativeSubjectId && s.sectionId === cumulativeSectionId
  );
  const totalConducted = cumulativeSessions.length || 1;

  const cumulativeRoster = cumulativeSecStudents
    .map((st) => {
      const attended = records.filter(
        (r) =>
          r.studentId === st.id &&
          r.subjectId === cumulativeSubjectId &&
          (r.status === 'present' || r.status === 'late')
      ).length;
      const percentage = parseFloat(((attended / totalConducted) * 100).toFixed(1));
      return {
        student: st,
        attended,
        total: totalConducted,
        percentage,
        isShortage: percentage < 75,
      };
    })
    .filter(
      (item) =>
        !cumulativeSearch ||
        item.student.name.toLowerCase().includes(cumulativeSearch.toLowerCase()) ||
        item.student.rollNo.toLowerCase().includes(cumulativeSearch.toLowerCase())
    );

  const totalShortageCount = cumulativeRoster.filter((item) => item.isShortage).length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Attendance Records & Register Reports
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Organized day-wise lecture logs, cumulative course registers, and printable PDF roll call sheets for SBCET College.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCumulativePdf}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Subject PDF</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('daywise')}
          className={`pb-3 px-2 flex items-center gap-2 transition-colors relative ${
            activeTab === 'daywise'
              ? 'text-indigo-600 border-b-2 border-indigo-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Day-Wise Lecture Logs ({filteredSessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cumulative')}
          className={`pb-3 px-2 flex items-center gap-2 transition-colors relative ${
            activeTab === 'cumulative'
              ? 'text-indigo-600 border-b-2 border-indigo-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Subject Cumulative Register</span>
        </button>

        <button
          onClick={() => setActiveTab('corrections')}
          className={`pb-3 px-2 flex items-center gap-2 transition-colors relative ${
            activeTab === 'corrections'
              ? 'text-indigo-600 border-b-2 border-indigo-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Auditable Corrections</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: DAY-WISE & SESSION HISTORY                                  */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'daywise' && (
        <div className="space-y-4">
          {/* Daywise Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {/* Subject Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Subject:</span>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Assigned Subjects</option>
                  {subjects
                    .filter((s) => teacherProfile?.assignedSubjectIds.includes(s.id))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                </select>
              </div>

              {/* Section Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Section:</span>
                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Sections</option>
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                />
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate('')}
                    className="text-xs text-indigo-600 hover:underline font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-400">
              Showing {filteredSessions.length} Conducted Lectures
            </div>
          </div>

          {/* Sessions List */}
          {filteredSessions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No lecture sessions match this filter</p>
              <p className="text-xs text-slate-400 mt-1">
                Try selecting "All Assigned Subjects" or clear the date filter.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSessions.map((session) => {
                const sub = subjects.find((s) => s.id === session.subjectId);
                const sec = sections.find((s) => s.id === session.sectionId);
                const cr = db.getClassrooms().find((c) => c.id === session.classroomId);
                const secStudents = students.filter((st) => st.sectionId === session.sectionId);
                const sessionRecs = records.filter((r) => r.sessionId === session.id);

                const dateObj = new Date(session.startedAt);
                const formattedDate = dateObj.toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
                const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const presentCount = sessionRecs.length;
                const totalCount = secStudents.length;
                const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
                const isExpanded = expandedSessionId === session.id;

                return (
                  <div
                    key={session.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-slate-300"
                  >
                    {/* Session Summary Card */}
                    <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100 shrink-0 text-center min-w-[64px]">
                          <div className="text-[10px] uppercase font-bold text-indigo-500">
                            {dateObj.toLocaleDateString('en-IN', { weekday: 'short' })}
                          </div>
                          <div className="text-lg font-extrabold text-indigo-950 leading-tight">
                            {dateObj.getDate()}
                          </div>
                          <div className="text-[10px] text-indigo-600 font-semibold">
                            {dateObj.toLocaleDateString('en-IN', { month: 'short' })}
                          </div>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {sub?.code}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                              {sub?.name}
                            </h3>
                          </div>

                          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-semibold text-slate-700">{sec?.name}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{formattedTime}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{cr?.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Attendance Bar & Actions */}
                      <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <div className="text-right min-w-[130px]">
                          <div className="flex justify-between md:justify-end items-center gap-2 text-xs font-bold text-slate-700">
                            <span>{presentCount} / {totalCount} Present</span>
                            <span className={percentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}>
                              {percentage}%
                            </span>
                          </div>
                          <div className="w-full md:w-32 bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleExportSessionPdf(session)}
                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold text-xs rounded-xl border border-indigo-200 transition-all flex items-center gap-1.5 shadow-2xs"
                            title="Print or Save official PDF Roll Call sheet"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>PDF Sheet</span>
                          </button>

                          <button
                            onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                            className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                              isExpanded
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                            title={isExpanded ? 'Hide Roll Call' : 'View Full Class Roll Call'}
                          >
                            <span className="hidden sm:inline">
                              {isExpanded ? 'Hide Roll Call' : 'View Names'}
                            </span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Complete Class Roll Call */}
                    {isExpanded && (
                      <div className="bg-slate-50/80 border-t border-slate-200 p-4 sm:p-5 animate-in fade-in duration-200">
                        <div className="flex flex-wrap justify-between items-center mb-3 text-xs">
                          <span className="font-bold text-slate-800">
                            Full Class Roster ({secStudents.length} Students)
                          </span>
                          <span className="text-slate-500 text-[11px]">
                            Showing all enrolled students in {sec?.name}
                          </span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                              <tr>
                                <th className="py-2.5 px-3 text-center">#</th>
                                <th className="py-2.5 px-3">Roll No</th>
                                <th className="py-2.5 px-3">Student Name</th>
                                <th className="py-2.5 px-3">Branch (Batch)</th>
                                <th className="py-2.5 px-3">Status</th>
                                <th className="py-2.5 px-3">Check-in Time</th>
                                <th className="py-2.5 px-3">Verification Details</th>
                                <th className="py-2.5 px-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                              {secStudents.map((st, idx) => {
                                const rec = sessionRecs.find((r) => r.studentId === st.id);
                                const isPresent = rec?.status === 'present' || rec?.status === 'late';

                                return (
                                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                                      {idx + 1}
                                    </td>
                                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800 text-[11px]">
                                      {st.rollNo}
                                    </td>
                                    <td className="py-2.5 px-3 font-bold text-slate-900">
                                      {st.name}
                                    </td>
                                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                                      {st.branch} ({st.batch})
                                    </td>
                                    <td className="py-2.5 px-3">
                                      {isPresent ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 capitalize">
                                          <CheckCircle2 className="w-3 h-3" />
                                          {rec?.status}
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 uppercase">
                                          <XCircle className="w-3 h-3" />
                                          ABSENT
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                                      {rec ? new Date(rec.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                                    </td>
                                    <td className="py-2.5 px-3 text-[10px] text-slate-500">
                                      {rec ? (
                                        <div className="flex items-center gap-1 text-slate-600">
                                          <span className="text-emerald-700 font-semibold">QR: {rec.verification.qr}</span>
                                          <span>•</span>
                                          <span className="text-indigo-700 font-semibold">{rec.verification.distanceMeters ?? 18}m</span>
                                          <span>•</span>
                                          <span className="text-purple-700 font-semibold">Face: {rec.verification.face}</span>
                                        </div>
                                      ) : (
                                        <span className="text-slate-400">Not recorded</span>
                                      )}
                                    </td>
                                    <td className="py-2.5 px-3 text-right">
                                      {rec && (
                                        <button
                                          onClick={() => {
                                            setCorrectionTarget(rec);
                                            setNewStatus(rec.status);
                                            setReason('');
                                            setModalError(null);
                                          }}
                                          className="px-2 py-0.5 text-xs text-indigo-600 hover:text-indigo-800 hover:underline font-semibold"
                                        >
                                          Correct
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: SUBJECT CUMULATIVE REGISTER                                  */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'cumulative' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Select Subject
                </label>
                <select
                  value={cumulativeSubjectId}
                  onChange={(e) => setCumulativeSubjectId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  {subjects
                    .filter((s) => teacherProfile?.assignedSubjectIds.includes(s.id))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Select Section
                </label>
                <select
                  value={cumulativeSectionId}
                  onChange={(e) => setCumulativeSectionId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 self-stretch sm:self-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={cumulativeSearch}
                  onChange={(e) => setCumulativeSearch(e.target.value)}
                  placeholder="Search student or roll no..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <button
                onClick={handleExportCumulativePdf}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
              >
                <FileText className="w-4 h-4" />
                <span>Export PDF Register</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-semibold text-slate-400">Total Classes Conducted</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalConducted} Lectures</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-semibold text-slate-400">Enrolled Students</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{cumulativeSecStudents.length} Students</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-semibold text-rose-500">Shortage Warning (&lt;75%)</div>
              <div className="text-2xl font-extrabold text-rose-600 mt-1">{totalShortageCount} Students</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-semibold text-emerald-600">Eligible (≥75%)</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                {cumulativeSecStudents.length - totalShortageCount} Students
              </div>
            </div>
          </div>

          {/* Cumulative Table of All Student Names */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">
                Complete Student Attendance Register ({cumulativeRoster.length} Names)
              </h3>
              <span className="text-xs text-slate-400">
                Mandatory statutory threshold: 75%
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 text-center">#</th>
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Branch & Batch</th>
                    <th className="py-3 px-4 text-center">Lectures Attended</th>
                    <th className="py-3 px-4 text-center">Percentage</th>
                    <th className="py-3 px-4 text-center">Eligibility Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {cumulativeRoster.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No students found matching filters.
                      </td>
                    </tr>
                  ) : (
                    cumulativeRoster.map((row, idx) => (
                      <tr
                        key={row.student.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          row.isShortage ? 'bg-rose-50/30' : ''
                        }`}
                      >
                        <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                          {row.student.rollNo}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {row.student.name}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {row.student.branch} ({row.student.batch})
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-800">
                          {row.attended} / {row.total}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-mono font-extrabold text-xs ${
                              row.isShortage ? 'text-rose-600' : 'text-emerald-700'
                            }`}
                          >
                            {row.percentage}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {row.isShortage ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              SHORTAGE (&lt;75%)
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              ELIGIBLE
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* TAB 3: AUDITABLE CORRECTIONS                                        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTab === 'corrections' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Attendance Audit Trail & Verification Logs
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Every status correction requires an explicit justification reason and is permanently recorded in the institutional ledger.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Roll No</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">Marked Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Verification</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {records.slice(0, 40).map((r) => {
                    const sub = subjects.find((s) => s.id === r.subjectId);
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{r.studentName}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{r.rollNo}</td>
                        <td className="py-3.5 px-4">{sub?.name || r.subjectId}</td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(r.markedAt).toLocaleDateString()} at{' '}
                          {new Date(r.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              r.status === 'present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.status === 'late'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[10px]">
                          QR: {r.verification.qr} • {r.verification.distanceMeters ?? 18}m • Face: {r.verification.face}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setCorrectionTarget(r);
                              setNewStatus(r.status);
                              setReason('');
                              setModalError(null);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Correct</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* CORRECTION MODAL                                                    */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {correctionTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Request Attendance Correction
                </h3>
              </div>
              <button
                onClick={() => setCorrectionTarget(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Updating record for <strong className="text-slate-800">{correctionTarget.studentName}</strong> ({correctionTarget.rollNo}).
              This modification will be permanently registered in the institutional audit log.
            </p>

            {modalError && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{modalError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corrected Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AttendanceStatus)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                  <option value="excused">Excused (Medical / Official)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Justification Reason (Mandatory)
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Student experienced network timeout; verified physical attendance in lecture hall."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCorrectionTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCorrection}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
              >
                Record Correction & Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        title={pdfTitle}
        htmlContent={pdfHtml}
      />
    </div>
  );
};
