import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/store';
import { Calendar, Clock, MapPin, BookOpen, Users } from 'lucide-react';

export const StudentTimetable: React.FC = () => {
  const { studentProfile } = useAuth();
  const [selectedDay, setSelectedDay] = useState<number>(
    new Date().getDay() === 0 ? 1 : new Date().getDay()
  );

  const days = [
    { day: 1, name: 'Monday' },
    { day: 2, name: 'Tuesday' },
    { day: 3, name: 'Wednesday' },
    { day: 4, name: 'Thursday' },
    { day: 5, name: 'Friday' },
    { day: 6, name: 'Saturday' },
  ];

  const subjects = db.getSubjects();
  const teachers = db.getTeachers();
  const classrooms = db.getClassrooms();

  const slots = db
    .getTimetables()
    .filter((t) => t.sectionId === studentProfile?.sectionId && t.dayOfWeek === selectedDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Weekly Timetable
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs text-slate-500">
              Section: <strong className="text-slate-800">{studentProfile?.sectionId === 'sec_btech_1b' ? 'Section B (AI & DS)' : 'Section A (CSE & CS)'}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
              Branch: {studentProfile?.branch || 'CSE'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold font-mono">
              Lab Batch: {studentProfile?.batch || 'A1'}
            </span>
            <span className="text-xs text-slate-400">• B.Tech I Sem (2026-27)</span>
          </div>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((d) => (
          <button
            key={d.day}
            onClick={() => setSelectedDay(d.day)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              selectedDay === d.day
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      {/* Slots List */}
      <div className="space-y-3">
        {slots.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-xs">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No classes scheduled on this day</p>
            <p className="text-xs text-slate-400 mt-1">Use this time for personal study or lab assignments.</p>
          </div>
        ) : (
          slots.map((slot) => {
            const sub = subjects.find((s) => s.id === slot.subjectId);
            const teacher = teachers.find((t) => t.id === slot.teacherId);
            const classroom = classrooms.find((c) => c.id === slot.classroomId);

            return (
              <div
                key={slot.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-indigo-200 transition-all"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 text-center shrink-0 min-w-[75px] border border-indigo-100">
                    <span className="text-[10px] uppercase font-bold block">Period</span>
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
                        {teacher?.name}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {classroom?.name} ({classroom?.building})
                      </span>
                    </div>
                  </div>
                </div>

                <span className="self-end sm:self-center px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[11px] font-semibold text-slate-600">
                  Lecture • 4 Credits
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

