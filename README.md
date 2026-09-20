# 🎓 AttendIQ — Smart College Attendance System

<p align="center">
  <strong>A multi-tier digital attendance management platform for SBCET College</strong><br/>
  Built with React + TypeScript + Tailwind CSS + Vite
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel" />
</p>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Institutional Portal Access](#-institutional-portal-access)
- [Architecture](#-architecture)
- [Deployment](#-deployment)
- [Firebase Integration](#-firebase-integration)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 Multi-Layer Verification Pipeline
- **Dynamic QR Tokens** — Auto-rotating every 25 seconds, preventing screenshot sharing
- **Campus Geofencing** — Haversine distance calculation with configurable radius (50m-500m)
- **Face Verification & Liveness Detection** — Camera-based with interactive challenges (blink, smile, turn head)
- **Duplicate Lock** — Atomic composite key prevents double attendance submissions

### 👨🏫 Teacher Command Center
- Today's schedule auto-populated from timetable
- Live session screen with HD QR code, countdown ring, real-time check-in feed
- Attendance history with auditable corrections (mandatory justification)

### 👨🎓 Student Experience
- Overall attendance gauge with 75% threshold alerts
- Subject-wise breakdown with progress bars
- 4-step verification wizard: QR Scan → Geofence → Face/Liveness → Digital Receipt
- Branch, batch, and section-wise views

### 🛡️ Administrator Console
- Institutional KPI dashboard (students, faculty, classrooms, shortage warnings)
- Academic hierarchy management (departments, courses, semesters, sections)
- User directory with branch/batch filters and biometric status
- Timetable scheduler, geofence configuration, audit trail
- Multi-filter reports with one-click CSV export

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript 5.7 |
| **Styling** | Tailwind CSS 3.4 |
| **Build Tool** | Vite 6.1 |
| **Icons** | Lucide React |
| **QR Generation** | qrcode.js |
| **Animations** | canvas-confetti |
| **Backend (optional)** | Firebase Firestore + Auth |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
AttendIQ/
├── public/                    # Static assets
├── docs/                      # Documentation
│   └── full_spec.md           # Complete project specification
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ErrorBoundary.tsx   # Global error boundary
│   │   ├── Navbar.tsx          # Top navigation bar
│   │   └── Sidebar.tsx         # Side navigation panel
│   ├── context/               # React context providers
│   │   └── AuthContext.tsx     # Authentication state management
│   ├── db/                    # Data layer
│   │   ├── initialData.ts      # Seed data (114 students, SBCET college)
│   │   └── store.ts            # LocalStorage-based data store
│   ├── firebase/              # Firebase configuration
│   │   └── config.ts           # Firebase app initialization
│   ├── pages/                 # Page components (route-based)
│   │   ├── admin/              # Admin panel pages
│   │   │   ├── AdminAcademics.tsx
│   │   │   ├── AdminAudit.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminGeofence.tsx
│   │   │   ├── AdminReports.tsx
│   │   │   ├── AdminTimetable.tsx
│   │   │   └── AdminUsers.tsx
│   │   ├── auth/               # Authentication pages
│   │   │   └── LoginPage.tsx
│   │   ├── student/            # Student portal pages
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── StudentHistory.tsx
│   │   │   ├── StudentScanWizard.tsx
│   │   │   └── StudentTimetable.tsx
│   │   └── teacher/            # Teacher portal pages
│   │       ├── TeacherDashboard.tsx
│   │       ├── TeacherHistory.tsx
│   │       └── TeacherLiveSession.tsx
│   ├── services/              # Business logic services
│   │   ├── exportService.ts    # CSV report export
│   │   ├── faceService.ts      # Face detection & liveness
│   │   ├── geofenceService.ts  # Campus geofencing
│   │   └── qrService.ts        # Dynamic QR token generation
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts            # All interfaces & types
│   ├── utils/                 # Utility functions
│   │   ├── crypto.ts           # Token encryption utilities
│   │   └── haversine.ts        # Haversine distance formula
│   ├── App.tsx                # Root application component
│   ├── index.css              # Global styles
│   └── main.tsx               # Application entry point
├── .gitignore
├── firebase.json              # Firebase hosting config
├── firestore.rules            # Firestore security rules
├── index.html                 # HTML entry point
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json                # Vercel deployment config
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/Saksham-Dev-001/AttendIQ-Smart-College-Attendance-System.git
cd AttendIQ-Smart-College-Attendance-System

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 Institutional Portal Access

| Portal | Identifier / Username | Password | User Details & Branch |
|--------|----------------------|----------|-----------------------|
| **👨‍🎓 Student (Section A)** | `26SBCETCSE001` | `student123` | Aayush Sharma (B.Tech I Sem • CSE, Batch A1) |
| **👨‍🎓 Student (Section B)** | `26SBCETAI001` | `student123` | Akash Babu (B.Tech I Sem • AI, Batch B1) |
| **👨‍🏫 Faculty (Chemistry)** | `EMP-T201` or `aastha@sbcet.ac.in` | `teacher123` | Dr. Aastha Pareek (Faculty of Chemistry) |
| **👨‍🏫 Faculty (Mathematics)** | `EMP-T202` or `ahkhan@sbcet.ac.in` | `teacher123` | Dr. A. H. Khan (Faculty of Mathematics) |
| **🛡️ Administrator** | `admin@sbcet.ac.in` | `admin123` | Dr. Surendra Singh (Principal & Registrar) |

> ℹ️ *All 114 enrolled students and 11 department faculty members can authenticate directly using their official Roll Number or Employee ID.*

---

## 🏗️ Architecture

### Attendance Verification Flow
```
Teacher starts session → Dynamic QR generated (25s rotation)
        ↓
Student scans QR → Token validated
        ↓
Geofence check → Must be within campus radius (Haversine formula)
        ↓
Face verification + Liveness detection → Interactive challenge
        ↓
Attendance recorded → Immutable audit log created
```

### Data Store
- **Default**: LocalStorage-based store with automatic version migration (`2026_sbcet_v4_production`)
- **Production**: Firebase Firestore with role-based security rules

### Pre-loaded Institutional Data
- **114 Real Students** enrolled across Section A (CSE, CS) and Section B (AI, CSE-DS, Mech)
- **11 Faculty Members** from First Year Engineering & Applied Sciences
- **Full Timetable** for B.Tech 1st Year, 1st Semester (SL1, SL-4, Labs)

---

## ☁️ Deployment

### Vercel (Recommended)

The project includes a `vercel.json` configuration file. Simply:
1. Connect your GitHub repo to Vercel
2. Vercel auto-detects Vite and deploys

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

---

## 🔥 Firebase Integration

To connect to live Firebase:

1. Set `USE_FIREBASE_CLOUD = true` in `src/firebase/config.ts`
2. Add your Firebase Web App credentials
3. Deploy Firestore security rules: `firebase deploy --only firestore:rules`

The included `firestore.rules` enforce:
- Role-based read/write permissions
- Composite key uniqueness for attendance
- Immutable audit log entries

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is developed for educational purposes at **SBCET College**.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Saksham-Dev-001">Saksham Dev</a>
</p>