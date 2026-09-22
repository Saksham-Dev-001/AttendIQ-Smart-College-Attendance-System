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
} from '../types';

export const INITIAL_SETTINGS: SystemSettings = {
  collegeName: "Sri Balaji College of Engg & Technology, Jaipur",
  campusName: "Benad Road Campus, Jaipur",
  campusLatitude: 26.9855,
  campusLongitude: 75.7725,
  campusRadiusMeters: 150,
  geofenceMandatory: true,
  defaultSessionDurationMinutes: 10,
  lateThresholdMinutes: 5,
  qrRefreshSeconds: 25,
  minAttendancePercentage: 75,
  academicSession: "2026-27 (w.e.f. 17/08/2026)",
};

// ─────────────────────────────────────────────────────────────────────────────
//  DEPARTMENTS
// ─────────────────────────────────────────────────────────────────────────────
export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'dept_first_year', name: 'Applied Sciences & First Year Engineering', code: 'FY-ENGG' },
  { id: 'dept_cse',        name: 'Computer Science & Engineering',            code: 'CSE'     },
  { id: 'dept_cs',         name: 'Computer Science',                          code: 'CS'      },
  { id: 'dept_ai',         name: 'Artificial Intelligence',                   code: 'AI'      },
  { id: 'dept_cseds',      name: 'Computer Science – Data Science',           code: 'CSE-DS'  },
  { id: 'dept_mech',       name: 'Mechanical Engineering',                    code: 'MECH'    },
];

export const INITIAL_COURSES: Course[] = [
  { id: 'course_btech', name: 'Bachelor of Technology (B.Tech)', code: 'B.TECH', departmentId: 'dept_first_year', totalSemesters: 8 },
];

export const INITIAL_SEMESTERS: Semester[] = [
  { id: 'sem_btech_1', name: 'B.Tech I Sem (1st Year)', number: 1, courseId: 'course_btech' },
];

export const INITIAL_SECTIONS: Section[] = [
  { id: 'sec_btech_1a', name: 'Section A (CSE & CS)',  semesterId: 'sem_btech_1', courseId: 'course_btech', academicSessionId: '2026-27' },
  { id: 'sec_btech_1b', name: 'Section B (AI & DS)',   semesterId: 'sem_btech_1', courseId: 'course_btech', academicSessionId: '2026-27' },
];

export const INITIAL_CLASSROOMS: Classroom[] = [
  { id: 'cr_sl1',     name: 'SL1 (Smart Lecture Hall 1)',          building: 'Academic Block A - Ground Floor', latitude: 26.9855, longitude: 75.7725, radiusMeters: 120, status: 'active' },
  { id: 'cr_sl4',     name: 'SL-4 (Smart Lecture Hall 4)',         building: 'Academic Block A - 1st Floor',   latitude: 26.9857, longitude: 75.7727, radiusMeters: 120, status: 'active' },
  { id: 'cr_chemlab', name: 'Engineering Chemistry Lab',           building: 'Applied Science Wing',           latitude: 26.9852, longitude: 75.7722, radiusMeters: 120, status: 'active' },
  { id: 'cr_ppslab',  name: 'Programming for Problem Solving Lab', building: 'Computer Centre Wing',           latitude: 26.9859, longitude: 75.7730, radiusMeters: 120, status: 'active' },
  { id: 'cr_commlab', name: 'Communication Skills Lab',            building: 'Language & Humanities Block',    latitude: 26.9850, longitude: 75.7720, radiusMeters: 120, status: 'active' },
  { id: 'cr_lib',     name: 'Central Library',                     building: 'Library Block',                  latitude: 26.9853, longitude: 75.7726, radiusMeters: 150, status: 'active' },
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub_chem',    name: 'Engineering Chemistry',                           code: 'CY101',  departmentId: 'dept_first_year', courseId: 'course_btech', semesterId: 'sem_btech_1', credits: 4, status: 'active' },
  { id: 'sub_math',    name: 'Engineering Mathematics',                         code: 'MA101',  departmentId: 'dept_first_year', courseId: 'course_btech', semesterId: 'sem_btech_1', credits: 4, status: 'active' },
  { id: 'sub_comm',    name: 'Communication Skills',                            code: 'HS101',  departmentId: 'dept_first_year', courseId: 'course_btech', semesterId: 'sem_btech_1', credits: 3, status: 'active' },
  { id: 'sub_de',      name: 'Digital Electronics',                             code: 'EC101',  departmentId: 'dept_first_year', courseId: 'course_btech', semesterId: 'sem_btech_1', credits: 4, status: 'active' },
  { id: 'sub_cyber',   name: 'Fundamental of Cyber Security & Ethical Hacking', code: 'CS101',  departmentId: 'dept_first_year', courseId: 'course_btech', semesterId: 'sem_btech_1', credits: 3, status: 'active' },
  { id: 'sub_pps',     name: 'Programming for Problem Solving',                 code: 'CS102',  departmentId: 'dept_first_year', courseId: 'course_btech', semesterId: 'sem_btech_1', credits: 4, status: 'active' },
  { id: 'sub_chemlab', name: 'Engineering Chemistry Lab',                       code: 'CY102P', departmentId: 'dept_first_year', courseId: 'course_btech', semesterId: 'sem_btech_1', credits: 2, status: 'active' },
  { id: 'sub_ppslab',  name: 'Programming for Problem Solving Lab',             code: 'CS103P', departmentId: 'dept_first_year', courseId: 'course_btech', semesterId: 'sem_btech_1', credits: 2, status: 'active' },
  { id: 'sub_commlab', name: 'Communication Skills Lab',                        code: 'HS102P', departmentId: 'dept_first_year', courseId: 'course_btech', semesterId: 'sem_btech_1', credits: 2, status: 'active' },
  { id: 'sub_lib',     name: 'Library (Lib)',                                   code: 'LIB101', departmentId: 'dept_first_year', courseId: 'course_btech', semesterId: 'sem_btech_1', credits: 1, status: 'active' },
  { id: 'sub_eca',     name: 'Extra Curricular Activities',                     code: 'ECA101', departmentId: 'dept_first_year', courseId: 'course_btech', semesterId: 'sem_btech_1', credits: 1, status: 'active' },
];

// ─────────────────────────────────────────────────────────────────────────────
//  USERS  (Admin + 11 Faculty + 114 Real Students)
// ─────────────────────────────────────────────────────────────────────────────
export const INITIAL_USERS: User[] = [
  // ── Admin ──────────────────────────────────────────────────────────────────
  { id: 'usr_admin', name: 'Dr. Surendra Singh (Principal & Registrar)', email: 'admin@sbcet.ac.in', role: 'admin', phone: '+91 141 279 3300', status: 'active', createdAt: '2026-08-01T09:00:00Z' },

  // ── Faculty (11) ──────────────────────────────────────────────────────────
  { id: 'usr_tea_aastha',   name: 'Dr. Aastha Pareek',      email: 'aastha@sbcet.ac.in',   role: 'teacher', phone: '+91 94140 12345', status: 'active', createdAt: '2026-08-01T09:00:00Z' },
  { id: 'usr_tea_ahkhan',   name: 'Dr. A. H. Khan',         email: 'ahkhan@sbcet.ac.in',   role: 'teacher', phone: '+91 94140 23456', status: 'active', createdAt: '2026-08-01T09:00:00Z' },
  { id: 'usr_tea_vishal',   name: 'Dr. Vishal Sexena',      email: 'vishal@sbcet.ac.in',   role: 'teacher', phone: '+91 94140 34567', status: 'active', createdAt: '2026-08-01T09:00:00Z' },
  { id: 'usr_tea_pankaj',   name: 'Dr. Pankaj Meel',        email: 'pankaj@sbcet.ac.in',   role: 'teacher', phone: '+91 94140 45678', status: 'active', createdAt: '2026-08-01T09:00:00Z' },
  { id: 'usr_tea_vikas',    name: 'Mr. Vikas Singh',        email: 'vikas@sbcet.ac.in',    role: 'teacher', phone: '+91 94140 56789', status: 'active', createdAt: '2026-08-01T09:00:00Z' },
  { id: 'usr_tea_sikander', name: 'Mr. Sikander Khan',      email: 'sikander@sbcet.ac.in', role: 'teacher', phone: '+91 94140 67890', status: 'active', createdAt: '2026-08-01T09:00:00Z' },
  { id: 'usr_tea_happy',    name: 'Mr. Happy Dabla',        email: 'happy@sbcet.ac.in',    role: 'teacher', phone: '+91 94140 78901', status: 'active', createdAt: '2026-08-01T09:00:00Z' },
  { id: 'usr_tea_firoz',    name: 'Dr. Syed Firoz Haider', email: 'firoz@sbcet.ac.in',    role: 'teacher', phone: '+91 94140 89012', status: 'active', createdAt: '2026-08-01T09:00:00Z' },
  { id: 'usr_tea_toofan',   name: 'Mr. Toofan Mukharjee',  email: 'toofan@sbcet.ac.in',   role: 'teacher', phone: '+91 94140 90123', status: 'active', createdAt: '2026-08-01T09:00:00Z' },
  { id: 'usr_tea_vijay',    name: 'Mr. Vijay Sharma',       email: 'vijay@sbcet.ac.in',    role: 'teacher', phone: '+91 94140 01234', status: 'active', createdAt: '2026-08-01T09:00:00Z' },
  { id: 'usr_tea_nisha',    name: 'Dr. Nisha Poonia',       email: 'nisha@sbcet.ac.in',    role: 'teacher', phone: '+91 94140 11111', status: 'active', createdAt: '2026-08-01T09:00:00Z' },

  // ── Section A – Batch A1 (CSE, 33 students) ───────────────────────────────
  { id: 'usr_a1_01', name: 'Aayush Sharma',         email: 'student@sbcet.ac.in',           role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_02', name: 'Abhay Shankar Patel',   email: 'abhay.patel@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_03', name: 'Aditya Choudhary',      email: 'aditya.choudhary@sbcet.ac.in',  role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_04', name: 'Aditya Giri',           email: 'aditya.giri@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_05', name: 'Aditya Singh (A1)',     email: 'aditya.singh1@sbcet.ac.in',     role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_06', name: 'Aditya Singh (A1-2)',   email: 'aditya.singh2@sbcet.ac.in',     role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_07', name: 'Ajay Kumar',            email: 'ajay.kumar@sbcet.ac.in',        role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_08', name: 'Akshita Agarwal',       email: 'akshita.agarwal@sbcet.ac.in',   role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_09', name: 'Ayushi Agarwal',        email: 'ayushi.agarwal@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_10', name: 'Badal Kumar',           email: 'badal.kumar@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_11', name: 'Chirayu Dhabhai',       email: 'chirayu.dhabhai@sbcet.ac.in',   role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_12', name: 'Dev Jangid',            email: 'dev.jangid@sbcet.ac.in',        role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_13', name: 'Devesh Swami',          email: 'devesh.swami@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_14', name: 'Dinesh Saini',          email: 'dinesh.saini@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_15', name: 'Gaurav Chopra',         email: 'gaurav.chopra@sbcet.ac.in',     role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_16', name: 'Harshita Kumari',       email: 'harshita.kumari@sbcet.ac.in',   role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_17', name: 'Choudhary',             email: 'choudhary@sbcet.ac.in',         role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_18', name: 'Himmat Yadav',          email: 'himmat.yadav@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_19', name: 'Ishika Kumawat',        email: 'ishika.kumawat@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_20', name: 'Jaya Kaushik',          email: 'jaya.kaushik@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_21', name: 'Khushi Kumawat',        email: 'khushi.kumawat@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_22', name: 'Khushi Mahawar',        email: 'khushi.mahawar@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_23', name: 'Khushwant Sharma',      email: 'khushwant.sharma@sbcet.ac.in',  role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_24', name: 'Krishna Yadav',         email: 'krishna.yadav@sbcet.ac.in',     role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_25', name: 'Kundan Saini',          email: 'kundan.saini@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_26', name: 'Lakshya Gera',          email: 'lakshya.gera@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_27', name: 'Megha Singh',           email: 'megha.singh@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_28', name: 'Nandini Sharma',        email: 'nandini.sharma@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_29', name: 'Neeraj Kumar Jangid',   email: 'neeraj.jangid@sbcet.ac.in',     role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_30', name: 'Ojasvi Sharma',         email: 'ojasvi.sharma@sbcet.ac.in',     role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_31', name: 'Paras Joshi',           email: 'paras.joshi@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_32', name: 'Pradeep Kumar Sah',     email: 'pradeep.sah@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a1_33', name: 'Preet Raika',           email: 'preet.raika@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },

  // ── Section A – Batch A2 (CSE: 22 + CS: 10 = 32 students) ────────────────
  { id: 'usr_a2_01', name: 'Preetam Kushwah',       email: 'preetam.kushwah@sbcet.ac.in',   role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_02', name: 'Pritesh Singh',         email: 'pritesh.singh@sbcet.ac.in',     role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_03', name: 'Punit Tiwari',          email: 'punit.tiwari@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_04', name: 'Rahul Hakala',          email: 'rahul.hakala@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_05', name: 'Rakhi Kumari Yadav',    email: 'rakhi.yadav@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_06', name: 'Rohit (A2)',            email: 'rohit.a2@sbcet.ac.in',          role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_07', name: 'Roshan Yadav (CSE)',    email: 'roshan.yadav.cse@sbcet.ac.in',  role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_08', name: 'Saksham Sharma',        email: 'saksham.sharma@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_09', name: 'Sakshi Soni',           email: 'sakshi.soni@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_10', name: 'Sandeep Kumar Sah',     email: 'sandeep.sah@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_11', name: 'Shantanu Prajapati',    email: 'shantanu.prajapati@sbcet.ac.in',role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_12', name: 'Shatakshi Kaushik',     email: 'shatakshi.kaushik@sbcet.ac.in', role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_13', name: 'Shiksha Meena',         email: 'shiksha.meena@sbcet.ac.in',     role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_14', name: 'Shivam Raghav',         email: 'shivam.raghav@sbcet.ac.in',     role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_15', name: 'Shree Ram Roj',         email: 'shreeram.roj@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_16', name: 'Sunil Kumar',           email: 'sunil.kumar@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_17', name: 'Swati Verma',           email: 'swati.verma@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_18', name: 'Umesh Singh',           email: 'umesh.singh@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_19', name: 'Vedant Kumawat',        email: 'vedant.kumawat@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_20', name: 'Vimal Kumar Sharma',    email: 'vimal.sharma@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_21', name: 'Vishal Meena',          email: 'vishal.meena@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_22', name: 'Yash Dangi',            email: 'yash.dangi@sbcet.ac.in',        role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  // A2 – CS Branch (10 students)
  { id: 'usr_a2_23', name: 'Aayush Sharma (CS)',    email: 'aayush.sharma.cs@sbcet.ac.in',  role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_24', name: 'Aditya Choudhary (CS)', email: 'aditya.choudhary.cs@sbcet.ac.in',role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_25', name: 'Ankit Sharma',          email: 'ankit.sharma.cs@sbcet.ac.in',   role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_26', name: 'Divyanshu Sharma',      email: 'divyanshu.sharma@sbcet.ac.in',  role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_27', name: 'Naksh Pareek',          email: 'naksh.pareek@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_28', name: 'Nitin Singh',           email: 'nitin.singh.cs@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_29', name: 'Piyush Deshwal',        email: 'piyush.deshwal@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_30', name: 'Roshan Yadav (CS)',     email: 'roshan.yadav.cs@sbcet.ac.in',   role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_31', name: 'Shivang Vyas',          email: 'shivang.vyas@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_a2_32', name: 'Shubham Suthar',        email: 'shubham.suthar@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },

  // ── Section B – Batch B1 (AI, 36 students) ────────────────────────────────
  { id: 'usr_b1_01', name: 'Akash Babu',              email: 'akash.babu@sbcet.ac.in',          role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_02', name: 'Aman Tiwari',             email: 'aman.tiwari@sbcet.ac.in',         role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_03', name: 'Ankit Kumawat',           email: 'ankit.kumawat@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_04', name: 'Dheeraj Saini',           email: 'dheeraj.saini@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_05', name: 'Divakar Nayak',           email: 'divakar.nayak@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_06', name: 'Garv Jangir',             email: 'garv.jangir@sbcet.ac.in',         role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_07', name: 'Hemant',                  email: 'hemant@sbcet.ac.in',              role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_08', name: 'Himanshu Singh Khichee',  email: 'himanshu.khichee@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_09', name: 'Jatin Prajapat',          email: 'jatin.prajapat@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_10', name: 'Kapil Kumawat',           email: 'kapil.kumawat@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_11', name: 'Keshav Sharma',           email: 'keshav.sharma@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_12', name: 'Kishori',                 email: 'kishori@sbcet.ac.in',             role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_13', name: 'Komal Kumawat',           email: 'komal.kumawat@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_14', name: 'Lokesh Kumawat',          email: 'lokesh.kumawat@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_15', name: 'Mayank',                  email: 'mayank@sbcet.ac.in',              role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_16', name: 'Meenakshi Sharma',        email: 'meenakshi.sharma@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_17', name: 'Mohit Jangid',            email: 'mohit.jangid@sbcet.ac.in',        role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_18', name: 'Neeraj Saini',            email: 'neeraj.saini@sbcet.ac.in',        role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_19', name: 'Nidhi Nathawat',          email: 'nidhi.nathawat@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_20', name: 'Nidhi Sharma',            email: 'nidhi.sharma@sbcet.ac.in',        role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_21', name: 'Nishita Shekhawat',       email: 'nishita.shekhawat@sbcet.ac.in',   role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_22', name: 'Palakshi Kumawat',        email: 'palakshi.kumawat@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_23', name: 'Piyush Yadav',            email: 'piyush.yadav@sbcet.ac.in',        role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_24', name: 'Pooja Sharma',            email: 'pooja.sharma@sbcet.ac.in',        role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_25', name: 'Prashant Kumawat',        email: 'prashant.kumawat@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_26', name: 'Praveen Kushawah',        email: 'praveen.kushawah@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_27', name: 'Praveen Pareek',          email: 'praveen.pareek@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_28', name: 'Raj Kumar Jat',           email: 'rajkumar.jat@sbcet.ac.in',        role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_29', name: 'Raj Saini',               email: 'raj.saini@sbcet.ac.in',           role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_30', name: 'Riya Kanwar',             email: 'riya.kanwar@sbcet.ac.in',         role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_31', name: 'Rupendra Kumawat',        email: 'rupendra.kumawat@sbcet.ac.in',    role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_32', name: 'Sahil Bainsla',           email: 'sahil.bainsla@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_33', name: 'Saina Choudhary',         email: 'saina.choudhary@sbcet.ac.in',     role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_34', name: 'Sana Bano',               email: 'sana.bano@sbcet.ac.in',           role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_35', name: 'Sumit Sain',              email: 'sumit.sain@sbcet.ac.in',          role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b1_36', name: 'Tamanna Jangid',          email: 'tamanna.jangid@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },

  // ── Section B – Batch B2 (CSE-DS: 7 + Mech: 6 = 13 students) ─────────────
  { id: 'usr_b2_01', name: 'Abhishek Pandey',              email: 'abhishek.pandey@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b2_02', name: 'Akshara Agarwal',              email: 'akshara.agarwal@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b2_03', name: 'Deepanshu Lekhraj',            email: 'deepanshu.lekhraj@sbcet.ac.in',     role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b2_04', name: 'Neeraj Jangid',                email: 'neeraj.jangid.ds@sbcet.ac.in',      role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b2_05', name: 'Shagun Prajapat',              email: 'shagun.prajapat@sbcet.ac.in',       role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b2_06', name: 'Shivkaran',                    email: 'shivkaran@sbcet.ac.in',             role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b2_07', name: 'Yuvraj Singh',                 email: 'yuvraj.singh@sbcet.ac.in',          role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b2_08', name: 'Kumawat Rahul Mahaveerprasad', email: 'rahul.mahaveerprasad@sbcet.ac.in',  role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b2_09', name: 'Akshat Sain',                  email: 'akshat.sain@sbcet.ac.in',           role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b2_10', name: 'Darshan Vishwakarma',          email: 'darshan.vishwakarma@sbcet.ac.in',   role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b2_11', name: 'Deepak Kumar',                 email: 'deepak.kumar.mech@sbcet.ac.in',     role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b2_12', name: 'Pradhuman Shekhawat',          email: 'pradhuman.shekhawat@sbcet.ac.in',   role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
  { id: 'usr_b2_13', name: 'Rohit (Mech)',                 email: 'rohit.mech@sbcet.ac.in',            role: 'student', status: 'active', createdAt: '2026-08-15T09:00:00Z' },
];

// ─────────────────────────────────────────────────────────────────────────────
//  TEACHER PROFILES
// ─────────────────────────────────────────────────────────────────────────────
export const INITIAL_TEACHERS: TeacherProfile[] = [
  { id: 'tea_aastha',   userId: 'usr_tea_aastha',   employeeId: 'EMP-T201', name: 'Dr. Aastha Pareek',      departmentId: 'dept_first_year', email: 'aastha@sbcet.ac.in',   assignedSubjectIds: ['sub_chem', 'sub_chemlab'], status: 'active' },
  { id: 'tea_ahkhan',   userId: 'usr_tea_ahkhan',   employeeId: 'EMP-T202', name: 'Dr. A. H. Khan',         departmentId: 'dept_first_year', email: 'ahkhan@sbcet.ac.in',   assignedSubjectIds: ['sub_math'],               status: 'active' },
  { id: 'tea_vishal',   userId: 'usr_tea_vishal',   employeeId: 'EMP-T203', name: 'Dr. Vishal Sexena',      departmentId: 'dept_first_year', email: 'vishal@sbcet.ac.in',   assignedSubjectIds: ['sub_math'],               status: 'active' },
  { id: 'tea_pankaj',   userId: 'usr_tea_pankaj',   employeeId: 'EMP-T204', name: 'Dr. Pankaj Meel',        departmentId: 'dept_first_year', email: 'pankaj@sbcet.ac.in',   assignedSubjectIds: ['sub_comm'],               status: 'active' },
  { id: 'tea_vikas',    userId: 'usr_tea_vikas',    employeeId: 'EMP-T205', name: 'Mr. Vikas Singh',        departmentId: 'dept_first_year', email: 'vikas@sbcet.ac.in',    assignedSubjectIds: ['sub_pps'],                status: 'active' },
  { id: 'tea_sikander', userId: 'usr_tea_sikander', employeeId: 'EMP-T206', name: 'Mr. Sikander Khan',      departmentId: 'dept_first_year', email: 'sikander@sbcet.ac.in', assignedSubjectIds: ['sub_cyber', 'sub_ppslab'],status: 'active' },
  { id: 'tea_happy',    userId: 'usr_tea_happy',    employeeId: 'EMP-T207', name: 'Mr. Happy Dabla',        departmentId: 'dept_first_year', email: 'happy@sbcet.ac.in',    assignedSubjectIds: ['sub_de'],                 status: 'active' },
  { id: 'tea_firoz',    userId: 'usr_tea_firoz',    employeeId: 'EMP-T208', name: 'Dr. Syed Firoz Haider',  departmentId: 'dept_first_year', email: 'firoz@sbcet.ac.in',    assignedSubjectIds: ['sub_de'],                 status: 'active' },
  { id: 'tea_toofan',   userId: 'usr_tea_toofan',   employeeId: 'EMP-T209', name: 'Mr. Toofan Mukharjee',   departmentId: 'dept_first_year', email: 'toofan@sbcet.ac.in',   assignedSubjectIds: ['sub_cyber'],              status: 'active' },
  { id: 'tea_vijay',    userId: 'usr_tea_vijay',    employeeId: 'EMP-T210', name: 'Mr. Vijay Sharma',       departmentId: 'dept_first_year', email: 'vijay@sbcet.ac.in',    assignedSubjectIds: ['sub_ppslab'],             status: 'active' },
  { id: 'tea_nisha',    userId: 'usr_tea_nisha',    employeeId: 'EMP-T211', name: 'Dr. Nisha Poonia',       departmentId: 'dept_first_year', email: 'nisha@sbcet.ac.in',    assignedSubjectIds: ['sub_commlab'],            status: 'active' },
];

// ─────────────────────────────────────────────────────────────────────────────
//  STUDENT PROFILES  (114 real students)
//  Roll No format:
//    CSE  → 26SBCETCSE001 … 26SBCETCSE055
//    CS   → 26SBCETCS001  … 26SBCETCS010
//    AI   → 26SBCETAI001  … 26SBCETAI036
//    CSEDS→ 26SBCETDS001  … 26SBCETDS007
//    MECH → 26SBCETME001  … 26SBCETME006
// ─────────────────────────────────────────────────────────────────────────────
const mkStu = (
  n: number,       // sequence for roll/enrollment
  id: string,
  userId: string,
  name: string,
  email: string,
  sectionId: string,
  batch: string,
  branch: string,
  rollPrefix: string,
  deptId: string,
): StudentProfile => ({
  id,
  userId,
  name,
  rollNo: `26SBCET${rollPrefix}${String(n).padStart(3, '0')}`,
  enrollmentNo: `SBCET/2026/${rollPrefix}${String(n).padStart(3, '0')}`,
  departmentId: deptId,
  courseId: 'course_btech',
  semesterId: 'sem_btech_1',
  sectionId,
  batch,
  branch,
  academicSessionId: '2026-27',
  status: 'active',
  faceProfileStatus: 'verified',
  email,
});

export const INITIAL_STUDENTS: StudentProfile[] = [
  // ════════════════════════════════════════════════════════════════════════════
  //  SECTION A — Batch A1 (CSE, 33 students) — Roll: CSE001–CSE033
  // ════════════════════════════════════════════════════════════════════════════
  mkStu( 1,'stu_a1_01','usr_a1_01','Aayush Sharma',        'student@sbcet.ac.in',             'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu( 2,'stu_a1_02','usr_a1_02','Abhay Shankar Patel',  'abhay.patel@sbcet.ac.in',         'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu( 3,'stu_a1_03','usr_a1_03','Aditya Choudhary',     'aditya.choudhary@sbcet.ac.in',    'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu( 4,'stu_a1_04','usr_a1_04','Aditya Giri',          'aditya.giri@sbcet.ac.in',         'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu( 5,'stu_a1_05','usr_a1_05','Aditya Singh (A1)',    'aditya.singh1@sbcet.ac.in',       'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu( 6,'stu_a1_06','usr_a1_06','Aditya Singh (A1-2)',  'aditya.singh2@sbcet.ac.in',       'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu( 7,'stu_a1_07','usr_a1_07','Ajay Kumar',           'ajay.kumar@sbcet.ac.in',          'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu( 8,'stu_a1_08','usr_a1_08','Akshita Agarwal',      'akshita.agarwal@sbcet.ac.in',     'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu( 9,'stu_a1_09','usr_a1_09','Ayushi Agarwal',       'ayushi.agarwal@sbcet.ac.in',      'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(10,'stu_a1_10','usr_a1_10','Badal Kumar',          'badal.kumar@sbcet.ac.in',         'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(11,'stu_a1_11','usr_a1_11','Chirayu Dhabhai',      'chirayu.dhabhai@sbcet.ac.in',     'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(12,'stu_a1_12','usr_a1_12','Dev Jangid',           'dev.jangid@sbcet.ac.in',          'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(13,'stu_a1_13','usr_a1_13','Devesh Swami',         'devesh.swami@sbcet.ac.in',        'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(14,'stu_a1_14','usr_a1_14','Dinesh Saini',         'dinesh.saini@sbcet.ac.in',        'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(15,'stu_a1_15','usr_a1_15','Gaurav Chopra',        'gaurav.chopra@sbcet.ac.in',       'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(16,'stu_a1_16','usr_a1_16','Harshita Kumari',      'harshita.kumari@sbcet.ac.in',     'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(17,'stu_a1_17','usr_a1_17','Choudhary',            'choudhary@sbcet.ac.in',           'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(18,'stu_a1_18','usr_a1_18','Himmat Yadav',         'himmat.yadav@sbcet.ac.in',        'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(19,'stu_a1_19','usr_a1_19','Ishika Kumawat',       'ishika.kumawat@sbcet.ac.in',      'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(20,'stu_a1_20','usr_a1_20','Jaya Kaushik',         'jaya.kaushik@sbcet.ac.in',        'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(21,'stu_a1_21','usr_a1_21','Khushi Kumawat',       'khushi.kumawat@sbcet.ac.in',      'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(22,'stu_a1_22','usr_a1_22','Khushi Mahawar',       'khushi.mahawar@sbcet.ac.in',      'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(23,'stu_a1_23','usr_a1_23','Khushwant Sharma',     'khushwant.sharma@sbcet.ac.in',    'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(24,'stu_a1_24','usr_a1_24','Krishna Yadav',        'krishna.yadav@sbcet.ac.in',       'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(25,'stu_a1_25','usr_a1_25','Kundan Saini',         'kundan.saini@sbcet.ac.in',        'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(26,'stu_a1_26','usr_a1_26','Lakshya Gera',         'lakshya.gera@sbcet.ac.in',        'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(27,'stu_a1_27','usr_a1_27','Megha Singh',          'megha.singh@sbcet.ac.in',         'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(28,'stu_a1_28','usr_a1_28','Nandini Sharma',       'nandini.sharma@sbcet.ac.in',      'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(29,'stu_a1_29','usr_a1_29','Neeraj Kumar Jangid',  'neeraj.jangid@sbcet.ac.in',       'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(30,'stu_a1_30','usr_a1_30','Ojasvi Sharma',        'ojasvi.sharma@sbcet.ac.in',       'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(31,'stu_a1_31','usr_a1_31','Paras Joshi',          'paras.joshi@sbcet.ac.in',         'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(32,'stu_a1_32','usr_a1_32','Pradeep Kumar Sah',    'pradeep.sah@sbcet.ac.in',         'sec_btech_1a','A1','CSE','CSE','dept_cse'),
  mkStu(33,'stu_a1_33','usr_a1_33','Preet Raika',          'preet.raika@sbcet.ac.in',         'sec_btech_1a','A1','CSE','CSE','dept_cse'),

  // ════════════════════════════════════════════════════════════════════════════
  //  SECTION A — Batch A2 CSE (22) — Roll: CSE034–CSE055
  // ════════════════════════════════════════════════════════════════════════════
  mkStu(34,'stu_a2_01','usr_a2_01','Preetam Kushwah',      'preetam.kushwah@sbcet.ac.in',     'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(35,'stu_a2_02','usr_a2_02','Pritesh Singh',        'pritesh.singh@sbcet.ac.in',       'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(36,'stu_a2_03','usr_a2_03','Punit Tiwari',         'punit.tiwari@sbcet.ac.in',        'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(37,'stu_a2_04','usr_a2_04','Rahul Hakala',         'rahul.hakala@sbcet.ac.in',        'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(38,'stu_a2_05','usr_a2_05','Rakhi Kumari Yadav',   'rakhi.yadav@sbcet.ac.in',         'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(39,'stu_a2_06','usr_a2_06','Rohit (A2)',           'rohit.a2@sbcet.ac.in',            'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(40,'stu_a2_07','usr_a2_07','Roshan Yadav (CSE)',   'roshan.yadav.cse@sbcet.ac.in',    'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(41,'stu_a2_08','usr_a2_08','Saksham Sharma',       'saksham.sharma@sbcet.ac.in',      'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(42,'stu_a2_09','usr_a2_09','Sakshi Soni',          'sakshi.soni@sbcet.ac.in',         'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(43,'stu_a2_10','usr_a2_10','Sandeep Kumar Sah',    'sandeep.sah@sbcet.ac.in',         'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(44,'stu_a2_11','usr_a2_11','Shantanu Prajapati',   'shantanu.prajapati@sbcet.ac.in',  'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(45,'stu_a2_12','usr_a2_12','Shatakshi Kaushik',    'shatakshi.kaushik@sbcet.ac.in',   'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(46,'stu_a2_13','usr_a2_13','Shiksha Meena',        'shiksha.meena@sbcet.ac.in',       'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(47,'stu_a2_14','usr_a2_14','Shivam Raghav',        'shivam.raghav@sbcet.ac.in',       'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(48,'stu_a2_15','usr_a2_15','Shree Ram Roj',        'shreeram.roj@sbcet.ac.in',        'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(49,'stu_a2_16','usr_a2_16','Sunil Kumar',          'sunil.kumar@sbcet.ac.in',         'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(50,'stu_a2_17','usr_a2_17','Swati Verma',          'swati.verma@sbcet.ac.in',         'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(51,'stu_a2_18','usr_a2_18','Umesh Singh',          'umesh.singh@sbcet.ac.in',         'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(52,'stu_a2_19','usr_a2_19','Vedant Kumawat',       'vedant.kumawat@sbcet.ac.in',      'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(53,'stu_a2_20','usr_a2_20','Vimal Kumar Sharma',   'vimal.sharma@sbcet.ac.in',        'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(54,'stu_a2_21','usr_a2_21','Vishal Meena',         'vishal.meena@sbcet.ac.in',        'sec_btech_1a','A2','CSE','CSE','dept_cse'),
  mkStu(55,'stu_a2_22','usr_a2_22','Yash Dangi',           'yash.dangi@sbcet.ac.in',          'sec_btech_1a','A2','CSE','CSE','dept_cse'),

  // ════════════════════════════════════════════════════════════════════════════
  //  SECTION A — Batch A2 CS (10) — Roll: CS001–CS010
  // ════════════════════════════════════════════════════════════════════════════
  mkStu( 1,'stu_a2_23','usr_a2_23','Aayush Sharma (CS)',    'aayush.sharma.cs@sbcet.ac.in',   'sec_btech_1a','A2','CS','CS','dept_cs'),
  mkStu( 2,'stu_a2_24','usr_a2_24','Aditya Choudhary (CS)','aditya.choudhary.cs@sbcet.ac.in','sec_btech_1a','A2','CS','CS','dept_cs'),
  mkStu( 3,'stu_a2_25','usr_a2_25','Ankit Sharma',          'ankit.sharma.cs@sbcet.ac.in',    'sec_btech_1a','A2','CS','CS','dept_cs'),
  mkStu( 4,'stu_a2_26','usr_a2_26','Divyanshu Sharma',      'divyanshu.sharma@sbcet.ac.in',   'sec_btech_1a','A2','CS','CS','dept_cs'),
  mkStu( 5,'stu_a2_27','usr_a2_27','Naksh Pareek',          'naksh.pareek@sbcet.ac.in',       'sec_btech_1a','A2','CS','CS','dept_cs'),
  mkStu( 6,'stu_a2_28','usr_a2_28','Nitin Singh',           'nitin.singh.cs@sbcet.ac.in',     'sec_btech_1a','A2','CS','CS','dept_cs'),
  mkStu( 7,'stu_a2_29','usr_a2_29','Piyush Deshwal',        'piyush.deshwal@sbcet.ac.in',     'sec_btech_1a','A2','CS','CS','dept_cs'),
  mkStu( 8,'stu_a2_30','usr_a2_30','Roshan Yadav (CS)',     'roshan.yadav.cs@sbcet.ac.in',    'sec_btech_1a','A2','CS','CS','dept_cs'),
  mkStu( 9,'stu_a2_31','usr_a2_31','Shivang Vyas',          'shivang.vyas@sbcet.ac.in',       'sec_btech_1a','A2','CS','CS','dept_cs'),
  mkStu(10,'stu_a2_32','usr_a2_32','Shubham Suthar',        'shubham.suthar@sbcet.ac.in',     'sec_btech_1a','A2','CS','CS','dept_cs'),

  // ════════════════════════════════════════════════════════════════════════════
  //  SECTION B — Batch B1 (AI, 36 students) — Roll: AI001–AI036
  // ════════════════════════════════════════════════════════════════════════════
  mkStu( 1,'stu_b1_01','usr_b1_01','Akash Babu',             'akash.babu@sbcet.ac.in',         'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu( 2,'stu_b1_02','usr_b1_02','Aman Tiwari',            'aman.tiwari@sbcet.ac.in',        'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu( 3,'stu_b1_03','usr_b1_03','Ankit Kumawat',          'ankit.kumawat@sbcet.ac.in',      'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu( 4,'stu_b1_04','usr_b1_04','Dheeraj Saini',          'dheeraj.saini@sbcet.ac.in',      'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu( 5,'stu_b1_05','usr_b1_05','Divakar Nayak',          'divakar.nayak@sbcet.ac.in',      'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu( 6,'stu_b1_06','usr_b1_06','Garv Jangir',            'garv.jangir@sbcet.ac.in',        'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu( 7,'stu_b1_07','usr_b1_07','Hemant',                 'hemant@sbcet.ac.in',             'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu( 8,'stu_b1_08','usr_b1_08','Himanshu Singh Khichee', 'himanshu.khichee@sbcet.ac.in',   'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu( 9,'stu_b1_09','usr_b1_09','Jatin Prajapat',         'jatin.prajapat@sbcet.ac.in',     'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(10,'stu_b1_10','usr_b1_10','Kapil Kumawat',          'kapil.kumawat@sbcet.ac.in',      'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(11,'stu_b1_11','usr_b1_11','Keshav Sharma',          'keshav.sharma@sbcet.ac.in',      'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(12,'stu_b1_12','usr_b1_12','Kishori',                'kishori@sbcet.ac.in',            'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(13,'stu_b1_13','usr_b1_13','Komal Kumawat',          'komal.kumawat@sbcet.ac.in',      'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(14,'stu_b1_14','usr_b1_14','Lokesh Kumawat',         'lokesh.kumawat@sbcet.ac.in',     'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(15,'stu_b1_15','usr_b1_15','Mayank',                 'mayank@sbcet.ac.in',             'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(16,'stu_b1_16','usr_b1_16','Meenakshi Sharma',       'meenakshi.sharma@sbcet.ac.in',   'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(17,'stu_b1_17','usr_b1_17','Mohit Jangid',           'mohit.jangid@sbcet.ac.in',       'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(18,'stu_b1_18','usr_b1_18','Neeraj Saini',           'neeraj.saini@sbcet.ac.in',       'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(19,'stu_b1_19','usr_b1_19','Nidhi Nathawat',         'nidhi.nathawat@sbcet.ac.in',     'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(20,'stu_b1_20','usr_b1_20','Nidhi Sharma',           'nidhi.sharma@sbcet.ac.in',       'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(21,'stu_b1_21','usr_b1_21','Nishita Shekhawat',      'nishita.shekhawat@sbcet.ac.in',  'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(22,'stu_b1_22','usr_b1_22','Palakshi Kumawat',       'palakshi.kumawat@sbcet.ac.in',   'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(23,'stu_b1_23','usr_b1_23','Piyush Yadav',           'piyush.yadav@sbcet.ac.in',       'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(24,'stu_b1_24','usr_b1_24','Pooja Sharma',           'pooja.sharma@sbcet.ac.in',       'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(25,'stu_b1_25','usr_b1_25','Prashant Kumawat',       'prashant.kumawat@sbcet.ac.in',   'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(26,'stu_b1_26','usr_b1_26','Praveen Kushawah',       'praveen.kushawah@sbcet.ac.in',   'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(27,'stu_b1_27','usr_b1_27','Praveen Pareek',         'praveen.pareek@sbcet.ac.in',     'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(28,'stu_b1_28','usr_b1_28','Raj Kumar Jat',          'rajkumar.jat@sbcet.ac.in',       'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(29,'stu_b1_29','usr_b1_29','Raj Saini',              'raj.saini@sbcet.ac.in',          'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(30,'stu_b1_30','usr_b1_30','Riya Kanwar',            'riya.kanwar@sbcet.ac.in',        'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(31,'stu_b1_31','usr_b1_31','Rupendra Kumawat',       'rupendra.kumawat@sbcet.ac.in',   'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(32,'stu_b1_32','usr_b1_32','Sahil Bainsla',          'sahil.bainsla@sbcet.ac.in',      'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(33,'stu_b1_33','usr_b1_33','Saina Choudhary',        'saina.choudhary@sbcet.ac.in',    'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(34,'stu_b1_34','usr_b1_34','Sana Bano',              'sana.bano@sbcet.ac.in',          'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(35,'stu_b1_35','usr_b1_35','Sumit Sain',             'sumit.sain@sbcet.ac.in',         'sec_btech_1b','B1','AI','AI','dept_ai'),
  mkStu(36,'stu_b1_36','usr_b1_36','Tamanna Jangid',         'tamanna.jangid@sbcet.ac.in',     'sec_btech_1b','B1','AI','AI','dept_ai'),

  // ════════════════════════════════════════════════════════════════════════════
  //  SECTION B — Batch B2 CSE-DS (7) — Roll: DS001–DS007
  // ════════════════════════════════════════════════════════════════════════════
  mkStu(1,'stu_b2_01','usr_b2_01','Abhishek Pandey',             'abhishek.pandey@sbcet.ac.in',       'sec_btech_1b','B2','CSE-DS','DS','dept_cseds'),
  mkStu(2,'stu_b2_02','usr_b2_02','Akshara Agarwal',             'akshara.agarwal@sbcet.ac.in',       'sec_btech_1b','B2','CSE-DS','DS','dept_cseds'),
  mkStu(3,'stu_b2_03','usr_b2_03','Deepanshu Lekhraj',           'deepanshu.lekhraj@sbcet.ac.in',     'sec_btech_1b','B2','CSE-DS','DS','dept_cseds'),
  mkStu(4,'stu_b2_04','usr_b2_04','Neeraj Jangid',               'neeraj.jangid.ds@sbcet.ac.in',      'sec_btech_1b','B2','CSE-DS','DS','dept_cseds'),
  mkStu(5,'stu_b2_05','usr_b2_05','Shagun Prajapat',             'shagun.prajapat@sbcet.ac.in',       'sec_btech_1b','B2','CSE-DS','DS','dept_cseds'),
  mkStu(6,'stu_b2_06','usr_b2_06','Shivkaran',                   'shivkaran@sbcet.ac.in',             'sec_btech_1b','B2','CSE-DS','DS','dept_cseds'),
  mkStu(7,'stu_b2_07','usr_b2_07','Yuvraj Singh',                'yuvraj.singh@sbcet.ac.in',          'sec_btech_1b','B2','CSE-DS','DS','dept_cseds'),

  // ════════════════════════════════════════════════════════════════════════════
  //  SECTION B — Batch B2 Mech (6) — Roll: ME001–ME006
  // ════════════════════════════════════════════════════════════════════════════
  mkStu(1,'stu_b2_08','usr_b2_08','Kumawat Rahul Mahaveerprasad','rahul.mahaveerprasad@sbcet.ac.in',  'sec_btech_1b','B2','Mech','ME','dept_mech'),
  mkStu(2,'stu_b2_09','usr_b2_09','Akshat Sain',                 'akshat.sain@sbcet.ac.in',           'sec_btech_1b','B2','Mech','ME','dept_mech'),
  mkStu(3,'stu_b2_10','usr_b2_10','Darshan Vishwakarma',         'darshan.vishwakarma@sbcet.ac.in',   'sec_btech_1b','B2','Mech','ME','dept_mech'),
  mkStu(4,'stu_b2_11','usr_b2_11','Deepak Kumar',                'deepak.kumar.mech@sbcet.ac.in',     'sec_btech_1b','B2','Mech','ME','dept_mech'),
  mkStu(5,'stu_b2_12','usr_b2_12','Pradhuman Shekhawat',         'pradhuman.shekhawat@sbcet.ac.in',   'sec_btech_1b','B2','Mech','ME','dept_mech'),
  mkStu(6,'stu_b2_13','usr_b2_13','Rohit (Mech)',                'rohit.mech@sbcet.ac.in',            'sec_btech_1b','B2','Mech','ME','dept_mech'),
];

// ─────────────────────────────────────────────────────────────────────────────
//  TIMETABLE (unchanged real SBCET data)
// ─────────────────────────────────────────────────────────────────────────────
export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // ─── SECTION A: CSE & CS (SL1) ───────────────────────────────────────────
  { id: 'tt_a_mon_1', dayOfWeek:1, dayName:'Monday',    startTime:'09:35',endTime:'10:30',subjectId:'sub_chem',   teacherId:'tea_aastha',  sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_mon_2', dayOfWeek:1, dayName:'Monday',    startTime:'10:30',endTime:'11:25',subjectId:'sub_math',   teacherId:'tea_ahkhan',  sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_mon_3', dayOfWeek:1, dayName:'Monday',    startTime:'11:25',endTime:'12:20',subjectId:'sub_pps',    teacherId:'tea_vikas',   sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_mon_4', dayOfWeek:1, dayName:'Monday',    startTime:'12:20',endTime:'13:10',subjectId:'sub_lib',    teacherId:'tea_aastha',  sectionId:'sec_btech_1a',classroomId:'cr_lib',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_mon_5', dayOfWeek:1, dayName:'Monday',    startTime:'13:45',endTime:'14:35',subjectId:'sub_chemlab',teacherId:'tea_aastha',  sectionId:'sec_btech_1a',classroomId:'cr_chemlab',academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_mon_6', dayOfWeek:1, dayName:'Monday',    startTime:'14:35',endTime:'15:25',subjectId:'sub_commlab',teacherId:'tea_nisha',   sectionId:'sec_btech_1a',classroomId:'cr_commlab',academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_tue_1', dayOfWeek:2, dayName:'Tuesday',   startTime:'09:35',endTime:'10:30',subjectId:'sub_de',     teacherId:'tea_firoz',   sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_tue_2', dayOfWeek:2, dayName:'Tuesday',   startTime:'10:30',endTime:'11:25',subjectId:'sub_math',   teacherId:'tea_ahkhan',  sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_tue_3', dayOfWeek:2, dayName:'Tuesday',   startTime:'11:25',endTime:'12:20',subjectId:'sub_pps',    teacherId:'tea_vikas',   sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_tue_4', dayOfWeek:2, dayName:'Tuesday',   startTime:'12:20',endTime:'13:10',subjectId:'sub_lib',    teacherId:'tea_ahkhan',  sectionId:'sec_btech_1a',classroomId:'cr_lib',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_tue_5', dayOfWeek:2, dayName:'Tuesday',   startTime:'13:45',endTime:'14:35',subjectId:'sub_chemlab',teacherId:'tea_aastha',  sectionId:'sec_btech_1a',classroomId:'cr_chemlab',academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_tue_6', dayOfWeek:2, dayName:'Tuesday',   startTime:'14:35',endTime:'15:25',subjectId:'sub_commlab',teacherId:'tea_nisha',   sectionId:'sec_btech_1a',classroomId:'cr_commlab',academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_wed_1', dayOfWeek:3, dayName:'Wednesday', startTime:'09:35',endTime:'10:30',subjectId:'sub_chem',   teacherId:'tea_aastha',  sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_wed_2', dayOfWeek:3, dayName:'Wednesday', startTime:'10:30',endTime:'11:25',subjectId:'sub_lib',    teacherId:'tea_vikas',   sectionId:'sec_btech_1a',classroomId:'cr_lib',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_wed_3', dayOfWeek:3, dayName:'Wednesday', startTime:'11:25',endTime:'12:20',subjectId:'sub_cyber',  teacherId:'tea_sikander',sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_wed_4', dayOfWeek:3, dayName:'Wednesday', startTime:'12:20',endTime:'13:10',subjectId:'sub_de',     teacherId:'tea_firoz',   sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_wed_5', dayOfWeek:3, dayName:'Wednesday', startTime:'13:45',endTime:'14:35',subjectId:'sub_comm',   teacherId:'tea_pankaj',  sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_wed_6', dayOfWeek:3, dayName:'Wednesday', startTime:'14:35',endTime:'15:25',subjectId:'sub_lib',    teacherId:'tea_firoz',   sectionId:'sec_btech_1a',classroomId:'cr_lib',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_thu_1', dayOfWeek:4, dayName:'Thursday',  startTime:'09:35',endTime:'10:30',subjectId:'sub_math',   teacherId:'tea_ahkhan',  sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_thu_2', dayOfWeek:4, dayName:'Thursday',  startTime:'10:30',endTime:'11:25',subjectId:'sub_chem',   teacherId:'tea_aastha',  sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_thu_3', dayOfWeek:4, dayName:'Thursday',  startTime:'11:25',endTime:'12:20',subjectId:'sub_lib',    teacherId:'tea_ahkhan',  sectionId:'sec_btech_1a',classroomId:'cr_lib',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_thu_4', dayOfWeek:4, dayName:'Thursday',  startTime:'12:20',endTime:'13:10',subjectId:'sub_cyber',  teacherId:'tea_sikander',sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_thu_5', dayOfWeek:4, dayName:'Thursday',  startTime:'13:45',endTime:'14:35',subjectId:'sub_comm',   teacherId:'tea_pankaj',  sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_thu_6', dayOfWeek:4, dayName:'Thursday',  startTime:'14:35',endTime:'15:25',subjectId:'sub_de',     teacherId:'tea_firoz',   sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_fri_1', dayOfWeek:5, dayName:'Friday',    startTime:'09:35',endTime:'10:30',subjectId:'sub_math',   teacherId:'tea_ahkhan',  sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_fri_2', dayOfWeek:5, dayName:'Friday',    startTime:'10:30',endTime:'11:25',subjectId:'sub_lib',    teacherId:'tea_pankaj',  sectionId:'sec_btech_1a',classroomId:'cr_lib',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_fri_3', dayOfWeek:5, dayName:'Friday',    startTime:'11:25',endTime:'12:20',subjectId:'sub_chem',   teacherId:'tea_aastha',  sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_fri_4', dayOfWeek:5, dayName:'Friday',    startTime:'12:20',endTime:'13:10',subjectId:'sub_comm',   teacherId:'tea_pankaj',  sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_fri_5', dayOfWeek:5, dayName:'Friday',    startTime:'13:45',endTime:'14:35',subjectId:'sub_ppslab', teacherId:'tea_vijay',   sectionId:'sec_btech_1a',classroomId:'cr_ppslab', academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_fri_6', dayOfWeek:5, dayName:'Friday',    startTime:'14:35',endTime:'15:25',subjectId:'sub_ppslab', teacherId:'tea_sikander',sectionId:'sec_btech_1a',classroomId:'cr_ppslab', academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_sat_1', dayOfWeek:6, dayName:'Saturday',  startTime:'09:35',endTime:'10:30',subjectId:'sub_math',   teacherId:'tea_ahkhan',  sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_sat_2', dayOfWeek:6, dayName:'Saturday',  startTime:'10:30',endTime:'11:25',subjectId:'sub_chem',   teacherId:'tea_aastha',  sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_sat_3', dayOfWeek:6, dayName:'Saturday',  startTime:'11:25',endTime:'12:20',subjectId:'sub_pps',    teacherId:'tea_vikas',   sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_sat_4', dayOfWeek:6, dayName:'Saturday',  startTime:'12:20',endTime:'13:10',subjectId:'sub_cyber',  teacherId:'tea_sikander',sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_a_sat_5', dayOfWeek:6, dayName:'Saturday',  startTime:'13:45',endTime:'15:25',subjectId:'sub_eca',    teacherId:'tea_pankaj',  sectionId:'sec_btech_1a',classroomId:'cr_sl1',    academicSessionId:'2026-27',status:'active'},

  // ─── SECTION B: AI & DS (SL-4) ───────────────────────────────────────────
  { id: 'tt_b_mon_1', dayOfWeek:1, dayName:'Monday',    startTime:'09:35',endTime:'10:30',subjectId:'sub_cyber',  teacherId:'tea_toofan',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_mon_2', dayOfWeek:1, dayName:'Monday',    startTime:'10:30',endTime:'11:25',subjectId:'sub_chem',   teacherId:'tea_aastha',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_mon_3', dayOfWeek:1, dayName:'Monday',    startTime:'11:25',endTime:'12:20',subjectId:'sub_lib',    teacherId:'tea_vishal',  sectionId:'sec_btech_1b',classroomId:'cr_lib',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_mon_4', dayOfWeek:1, dayName:'Monday',    startTime:'12:20',endTime:'13:10',subjectId:'sub_math',   teacherId:'tea_vishal',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_mon_5', dayOfWeek:1, dayName:'Monday',    startTime:'13:45',endTime:'14:35',subjectId:'sub_comm',   teacherId:'tea_pankaj',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_mon_6', dayOfWeek:1, dayName:'Monday',    startTime:'14:35',endTime:'15:25',subjectId:'sub_lib',    teacherId:'tea_toofan',  sectionId:'sec_btech_1b',classroomId:'cr_lib',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_tue_1', dayOfWeek:2, dayName:'Tuesday',   startTime:'09:35',endTime:'10:30',subjectId:'sub_chem',   teacherId:'tea_aastha',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_tue_2', dayOfWeek:2, dayName:'Tuesday',   startTime:'10:30',endTime:'11:25',subjectId:'sub_math',   teacherId:'tea_vishal',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_tue_3', dayOfWeek:2, dayName:'Tuesday',   startTime:'11:25',endTime:'13:10',subjectId:'sub_chemlab',teacherId:'tea_aastha',  sectionId:'sec_btech_1b',classroomId:'cr_chemlab',academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_tue_5', dayOfWeek:2, dayName:'Tuesday',   startTime:'13:45',endTime:'14:35',subjectId:'sub_comm',   teacherId:'tea_pankaj',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_tue_6', dayOfWeek:2, dayName:'Tuesday',   startTime:'14:35',endTime:'15:25',subjectId:'sub_lib',    teacherId:'tea_pankaj',  sectionId:'sec_btech_1b',classroomId:'cr_lib',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_wed_1', dayOfWeek:3, dayName:'Wednesday', startTime:'09:35',endTime:'10:30',subjectId:'sub_de',     teacherId:'tea_happy',   sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_wed_2', dayOfWeek:3, dayName:'Wednesday', startTime:'10:30',endTime:'11:25',subjectId:'sub_chem',   teacherId:'tea_aastha',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_wed_3', dayOfWeek:3, dayName:'Wednesday', startTime:'11:25',endTime:'12:20',subjectId:'sub_pps',    teacherId:'tea_vikas',   sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_wed_4', dayOfWeek:3, dayName:'Wednesday', startTime:'12:20',endTime:'13:10',subjectId:'sub_math',   teacherId:'tea_vishal',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_wed_5', dayOfWeek:3, dayName:'Wednesday', startTime:'13:45',endTime:'15:25',subjectId:'sub_ppslab', teacherId:'tea_vikas',   sectionId:'sec_btech_1b',classroomId:'cr_ppslab', academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_thu_1', dayOfWeek:4, dayName:'Thursday',  startTime:'09:35',endTime:'10:30',subjectId:'sub_cyber',  teacherId:'tea_toofan',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_thu_2', dayOfWeek:4, dayName:'Thursday',  startTime:'10:30',endTime:'11:25',subjectId:'sub_lib',    teacherId:'tea_toofan',  sectionId:'sec_btech_1b',classroomId:'cr_lib',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_thu_3', dayOfWeek:4, dayName:'Thursday',  startTime:'11:25',endTime:'12:20',subjectId:'sub_pps',    teacherId:'tea_vikas',   sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_thu_4', dayOfWeek:4, dayName:'Thursday',  startTime:'12:20',endTime:'13:10',subjectId:'sub_de',     teacherId:'tea_happy',   sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_thu_5', dayOfWeek:4, dayName:'Thursday',  startTime:'13:45',endTime:'14:35',subjectId:'sub_lib',    teacherId:'tea_happy',   sectionId:'sec_btech_1b',classroomId:'cr_lib',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_thu_6', dayOfWeek:4, dayName:'Thursday',  startTime:'14:35',endTime:'15:25',subjectId:'sub_comm',   teacherId:'tea_pankaj',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_fri_1', dayOfWeek:5, dayName:'Friday',    startTime:'09:35',endTime:'10:30',subjectId:'sub_de',     teacherId:'tea_happy',   sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_fri_2', dayOfWeek:5, dayName:'Friday',    startTime:'10:30',endTime:'11:25',subjectId:'sub_lib',    teacherId:'tea_happy',   sectionId:'sec_btech_1b',classroomId:'cr_lib',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_fri_3', dayOfWeek:5, dayName:'Friday',    startTime:'11:25',endTime:'12:20',subjectId:'sub_pps',    teacherId:'tea_vikas',   sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_fri_4', dayOfWeek:5, dayName:'Friday',    startTime:'12:20',endTime:'13:10',subjectId:'sub_chem',   teacherId:'tea_aastha',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_fri_5', dayOfWeek:5, dayName:'Friday',    startTime:'13:45',endTime:'15:25',subjectId:'sub_chemlab',teacherId:'tea_aastha',  sectionId:'sec_btech_1b',classroomId:'cr_chemlab',academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_sat_1', dayOfWeek:6, dayName:'Saturday',  startTime:'09:35',endTime:'10:30',subjectId:'sub_math',   teacherId:'tea_vishal',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_sat_2', dayOfWeek:6, dayName:'Saturday',  startTime:'10:30',endTime:'11:25',subjectId:'sub_cyber',  teacherId:'tea_toofan',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_sat_3', dayOfWeek:6, dayName:'Saturday',  startTime:'11:25',endTime:'12:20',subjectId:'sub_lib',    teacherId:'tea_vishal',  sectionId:'sec_btech_1b',classroomId:'cr_lib',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_sat_4', dayOfWeek:6, dayName:'Saturday',  startTime:'12:20',endTime:'13:10',subjectId:'sub_chem',   teacherId:'tea_aastha',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
  { id: 'tt_b_sat_5', dayOfWeek:6, dayName:'Saturday',  startTime:'13:45',endTime:'15:25',subjectId:'sub_eca',    teacherId:'tea_pankaj',  sectionId:'sec_btech_1b',classroomId:'cr_sl4',    academicSessionId:'2026-27',status:'active'},
];

// ─────────────────────────────────────────────────────────────────────────────
//  HISTORICAL ATTENDANCE RECORDS  (5 weeks: 18 Aug → 19 Sep 2026)
//  Primary login student: Aayush Sharma (stu_a1_01) → 26SBCETCSE001
// ─────────────────────────────────────────────────────────────────────────────
const v = (d: number, s: number): AttendanceRecord['verification'] => ({
  qr: 'passed', geofence: 'passed', face: 'passed', liveness: 'passed',
  distanceMeters: d, faceMatchScore: s, deviceTimestamp: '',
});

// Bulk representative students for Section A (good attendance)
const SEC_A_REGULAR = [
  'stu_a1_01','stu_a1_02','stu_a1_03','stu_a1_04','stu_a1_05','stu_a1_06','stu_a1_07','stu_a1_08',
  'stu_a1_09','stu_a1_10','stu_a1_11','stu_a1_12','stu_a1_13','stu_a1_14','stu_a1_15','stu_a1_16',
  'stu_a1_18','stu_a1_19','stu_a1_20','stu_a1_21','stu_a1_22','stu_a1_23','stu_a1_24','stu_a1_25',
  'stu_a1_26','stu_a1_27','stu_a1_28','stu_a1_29','stu_a1_30','stu_a1_31','stu_a1_32','stu_a1_33',
  'stu_a2_01','stu_a2_02','stu_a2_03','stu_a2_04','stu_a2_05','stu_a2_06','stu_a2_07','stu_a2_08',
  'stu_a2_09','stu_a2_10','stu_a2_11','stu_a2_12','stu_a2_13','stu_a2_14','stu_a2_15','stu_a2_16',
  'stu_a2_17','stu_a2_18','stu_a2_19','stu_a2_20','stu_a2_21','stu_a2_22',
  'stu_a2_23','stu_a2_24','stu_a2_25','stu_a2_26','stu_a2_27','stu_a2_28','stu_a2_29','stu_a2_30','stu_a2_31','stu_a2_32',
];
// Low-attendance (will skip ~55% of sessions → drops below 75%)
const SEC_A_LOW = ['stu_a1_17'];

// Section B regular + low
const SEC_B_REGULAR = [
  'stu_b1_01','stu_b1_02','stu_b1_03','stu_b1_04','stu_b1_05','stu_b1_06','stu_b1_07','stu_b1_08',
  'stu_b1_09','stu_b1_10','stu_b1_11','stu_b1_12','stu_b1_13','stu_b1_14','stu_b1_15','stu_b1_16',
  'stu_b1_17','stu_b1_18','stu_b1_19','stu_b1_20','stu_b1_21','stu_b1_22','stu_b1_23','stu_b1_24',
  'stu_b1_25','stu_b1_26','stu_b1_27','stu_b1_28','stu_b1_29','stu_b1_30','stu_b1_31','stu_b1_32',
  'stu_b1_33','stu_b1_34','stu_b1_35','stu_b1_36',
  'stu_b2_01','stu_b2_02','stu_b2_03','stu_b2_04','stu_b2_05','stu_b2_06','stu_b2_07',
  'stu_b2_08','stu_b2_09','stu_b2_10','stu_b2_11','stu_b2_12','stu_b2_13',
];
const SEC_B_LOW: string[] = [];

// Name+Roll lookup (only the enrolled students, not all 114 — just what makeRecs needs)
const STU_META: Record<string, { name: string; rollNo: string }> = {
  stu_a1_01:{name:'Aayush Sharma',              rollNo:'26SBCETCSE001'},
  stu_a1_02:{name:'Abhay Shankar Patel',        rollNo:'26SBCETCSE002'},
  stu_a1_03:{name:'Aditya Choudhary',           rollNo:'26SBCETCSE003'},
  stu_a1_04:{name:'Aditya Giri',                rollNo:'26SBCETCSE004'},
  stu_a1_05:{name:'Aditya Singh (A1)',          rollNo:'26SBCETCSE005'},
  stu_a1_06:{name:'Aditya Singh (A1-2)',        rollNo:'26SBCETCSE006'},
  stu_a1_07:{name:'Ajay Kumar',                 rollNo:'26SBCETCSE007'},
  stu_a1_08:{name:'Akshita Agarwal',            rollNo:'26SBCETCSE008'},
  stu_a1_09:{name:'Ayushi Agarwal',             rollNo:'26SBCETCSE009'},
  stu_a1_10:{name:'Badal Kumar',                rollNo:'26SBCETCSE010'},
  stu_a1_11:{name:'Chirayu Dhabhai',            rollNo:'26SBCETCSE011'},
  stu_a1_12:{name:'Dev Jangid',                 rollNo:'26SBCETCSE012'},
  stu_a1_13:{name:'Devesh Swami',               rollNo:'26SBCETCSE013'},
  stu_a1_14:{name:'Dinesh Saini',               rollNo:'26SBCETCSE014'},
  stu_a1_15:{name:'Gaurav Chopra',              rollNo:'26SBCETCSE015'},
  stu_a1_16:{name:'Harshita Kumari',            rollNo:'26SBCETCSE016'},
  stu_a1_17:{name:'Choudhary',                  rollNo:'26SBCETCSE017'},
  stu_a1_18:{name:'Himmat Yadav',               rollNo:'26SBCETCSE018'},
  stu_a1_19:{name:'Ishika Kumawat',             rollNo:'26SBCETCSE019'},
  stu_a1_20:{name:'Jaya Kaushik',               rollNo:'26SBCETCSE020'},
  stu_a1_21:{name:'Khushi Kumawat',             rollNo:'26SBCETCSE021'},
  stu_a1_22:{name:'Khushi Mahawar',             rollNo:'26SBCETCSE022'},
  stu_a1_23:{name:'Khushwant Sharma',           rollNo:'26SBCETCSE023'},
  stu_a1_24:{name:'Krishna Yadav',              rollNo:'26SBCETCSE024'},
  stu_a1_25:{name:'Kundan Saini',               rollNo:'26SBCETCSE025'},
  stu_a1_26:{name:'Lakshya Gera',               rollNo:'26SBCETCSE026'},
  stu_a1_27:{name:'Megha Singh',                rollNo:'26SBCETCSE027'},
  stu_a1_28:{name:'Nandini Sharma',             rollNo:'26SBCETCSE028'},
  stu_a1_29:{name:'Neeraj Kumar Jangid',        rollNo:'26SBCETCSE029'},
  stu_a1_30:{name:'Ojasvi Sharma',              rollNo:'26SBCETCSE030'},
  stu_a1_31:{name:'Paras Joshi',                rollNo:'26SBCETCSE031'},
  stu_a1_32:{name:'Pradeep Kumar Sah',          rollNo:'26SBCETCSE032'},
  stu_a1_33:{name:'Preet Raika',                rollNo:'26SBCETCSE033'},
  stu_a2_01:{name:'Preetam Kushwah',            rollNo:'26SBCETCSE034'},
  stu_a2_02:{name:'Pritesh Singh',              rollNo:'26SBCETCSE035'},
  stu_a2_03:{name:'Punit Tiwari',               rollNo:'26SBCETCSE036'},
  stu_a2_04:{name:'Rahul Hakala',               rollNo:'26SBCETCSE037'},
  stu_a2_05:{name:'Rakhi Kumari Yadav',         rollNo:'26SBCETCSE038'},
  stu_a2_06:{name:'Rohit (A2)',                 rollNo:'26SBCETCSE039'},
  stu_a2_07:{name:'Roshan Yadav (CSE)',         rollNo:'26SBCETCSE040'},
  stu_a2_08:{name:'Saksham Sharma',             rollNo:'26SBCETCSE041'},
  stu_a2_09:{name:'Sakshi Soni',                rollNo:'26SBCETCSE042'},
  stu_a2_10:{name:'Sandeep Kumar Sah',          rollNo:'26SBCETCSE043'},
  stu_a2_11:{name:'Shantanu Prajapati',         rollNo:'26SBCETCSE044'},
  stu_a2_12:{name:'Shatakshi Kaushik',          rollNo:'26SBCETCSE045'},
  stu_a2_13:{name:'Shiksha Meena',              rollNo:'26SBCETCSE046'},
  stu_a2_14:{name:'Shivam Raghav',              rollNo:'26SBCETCSE047'},
  stu_a2_15:{name:'Shree Ram Roj',              rollNo:'26SBCETCSE048'},
  stu_a2_16:{name:'Sunil Kumar',                rollNo:'26SBCETCSE049'},
  stu_a2_17:{name:'Swati Verma',                rollNo:'26SBCETCSE050'},
  stu_a2_18:{name:'Umesh Singh',                rollNo:'26SBCETCSE051'},
  stu_a2_19:{name:'Vedant Kumawat',             rollNo:'26SBCETCSE052'},
  stu_a2_20:{name:'Vimal Kumar Sharma',         rollNo:'26SBCETCSE053'},
  stu_a2_21:{name:'Vishal Meena',               rollNo:'26SBCETCSE054'},
  stu_a2_22:{name:'Yash Dangi',                 rollNo:'26SBCETCSE055'},
  stu_a2_23:{name:'Aayush Sharma (CS)',         rollNo:'26SBCETCS001'},
  stu_a2_24:{name:'Aditya Choudhary (CS)',      rollNo:'26SBCETCS002'},
  stu_a2_25:{name:'Ankit Sharma',               rollNo:'26SBCETCS003'},
  stu_a2_26:{name:'Divyanshu Sharma',           rollNo:'26SBCETCS004'},
  stu_a2_27:{name:'Naksh Pareek',               rollNo:'26SBCETCS005'},
  stu_a2_28:{name:'Nitin Singh',                rollNo:'26SBCETCS006'},
  stu_a2_29:{name:'Piyush Deshwal',             rollNo:'26SBCETCS007'},
  stu_a2_30:{name:'Roshan Yadav (CS)',          rollNo:'26SBCETCS008'},
  stu_a2_31:{name:'Shivang Vyas',               rollNo:'26SBCETCS009'},
  stu_a2_32:{name:'Shubham Suthar',             rollNo:'26SBCETCS010'},
  stu_b1_01:{name:'Akash Babu',                 rollNo:'26SBCETAI001'},
  stu_b1_02:{name:'Aman Tiwari',                rollNo:'26SBCETAI002'},
  stu_b1_03:{name:'Ankit Kumawat',              rollNo:'26SBCETAI003'},
  stu_b1_04:{name:'Dheeraj Saini',              rollNo:'26SBCETAI004'},
  stu_b1_05:{name:'Divakar Nayak',              rollNo:'26SBCETAI005'},
  stu_b1_06:{name:'Garv Jangir',                rollNo:'26SBCETAI006'},
  stu_b1_07:{name:'Hemant',                     rollNo:'26SBCETAI007'},
  stu_b1_08:{name:'Himanshu Singh Khichee',     rollNo:'26SBCETAI008'},
  stu_b1_09:{name:'Jatin Prajapat',             rollNo:'26SBCETAI009'},
  stu_b1_10:{name:'Kapil Kumawat',              rollNo:'26SBCETAI010'},
  stu_b1_11:{name:'Keshav Sharma',              rollNo:'26SBCETAI011'},
  stu_b1_12:{name:'Kishori',                    rollNo:'26SBCETAI012'},
  stu_b1_13:{name:'Komal Kumawat',              rollNo:'26SBCETAI013'},
  stu_b1_14:{name:'Lokesh Kumawat',             rollNo:'26SBCETAI014'},
  stu_b1_15:{name:'Mayank',                     rollNo:'26SBCETAI015'},
  stu_b1_16:{name:'Meenakshi Sharma',           rollNo:'26SBCETAI016'},
  stu_b1_17:{name:'Mohit Jangid',               rollNo:'26SBCETAI017'},
  stu_b1_18:{name:'Neeraj Saini',               rollNo:'26SBCETAI018'},
  stu_b1_19:{name:'Nidhi Nathawat',             rollNo:'26SBCETAI019'},
  stu_b1_20:{name:'Nidhi Sharma',               rollNo:'26SBCETAI020'},
  stu_b1_21:{name:'Nishita Shekhawat',          rollNo:'26SBCETAI021'},
  stu_b1_22:{name:'Palakshi Kumawat',           rollNo:'26SBCETAI022'},
  stu_b1_23:{name:'Piyush Yadav',               rollNo:'26SBCETAI023'},
  stu_b1_24:{name:'Pooja Sharma',               rollNo:'26SBCETAI024'},
  stu_b1_25:{name:'Prashant Kumawat',           rollNo:'26SBCETAI025'},
  stu_b1_26:{name:'Praveen Kushawah',           rollNo:'26SBCETAI026'},
  stu_b1_27:{name:'Praveen Pareek',             rollNo:'26SBCETAI027'},
  stu_b1_28:{name:'Raj Kumar Jat',              rollNo:'26SBCETAI028'},
  stu_b1_29:{name:'Raj Saini',                  rollNo:'26SBCETAI029'},
  stu_b1_30:{name:'Riya Kanwar',                rollNo:'26SBCETAI030'},
  stu_b1_31:{name:'Rupendra Kumawat',           rollNo:'26SBCETAI031'},
  stu_b1_32:{name:'Sahil Bainsla',              rollNo:'26SBCETAI032'},
  stu_b1_33:{name:'Saina Choudhary',            rollNo:'26SBCETAI033'},
  stu_b1_34:{name:'Sana Bano',                  rollNo:'26SBCETAI034'},
  stu_b1_35:{name:'Sumit Sain',                 rollNo:'26SBCETAI035'},
  stu_b1_36:{name:'Tamanna Jangid',             rollNo:'26SBCETAI036'},
  stu_b2_01:{name:'Abhishek Pandey',            rollNo:'26SBCETDS001'},
  stu_b2_02:{name:'Akshara Agarwal',            rollNo:'26SBCETDS002'},
  stu_b2_03:{name:'Deepanshu Lekhraj',          rollNo:'26SBCETDS003'},
  stu_b2_04:{name:'Neeraj Jangid',              rollNo:'26SBCETDS004'},
  stu_b2_05:{name:'Shagun Prajapat',            rollNo:'26SBCETDS005'},
  stu_b2_06:{name:'Shivkaran',                  rollNo:'26SBCETDS006'},
  stu_b2_07:{name:'Yuvraj Singh',               rollNo:'26SBCETDS007'},
  stu_b2_08:{name:'Kumawat Rahul Mahaveerprasad',rollNo:'26SBCETME001'},
  stu_b2_09:{name:'Akshat Sain',                rollNo:'26SBCETME002'},
  stu_b2_10:{name:'Darshan Vishwakarma',        rollNo:'26SBCETME003'},
  stu_b2_11:{name:'Deepak Kumar',               rollNo:'26SBCETME004'},
  stu_b2_12:{name:'Pradhuman Shekhawat',        rollNo:'26SBCETME005'},
  stu_b2_13:{name:'Rohit (Mech)',               rollNo:'26SBCETME006'},
};

function makeRecs(
  sessionId: string,
  teacherId: string,
  subjectId: string,
  sectionId: string,
  datePrefix: string,
  presentStudents: string[],
  lateStudents: string[],
  idx: {n:number}
): AttendanceRecord[] {
  const recs: AttendanceRecord[] = [];
  for (const stuId of [...presentStudents, ...lateStudents]) {
    const meta = STU_META[stuId];
    if (!meta) continue;
    const mins = String(2 + (idx.n % 8)).padStart(2,'0');
    recs.push({
      id: `rec_${sessionId}_${stuId}`,
      sessionId, studentId: stuId,
      studentName: meta.name, rollNo: meta.rollNo,
      teacherId, subjectId, sectionId,
      status: lateStudents.includes(stuId) ? 'late' : 'present',
      markedAt: `${datePrefix}:${mins}Z`,
      verification: v(10 + (idx.n % 30), parseFloat((0.91 + (idx.n % 9) * 0.01).toFixed(2))),
    });
    idx.n++;
  }
  return recs;
}

function buildSection(
  sectionId: string,
  regular: string[],
  low: string[],
  sessions: { id: string; teacher: string; subject: string; date: string; late?: string[] }[],
  skipSet: Set<number>
): AttendanceRecord[] {
  const idx = { n: sectionId === 'sec_btech_1a' ? 1 : 5000 };
  const recs: AttendanceRecord[] = [];
  sessions.forEach((s, i) => {
    const attendees = skipSet.has(i) ? regular : [...regular, ...low];
    recs.push(...makeRecs(s.id, s.teacher, s.subject, sectionId, s.date, attendees, s.late ?? [], idx));
  });
  return recs;
}

const sessA = [
  {id:'sess_a_chem_w1', teacher:'tea_aastha',   subject:'sub_chem',  date:'2026-08-18T09:40'},
  {id:'sess_a_math_w1', teacher:'tea_ahkhan',   subject:'sub_math',  date:'2026-08-18T10:35', late:['stu_a1_07','stu_a1_11']},
  {id:'sess_a_pps_w1',  teacher:'tea_vikas',    subject:'sub_pps',   date:'2026-08-19T11:30'},
  {id:'sess_a_de_w1',   teacher:'tea_firoz',    subject:'sub_de',    date:'2026-08-19T09:42'},
  {id:'sess_a_cyber_w1',teacher:'tea_sikander', subject:'sub_cyber', date:'2026-08-20T11:30', late:['stu_a1_09']},
  {id:'sess_a_comm_w1', teacher:'tea_pankaj',   subject:'sub_comm',  date:'2026-08-21T13:50'},
  {id:'sess_a_chem_w2', teacher:'tea_aastha',   subject:'sub_chem',  date:'2026-08-25T09:40'},
  {id:'sess_a_math_w2', teacher:'tea_ahkhan',   subject:'sub_math',  date:'2026-08-25T10:35'},
  {id:'sess_a_pps_w2',  teacher:'tea_vikas',    subject:'sub_pps',   date:'2026-08-26T11:30', late:['stu_a2_02']},
  {id:'sess_a_de_w2',   teacher:'tea_firoz',    subject:'sub_de',    date:'2026-08-27T09:42'},
  {id:'sess_a_cyber_w2',teacher:'tea_sikander', subject:'sub_cyber', date:'2026-08-27T11:30'},
  {id:'sess_a_comm_w2', teacher:'tea_pankaj',   subject:'sub_comm',  date:'2026-08-28T13:50'},
  {id:'sess_a_chem_w3', teacher:'tea_aastha',   subject:'sub_chem',  date:'2026-09-01T09:40', late:['stu_a1_05','stu_a2_14']},
  {id:'sess_a_math_w3', teacher:'tea_ahkhan',   subject:'sub_math',  date:'2026-09-02T10:35'},
  {id:'sess_a_pps_w3',  teacher:'tea_vikas',    subject:'sub_pps',   date:'2026-09-03T11:30'},
  {id:'sess_a_de_w3',   teacher:'tea_firoz',    subject:'sub_de',    date:'2026-09-03T09:42'},
  {id:'sess_a_cyber_w3',teacher:'tea_sikander', subject:'sub_cyber', date:'2026-09-04T11:30'},
  {id:'sess_a_comm_w3', teacher:'tea_pankaj',   subject:'sub_comm',  date:'2026-09-04T13:50'},
  {id:'sess_a_chem_w4', teacher:'tea_aastha',   subject:'sub_chem',  date:'2026-09-08T09:40'},
  {id:'sess_a_math_w4', teacher:'tea_ahkhan',   subject:'sub_math',  date:'2026-09-09T10:35', late:['stu_a1_03','stu_a1_08']},
  {id:'sess_a_pps_w4',  teacher:'tea_vikas',    subject:'sub_pps',   date:'2026-09-10T11:30'},
  {id:'sess_a_de_w4',   teacher:'tea_firoz',    subject:'sub_de',    date:'2026-09-10T09:42'},
  {id:'sess_a_cyber_w4',teacher:'tea_sikander', subject:'sub_cyber', date:'2026-09-11T11:30'},
  {id:'sess_a_comm_w4', teacher:'tea_pankaj',   subject:'sub_comm',  date:'2026-09-11T13:50'},
  {id:'sess_a_chem_w5', teacher:'tea_aastha',   subject:'sub_chem',  date:'2026-09-15T09:40'},
  {id:'sess_a_math_w5', teacher:'tea_ahkhan',   subject:'sub_math',  date:'2026-09-16T10:35'},
  {id:'sess_a_pps_w5',  teacher:'tea_vikas',    subject:'sub_pps',   date:'2026-09-17T11:30', late:['stu_a1_06']},
  {id:'sess_a_de_w5',   teacher:'tea_firoz',    subject:'sub_de',    date:'2026-09-17T09:42'},
  {id:'sess_a_cyber_w5',teacher:'tea_sikander', subject:'sub_cyber', date:'2026-09-18T11:30', late:['stu_a1_01']},
  {id:'sess_a_comm_w5', teacher:'tea_pankaj',   subject:'sub_comm',  date:'2026-09-18T13:50'},
];

const sessB = [
  {id:'sess_b_chem_w1', teacher:'tea_aastha',   subject:'sub_chem',  date:'2026-08-18T10:35'},
  {id:'sess_b_math_w1', teacher:'tea_vishal',   subject:'sub_math',  date:'2026-08-18T12:25', late:['stu_b1_03']},
  {id:'sess_b_pps_w1',  teacher:'tea_vikas',    subject:'sub_pps',   date:'2026-08-20T11:30'},
  {id:'sess_b_de_w1',   teacher:'tea_happy',    subject:'sub_de',    date:'2026-08-20T09:40'},
  {id:'sess_b_cyber_w1',teacher:'tea_toofan',   subject:'sub_cyber', date:'2026-08-21T09:40'},
  {id:'sess_b_comm_w1', teacher:'tea_pankaj',   subject:'sub_comm',  date:'2026-08-21T13:50'},
  {id:'sess_b_chem_w2', teacher:'tea_aastha',   subject:'sub_chem',  date:'2026-08-25T10:35', late:['stu_b1_06']},
  {id:'sess_b_math_w2', teacher:'tea_vishal',   subject:'sub_math',  date:'2026-08-26T10:35'},
  {id:'sess_b_pps_w2',  teacher:'tea_vikas',    subject:'sub_pps',   date:'2026-08-27T11:30'},
  {id:'sess_b_de_w2',   teacher:'tea_happy',    subject:'sub_de',    date:'2026-08-27T09:40'},
  {id:'sess_b_cyber_w2',teacher:'tea_toofan',   subject:'sub_cyber', date:'2026-08-28T09:40'},
  {id:'sess_b_comm_w2', teacher:'tea_pankaj',   subject:'sub_comm',  date:'2026-08-28T13:50'},
  {id:'sess_b_chem_w3', teacher:'tea_aastha',   subject:'sub_chem',  date:'2026-09-01T10:35'},
  {id:'sess_b_math_w3', teacher:'tea_vishal',   subject:'sub_math',  date:'2026-09-02T10:35', late:['stu_b1_01']},
  {id:'sess_b_pps_w3',  teacher:'tea_vikas',    subject:'sub_pps',   date:'2026-09-03T11:30'},
  {id:'sess_b_de_w3',   teacher:'tea_happy',    subject:'sub_de',    date:'2026-09-04T09:40'},
  {id:'sess_b_cyber_w3',teacher:'tea_toofan',   subject:'sub_cyber', date:'2026-09-04T09:40'},
  {id:'sess_b_comm_w3', teacher:'tea_pankaj',   subject:'sub_comm',  date:'2026-09-05T13:50'},
  {id:'sess_b_chem_w4', teacher:'tea_aastha',   subject:'sub_chem',  date:'2026-09-08T10:35'},
  {id:'sess_b_math_w4', teacher:'tea_vishal',   subject:'sub_math',  date:'2026-09-09T10:35'},
  {id:'sess_b_pps_w4',  teacher:'tea_vikas',    subject:'sub_pps',   date:'2026-09-10T11:30', late:['stu_b1_04','stu_b1_09']},
  {id:'sess_b_de_w4',   teacher:'tea_happy',    subject:'sub_de',    date:'2026-09-11T09:40'},
  {id:'sess_b_cyber_w4',teacher:'tea_toofan',   subject:'sub_cyber', date:'2026-09-11T09:40'},
  {id:'sess_b_comm_w4', teacher:'tea_pankaj',   subject:'sub_comm',  date:'2026-09-11T13:50'},
  {id:'sess_b_chem_w5', teacher:'tea_aastha',   subject:'sub_chem',  date:'2026-09-15T10:35'},
  {id:'sess_b_math_w5', teacher:'tea_vishal',   subject:'sub_math',  date:'2026-09-16T10:35'},
  {id:'sess_b_pps_w5',  teacher:'tea_vikas',    subject:'sub_pps',   date:'2026-09-17T11:30'},
  {id:'sess_b_de_w5',   teacher:'tea_happy',    subject:'sub_de',    date:'2026-09-18T09:40', late:['stu_b1_02']},
  {id:'sess_b_cyber_w5',teacher:'tea_toofan',   subject:'sub_cyber', date:'2026-09-18T09:40'},
  {id:'sess_b_comm_w5', teacher:'tea_pankaj',   subject:'sub_comm',  date:'2026-09-19T13:50'},
];

export const INITIAL_SESSIONS: AttendanceSession[] = [
  ...sessA.map((s) => ({
    id: s.id,
    teacherId: s.teacher,
    subjectId: s.subject,
    sectionId: 'sec_btech_1a',
    timetableId: `tt_a_${s.id}`,
    classroomId: 'cr_sl1',
    academicSessionId: '2026-27',
    startedAt: `${s.date}:00Z`,
    expiresAt: `${s.date.replace(/:\d+$/, ':50')}:00Z`,
    status: 'closed' as const,
    currentQrToken: `EXP_${s.id}`,
    qrVersion: 10,
    lastQrRotatedAt: `${s.date}:00Z`,
    security: {
      dynamicQR: true,
      geofence: true,
      faceVerification: true,
      liveness: true,
    },
  })),
  ...sessB.map((s) => ({
    id: s.id,
    teacherId: s.teacher,
    subjectId: s.subject,
    sectionId: 'sec_btech_1b',
    timetableId: `tt_b_${s.id}`,
    classroomId: 'cr_sl4',
    academicSessionId: '2026-27',
    startedAt: `${s.date}:00Z`,
    expiresAt: `${s.date.replace(/:\d+$/, ':50')}:00Z`,
    status: 'closed' as const,
    currentQrToken: `EXP_${s.id}`,
    qrVersion: 10,
    lastQrRotatedAt: `${s.date}:00Z`,
    security: {
      dynamicQR: true,
      geofence: true,
      faceVerification: true,
      liveness: true,
    },
  })),
];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  ...buildSection('sec_btech_1a', SEC_A_REGULAR, SEC_A_LOW, sessA, new Set([0,1,3,5,7,9,11,13,15,17])),
  ...buildSection('sec_btech_1b', SEC_B_REGULAR, SEC_B_LOW, sessB, new Set()),
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_1', actorId: 'usr_admin', actorName: 'Dr. Surendra Singh', actorRole: 'admin',
    action: 'rule_change', targetId: 'settings', targetType: 'settings',
    oldValue: 'session: 2025-26', newValue: 'session: 2026-27 (w.e.f. 17/08/2026)',
    reason: 'Configured academic term for B.Tech I Semester (Sections A & B)',
    createdAt: '2026-08-17T09:00:00Z',
  },
  {
    id: 'audit_2', actorId: 'usr_admin', actorName: 'Dr. Surendra Singh', actorRole: 'admin',
    action: 'user_update', targetId: 'sec_btech_1a', targetType: 'user',
    oldValue: '', newValue: 'Section A — 65 students enrolled (A1: 33 CSE, A2: 22 CSE + 10 CS)',
    reason: 'New B.Tech 1st Year Section A created for AY 2026-27',
    createdAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 'audit_3', actorId: 'usr_admin', actorName: 'Dr. Surendra Singh', actorRole: 'admin',
    action: 'user_update', targetId: 'sec_btech_1b', targetType: 'user',
    oldValue: '', newValue: 'Section B — 49 students enrolled (B1: 36 AI, B2: 7 CSE-DS + 6 Mech)',
    reason: 'New B.Tech 1st Year Section B created for AY 2026-27',
    createdAt: '2026-08-15T10:05:00Z',
  },
  {
    id: 'audit_4', actorId: 'usr_tea_aastha', actorName: 'Dr. Aastha Pareek', actorRole: 'teacher',
    action: 'session_closed', targetId: 'sess_a_chem_w1', targetType: 'attendanceSession',
    oldValue: 'active', newValue: 'closed',
    reason: 'Engineering Chemistry – Week 1 attendance completed',
    createdAt: '2026-08-18T10:30:00Z',
  },
  {
    id: 'audit_5', actorId: 'usr_admin', actorName: 'Dr. Surendra Singh', actorRole: 'admin',
    action: 'rule_change', targetId: 'settings', targetType: 'settings',
    oldValue: 'radius: 100m', newValue: 'radius: 150m',
    reason: 'Campus GPS radius updated to include hostel-side extension',
    createdAt: '2026-08-20T09:00:00Z',
  },
];
