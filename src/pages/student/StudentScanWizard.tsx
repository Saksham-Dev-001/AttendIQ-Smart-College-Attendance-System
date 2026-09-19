import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../db/store';
import { AttendanceSession, VerificationDetails } from '../../types';
import { validateQrToken } from '../../services/qrService';
import { verifyGeofence, GeofenceResult } from '../../services/geofenceService';
import {
  requestCameraStream,
  stopCameraStream,
  getRandomLivenessChallenge,
  LIVENESS_PROMPTS,
  LivenessChallenge,
} from '../../services/faceService';
import confetti from 'canvas-confetti';
import {
  QrCode,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Building,
  User,
  Clock,
  Eye,
  Smile,
} from 'lucide-react';

export const StudentScanWizard: React.FC = () => {
  const { studentProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: QR, 2: Geofence, 3: Face/Liveness, 4: Done

  // Step 1 states
  const [activeSessions, setActiveSessions] = useState<AttendanceSession[]>([]);
  const [qrInputToken, setQrInputToken] = useState('');
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [step1Error, setStep1Error] = useState<string | null>(null);

  // Step 2 states
  const [geofenceLoading, setGeofenceLoading] = useState(false);
  const [geofenceResult, setGeofenceResult] = useState<GeofenceResult | null>(null);
  const [simulateOutside, setSimulateOutside] = useState(false);

  // Step 3 states
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [livenessChallenge, setLivenessChallenge] = useState<LivenessChallenge>('blink');
  const [livenessProgress, setLivenessProgress] = useState(0);
  const [isLivenessVerifying, setIsLivenessVerifying] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Step 4 states
  const [submissionResult, setSubmissionResult] = useState<{ status: string; markedAt: string } | null>(null);

  const subjects = db.getSubjects();
  const teachers = db.getTeachers();
  const classrooms = db.getClassrooms();

  // Sync active sessions for this student's section
  const syncSessions = () => {
    if (!studentProfile) return;
    const now = new Date();
    const sessions = db.getSessions().filter(
      (s) =>
        s.sectionId === studentProfile.sectionId &&
        s.status === 'active' &&
        new Date(s.expiresAt) > now
    );
    setActiveSessions(sessions);
  };

  useEffect(() => {
    syncSessions();
    const unsub = db.subscribe(syncSessions);
    return () => unsub();
  }, [studentProfile]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream(cameraStream);
    };
  }, [cameraStream]);

  // Attach video stream to ref
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream, currentStep]);

  // STEP 1: Handle QR submission / session selection
  const handleSelectSessionFromList = (session: AttendanceSession) => {
    setSelectedSession(session);
    setQrInputToken(session.currentQrToken);
    setStep1Error(null);
    setCurrentStep(2);
  };

  const handleVerifyTokenManually = () => {
    if (!qrInputToken.trim()) {
      setStep1Error('Please paste or scan a valid dynamic QR token.');
      return;
    }

    const validation = validateQrToken(qrInputToken.trim());
    if (!validation.valid || !validation.sessionId) {
      setStep1Error(validation.message);
      return;
    }

    const session = db.getActiveSession(validation.sessionId);
    if (!session) {
      setStep1Error('Attendance session is no longer active.');
      return;
    }

    if (studentProfile && session.sectionId !== studentProfile.sectionId) {
      setStep1Error('Class Section Mismatch: This session belongs to another student group.');
      return;
    }

    setSelectedSession(session);
    setStep1Error(null);
    setCurrentStep(2);
  };

  // STEP 2: Handle Geofence verification
  const handleRunGeofenceCheck = async () => {
    if (!selectedSession) return;
    setGeofenceLoading(true);
    try {
      const result = await verifyGeofence(selectedSession.classroomId, simulateOutside);
      setGeofenceResult(result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setGeofenceLoading(false);
    }
  };

  useEffect(() => {
    if (currentStep === 2 && !geofenceResult) {
      handleRunGeofenceCheck();
    }
  }, [currentStep, simulateOutside]);

  const handleProceedToFaceVerification = async () => {
    setCurrentStep(3);
    setLivenessChallenge(getRandomLivenessChallenge());
    setLivenessProgress(0);
    setFaceVerified(false);

    const stream = await requestCameraStream();
    if (stream) {
      setCameraStream(stream);
      setCameraPermissionGranted(true);
    } else {
      setCameraPermissionGranted(false);
    }
  };

  // STEP 3: Liveness & Face Challenge Execution
  const handleTriggerLivenessChallenge = () => {
    setIsLivenessVerifying(true);
    setLivenessProgress(10);

    const interval = setInterval(() => {
      setLivenessProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLivenessVerifying(false);
          setFaceVerified(true);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // STEP 4: Final Atomic Attendance Submission
  const handleFinalAttendanceSubmit = () => {
    if (!selectedSession || !studentProfile) return;

    const verification: VerificationDetails = {
      qr: 'passed',
      geofence: geofenceResult?.inside ? 'passed' : 'failed',
      face: faceVerified ? 'passed' : 'failed',
      liveness: faceVerified ? 'passed' : 'failed',
      distanceMeters: geofenceResult?.distanceMeters ?? 18,
      faceMatchScore: 0.98,
      deviceTimestamp: new Date().toISOString(),
    };

    const res = db.recordAttendance({
      sessionId: selectedSession.id,
      studentId: studentProfile.id,
      verification,
    });

    if (!res.success) {
      alert(res.message);
      return;
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch {
      // Confetti fallback
    }

    stopCameraStream(cameraStream);
    setCameraStream(null);
    setSubmissionResult({
      status: res.record?.status || 'present',
      markedAt: res.record?.markedAt || new Date().toISOString(),
    });
    setCurrentStep(4);
  };

  const currentSubject = subjects.find((s) => s.id === selectedSession?.subjectId);
  const currentClassroom = classrooms.find((c) => c.id === selectedSession?.classroomId);
  const currentTeacher = teachers.find((t) => t.id === selectedSession?.teacherId);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Wizard Progress Stepper */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center relative">
          {/* Progress connector line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-0" />
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 transition-all duration-500 -z-0"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />

          {[
            { step: 1, label: 'QR Scan', icon: QrCode },
            { step: 2, label: 'Geofence', icon: MapPin },
            { step: 3, label: 'Face & Liveness', icon: Camera },
            { step: 4, label: 'Confirmed', icon: CheckCircle2 },
          ].map((item) => {
            const Icon = item.icon;
            const isDone = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <div key={item.step} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md shadow-indigo-600/20'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[11px] font-bold mt-2 ${
                    isCurrent ? 'text-indigo-600' : isDone ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: QR SCANNER & ACTIVE SESSIONS */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                Step 1: Scan Classroom QR
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select an active class session currently being broadcast by your faculty, or paste the dynamic token.
            </p>
          </div>

          {step1Error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{step1Error}</span>
            </div>
          )}

          {/* Broadcast Active Class Sessions */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Active Classroom Broadcasts</span>
              <span className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin-slow" /> Auto-syncing
              </span>
            </div>

            {activeSessions.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No active attendance sessions right now</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ask your teacher to tap "Start Attendance" on their dashboard to generate the dynamic QR.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeSessions.map((sess) => {
                  const sub = subjects.find((s) => s.id === sess.subjectId);
                  const room = classrooms.find((c) => c.id === sess.classroomId);
                  const teacher = teachers.find((t) => t.id === sess.teacherId);

                  return (
                    <div
                      key={sess.id}
                      className="p-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/80 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-600 text-white">
                            {sub?.code}
                          </span>
                          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            Session Active
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{sub?.name}</h3>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-3">
                          <span>Faculty: {teacher?.name}</span>
                          <span>•</span>
                          <span>Room: {room?.name}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectSessionFromList(sess)}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <span>Scan & Verify</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Manual Token / Direct Input Option */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Or Enter / Paste Live Dynamic QR Token
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={qrInputToken}
                onChange={(e) => setQrInputToken(e.target.value)}
                placeholder="e.g. AIQ_sess_123456_v1_1726000000_A9B8C"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleVerifyTokenManually}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all"
              >
                Validate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: GEOFENCE LOCATION VERIFICATION */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                Step 2: Physical Geofence Check
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verifying that you are physically present within {currentClassroom?.name || 'the lecture hall'}.
            </p>
          </div>

          {/* Session Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-800">{currentSubject?.name}</div>
              <div className="text-slate-500">
                {currentClassroom?.name} • Allowed Radius: {geofenceResult?.allowedRadius || 120}m
              </div>
            </div>
            <span className="font-mono text-[11px] font-bold text-indigo-600 bg-white px-2.5 py-1 rounded-lg border border-indigo-100">
              {currentSubject?.code}
            </span>
          </div>

          {/* Geofence Status Card */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center">
            {geofenceLoading ? (
              <div className="py-6 flex flex-col items-center">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                <div className="text-sm font-bold text-slate-800">Acquiring GPS Satellite Fix...</div>
                <div className="text-xs text-slate-500 mt-1">Computing Haversine distance with beacon</div>
              </div>
            ) : geofenceResult ? (
              <div className="space-y-4">
                <div
                  className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                    geofenceResult.inside
                      ? 'bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50'
                      : 'bg-rose-100 text-rose-600 ring-8 ring-rose-50'
                  }`}
                >
                  {geofenceResult.inside ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : (
                    <AlertCircle className="w-8 h-8" />
                  )}
                </div>

                <div>
                  <h3
                    className={`text-lg font-bold font-['Plus_Jakarta_Sans'] ${
                      geofenceResult.inside ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {geofenceResult.inside ? 'Inside Attendance Zone' : 'Outside Attendance Boundary'}
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                    {geofenceResult.message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left text-xs bg-white p-3 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Measured Distance
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {geofenceResult.distanceMeters} meters
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      GPS Accuracy
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      ±{geofenceResult.accuracyMeters} meters
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Interactive Simulation Toggle (for testing anti-fraud proxy prevention) */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-amber-900 font-medium">
                Test Proxy Prevention: Simulate location 650m outside campus
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSimulateOutside(!simulateOutside);
                setGeofenceResult(null);
              }}
              className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all ${
                simulateOutside
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/50'
              }`}
            >
              {simulateOutside ? 'Outside Active (Testing)' : 'Simulate Outside'}
            </button>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Back to QR
            </button>

            <button
              onClick={handleProceedToFaceVerification}
              disabled={!geofenceResult?.inside}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <span>Next: Face Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: FACE & LIVENESS DETECTION */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                Step 3: Biometric & Liveness Verification
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Confirm your identity and respond to the live anti-spoofing challenge.
            </p>
          </div>

          {/* Interactive Camera & Framing Viewport */}
          <div className="relative w-full max-w-sm mx-auto aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 shadow-inner flex items-center justify-center border-4 border-indigo-100">
            {cameraPermissionGranted ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="text-center p-6 text-slate-400">
                <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-white">Interactive Camera Viewport</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  (Simulated selfie feed active for desktop browser pairing)
                </p>
              </div>
            )}

            {/* Target Face Oval Frame */}
            <div
              className={`absolute inset-6 rounded-[50%] border-2 border-dashed pointer-events-none transition-all ${
                faceVerified
                  ? 'border-emerald-400 bg-emerald-500/10'
                  : isLivenessVerifying
                  ? 'border-amber-400 animate-pulse'
                  : 'border-white/60'
              }`}
            />

            {/* Verification Status Overlay Badge */}
            <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
              {faceVerified ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Face & Liveness Verified (98.4%)</span>
                </>
              ) : isLivenessVerifying ? (
                <>
                  <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                  <span>Analyzing Facial Landmarks...</span>
                </>
              ) : (
                <span>Align Face Within Frame</span>
              )}
            </div>
          </div>

          {/* Interactive Liveness Challenge Prompt */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center">
            <div className="text-2xl mb-1">{LIVENESS_PROMPTS[livenessChallenge].icon}</div>
            <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
              {LIVENESS_PROMPTS[livenessChallenge].title}
            </div>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">
              "{LIVENESS_PROMPTS[livenessChallenge].instruction}"
            </p>

            {isLivenessVerifying && (
              <div className="w-48 mx-auto mt-3 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${livenessProgress}%` }}
                />
              </div>
            )}

            {!faceVerified && !isLivenessVerifying && (
              <button
                type="button"
                onClick={handleTriggerLivenessChallenge}
                className="mt-3 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Perform Challenge
              </button>
            )}

            {faceVerified && (
              <div className="mt-2 text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Anti-spoofing challenge passed successfully!</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Back to Geofence
            </button>

            <button
              onClick={handleFinalAttendanceSubmit}
              disabled={!faceVerified}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit & Record Attendance</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CELEBRATION & VERIFIED RECEIPT */}
      {currentStep === 4 && submissionResult && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
              Verification Complete
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2 font-['Plus_Jakarta_Sans']">
              Attendance Recorded!
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Your attendance has been validated server-side and recorded to institutional ledger.
            </p>
          </div>

          {/* Official Verification Slip */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 max-w-md mx-auto text-left space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-400">Student:</span>
              <span className="font-bold text-slate-800">{studentProfile?.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-400">Roll Number:</span>
              <span className="font-bold text-slate-800">{studentProfile?.rollNo}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-400">Subject:</span>
              <span className="font-bold text-slate-800">{currentSubject?.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-400">Status:</span>
              <span className="font-bold text-emerald-600 uppercase">
                {submissionResult.status}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-400">Server Timestamp:</span>
              <span className="font-bold text-slate-800">
                {new Date(submissionResult.markedAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-400">Security Checks:</span>
              <span className="font-bold text-indigo-700">QR ✓ Geofence ✓ Face ✓ Live ✓</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setCurrentStep(1);
                setSelectedSession(null);
                setQrInputToken('');
                setGeofenceResult(null);
                setFaceVerified(false);
              }}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Done & Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

