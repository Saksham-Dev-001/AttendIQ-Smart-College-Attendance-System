import { AttendanceRecord, Subject } from '../types';

export function exportAttendanceToCSV(
  records: AttendanceRecord[],
  subjects: Subject[],
  filename = 'AttendIQ_Attendance_Report.csv'
) {
  if (!records || records.length === 0) {
    alert('No attendance records to export.');
    return;
  }

  const subjectMap = new Map<string, string>();
  subjects.forEach((s) => subjectMap.set(s.id, `${s.name} (${s.code})`));

  const headers = [
    'Student Roll No',
    'Student Name',
    'Branch',
    'Batch',
    'Subject',
    'Status',
    'Marked Date & Time',
    'QR Check',
    'Geofence Check',
    'Distance (m)',
    'Face Check',
    'Liveness Check',
  ];

  // Optional lookup for student metadata if available
  const rows = records.map((r) => [
    `"${r.rollNo}"`,
    `"${r.studentName}"`,
    `"${(r as any).branch || 'CSE'}"`,
    `"${(r as any).batch || 'A1'}"`,
    `"${subjectMap.get(r.subjectId) || r.subjectId}"`,
    `"${r.status.toUpperCase()}"`,
    `"${new Date(r.markedAt).toLocaleString()}"`,
    `"${r.verification.qr}"`,
    `"${r.verification.geofence}"`,
    `"${r.verification.distanceMeters ?? 'N/A'}"`,
    `"${r.verification.face}"`,
    `"${r.verification.liveness}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

