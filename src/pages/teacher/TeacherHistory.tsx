import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/store';
import { AttendanceRecord, AttendanceStatus, Subject } from '../../types';
import { exportAttendanceToCSV } from '../../services/exportService';
import {
  History,
  FileSpreadsheet,
  Edit3,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';

export const TeacherHistory: React.FC = () => {
  const { currentUser, teacherProfile } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal for correction
  const [correctionTarget, setCorrectionTarget] = useState<AttendanceRecord | null>(null);
  const [newStatus, setNewStatus] = useState<AttendanceStatus>('present');
  const [reason, setReason] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);

  const sync = () => {
    if (!teacherProfile) return;
    const allSubs = db.getSubjects();
    setSubjects(allSubs);

    const allRecs = db.getAttendanceRecords().filter((r) => r.teacherId === teacherProfile.id);
    setRecords(allRecs);
  };

  useEffect(() => {
    sync();
    const unsub = db.subscribe(sync);
    return () => unsub();
  }, [teacherProfile]);

  const handleExport = () => {
    exportAttendanceToCSV(filteredRecords, subjects, `Attendance_Report_${teacherProfile?.employeeId}.csv`);
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
        name: currentUser?.name || 'Faculty',
        role: 'teacher',
      });
      setCorrectionTarget(null);
      setReason('');
      setModalError(null);
      alert('Attendance record corrected and permanently recorded to institutional audit log.');
    } catch (err: any) {
      setModalError(err.message || 'Failed to correct record.');
    }
  };

  const filteredRecords = records.filter((r) => {
    const matchesSub = selectedSubjectId === 'all' || r.subjectId === selectedSubjectId;
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSub && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Attendance History & Corrections
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review past attendance records for your assigned subjects. Any modifications require an auditable justification.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student name or roll number..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Roll No</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No attendance records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
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
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-emerald-700 font-semibold">QR: {r.verification.qr}</span>
                          <span>•</span>
                          <span className="text-indigo-700 font-semibold">{r.verification.distanceMeters ?? 18}m</span>
                          <span>•</span>
                          <span className="text-purple-700 font-semibold">Face: {r.verification.face}</span>
                        </div>
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Correction Modal */}
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
    </div>
  );
};

