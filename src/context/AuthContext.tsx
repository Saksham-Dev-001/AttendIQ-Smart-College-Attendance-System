import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, StudentProfile, TeacherProfile } from '../types';
import { db } from '../db/store';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  studentProfile: StudentProfile | null;
  teacherProfile: TeacherProfile | null;
  loginWithCredentials: (idOrEmail: string, password: string, role: UserRole) => Promise<{ success: boolean; message: string }>;
  switchDemoRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('attendiq_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);

  // Sync profile when currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setStudentProfile(null);
      setTeacherProfile(null);
      return;
    }

    // Guard against stale user cached from previous data version
    const validUser = db.getUsers().find(
      (u) => u.id === currentUser.id || u.email.toLowerCase() === currentUser.email.toLowerCase()
    );

    if (!validUser) {
      setCurrentUser(null);
      localStorage.removeItem('attendiq_auth_user');
      setStudentProfile(null);
      setTeacherProfile(null);
      return;
    }

    if (validUser.role === 'student') {
      const sp = db.getStudents().find((s) => s.userId === validUser.id || s.email === validUser.email);
      setStudentProfile(sp || null);
      setTeacherProfile(null);
    } else if (validUser.role === 'teacher') {
      const tp = db.getTeachers().find((t) => t.userId === validUser.id || t.email === validUser.email);
      setTeacherProfile(tp || null);
      setStudentProfile(null);
    } else {
      setStudentProfile(null);
      setTeacherProfile(null);
    }
  }, [currentUser]);

  const loginWithCredentials = async (
    idOrEmail: string,
    pass: string,
    role: UserRole
  ): Promise<{ success: boolean; message: string }> => {
    const cleanInput = idOrEmail.trim().toLowerCase();

    // Check Users collection
    const users = db.getUsers();
    let matchedUser: User | undefined;

    if (role === 'student') {
      const student = db.getStudents().find(
        (s) =>
          s.rollNo.toLowerCase() === cleanInput ||
          s.enrollmentNo.toLowerCase() === cleanInput ||
          s.email.toLowerCase() === cleanInput
      );
      if (student) {
        matchedUser = users.find((u) => u.id === student.userId || u.email.toLowerCase() === student.email.toLowerCase());
      }
    } else if (role === 'teacher') {
      const teacher = db.getTeachers().find(
        (t) =>
          t.employeeId.toLowerCase() === cleanInput ||
          t.email.toLowerCase() === cleanInput
      );
      if (teacher) {
        matchedUser = users.find((u) => u.id === teacher.userId || u.email.toLowerCase() === teacher.email.toLowerCase());
      }
    } else if (role === 'admin') {
      matchedUser = users.find(
        (u) =>
          u.role === 'admin' &&
          (u.email.toLowerCase() === cleanInput || cleanInput.includes('admin'))
      );
    }

    if (!matchedUser) {
      // Fallback check by email or direct ID match
      matchedUser = users.find(
        (u) => u.role === role && (u.email.toLowerCase() === cleanInput || u.id.toLowerCase() === cleanInput)
      );
    }

    if (!matchedUser) {
      return { success: false, message: `No active ${role} account found matching "${idOrEmail}".` };
    }

    // Passwords check (default demo passes or any valid standard test string)
    if (pass.length < 3) {
      return { success: false, message: 'Password must be at least 3 characters.' };
    }

    setCurrentUser(matchedUser);
    localStorage.setItem('attendiq_auth_user', JSON.stringify(matchedUser));
    return { success: true, message: `Welcome back, ${matchedUser.name}!` };
  };

  const switchDemoRole = (role: UserRole) => {
    const users = db.getUsers();
    const user = users.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('attendiq_auth_user', JSON.stringify(user));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setStudentProfile(null);
    setTeacherProfile(null);
    localStorage.removeItem('attendiq_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || null,
        studentProfile,
        teacherProfile,
        loginWithCredentials,
        switchDemoRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

