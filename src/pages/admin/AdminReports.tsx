import React, { useState, useEffect } from 'react';
import { db } from '../../db/store';
import { AttendanceRecord, Subject, StudentProfile } from '../../types';
import { exportAttendanceToCSV } from '../../services/exportService';
import { FileSpreadsheet, Download, Search, Filter, Calendar } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sync = () => {
    setRecords(db.getAttendanceRecords());
    setSubjects(db.getSubjects());
    setStudents(db.getStudents());
  };

  useEffect(() => {
    sync();
    const unsub = db.subscribe(sync);
    return () => unsub();
  }, []);

  // Map student roll/id to profile metadata
  const studentMap = new Map<string, StudentProfile>();
  students.forEach((s) => {
    studentMap.set(s.id, s);
    studentMap.set(s.rollNo, s);
  });

  // Attach branch and batch metadata to records for display & export
  const enrichedRecords = records.map((r) => {
    const profile = studentMap.get(r.studentId) || studentMap.get(r.rollNo);
    return {
      ...r,
      branch: profile?.branch || 'CSE',
      batch: profile?.batch || 'A1',
    };
  });

  const filteredRecords = enrichedRecords.filter((r) => {
    const matchesSub = selectedSubjectId === 'all' || r.subjectId === selectedSubjectId;
    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
    const matchesBranch = selectedBranch === 'all' || r.branch === selectedBranch;
    const matchesBatch = selectedBatch === 'all' || r.batch === selectedBatch;
    const matchesSection = selectedSection === 'all' || r.sectionId === selectedSection;
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.branch.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSub && matchesStatus && matchesBranch && matchesBatch && matchesSection && matchesSearch;
  });

  const handleExportCSV = () => {
    exportAttendanceToCSV(
      filteredRecords,
      subjects,
      `AttendIQ_Report_${selectedBranch !== 'all' ? selectedBranch : 'AllBranches'}_${selectedBatch !== 'all' ? selectedBatch : 'AllBatches'}.csv`
    );
  };

  const getBranchBadgeStyle = (branch?: string) => {
    switch (branch) {
      case 'CSE':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CS':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'AI':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'CSE-DS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Mech':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Institutional Attendance Reports & Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Filter attendance records branch-wise, batch-wise, and subject-wise. Export verified records directly to CSV.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Filtered CSV ({filteredRecords.length})</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student, roll number, or branch..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Section Filter */}
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Sections</option>
              <option value="sec_btech_1a">Section A (CSE & CS)</option>
              <option value="sec_btech_1b">Section B (AI & DS)</option>
            </select>

            {/* Branch Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Branches</option>
              <option value="CSE">CSE (Computer Science & Engg)</option>
              <option value="CS">CS (Computer Science)</option>
              <option value="AI">AI (Artificial Intelligence)</option>
              <option value="CSE-DS">CSE-DS (Data Science)</option>
              <option value="Mech">Mech (Mechanical)</option>
            </select>

            {/* Batch Filter */}
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Batches</option>
              <option value="A1">Batch A1</option>
              <option value="A2">Batch A2</option>
              <option value="B1">Batch B1</option>
              <option value="B2">Batch B2</option>
            </select>

            {/* Subject Filter */}
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
              <option value="excused">Excused</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-slate-400">Showing {filteredRecords.length} records</span>
          {(selectedBranch !== 'all' || selectedBatch !== 'all' || selectedSection !== 'all' || selectedSubjectId !== 'all' || selectedStatus !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedBranch('all');
                setSelectedBatch('all');
                setSelectedSection('all');
                setSelectedSubjectId('all');
                setSelectedStatus('all');
                setSearchTerm('');
              }}
              className="text-xs text-indigo-600 hover:underline font-bold ml-2"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Roll No</th>
                <th className="py-3.5 px-4">Branch & Batch</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Geofence</th>
                <th className="py-3.5 px-4">Face & Liveness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No attendance records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const sub = subjects.find((s) => s.id === r.subjectId);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{r.studentName}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-600">{r.rollNo}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getBranchBadgeStyle(r.branch)}`}>
                            {r.branch}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                            {r.batch}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{sub?.name || r.subjectId}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{sub?.code}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(r.markedAt).toLocaleDateString()} at{' '}
                        {new Date(r.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
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
                      <td className="py-3 px-4 text-[10px] font-mono text-emerald-700">
                        {r.verification.geofence} ({r.verification.distanceMeters ?? 18}m)
                      </td>
                      <td className="py-3 px-4 text-[10px] font-mono text-indigo-700">
                        face: {r.verification.face} • live: {r.verification.liveness}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
