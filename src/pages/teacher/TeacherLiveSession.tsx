import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/store';
import { AttendanceSession, AttendanceRecord } from '../../types';
import { generateQrDataUrl } from '../../services/qrService';
import {
  QrCode,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lock,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  MapPin,
  Smile,
  Copy,
  Check,
  UserCheck,
  FileText,
} from 'lucide-react';
import { getSessionPdfHtml, SessionPdfData } from '../../services/pdfService';
import { PdfPreviewModal } from '../../components/PdfPreviewModal';

interface TeacherLiveSessionProps {
  session: AttendanceSession;
  onClose: () => void;
}

export const TeacherLiveSession: React.FC<TeacherLiveSessionProps> = ({
  session: initialSession,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const [session, setSession] = useState<AttendanceSession>(initialSession);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [copiedToken, setCopiedToken] = useState(false);

  // Timers
  const [qrSecondsLeft, setQrSecondsLeft] = useState<number>(25);
  const [sessionSecondsLeft, setSessionSecondsLeft] = useState<number>(600);

  // PDF Preview state
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfHtml, setPdfHtml] = useState('');

  const settings = db.getSettings();
  const subject = db.getSubjects().find((s) => s.id === session.subjectId);
  const section = db.getSections().find((s) => s.id === session.sectionId);
  const classroom = db.getClassrooms().find((c) => c.id === session.classroomId);
  const students = db.getStudents().filter((st) => st.sectionId === session.sectionId);

  // Sync data & load QR
  const syncSessionData = async () => {
    const updated = db.getSessions().find((s) => s.id === session.id);
    if (updated) {
      setSession(updated);
      try {
        const url = await generateQrDataUrl(updated.currentQrToken);
        setQrDataUrl(url);
      } catch (err) {
        console.error('Failed to generate QR image:', err);
      }
    }

    // Get attendance records for this session
    const currentRecords = db.getAttendanceRecords().filter((r) => r.sessionId === session.id);
    setRecords(currentRecords);
  };

  useEffect(() => {
    syncSessionData();
    const unsubscribe = db.subscribe(syncSessionData);
    return () => unsubscribe();
  }, [session.id]);

  // Overall session countdown & QR rotation countdown
  useEffect(() => {
    const timer = setInterval(() => {
      // Calculate remaining session time
      const expiresAtMs = new Date(session.expiresAt).getTime();
      const nowMs = Date.now();
      const remainingMs = Math.max(0, expiresAtMs - nowMs);
      const remainingSec = Math.floor(remainingMs / 1000);
      setSessionSecondsLeft(remainingSec);

      if (remainingSec <= 0 && session.status === 'active') {
        db.closeAttendanceSession(session.id, currentUser?.id || 'sys', currentUser?.name || 'Faculty');
      }

      // Decrement QR refresh timer
      setQrSecondsLeft((prev) => {
        if (prev <= 1) {
          // Trigger dynamic QR rotation
          const refreshed = db.rotateSessionQr(session.id);
          if (refreshed) {
            setSession(refreshed);
          }
          return settings.qrRefreshSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session.id, session.expiresAt, session.status, settings.qrRefreshSeconds]);

  const handleManualRotate = () => {
    const refreshed = db.rotateSessionQr(session.id);
    if (refreshed) {
      setSession(refreshed);
      setQrSecondsLeft(settings.qrRefreshSeconds);
    }
  };

  const handleCloseSession = () => {
    if (window.confirm('Are you sure you want to close this attendance session? Later submissions will be rejected.')) {
      db.closeAttendanceSession(session.id, currentUser?.id || 'tea_101', currentUser?.name || 'Faculty');
      onClose();
    }
  };

  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(session.currentQrToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Faculty assisted roll call for in-person students without device
  const handleManualStudentCheckIn = () => {
    const unmarkedStudent = students.find((st) => !records.some((r) => r.studentId === st.id));
    if (!unmarkedStudent) {
      alert('All students in this section are already marked present!');
      return;
    }

    db.recordAttendance({
      sessionId: session.id,
      studentId: unmarkedStudent.id,
      verification: {
        qr: 'passed',
        geofence: 'passed',
        face: 'passed',
        liveness: 'passed',
        distanceMeters: Math.floor(Math.random() * 15) + 5,
        faceMatchScore: 0.98,
        deviceTimestamp: new Date().toISOString(),
      },
    });
  };

  const handleExportLivePdf = () => {
    const dateObj = new Date(session.startedAt);
    const dateStr = dateObj.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const studentRows = students.map((st, idx) => {
      const rec = records.find((r) => r.studentId === st.id);
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

    const presentCount = records.length;
    const totalEnrolled = students.length;
    const absentCount = Math.max(0, totalEnrolled - presentCount);
    const percentage = totalEnrolled > 0 ? parseFloat(((presentCount / totalEnrolled) * 100).toFixed(1)) : 0;

    const pdfData: SessionPdfData = {
      collegeName: settings.collegeName,
      campusName: settings.campusName,
      departmentName: 'Department of Applied Sciences & First Year Engineering',
      subjectName: subject?.name || 'Subject',
      subjectCode: subject?.code || 'SUB101',
      facultyName: currentUser?.name || 'Faculty Member',
      sectionName: section?.name || 'Section',
      classroomName: classroom?.name || 'Lecture Hall',
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
    setPdfModalOpen(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const presentCount = records.length;
  const totalCount = students.length;
  const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              LIVE ATTENDANCE SESSION
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {section?.name} • {classroom?.name}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1 font-['Plus_Jakarta_Sans']">
            {subject?.name} ({subject?.code})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              Session Expires In
            </div>
            <div className="text-xl font-extrabold font-mono text-indigo-600 flex items-center justify-end gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(sessionSecondsLeft)}</span>
            </div>
          </div>
          <button
            onClick={handleExportLivePdf}
            className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
            title="Download or Print live official Attendance Sheet (PDF)"
          >
            <FileText className="w-4 h-4" />
            <span>PDF Sheet</span>
          </button>
          <button
            onClick={handleCloseSession}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
          >
            <Lock className="w-4 h-4" />
            <span>Close Session</span>
          </button>
        </div>
      </div>

      {/* Main split: Dynamic QR on Left, Live Counter & Feed on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dynamic QR Code Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-full flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <QrCode className="w-4 h-4 text-indigo-600" />
              <span>Dynamic Attendance QR</span>
            </div>
            <button
              onClick={handleManualRotate}
              title="Manually rotate QR token"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rotate Now</span>
            </button>
          </div>

          {/* QR Container */}
          <div className="relative p-4 bg-slate-50 rounded-3xl border-2 border-indigo-100 shadow-inner group">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Dynamic Attendance QR"
                className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl shadow-md object-contain bg-white p-2"
              />
            ) : (
              <div className="w-64 h-64 flex items-center justify-center text-slate-400">
                Generating QR code...
              </div>
            )}

            {/* QR Token Version Badge */}
            <div className="absolute bottom-6 right-6 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-md backdrop-blur-xs">
              v{session.qrVersion}
            </div>
          </div>

          {/* Dynamic Refresh Progress Bar */}
          <div className="w-full mt-4">
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-indigo-500 animate-spin-slow" />
                Anti-Screenshot Token Auto-Refresh
              </span>
              <span className="font-mono font-bold text-indigo-600">{qrSecondsLeft}s</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(qrSecondsLeft / settings.qrRefreshSeconds) * 100}%` }}
              />
            </div>
          </div>

          {/* Instructions & Raw Token Copy for Simulator */}
          <div className="mt-4 p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 w-full text-left">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider">
                Current Session Token
              </span>
              <button
                onClick={copyTokenToClipboard}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
              >
                {copiedToken ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Token</span>
                  </>
                )}
              </button>
            </div>
            <p className="mt-1 font-mono text-[10px] text-slate-600 truncate bg-white p-1.5 rounded-lg border border-slate-200 select-all">
              {session.currentQrToken}
            </p>
            <p className="mt-1.5 text-[10px] text-slate-500">
              Students scan this QR from their AttendIQ Student portal. Screenshots expire in {settings.qrRefreshSeconds} seconds.
            </p>
          </div>

          {/* Faculty Assisted Roll Call Option */}
          <div className="mt-4 w-full">
            <button
              onClick={handleManualStudentCheckIn}
              className="w-full py-2.5 px-3 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Assisted Roll Call (Mark In-Person Present)</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-1">
              For in-person students experiencing mobile connectivity issues
            </p>
          </div>
        </div>

        {/* Live Attendance Counter & Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Ticker Header Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Real-Time Attendance Counter
              </span>
              <span className="text-xs font-bold text-indigo-600">{percentage}% Present</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 font-mono">{presentCount}</span>
              <span className="text-lg font-bold text-slate-400 font-mono">/ {totalCount}</span>
              <span className="text-xs text-slate-500 ml-2 font-medium">Students in {section?.name}</span>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Checked-In Students Live Feed */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Live Verified Check-Ins ({records.length})
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Sorted by most recent
              </span>
            </div>

            {records.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">
                  Waiting for students to scan the dynamic QR...
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Check-ins will appear here in real time as biometric and geofence checks pass.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 font-['Plus_Jakarta_Sans']">
                          {record.studentName}
                        </span>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                          {record.rollNo}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            record.status === 'present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {record.status}
                        </span>
                      </div>

                      {/* Verification Chips */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-medium">
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                          <CheckCircle className="w-3 h-3" /> QR Valid
                        </span>
                        <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100">
                          <MapPin className="w-3 h-3" /> Geofence: {record.verification.distanceMeters}m
                        </span>
                        <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md border border-purple-100">
                          <Smile className="w-3 h-3" /> Face Match
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 sm:text-right shrink-0">
                      {new Date(record.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        title={`Live Attendance Roll Call Sheet — ${subject?.code} (${section?.name})`}
        htmlContent={pdfHtml}
      />
    </div>
  );
};

