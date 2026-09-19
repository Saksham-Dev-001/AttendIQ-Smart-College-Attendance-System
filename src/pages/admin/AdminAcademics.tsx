import React, { useState, useEffect } from 'react';
import { db } from '../../db/store';
import { Department, Course, Section, Subject, Classroom } from '../../types';
import { BookOpen, Plus, MapPin, Building, GraduationCap, Layers, Check } from 'lucide-react';

export const AdminAcademics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'subjects' | 'classrooms' | 'departments' | 'courses' | 'sections'>('subjects');

  // Entities
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  // Add Subject Modal state
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subCredits, setSubCredits] = useState(4);

  // Add Classroom Modal state
  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [crName, setCrName] = useState('');
  const [crBuilding, setCrBuilding] = useState('');
  const [crRadius, setCrRadius] = useState(120);

  const sync = () => {
    setDepartments(db.getDepartments());
    setCourses(db.getCourses());
    setSections(db.getSections());
    setSubjects(db.getSubjects());
    setClassrooms(db.getClassrooms());
  };

  useEffect(() => {
    sync();
    const unsub = db.subscribe(sync);
    return () => unsub();
  }, []);

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subCode) return;
    db.addSubject({
      name: subName,
      code: subCode.toUpperCase(),
      departmentId: 'dept_cs',
      courseId: 'course_bca',
      semesterId: 'sem_bca_3',
      credits: subCredits,
      status: 'active',
    });
    setSubName('');
    setSubCode('');
    setShowSubjectModal(false);
  };

  const handleCreateClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crName) return;
    const settings = db.getSettings();
    db.addClassroom({
      name: crName,
      building: crBuilding || 'Academic Wing',
      latitude: settings.campusLatitude,
      longitude: settings.campusLongitude,
      radiusMeters: crRadius,
      status: 'active',
    });
    setCrName('');
    setCrBuilding('');
    setShowClassroomModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              College Academic Structure
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hierarchy: College ➔ Department ➔ Course ➔ Semester ➔ Section ➔ Classroom ➔ Subjects
          </p>
        </div>

        <div className="flex gap-2">
          {activeTab === 'subjects' && (
            <button
              onClick={() => setShowSubjectModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>
          )}
          {activeTab === 'classrooms' && (
            <button
              onClick={() => setShowClassroomModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Classroom</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'subjects', label: `Subjects (${subjects.length})`, icon: BookOpen },
          { id: 'classrooms', label: `Classrooms (${classrooms.length})`, icon: MapPin },
          { id: 'departments', label: `Departments (${departments.length})`, icon: Building },
          { id: 'courses', label: `Courses (${courses.length})`, icon: GraduationCap },
          { id: 'sections', label: `Sections (${sections.length})`, icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Subjects */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {sub.code}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {sub.credits} Credits
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-3 font-['Plus_Jakarta_Sans']">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Computer Science Department • BCA Semester 3
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px]">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Active Curriculum
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Classrooms */}
      {activeTab === 'classrooms' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classrooms.map((cr) => (
            <div
              key={cr.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    Radius: {cr.radiusMeters}m
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-3 font-['Plus_Jakarta_Sans']">
                  {cr.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{cr.building}</p>
                <div className="mt-3 p-2 bg-slate-50 rounded-xl border border-slate-200 text-[10px] font-mono text-slate-600">
                  Lat: {cr.latitude.toFixed(4)}, Lng: {cr.longitude.toFixed(4)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Departments */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                {d.code}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">{d.name}</h3>
              <p className="text-xs text-slate-500 mt-1">Full Degree & Diploma Programs</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Courses */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                {c.code}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">{c.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{c.totalSemesters} Semesters Total</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Sections */}
      {activeTab === 'sections' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Term: {s.academicSessionId} • Enrolled Students: {db.getStudents().filter((st) => st.sectionId === s.id).length}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Create Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubject}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">Add Academic Subject</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Name</label>
              <input
                type="text"
                required
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="e.g. Cloud Computing & DevOps"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Code</label>
                <input
                  type="text"
                  required
                  value={subCode}
                  onChange={(e) => setSubCode(e.target.value)}
                  placeholder="CS306"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Credits</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={subCredits}
                  onChange={(e) => setSubCredits(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubjectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                Save Subject
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Classroom Modal */}
      {showClassroomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateClassroom}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">Add Classroom Location</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Classroom / Hall Name</label>
              <input
                type="text"
                required
                value={crName}
                onChange={(e) => setCrName(e.target.value)}
                placeholder="Lecture Hall 301"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Building / Wing</label>
              <input
                type="text"
                value={crBuilding}
                onChange={(e) => setCrBuilding(e.target.value)}
                placeholder="Ramanujan Complex, 3rd Floor"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Allowed Geofence Radius (Meters)</label>
              <input
                type="number"
                min={30}
                max={300}
                value={crRadius}
                onChange={(e) => setCrRadius(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClassroomModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                Save Classroom
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

