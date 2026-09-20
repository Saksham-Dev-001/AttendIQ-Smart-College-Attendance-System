import { AttendanceRecord, Subject } from '../types';

/**
 * Sanitizes a string for CSV export to prevent CSV formula injection (CWE-1236)
 * and properly escape internal double quotes.
 */
function sanitizeCsvCell(value: any): string {
  if (value === null || value === undefined) return '""';
  let str = String(value).trim();
  // If the cell begins with dangerous formula trigger characters, prefix with single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

export function exportAttendanceToCSV(
  records: AttendanceRecord[],
  subjects: Subject[],
  filename = 'AttendIQ_SBCET_Attendance_Report.csv'
) {
  if (!records || records.length === 0) {
    alert('No attendance records available to export.');
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

  const rows = records.map((r) => [
    sanitizeCsvCell(r.rollNo),
    sanitizeCsvCell(r.studentName),
    sanitizeCsvCell(r.branch || 'CSE'),
    sanitizeCsvCell(r.batch || 'A1'),
    sanitizeCsvCell(subjectMap.get(r.subjectId) || r.subjectId),
    sanitizeCsvCell(r.status.toUpperCase()),
    sanitizeCsvCell(new Date(r.markedAt).toLocaleString()),
    sanitizeCsvCell(r.verification.qr),
    sanitizeCsvCell(r.verification.geofence),
    sanitizeCsvCell(r.verification.distanceMeters ?? 'N/A'),
    sanitizeCsvCell(r.verification.face),
    sanitizeCsvCell(r.verification.liveness),
  ]);

  const csvContent = [headers.map(h => sanitizeCsvCell(h)).join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Prevent memory leak
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
