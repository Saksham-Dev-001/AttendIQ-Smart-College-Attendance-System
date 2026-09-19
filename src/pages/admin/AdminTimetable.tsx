import React, { useState, useEffect } from 'react';
import { db } from '../../db/store';
import { TimetableSlot, Subject, TeacherProfile, Classroom } from '../../types';
import { Calendar, Plus, Trash2, Clock, MapPin, BookOpen, Users } from 'lucide-react';

export const AdminTimetable: React.FC = () => {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  // Add Slot Modal
  const [showModal, setShowModal] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [classroomId, setClassroomId] = useState('');

  const days = [
    { day: 1, name: 'Monday' },
    { day: 2, name: 'Tuesday' },
    { day: 3, name: 'Wednesday' },
    { day: 4, name: 'Thursday' },
    { day: 5, name: 'Friday' },
    { day: 6, name: 'Saturday' },
  ];

  const sync = () => {
    const s = db.getTimetables();
    setSlots(s);
    const subs = db.getSubjects();
    setSubjects(subs);
    if (subs.length > 0 && !subjectId) setSubjectId(subs[0].id);

    const teas = db.getTeachers();
    setTeachers(teas);
    if (teas.length > 0 && !teacherId) setTeacherId(teas[0].id);

    const crs = db.getClassrooms();
    setClassrooms(crs);
    if (crs.length > 0 && !classroomId) setClassroomId(crs[0].id);
  };

  useEffect(() => {
    sync();
    const unsub = db.subscribe(sync);
    return () => unsub();
  }, []);

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !teacherId || !classroomId) return;

    const dayName = days.find((d) => d.day === selectedDay)?.name || 'Monday';

    db.addTimetableSlot({
      dayOfWeek: selectedDay,
      dayName,
      startTime,
      endTime,
      subjectId,
      teacherId,
      sectionId: 'sec_bca_3a',
      classroomId,
      academicSessionId: '2026-2027',
      status: 'active',
    });

    setShowModal(false);
  };

  const handleDeleteSlot = (id: string) => {
    if (window.confirm('Delete this scheduled class from the institutional timetable?')) {
      db.deleteTimetableSlot(id);
    }
  };

  const daySlots = slots.filter((s) => s.dayOfWeek === selectedDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Timetable Scheduler & Auto-Class Dispatcher
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Scheduled classes automatically appear on teacher & student dashboards for one-tap attendance generation.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Timetable Period</span>
        </button>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((d) => {
          const count = slots.filter((s) => s.dayOfWeek === d.day).length;
          return (
            <button
              key={d.day}
              onClick={() => setSelectedDay(d.day)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                selectedDay === d.day
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{d.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  selectedDay === d.day ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slots List */}
      <div className="space-y-3">
        {daySlots.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-xs">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No scheduled periods for {days.find(d => d.day === selectedDay)?.name}</p>
            <p className="text-xs text-slate-400 mt-1">Click "Add Timetable Period" above to assign a faculty and classroom.</p>
          </div>
        ) : (
          daySlots.map((slot) => {
            const sub = subjects.find((s) => s.id === slot.subjectId);
            const teacher = teachers.find((t) => t.id === slot.teacherId);
            const room = classrooms.find((c) => c.id === slot.classroomId);

            return (
              <div
                key={slot.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-indigo-200 transition-all"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 text-center shrink-0 min-w-[80px] border border-indigo-100">
                    <span className="text-[10px] uppercase font-bold block">Time</span>
                    <span className="font-mono text-xs font-extrabold">{slot.startTime}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {sub?.code}
                      </span>
                      <span className="text-xs text-slate-400">
                        {slot.startTime} – {slot.endTime}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 font-['Plus_Jakarta_Sans']">
                      {sub?.name}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        Faculty: {teacher?.name}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        Room: {room?.name}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Section: BCA 3A
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  title="Remove from timetable"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors self-end sm:self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Slot Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSlot}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">
              Schedule Period for {days.find((d) => d.day === selectedDay)?.name}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Faculty</label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.employeeId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Classroom / Lecture Hall</label>
              <select
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              >
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.building})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                Schedule Class
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

