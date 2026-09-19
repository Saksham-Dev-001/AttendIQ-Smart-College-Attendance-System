import React, { useState, useEffect } from 'react';
import { db } from '../../db/store';
import { StudentProfile, TeacherProfile } from '../../types';
import {
  Users,
  GraduationCap,
  Briefcase,
  Plus,
  Search,
  CheckCircle2,
  Filter,
  Sparkles,
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Branch & Batch filters
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');

  // Modals
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [stuName, setStuName] = useState('');
  const [stuRoll, setStuRoll] = useState('');
  const [stuEmail, setStuEmail] = useState('');
  const [stuBranch, setStuBranch] = useState('CSE');
  const [stuBatch, setStuBatch] = useState('A1');
  const [stuSection, setStuSection] = useState('sec_btech_1a');

  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [teaName, setTeaName] = useState('');
  const [teaEmpId, setTeaEmpId] = useState('');
  const [teaEmail, setTeaEmail] = useState('');

  const sync = () => {
    setStudents(db.getStudents());
    setTeachers(db.getTeachers());
  };

  useEffect(() => {
    sync();
    const unsub = db.subscribe(sync);
    return () => unsub();
  }, []);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stuName || !stuRoll || !stuEmail) return;

    db.addStudent(
      {
        name: stuName,
        rollNo: stuRoll,
        enrollmentNo: `SBCET/2026/${stuRoll.replace(/[^0-9A-Za-z]/g, '').slice(-6)}`,
        departmentId: 'dept_first_year',
        courseId: 'course_btech',
        semesterId: 'sem_btech_1',
        sectionId: stuSection,
        batch: stuBatch,
        branch: stuBranch,
        academicSessionId: '2026-27',
        status: 'active',
        faceProfileStatus: 'verified',
        email: stuEmail,
      },
      stuEmail
    );

    setStuName('');
    setStuRoll('');
    setStuEmail('');
    setShowStudentModal(false);
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teaName || !teaEmpId || !teaEmail) return;

    db.addTeacher(
      {
        employeeId: teaEmpId,
        name: teaName,
        departmentId: 'dept_first_year',
        email: teaEmail,
        assignedSubjectIds: ['sub_chem'],
        status: 'active',
      },
      teaEmail
    );

    setTeaName('');
    setTeaEmpId('');
    setTeaEmail('');
    setShowTeacherModal(false);
  };

  // Branch styling helper
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

  // Student counts by branch
  const cseCount = students.filter((s) => s.branch === 'CSE').length;
  const csCount = students.filter((s) => s.branch === 'CS').length;
  const aiCount = students.filter((s) => s.branch === 'AI').length;
  const csedsCount = students.filter((s) => s.branch === 'CSE-DS').length;
  const mechCount = students.filter((s) => s.branch === 'Mech').length;

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.branch && s.branch.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.batch && s.batch.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBranch = selectedBranch === 'all' || s.branch === selectedBranch;
    const matchesBatch = selectedBatch === 'all' || s.batch === selectedBatch;
    const matchesSection = selectedSection === 'all' || s.sectionId === selectedSection;

    return matchesSearch && matchesBranch && matchesBatch && matchesSection;
  });

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Users & Biometric Directory
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage student enrollment across batches & branches, faculty assignments, and biometric verification profile states.
          </p>
        </div>

        <div className="flex gap-2">
          {activeTab === 'students' ? (
            <button
              onClick={() => setShowStudentModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
          ) : (
            <button
              onClick={() => setShowTeacherModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Faculty</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'students'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Students ({students.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'teachers'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Faculty ({teachers.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search by name, roll, branch...`}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Branch & Batch Summary Pills (Only in Students Tab) */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Branch Breakdown (B.Tech 1st Year)</span>
            </span>
            <span className="text-xs text-slate-400">Total Enrolled: <strong className="text-slate-700">{students.length}</strong></span>
          </div>

          {/* Branch Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedBranch('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedBranch === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>All Branches</span>
              <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px]">{students.length}</span>
            </button>
            <button
              onClick={() => setSelectedBranch('CSE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedBranch === 'CSE'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              <span>CSE</span>
              <span className="px-1.5 py-0.2 rounded-md bg-black/10 text-[10px]">{cseCount}</span>
            </button>
            <button
              onClick={() => setSelectedBranch('CS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedBranch === 'CS'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
              }`}
            >
              <span>CS</span>
              <span className="px-1.5 py-0.2 rounded-md bg-black/10 text-[10px]">{csCount}</span>
            </button>
            <button
              onClick={() => setSelectedBranch('AI')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedBranch === 'AI'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              <span>AI</span>
              <span className="px-1.5 py-0.2 rounded-md bg-black/10 text-[10px]">{aiCount}</span>
            </button>
            <button
              onClick={() => setSelectedBranch('CSE-DS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedBranch === 'CSE-DS'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span>CSE-DS</span>
              <span className="px-1.5 py-0.2 rounded-md bg-black/10 text-[10px]">{csedsCount}</span>
            </button>
            <button
              onClick={() => setSelectedBranch('Mech')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedBranch === 'Mech'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span>Mech</span>
              <span className="px-1.5 py-0.2 rounded-md bg-black/10 text-[10px]">{mechCount}</span>
            </button>
          </div>

          {/* Section & Batch Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Section:</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Sections</option>
                <option value="sec_btech_1a">Section A (CSE & CS — SL1)</option>
                <option value="sec_btech_1b">Section B (AI & DS — SL-4)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Lab Batch:</span>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Batches</option>
                <option value="A1">Batch A1 (33 CSE)</option>
                <option value="A2">Batch A2 (22 CSE + 10 CS)</option>
                <option value="B1">Batch B1 (36 AI)</option>
                <option value="B2">Batch B2 (7 CSE-DS + 6 Mech)</option>
              </select>
            </div>

            {(selectedBranch !== 'all' || selectedBatch !== 'all' || selectedSection !== 'all') && (
              <button
                onClick={() => {
                  setSelectedBranch('all');
                  setSelectedBatch('all');
                  setSelectedSection('all');
                }}
                className="text-xs text-indigo-600 hover:underline font-bold"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Students Table */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Roll Number</th>
                  <th className="py-3.5 px-4">Branch</th>
                  <th className="py-3.5 px-4">Lab Batch</th>
                  <th className="py-3.5 px-4">Section</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Biometric Status</th>
                  <th className="py-3.5 px-4">Account</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No students found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-100 shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div>{s.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono font-normal">{s.enrollmentNo}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">{s.rollNo}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getBranchBadgeStyle(s.branch)}`}>
                          {s.branch || 'CSE'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                          Batch {s.batch || 'A1'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-semibold">
                        {s.sectionId === 'sec_btech_1b' ? 'Section B' : 'Section A'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{s.email}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Face Enrolled
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Teachers Table */}
      {activeTab === 'teachers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Faculty Member</th>
                  <th className="py-3.5 px-4">Employee ID</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Official Email</th>
                  <th className="py-3.5 px-4">Assigned Subjects</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center font-bold text-xs border border-violet-100 shrink-0">
                        {t.name.charAt(0)}
                      </div>
                      <span>{t.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{t.employeeId}</td>
                    <td className="py-3.5 px-4">Applied Sciences & First Year Engineering</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">{t.email}</td>
                    <td className="py-3.5 px-4 font-semibold text-indigo-600">
                      {t.assignedSubjectIds
                        .map((id) => db.getSubjects().find((s) => s.id === id)?.name || id)
                        .join(', ')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddStudent}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">Enroll New Student</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={stuName}
                onChange={(e) => setStuName(e.target.value)}
                placeholder="e.g. Tarun Sharma"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number</label>
              <input
                type="text"
                required
                value={stuRoll}
                onChange={(e) => setStuRoll(e.target.value)}
                placeholder="e.g. 26SBCETCSE056"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">College Email</label>
              <input
                type="email"
                required
                value={stuEmail}
                onChange={(e) => setStuEmail(e.target.value)}
                placeholder="e.g. tarun.sharma@sbcet.ac.in"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Section</label>
                <select
                  value={stuSection}
                  onChange={(e) => setStuSection(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="sec_btech_1a">Section A</option>
                  <option value="sec_btech_1b">Section B</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Branch</label>
                <select
                  value={stuBranch}
                  onChange={(e) => setStuBranch(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="CSE">CSE</option>
                  <option value="CS">CS</option>
                  <option value="AI">AI</option>
                  <option value="CSE-DS">CSE-DS</option>
                  <option value="Mech">Mech</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Batch</label>
                <select
                  value={stuBatch}
                  onChange={(e) => setStuBatch(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowStudentModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                Save Student
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Teacher Modal */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddTeacher}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">Add Faculty Member</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={teaName}
                onChange={(e) => setTeaName(e.target.value)}
                placeholder="e.g. Dr. Rajesh Kumar"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Employee ID</label>
              <input
                type="text"
                required
                value={teaEmpId}
                onChange={(e) => setTeaEmpId(e.target.value)}
                placeholder="e.g. EMP-T212"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                required
                value={teaEmail}
                onChange={(e) => setTeaEmail(e.target.value)}
                placeholder="e.g. rajesh@sbcet.ac.in"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTeacherModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                Save Faculty
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
