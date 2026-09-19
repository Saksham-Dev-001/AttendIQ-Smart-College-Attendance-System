# Smart College Attendance System — Complete Project Specification

## 1. Project Overview

**Project Name:** Smart College Attendance System  
**Project Type:** College/University attendance management platform  
**Primary Goal:** Reduce the time teachers spend taking attendance while improving attendance integrity through authenticated student accounts, dynamic QR sessions, geofence verification, face verification, liveness detection, timestamps, and audit logs.

### Core Attendance Flow

Teacher starts a class attendance session → system generates a short-lived dynamic QR → student logs in and scans QR → system validates the active session → location/geofence is checked → face verification and liveness are performed → attendance is recorded → teacher sees the live count.

### Primary Users

1. **Admin**
2. **Teacher**
3. **Student**

---

# 2. Product Goals

- Make attendance fast for teachers.
- Allow students to mark their own attendance.
- Prevent attendance through shared/static QR screenshots.
- Reduce proxy attendance.
- Provide subject-wise and overall attendance analytics.
- Automate class/subject selection through timetable data.
- Maintain a reliable correction and audit history.
- Make the system mobile-first and easy to use.
- Keep biometric and location data collection minimized and controlled.

---

# 3. Recommended Technology Stack

## Frontend

- HTML5
- CSS3
- JavaScript
- Responsive/mobile-first UI

Optional future migration:
- React or Next.js

## Backend / Cloud

- Firebase Authentication
- Cloud Firestore
- Firebase Cloud Functions
- Firebase Hosting or Netlify

## Attendance Components

- Dynamic QR generation
- QR scanning
- Geofence/location verification
- Face verification
- Liveness detection
- Server-generated timestamps
- Audit logging

## Reports

- CSV/Excel export
- PDF report generation can be added later

---

# 4. User Roles & Permissions

## 4.1 Admin

Admin has full system management access.

### Admin capabilities

- Login
- Dashboard
- Add/edit/remove students
- Add/edit/remove teachers
- Manage departments
- Manage courses
- Manage semesters/years
- Manage sections
- Manage subjects
- Assign teachers to subjects
- Assign subjects to sections
- Manage classrooms
- Manage timetable
- Configure attendance rules
- Configure geofence
- Configure verification requirements
- View all attendance
- View attendance analytics
- Export reports
- Review attendance corrections
- View audit logs
- Manage student face-profile status
- Disable/enable accounts
- Configure academic session

Admin must NOT be able to silently modify historical attendance without creating an audit record.

---

# 4.2 Teacher

### Teacher capabilities

- Login
- View profile
- View assigned subjects
- View today's timetable
- Start attendance
- Generate dynamic QR
- View live attendance count
- See students who have successfully checked in
- Close attendance
- View attendance history for assigned subjects
- View subject attendance statistics
- Request/perform authorized corrections
- View reports for assigned classes

### Teacher restrictions

- Cannot access another teacher's classes unless explicitly authorized.
- Cannot change system-wide settings.
- Cannot modify student accounts.
- Cannot delete attendance history.
- Attendance changes must be auditable.

---

# 4.3 Student

### Student capabilities

- Login
- View profile
- View timetable
- Scan attendance QR
- Perform location verification
- Perform face verification
- Perform liveness verification
- Mark attendance
- View attendance history
- View subject-wise attendance
- View overall attendance
- View monthly calendar
- See low-attendance warnings
- View attendance status for each subject

### Student restrictions

- Cannot mark attendance without an active session.
- Cannot mark attendance twice for the same session.
- Cannot access another student's attendance.
- Cannot change attendance records.
- Cannot manually select a different student identity.

---

# 5. College Data Hierarchy

Recommended structure:

College
→ Department
→ Course
→ Academic Year / Semester
→ Section
→ Students

Example:

Computer Science Department
→ BCA
→ Semester 3
→ Section A
→ Students

---

# 6. Core Entities

The application should contain:

- Users
- Students
- Teachers
- Departments
- Courses
- Academic Sessions
- Semesters
- Sections
- Subjects
- Classrooms
- Timetables
- Attendance Sessions
- Attendance Records
- Face Profiles
- Audit Logs
- Notifications
- System Settings

---

# 7. Firestore Database Structure

Recommended top-level collections:

```text
users/
students/
teachers/
departments/
courses/
academicSessions/
semesters/
sections/
subjects/
classrooms/
timetables/
attendanceSessions/
attendanceRecords/
faceProfiles/
auditLogs/
notifications/
settings/
```

---

# 8. Users Collection

```text
users/{userId}

{
  name: "Student Name",
  email: "student@example.com",
  role: "student",
  phone: "",
  photoURL: "",
  status: "active",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

Possible roles:

```text
admin
teacher
student
```

---

# 9. Students Collection

```text
students/{studentId}

{
  userId: "firebaseAuthUid",
  name: "Student Name",
  rollNo: "BCA2026001",
  enrollmentNo: "ENR001",
  departmentId: "cs",
  courseId: "bca",
  semesterId: "sem3",
  sectionId: "bca3a",
  academicSessionId: "2026-27",
  status: "active",
  faceProfileStatus: "verified",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

---

# 10. Teachers Collection

```text
teachers/{teacherId}

{
  userId: "firebaseAuthUid",
  employeeId: "T001",
  name: "Teacher Name",
  departmentId: "cs",
  status: "active",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

---

# 11. Subjects Collection

```text
subjects/{subjectId}

{
  name: "Data Structures",
  code: "CS201",
  departmentId: "cs",
  courseId: "bca",
  semesterId: "sem3",
  status: "active"
}
```

---

# 12. Teacher-Subject Assignment

Teacher assignment can be stored in a dedicated collection or embedded through assignment documents.

Recommended:

```text
subjectAssignments/{assignmentId}

{
  subjectId: "dsa",
  teacherId: "teacher001",
  sectionId: "bca3a",
  academicSessionId: "2026-27",
  status: "active"
}
```

This allows multiple teachers/sections to use the same subject where necessary.

---

# 13. Timetable

```text
timetables/{timetableId}

{
  dayOfWeek: 1,
  startTime: "10:00",
  endTime: "11:00",
  subjectId: "dsa",
  teacherId: "teacher001",
  sectionId: "bca3a",
  classroomId: "room204",
  academicSessionId: "2026-27",
  status: "active"
}
```

The teacher dashboard should use this data to show today's classes automatically.

---

# 14. Classroom

```text
classrooms/{classroomId}

{
  name: "Room 204",
  building: "Main Block",
  latitude: 0,
  longitude: 0,
  status: "active"
}
```

Coordinates should be configured by the college administrator rather than hard-coded.

---

# 15. Attendance Session

A teacher creates an attendance session for a specific scheduled class.

```text
attendanceSessions/{sessionId}

{
  teacherId: "teacher001",
  subjectId: "dsa",
  sectionId: "bca3a",
  timetableId: "tt001",
  classroomId: "room204",
  startedAt: serverTimestamp(),
  expiresAt: serverTimestamp(),
  status: "active",

  qrVersion: 1,

  security: {
    dynamicQR: true,
    geofence: true,
    faceVerification: true,
    liveness: true
  }
}
```

Do not trust a QR token supplied by the client as proof of attendance. The backend must validate the active session and token.

---

# 16. Dynamic QR Design

The QR should represent a short-lived attendance session/token.

Requirements:

- Token must expire.
- Token must be unpredictable.
- Token must be validated server-side.
- A screenshot of an expired QR must fail.
- Student must be authenticated.
- Student can submit only once per session.
- Teacher can close the session immediately.

Suggested session duration:

**5–10 minutes**, configurable by admin.

QR refresh interval can be approximately:

**20–30 seconds**, configurable if needed.

The exact values should be tested with the college workflow.

---

# 17. Student Attendance Record

```text
attendanceRecords/{recordId}

{
  sessionId: "session123",
  studentId: "student001",
  teacherId: "teacher001",
  subjectId: "dsa",
  sectionId: "bca3a",

  status: "present",

  markedAt: serverTimestamp(),

  verification: {
    qr: "passed",
    geofence: "passed",
    face: "passed",
    liveness: "passed"
  }
}
```

Possible attendance statuses:

```text
present
absent
late
excused
```

Attendance should normally be generated from session participation, not from a student-controlled status field.

---

# 18. Attendance Flow

## Teacher Side

1. Login.
2. Open dashboard.
3. System displays today's timetable.
4. Teacher selects/opens a scheduled class.
5. Presses **Start Attendance**.
6. Backend creates attendance session.
7. Dynamic QR is displayed.
8. Live count updates as students check in.
9. Teacher sees verified students.
10. Teacher closes the session.
11. Session becomes closed.
12. Final attendance becomes available in reports.

## Student Side

1. Login.
2. Open **Mark Attendance**.
3. Scan teacher's QR.
4. System validates session.
5. System checks that the student's account belongs to the target section.
6. Location permission is requested when required.
7. Geofence verification is performed.
8. Face verification starts.
9. Liveness check runs.
10. Backend validates all required conditions.
11. Attendance is created.
12. Student sees confirmation.

---

# 19. Geofence

Geofence is an additional verification layer.

Admin configures:

```text
College/Campus Name
Latitude
Longitude
Radius
```

Example concept:

```text
College Campus
Radius: 150 metres
```

Do not hard-code a real college location into the application.

## Geofence rules

- Check location only during an attendance attempt.
- Do not continuously track students.
- Consider device-reported accuracy.
- Reject clearly unreliable readings.
- Use a reasonable campus radius.
- Keep location retention minimal.
- Make the policy visible to students.
- Provide a controlled fallback for legitimate location failures.

GPS is not perfectly reliable indoors, so geofence should not be treated as absolute proof of classroom presence.

---

# 20. Face Verification

Face verification should confirm that the authenticated student is the person attempting attendance.

Recommended flow:

```text
Authenticated Student
        ↓
Camera Permission
        ↓
Face Detection
        ↓
Face Verification
        ↓
Liveness
        ↓
Backend Result
```

The system should preferably use a reputable face verification/liveness service rather than implementing production biometric matching from scratch.

## Biometric privacy principles

- Obtain appropriate consent.
- Explain why face verification is required.
- Collect only necessary data.
- Protect biometric templates.
- Restrict access.
- Avoid storing raw attendance selfies unless there is a documented need.
- Define retention/deletion rules.
- Provide an appropriate non-biometric/manual verification path where required by institutional policy or applicable law.

---

# 21. Liveness Detection

Liveness helps distinguish a live person from a photograph/video.

Possible flow:

```text
Face Detected
↓
Look at Camera
↓
Random Liveness Challenge
↓
Blink / Turn Head / Follow Prompt
↓
Liveness Passed
```

The exact challenge should be generated by the verification provider rather than trusting a client-side boolean.

---

# 22. Security Model

Never rely only on frontend JavaScript.

Important security rules:

- Firebase Authentication required.
- Role-based Firestore access.
- Students can read only their permitted data.
- Teachers can access only assigned subjects/classes.
- Admin has management permissions.
- Attendance creation should be validated server-side.
- Session expiration should be validated server-side.
- Server timestamps should be used.
- QR tokens must not be trusted directly from the browser.
- Duplicate attendance must be prevented.
- Historical records should not be freely editable.
- Sensitive verification results should have restricted access.
- Every administrative attendance correction should generate an audit event.

---

# 23. Firestore Security Concept

The exact production rules should be written after the schema is finalized.

Conceptually:

```text
Student:
  read own profile
  read own attendance
  create attendance only through validated server workflow

Teacher:
  read assigned classes
  create attendance sessions for assigned classes
  read attendance for assigned classes

Admin:
  manage configuration and users
  read all authorized attendance
  approve corrections

Nobody:
  can arbitrarily change historical attendance from the client
```

For sensitive operations, prefer Cloud Functions/server-side validation.

---

# 24. Attendance Duplicate Prevention

A student must not be able to create two records for the same session.

Recommended logical uniqueness:

```text
sessionId + studentId
```

Possible document ID:

```text
{sessionId}_{studentId}
```

The backend should also enforce this rule.

---

# 25. Late Attendance

Admin should configure the policy.

Example:

```text
Session Duration: 10 minutes
Late After: 5 minutes
```

Possible logic:

```text
0–5 minutes → Present
5–10 minutes → Late
After session closes → Not allowed
```

Do not hard-code these values.

---

# 26. Attendance Correction

A correction must never silently overwrite history.

Example:

```text
Student: Rahul
Subject: Data Structures
Date: 18 Sept 2026

Original: Absent
Requested: Present

Reason:
Face verification failed even though student was present.

Status:
Pending Approval
```

After approval:

```text
Audit Log

Actor: Teacher/Admin
Action: Attendance Correction
Old: Absent
New: Present
Reason: ...
Timestamp: ...
```

---

# 27. Audit Logs

```text
auditLogs/{logId}

{
  actorId: "admin001",
  action: "attendance_correction",
  targetId: "attendanceRecord123",
  oldValue: "absent",
  newValue: "present",
  reason: "Approved correction",
  createdAt: serverTimestamp()
}
```

Log important actions such as:

- User creation
- User disable/enable
- Subject assignment
- Timetable changes
- Attendance session creation
- Attendance correction
- Configuration changes
- Face-profile verification/reset

---

# 28. Admin Dashboard

## Overview

Cards:

```text
Total Students
Total Teachers
Total Subjects
Today's Classes
Today's Attendance
Low Attendance Students
```

## Quick Actions

```text
Add Student
Add Teacher
Create Subject
Create Timetable
View Attendance
Generate Report
```

## Management Pages

```text
/admin/dashboard
/admin/students
/admin/teachers
/admin/departments
/admin/courses
/admin/sections
/admin/subjects
/admin/classrooms
/admin/timetable
/admin/attendance
/admin/reports
/admin/settings
/admin/audit-logs
```

---

# 29. Teacher Dashboard

Pages:

```text
/teacher/dashboard
/teacher/classes
/teacher/attendance
/teacher/history
/teacher/reports
/teacher/profile
```

Main dashboard:

```text
Today's Classes

Data Structures
BCA 2A
10:00 AM
Room 204

[ START ATTENDANCE ]
```

During attendance:

```text
Data Structures
BCA 2A

Dynamic QR

Present: 34 / 42

[ CLOSE ATTENDANCE ]
```

---

# 30. Student Dashboard

Pages:

```text
/student/dashboard
/student/scan
/student/attendance
/student/timetable
/student/profile
```

Dashboard:

```text
Overall Attendance
87.4%

Data Structures       92%
Operating Systems     84%
DBMS                   79%
Computer Networks     91%
```

---

# 31. Student Attendance Screen

```text
Mark Attendance

[ SCAN QR ]

After scanning:

Session Found
Subject: Data Structures
Class: BCA 2A
Teacher: Teacher A

Location
✓ Inside attendance zone

Face
✓ Identity verified

Liveness
✓ Verified

Final:
✅ Attendance Marked
```

---

# 32. Reports

Admin and authorized teachers can access reports.

## Student-wise

```text
Student
Roll Number
Subject
Classes Held
Present
Absent
Late
Percentage
```

## Subject-wise

```text
Subject
Section
Classes Held
Average Attendance
Low Attendance Count
```

## Date-wise

```text
Date
Subject
Teacher
Section
Present
Absent
Late
```

## Export

Support:

- CSV
- Excel
- PDF later

---

# 33. Attendance Calculation

Basic percentage:

```text
Attendance % =
Present Classes / Total Applicable Classes × 100
```

Example:

```text
36 / 40 × 100 = 90%
```

If the institution has special rules for late/medical/excused attendance, those rules should be configurable and explicitly documented.

---

# 34. Low Attendance Alerts

Admin configures threshold.

Example:

```text
Required Attendance: 75%
Warning Threshold: 75%
```

If a student falls below threshold:

```text
⚠ Low Attendance

Your DBMS attendance is 68%.

Required: 75%
```

Notification delivery can later support:

- In-app notifications
- Email
- College-approved messaging integration

---

# 35. UI/UX Requirements

## General

- Mobile-first
- Responsive
- Clean academic design
- Fast loading
- Accessible controls
- Large touch targets
- Clear success/error states
- Minimal teacher clicks

## Teacher priority

Teacher should be able to start attendance in a few taps.

## Student priority

Student should be able to complete attendance quickly.

## Admin priority

Admin should have clear navigation and powerful filtering.

---

# 36. Suggested Navigation

## Admin

```text
Dashboard
Students
Teachers
Departments
Courses
Sections
Subjects
Classrooms
Timetable
Attendance
Reports
Notifications
Settings
Audit Logs
Logout
```

## Teacher

```text
Dashboard
Today's Classes
Attendance
History
Reports
Profile
Logout
```

## Student

```text
Dashboard
Mark Attendance
My Attendance
Timetable
Profile
Logout
```

---

# 37. Notifications

Potential notifications:

### Student

- Attendance marked successfully.
- Attendance failed.
- Low attendance warning.
- Timetable change.

### Teacher

- Attendance session completed.
- Low attendance summary.
- Timetable change.

### Admin

- Correction request.
- Verification issue.
- System/configuration alert.

---

# 38. Error Handling

Examples:

```text
QR expired
→ "This attendance session has expired."

Wrong class
→ "You are not enrolled in this class."

Outside geofence
→ "You are outside the permitted attendance zone."

Location unavailable
→ "We couldn't verify your location. Please try again."

Face not detected
→ "Position your face inside the frame."

Face mismatch
→ "Identity verification failed."

Liveness failed
→ "Please retry the live verification."

Already marked
→ "Attendance has already been recorded."

Session closed
→ "This attendance session is closed."
```

Never expose internal Firebase errors or sensitive verification details to students.

---

# 39. Important Abuse Cases to Test

The system should explicitly test:

1. Student shares QR screenshot.
2. Student uses expired QR.
3. Student tries another student's account.
4. Student tries to mark attendance twice.
5. Student is outside geofence.
6. Student spoofs/blocks location where technically detectable.
7. Student shows a photo to face verification.
8. Student shows a video to the camera.
9. Student's face does not match.
10. Student loses internet during verification.
11. Teacher closes session while students are scanning.
12. Two devices use the same account.
13. Student changes device time.
14. Client modifies attendance request.
15. Unauthorized user tries Firestore writes.
16. Teacher tries to access another section.
17. Admin correction is made without a reason.
18. Duplicate attendance records are attempted.

---

# 40. Offline/Network Considerations

Attendance is a security-sensitive transaction.

If internet connectivity is unavailable, do not silently mark attendance as successful.

Possible behavior:

```text
Internet unavailable

⚠ Attendance could not be verified.

Please reconnect and try again.
```

A controlled offline mode can be designed later if the college requires it, but it needs careful anti-fraud handling.

---

# 41. Recommended Project Folder Structure

```text
smart-attendance/
│
├── index.html
├── login.html
│
├── admin/
│   ├── dashboard.html
│   ├── students.html
│   ├── teachers.html
│   ├── departments.html
│   ├── courses.html
│   ├── sections.html
│   ├── subjects.html
│   ├── classrooms.html
│   ├── timetable.html
│   ├── attendance.html
│   ├── reports.html
│   ├── settings.html
│   └── audit-logs.html
│
├── teacher/
│   ├── dashboard.html
│   ├── attendance.html
│   ├── history.html
│   ├── reports.html
│   └── profile.html
│
├── student/
│   ├── dashboard.html
│   ├── scan.html
│   ├── attendance.html
│   ├── timetable.html
│   └── profile.html
│
├── css/
│   ├── global.css
│   ├── auth.css
│   ├── admin.css
│   ├── teacher.css
│   └── student.css
│
├── js/
│   ├── firebase.js
│   ├── auth.js
│   ├── guards.js
│   ├── admin.js
│   ├── teacher.js
│   ├── student.js
│   ├── attendance.js
│   ├── qr.js
│   ├── geofence.js
│   ├── face.js
│   └── reports.js
│
├── functions/
│   └── Firebase Cloud Functions
│
├── firestore.rules
├── firestore.indexes.json
└── README.md
```

---

# 42. Development Phases

## Phase 1 — Foundation

- Firebase project
- Authentication
- User roles
- Firestore schema
- Security rules
- Base UI

## Phase 2 — Admin

- Student management
- Teacher management
- Subjects
- Sections
- Classrooms
- Timetable

## Phase 3 — Teacher

- Today's classes
- Start session
- Dynamic QR
- Live attendance
- Close session

## Phase 4 — Student

- Student dashboard
- QR scanner
- Attendance confirmation
- Attendance history

## Phase 5 — Geofence

- Campus configuration
- Location permission
- Distance calculation
- Accuracy checks
- Failure/fallback flow

## Phase 6 — Face & Liveness

- Face enrollment workflow
- Verification provider integration
- Liveness
- Verification result handling
- Secure biometric-data lifecycle

## Phase 7 — Analytics

- Subject-wise attendance
- Student-wise reports
- Monthly reports
- Low attendance
- Export

## Phase 8 — Security Testing

- Firestore rules
- Authorization tests
- QR replay tests
- Duplicate tests
- Session expiry tests
- Verification abuse tests

## Phase 9 — Deployment

- Production Firebase project
- Environment configuration
- Domain
- HTTPS
- Monitoring
- Backup/recovery procedures

---

# 43. MVP vs Advanced Features

## MVP

Build these first:

- Login
- Admin
- Teacher
- Student
- Subjects
- Sections
- Timetable
- Dynamic QR
- Attendance records
- Attendance history
- Basic reports

## Advanced

Add after MVP:

- Geofence
- Face verification
- Liveness
- Low attendance alerts
- Advanced analytics
- Excel/PDF export
- Correction workflow
- Audit logs
- Notifications
- Multi-department support
- Multiple campuses

This staged approach reduces development risk.

---

# 44. Recommended Attendance Security

Final recommended model:

```text
                 ATTENDANCE REQUEST
                         │
                         ▼
                 Firebase Login
                         │
                         ▼
                 Active QR Session?
                         │
                         ▼
                Correct Class/Section?
                         │
                         ▼
                    Geofence
                         │
                         ▼
                 Face Verification
                         │
                         ▼
                  Liveness Check
                         │
                         ▼
                  Duplicate Check
                         │
                         ▼
              Server Timestamp
                         │
                         ▼
              Create Attendance
                         │
                         ▼
                       ✅
```

Each layer should be independently validated.

---

# 45. Privacy & Governance Requirements

Because the system may process face/biometric and location information, production deployment should include:

- Clear privacy notice.
- Appropriate consent/legal basis as required.
- Purpose limitation.
- Data minimization.
- Secure storage.
- Encryption in transit and at rest through supported platform controls.
- Role-based access.
- Defined retention period.
- Deletion/revocation process.
- Incident response process.
- Institutional approval.
- Appropriate alternative/manual verification process.

The exact legal requirements should be reviewed with the college/institution before collecting biometric data.

---

# 46. Production Rules

Never put secrets in frontend code.

Never trust:

```text
studentId
teacherId
role
attendance status
verification result
timestamp
```

when they are supplied by an untrusted client.

Sensitive values should be validated server-side.

---

# 47. Performance Goals

Target:

- Fast dashboard loading.
- Minimal Firestore reads.
- Real-time attendance count.
- Pagination for large student lists.
- Indexed queries.
- Avoid unnecessary location polling.
- Avoid continuously running camera/face processing.
- Lazy-load heavy features.

---

# 48. Future Features

Potential future additions:

- Parent/guardian portal
- HOD dashboard
- Department-level analytics
- Multiple campuses
- Substitute teacher support
- Exam attendance
- QR attendance history
- Attendance shortage prediction
- Automated attendance certificates
- College ERP integration
- API for external college systems
- PWA/mobile app
- Android app
- Email/SMS notifications

---

# 49. Final Product Vision

The final system should feel like:

**For Teacher**

> Open dashboard → Tap today's class → Display QR → Watch live count → Close session.

**For Student**

> Scan QR → Verify location → Verify face/liveness → Attendance confirmed.

**For Admin**

> Configure college once → Manage users/timetable → Monitor attendance → Generate reports → Audit corrections.

The system should make attendance a **fast, secure, auditable workflow** rather than a daily manual roll-call process.

---

# 50. Immediate Build Checklist

Before production coding:

- [ ] Confirm college hierarchy
- [ ] Confirm Admin/Teacher/Student permissions
- [ ] Confirm attendance duration
- [ ] Confirm late-attendance policy
- [ ] Confirm minimum attendance requirement
- [ ] Decide campus geofence radius
- [ ] Decide whether geofence is mandatory
- [ ] Select face/liveness provider
- [ ] Define biometric retention policy
- [ ] Create Firebase project
- [ ] Create Firestore schema
- [ ] Write security rules
- [ ] Build authentication
- [ ] Build Admin panel
- [ ] Build Teacher panel
- [ ] Build Student panel
- [ ] Implement timetable
- [ ] Implement dynamic QR
- [ ] Implement attendance records
- [ ] Implement geofence
- [ ] Implement face/liveness
- [ ] Implement reports
- [ ] Implement audit logs
- [ ] Perform security testing
- [ ] Deploy production

---

# 51. Project Development Principle

Build the system in this order:

**Architecture → Database → Authentication → Roles → Admin → Timetable → Teacher Attendance → Student QR → Attendance Records → Geofence → Face/Liveness → Reports → Security Testing → Deployment**

Do not build face recognition first. The attendance/session architecture and authorization model should be correct before biometric verification is integrated.
