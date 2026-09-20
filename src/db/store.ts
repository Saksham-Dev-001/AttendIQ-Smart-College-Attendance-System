import {
  Department,
  Course,
  Semester,
  Section,
  Subject,
  Classroom,
  TimetableSlot,
  User,
  StudentProfile,
  TeacherProfile,
  AttendanceSession,
  AttendanceRecord,
  AuditLog,
  SystemSettings,
  AttendanceStatus,
  VerificationDetails,
} from '../types';

import {
  INITIAL_SETTINGS,
  INITIAL_DEPARTMENTS,
  INITIAL_COURSES,
  INITIAL_SEMESTERS,
  INITIAL_SECTIONS,
  INITIAL_CLASSROOMS,
  INITIAL_SUBJECTS,
  INITIAL_USERS,
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
  INITIAL_TIMETABLE,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_AUDIT_LOGS,
} from './initialData';

import { generateDynamicSessionToken } from '../utils/crypto';

type Listener = () => void;

class DatabaseStore {
  private settings: SystemSettings;
  private departments: Department[];
  private courses: Course[];
  private semesters: Semester[];
  private sections: Section[];
  private classrooms: Classroom[];
  private subjects: Subject[];
  private users: User[];
  private teachers: TeacherProfile[];
  private students: StudentProfile[];
  private timetables: TimetableSlot[];
  private attendanceSessions: AttendanceSession[];
  private attendanceRecords: AttendanceRecord[];
  private auditLogs: AuditLog[];

  private listeners: Set<Listener> = new Set();

  constructor() {
    this.settings = this.load('attendiq_settings', INITIAL_SETTINGS);
    this.departments = this.load('attendiq_departments', INITIAL_DEPARTMENTS);
    this.courses = this.load('attendiq_courses', INITIAL_COURSES);
    this.semesters = this.load('attendiq_semesters', INITIAL_SEMESTERS);
    this.sections = this.load('attendiq_sections', INITIAL_SECTIONS);
    this.classrooms = this.load('attendiq_classrooms', INITIAL_CLASSROOMS);
    this.subjects = this.load('attendiq_subjects', INITIAL_SUBJECTS);
    this.users = this.load('attendiq_users', INITIAL_USERS);
    this.teachers = this.load('attendiq_teachers', INITIAL_TEACHERS);
    this.students = this.load('attendiq_students', INITIAL_STUDENTS);
    this.timetables = this.load('attendiq_timetables', INITIAL_TIMETABLE);
    this.attendanceSessions = this.load('attendiq_attendance_sessions', []);
    this.attendanceRecords = this.load('attendiq_attendance_records', INITIAL_ATTENDANCE_RECORDS);
    this.auditLogs = this.load('attendiq_audit_logs', INITIAL_AUDIT_LOGS);

    // Auto-migrate if previous cache is outdated or doesn't have the full 114 SBCET students
    const CURRENT_DATA_VERSION = '2026_sbcet_v4_production';
    const cachedVersion = localStorage.getItem('attendiq_data_version');
    if (
      cachedVersion !== CURRENT_DATA_VERSION ||
      !this.settings.collegeName.includes('Balaji') ||
      this.students.length < 114 ||
      !this.students[0]?.batch
    ) {
      this.resetToDefaults();
    }

    // Listen to storage events for cross-tab real-time sync (e.g., student in one tab, teacher in another)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('attendiq_')) {
          this.reloadFromStorage();
          this.notify();
        }
      });
    }
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private save<T>(key: string, data: T) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error('Storage save error:', err);
    }
  }

  private reloadFromStorage() {
    this.settings = this.load('attendiq_settings', INITIAL_SETTINGS);
    this.departments = this.load('attendiq_departments', INITIAL_DEPARTMENTS);
    this.courses = this.load('attendiq_courses', INITIAL_COURSES);
    this.semesters = this.load('attendiq_semesters', INITIAL_SEMESTERS);
    this.sections = this.load('attendiq_sections', INITIAL_SECTIONS);
    this.classrooms = this.load('attendiq_classrooms', INITIAL_CLASSROOMS);
    this.subjects = this.load('attendiq_subjects', INITIAL_SUBJECTS);
    this.users = this.load('attendiq_users', INITIAL_USERS);
    this.teachers = this.load('attendiq_teachers', INITIAL_TEACHERS);
    this.students = this.load('attendiq_students', INITIAL_STUDENTS);
    this.timetables = this.load('attendiq_timetables', INITIAL_TIMETABLE);
    this.attendanceSessions = this.load('attendiq_attendance_sessions', []);
    this.attendanceRecords = this.load('attendiq_attendance_records', INITIAL_ATTENDANCE_RECORDS);
    this.auditLogs = this.load('attendiq_audit_logs', INITIAL_AUDIT_LOGS);
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // Getters (safely guarded against undefined/null)
  getSettings(): SystemSettings { return { ...(this.settings || INITIAL_SETTINGS) }; }
  getDepartments(): Department[] { return [...(this.departments || [])]; }
  getCourses(): Course[] { return [...(this.courses || [])]; }
  getSemesters(): Semester[] { return [...(this.semesters || [])]; }
  getSections(): Section[] { return [...(this.sections || [])]; }
  getClassrooms(): Classroom[] { return [...(this.classrooms || [])]; }
  getSubjects(): Subject[] { return [...(this.subjects || [])]; }
  getUsers(): User[] { return [...(this.users || [])]; }
  getTeachers(): TeacherProfile[] { return [...(this.teachers || [])]; }
  getStudents(): StudentProfile[] { return [...(this.students || [])]; }
  getTimetables(): TimetableSlot[] { return [...(this.timetables || [])]; }
  getSessions(): AttendanceSession[] { return [...(this.attendanceSessions || [])]; }
  getAttendanceRecords(): AttendanceRecord[] { return [...(this.attendanceRecords || [])]; }
  getAuditLogs(): AuditLog[] { return [...(this.auditLogs || [])]; }

  // Settings
  updateSettings(newSettings: Partial<SystemSettings>, actorId: string, actorName: string) {
    const oldSettings = { ...this.settings };
    this.settings = { ...this.settings, ...newSettings };
    this.save('attendiq_settings', this.settings);

    this.addAuditLog({
      actorId,
      actorName,
      actorRole: 'admin',
      action: 'rule_change',
      targetId: 'settings',
      targetType: 'settings',
      oldValue: JSON.stringify(oldSettings),
      newValue: JSON.stringify(this.settings),
      reason: 'Admin updated institutional system parameters and geofence settings',
    });

    this.notify();
  }

  // Academic Entities
  addSubject(subject: Omit<Subject, 'id'>) {
    const newSubject: Subject = { ...subject, id: `sub_${Date.now()}` };
    this.subjects.push(newSubject);
    this.save('attendiq_subjects', this.subjects);
    this.notify();
    return newSubject;
  }

  addClassroom(classroom: Omit<Classroom, 'id'>) {
    const newClassroom: Classroom = { ...classroom, id: `cr_${Date.now()}` };
    this.classrooms.push(newClassroom);
    this.save('attendiq_classrooms', this.classrooms);
    this.notify();
    return newClassroom;
  }

  addTimetableSlot(slot: Omit<TimetableSlot, 'id'>) {
    const newSlot: TimetableSlot = { ...slot, id: `tt_${Date.now()}` };
    this.timetables.push(newSlot);
    this.save('attendiq_timetables', this.timetables);
    this.notify();
    return newSlot;
  }

  deleteTimetableSlot(slotId: string) {
    this.timetables = this.timetables.filter((s) => s.id !== slotId);
    this.save('attendiq_timetables', this.timetables);
    this.notify();
  }

  // Users
  addStudent(student: Omit<StudentProfile, 'id' | 'userId'>, email: string) {
    const userId = `usr_${Date.now()}`;
    const studentId = `stu_${Date.now()}`;
    const newUser: User = {
      id: userId,
      name: student.name,
      email,
      role: 'student',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    const newStudent: StudentProfile = {
      ...student,
      id: studentId,
      userId,
      email,
      faceProfileStatus: 'verified',
    };

    this.users.push(newUser);
    this.students.push(newStudent);
    this.save('attendiq_users', this.users);
    this.save('attendiq_students', this.students);
    this.notify();
    return newStudent;
  }

  addTeacher(teacher: Omit<TeacherProfile, 'id' | 'userId'>, email: string) {
    const userId = `usr_${Date.now()}`;
    const teacherId = `tea_${Date.now()}`;
    const newUser: User = {
      id: userId,
      name: teacher.name,
      email,
      role: 'teacher',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    const newTeacher: TeacherProfile = {
      ...teacher,
      id: teacherId,
      userId,
      email,
    };

    this.users.push(newUser);
    this.teachers.push(newTeacher);
    this.save('attendiq_users', this.users);
    this.save('attendiq_teachers', this.teachers);
    this.notify();
    return newTeacher;
  }

  // ATTENDANCE SESSION MANAGEMENT
  startAttendanceSession(timetableSlotId: string, teacherId: string): AttendanceSession {
    const slot = this.timetables.find((t) => t.id === timetableSlotId);
    if (!slot) throw new Error('Invalid timetable slot');

    const durationMinutes = this.settings.defaultSessionDurationMinutes;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);
    const sessionId = `sess_${Date.now()}`;
    const initialQrToken = generateDynamicSessionToken(sessionId, 1);

    const newSession: AttendanceSession = {
      id: sessionId,
      teacherId,
      subjectId: slot.subjectId,
      sectionId: slot.sectionId,
      timetableId: slot.id,
      classroomId: slot.classroomId,
      academicSessionId: slot.academicSessionId,
      startedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      status: 'active',
      currentQrToken: initialQrToken,
      qrVersion: 1,
      lastQrRotatedAt: now.toISOString(),
      security: {
        dynamicQR: true,
        geofence: this.settings.geofenceMandatory,
        faceVerification: true,
        liveness: true,
      },
    };

    this.attendanceSessions.unshift(newSession);
    this.save('attendiq_attendance_sessions', this.attendanceSessions);
    this.notify();
    return newSession;
  }

  rotateSessionQr(sessionId: string): AttendanceSession | null {
    const sessionIndex = this.attendanceSessions.findIndex((s) => s.id === sessionId);
    if (sessionIndex === -1) return null;

    const session = this.attendanceSessions[sessionIndex];
    if (session.status !== 'active') return session;

    // Check if session has expired
    if (new Date() > new Date(session.expiresAt)) {
      session.status = 'closed';
      this.attendanceSessions[sessionIndex] = session;
      this.save('attendiq_attendance_sessions', this.attendanceSessions);
      this.notify();
      return session;
    }

    const nextVersion = session.qrVersion + 1;
    const updatedSession: AttendanceSession = {
      ...session,
      qrVersion: nextVersion,
      currentQrToken: generateDynamicSessionToken(sessionId, nextVersion),
      lastQrRotatedAt: new Date().toISOString(),
    };

    this.attendanceSessions[sessionIndex] = updatedSession;
    this.save('attendiq_attendance_sessions', this.attendanceSessions);
    this.notify();
    return updatedSession;
  }

  closeAttendanceSession(sessionId: string, actorId: string, actorName: string): AttendanceSession | null {
    const sessionIndex = this.attendanceSessions.findIndex((s) => s.id === sessionId);
    if (sessionIndex === -1) return null;

    const session = this.attendanceSessions[sessionIndex];
    session.status = 'closed';
    this.attendanceSessions[sessionIndex] = session;
    this.save('attendiq_attendance_sessions', this.attendanceSessions);

    this.addAuditLog({
      actorId,
      actorName,
      actorRole: 'teacher',
      action: 'session_closed',
      targetId: sessionId,
      targetType: 'attendanceSession',
      reason: 'Teacher closed attendance session manually',
    });

    this.notify();
    return session;
  }

  getActiveSession(sessionId: string): AttendanceSession | undefined {
    return this.attendanceSessions.find((s) => s.id === sessionId && s.status === 'active');
  }

  // ATTENDANCE RECORDING (WITH ATOMIC DUPLICATE CHECK & ANTI-FRAUD)
  recordAttendance(params: {
    sessionId: string;
    studentId: string;
    verification: VerificationDetails;
  }): { success: boolean; message: string; record?: AttendanceRecord } {
    const session = this.attendanceSessions.find((s) => s.id === params.sessionId);
    if (!session) {
      return { success: false, message: 'Attendance session not found.' };
    }

    if (session.status !== 'active' || new Date() > new Date(session.expiresAt)) {
      return { success: false, message: 'This attendance session has already closed or expired.' };
    }

    const student = this.students.find((st) => st.id === params.studentId);
    if (!student) {
      return { success: false, message: 'Student profile not found.' };
    }

    // Verify class/section eligibility
    if (student.sectionId !== session.sectionId) {
      return { success: false, message: 'You do not belong to the target class section for this session.' };
    }

    // Uniqueness constraint: composite document key {sessionId}_{studentId}
    const compositeId = `${session.id}_${student.id}`;
    const alreadyMarked = this.attendanceRecords.some(
      (r) => r.id === compositeId || (r.sessionId === session.id && r.studentId === student.id)
    );

    if (alreadyMarked) {
      return { success: false, message: 'Attendance has already been recorded for your account in this session.' };
    }

    // Calculate present vs late status
    const sessionStart = new Date(session.startedAt).getTime();
    const now = Date.now();
    const minutesElapsed = (now - sessionStart) / (1000 * 60);
    const isLate = minutesElapsed > this.settings.lateThresholdMinutes;
    const status: AttendanceStatus = isLate ? 'late' : 'present';

    const newRecord: AttendanceRecord = {
      id: compositeId,
      sessionId: session.id,
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      teacherId: session.teacherId,
      subjectId: session.subjectId,
      sectionId: session.sectionId,
      status,
      branch: student.branch,
      batch: student.batch,
      markedAt: new Date().toISOString(),
      verification: params.verification,
    };

    this.attendanceRecords.unshift(newRecord);
    this.save('attendiq_attendance_records', this.attendanceRecords);
    this.notify();

    return { success: true, message: `Attendance marked successfully as ${status.toUpperCase()}!`, record: newRecord };
  }

  // ATTENDANCE CORRECTION & AUDITING
  correctAttendanceRecord(
    recordId: string,
    newStatus: AttendanceStatus,
    reason: string,
    actor: { id: string; name: string; role: 'admin' | 'teacher' }
  ): boolean {
    if (!reason || reason.trim().length < 5) {
      throw new Error('A detailed reason is strictly required to perform an attendance correction.');
    }

    const recordIndex = this.attendanceRecords.findIndex((r) => r.id === recordId);
    if (recordIndex === -1) return false;

    const record = this.attendanceRecords[recordIndex];
    const oldStatus = record.status;

    record.status = newStatus;
    this.attendanceRecords[recordIndex] = record;
    this.save('attendiq_attendance_records', this.attendanceRecords);

    this.addAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'attendance_correction',
      targetId: recordId,
      targetType: 'attendanceRecord',
      oldValue: oldStatus,
      newValue: newStatus,
      reason,
    });

    this.notify();
    return true;
  }

  // AUDIT LOG
  private addAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>) {
    const newLog: AuditLog = {
      ...log,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
    this.save('attendiq_audit_logs', this.auditLogs);
  }

  // Reset to SBCET institutional defaults
  resetToDefaults() {
    localStorage.clear();
    this.settings = INITIAL_SETTINGS;
    this.departments = INITIAL_DEPARTMENTS;
    this.courses = INITIAL_COURSES;
    this.semesters = INITIAL_SEMESTERS;
    this.sections = INITIAL_SECTIONS;
    this.classrooms = INITIAL_CLASSROOMS;
    this.subjects = INITIAL_SUBJECTS;
    this.users = INITIAL_USERS;
    this.teachers = INITIAL_TEACHERS;
    this.students = INITIAL_STUDENTS;
    this.timetables = INITIAL_TIMETABLE;
    this.attendanceSessions = [];
    this.attendanceRecords = INITIAL_ATTENDANCE_RECORDS;
    this.auditLogs = INITIAL_AUDIT_LOGS;

    this.save('attendiq_settings', this.settings);
    this.save('attendiq_departments', this.departments);
    this.save('attendiq_courses', this.courses);
    this.save('attendiq_semesters', this.semesters);
    this.save('attendiq_sections', this.sections);
    this.save('attendiq_classrooms', this.classrooms);
    this.save('attendiq_subjects', this.subjects);
    this.save('attendiq_users', this.users);
    this.save('attendiq_teachers', this.teachers);
    this.save('attendiq_students', this.students);
    this.save('attendiq_timetables', this.timetables);
    this.save('attendiq_attendance_sessions', []);
    this.save('attendiq_attendance_records', this.attendanceRecords);
    this.save('attendiq_audit_logs', this.auditLogs);
    try {
      localStorage.setItem('attendiq_data_version', '2026_sbcet_v4_production');
    } catch {}

    this.notify();
  }
}

export const db = new DatabaseStore();

