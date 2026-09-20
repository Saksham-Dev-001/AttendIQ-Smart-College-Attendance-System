export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  photoURL?: string;
  status: 'active' | 'disabled';
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  rollNo: string;
  enrollmentNo: string;
  departmentId: string;
  courseId: string;
  semesterId: string;
  sectionId: string;
  batch?: string;           // e.g. 'A1', 'A2', 'B1', 'B2'
  branch?: string;          // e.g. 'CSE', 'CS', 'AI', 'CSE-DS', 'Mech'
  academicSessionId: string;
  status: 'active' | 'disabled';
  faceProfileStatus: 'verified' | 'pending' | 'unregistered';
  faceEmbeddingPreview?: string;
  email: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  employeeId: string;
  name: string;
  departmentId: string;
  email: string;
  assignedSubjectIds: string[];
  status: 'active' | 'disabled';
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  totalSemesters: number;
}

export interface Semester {
  id: string;
  name: string;
  number: number;
  courseId: string;
}

export interface Section {
  id: string;
  name: string; // e.g., "A", "B"
  semesterId: string;
  courseId: string;
  academicSessionId: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  courseId: string;
  semesterId: string;
  credits: number;
  status: 'active' | 'inactive';
}

export interface Classroom {
  id: string;
  name: string;
  building: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  status: 'active' | 'inactive';
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: number; // 1 = Monday, 2 = Tuesday, ... 6 = Saturday
  dayName: string;
  startTime: string; // "10:00"
  endTime: string;   // "11:00"
  subjectId: string;
  teacherId: string;
  sectionId: string;
  classroomId: string;
  academicSessionId: string;
  status: 'active' | 'cancelled';
}

export interface AttendanceSessionSecurity {
  dynamicQR: boolean;
  geofence: boolean;
  faceVerification: boolean;
  liveness: boolean;
}

export interface AttendanceSession {
  id: string;
  teacherId: string;
  subjectId: string;
  sectionId: string;
  timetableId: string;
  classroomId: string;
  academicSessionId: string;
  startedAt: string; // ISO string
  expiresAt: string; // ISO string
  status: 'active' | 'closed';
  currentQrToken: string;
  qrVersion: number;
  lastQrRotatedAt: string;
  security: AttendanceSessionSecurity;
}

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused';

export interface VerificationDetails {
  qr: 'passed' | 'failed';
  geofence: 'passed' | 'failed' | 'bypassed';
  face: 'passed' | 'failed' | 'bypassed';
  liveness: 'passed' | 'failed' | 'bypassed';
  distanceMeters?: number;
  faceMatchScore?: number;
  deviceTimestamp: string;
}

export interface AttendanceRecord {
  id: string; // Composite: `${sessionId}_${studentId}`
  sessionId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  teacherId: string;
  subjectId: string;
  sectionId: string;
  status: AttendanceStatus;
  branch?: string;
  batch?: string;
  markedAt: string;
  verification: VerificationDetails;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: 'attendance_correction' | 'session_override' | 'rule_change' | 'user_update' | 'session_closed';
  targetId: string;
  targetType: 'attendanceRecord' | 'attendanceSession' | 'settings' | 'user';
  oldValue?: string;
  newValue?: string;
  reason: string;
  createdAt: string;
}

export interface SystemSettings {
  collegeName: string;
  campusName: string;
  campusLatitude: number;
  campusLongitude: number;
  campusRadiusMeters: number;
  geofenceMandatory: boolean;
  defaultSessionDurationMinutes: number;
  lateThresholdMinutes: number;
  qrRefreshSeconds: number;
  minAttendancePercentage: number;
  academicSession: string;
}

