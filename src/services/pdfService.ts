export interface SessionStudentRow {
  sNo: number;
  rollNo: string;
  name: string;
  branch: string;
  batch: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedAt?: string;
  verificationSummary?: string;
}

export interface SessionPdfData {
  collegeName: string;
  campusName: string;
  departmentName: string;
  subjectName: string;
  subjectCode: string;
  facultyName: string;
  employeeId?: string;
  sectionName: string;
  classroomName: string;
  dateStr: string;
  timeStr: string;
  academicSession: string;
  totalEnrolled: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
  students: SessionStudentRow[];
}

export interface CumulativeStudentRow {
  sNo: number;
  rollNo: string;
  name: string;
  branch: string;
  batch: string;
  attendedLectures: number;
  totalLectures: number;
  percentage: number;
  isShortage: boolean;
}

export interface SubjectCumulativePdfData {
  collegeName: string;
  campusName: string;
  departmentName: string;
  subjectName: string;
  subjectCode: string;
  facultyName: string;
  employeeId?: string;
  sectionName: string;
  academicSession: string;
  totalLecturesConducted: number;
  students: CumulativeStudentRow[];
}

/**
 * Generates the clean HTML string for a single session roll call PDF sheet
 */
export function getSessionPdfHtml(data: SessionPdfData): string {
  const generatedAt = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const rowsHtml = data.students
    .map((s) => {
      const isPresent = s.status === 'present' || s.status === 'late';
      const statusBadge = isPresent
        ? `<span style="background-color: #dcfce7; color: #15803d; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 10px; text-transform: uppercase;">${s.status}</span>`
        : `<span style="background-color: #fee2e2; color: #b91c1c; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 10px; text-transform: uppercase;">ABSENT</span>`;

      return `
        <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
          <td style="padding: 6px 8px; text-align: center; color: #64748b;">${s.sNo}</td>
          <td style="padding: 6px 8px; font-family: monospace; font-weight: 600; color: #1e293b;">${s.rollNo}</td>
          <td style="padding: 6px 8px; font-weight: 600; color: #0f172a;">${s.name}</td>
          <td style="padding: 6px 8px; color: #475569;">${s.branch} (${s.batch})</td>
          <td style="padding: 6px 8px; text-align: center;">${statusBadge}</td>
          <td style="padding: 6px 8px; font-family: monospace; font-size: 10px; color: #64748b;">${s.markedAt || '—'}</td>
          <td style="padding: 6px 8px; font-size: 10px; color: #334155;">${s.verificationSummary || '—'}</td>
        </tr>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AttendIQ Attendance Sheet - ${data.subjectCode} - ${data.dateStr}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      margin: 0;
      padding: 10px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .header-table {
      width: 100%;
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .college-name {
      font-size: 18px;
      font-weight: 800;
      color: #1e3a8a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }
    .college-sub {
      font-size: 10px;
      color: #475569;
      margin: 2px 0;
    }
    .doc-title {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      background: #f1f5f9;
      display: inline-block;
      padding: 3px 12px;
      border-radius: 4px;
      margin-top: 4px;
      border: 1px solid #cbd5e1;
    }
    .meta-box {
      width: 100%;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 12px;
      font-size: 11px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px 16px;
    }
    .meta-item strong {
      color: #334155;
    }
    .stats-strip {
      display: flex;
      justify-content: space-between;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 6px;
      padding: 6px 12px;
      margin-bottom: 12px;
      font-size: 11px;
    }
    .stats-item {
      font-weight: 600;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      page-break-inside: auto;
    }
    table.data-table thead tr {
      background-color: #f1f5f9;
      border-top: 1px solid #cbd5e1;
      border-bottom: 2px solid #94a3b8;
    }
    table.data-table th {
      padding: 6px 8px;
      font-size: 10px;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    table.data-table tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    .footer-sign {
      margin-top: 28px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
      padding-top: 15px;
    }
    .sign-col {
      text-align: center;
      width: 28%;
    }
    .sign-line {
      border-top: 1px dashed #64748b;
      margin-bottom: 4px;
      padding-top: 2px;
    }
    .sign-role {
      font-size: 11px;
      font-weight: 600;
      color: #1e293b;
    }
    .sign-name {
      font-size: 10px;
      color: #64748b;
    }
    .audit-stamp {
      font-size: 9px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      margin-top: 16px;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="header-table">
    <table style="width: 100%; border: none;">
      <tr>
        <td style="vertical-align: middle;">
          <h1 class="college-name">${data.collegeName}</h1>
          <div class="college-sub">${data.campusName} • Approved by AICTE, Affiliated to RTU Kota</div>
          <div class="college-sub">${data.departmentName}</div>
          <div class="doc-title">OFFICIAL LECTURE ATTENDANCE & VERIFICATION ROLL CALL SHEET</div>
        </td>
        <td style="text-align: right; vertical-align: middle; width: 140px;">
          <div style="font-size: 10px; font-weight: 700; color: #1e3a8a; border: 2px solid #1e3a8a; padding: 4px 8px; border-radius: 6px; text-align: center;">
            ATTENDIQ<br/><span style="font-size: 8px; color: #64748b; font-weight: normal;">DIGITAL VERIFIED</span>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <div class="meta-box">
    <div class="meta-grid">
      <div class="meta-item"><strong>Subject:</strong> ${data.subjectName} (${data.subjectCode})</div>
      <div class="meta-item"><strong>Faculty:</strong> ${data.facultyName} ${data.employeeId ? `[${data.employeeId}]` : ''}</div>
      <div class="meta-item"><strong>Section:</strong> ${data.sectionName}</div>
      <div class="meta-item"><strong>Date:</strong> ${data.dateStr}</div>
      <div class="meta-item"><strong>Time Slot:</strong> ${data.timeStr}</div>
      <div class="meta-item"><strong>Lecture Hall:</strong> ${data.classroomName}</div>
      <div class="meta-item"><strong>Academic Session:</strong> ${data.academicSession}</div>
      <div class="meta-item"><strong>Security:</strong> Dynamic QR + Geofence + Biometric</div>
      <div class="meta-item"><strong>Verification Engine:</strong> AttendIQ Smart Shield</div>
    </div>
  </div>

  <div class="stats-strip">
    <div class="stats-item">Class Strength: <span style="color: #0f172a;">${data.totalEnrolled}</span></div>
    <div class="stats-item">Present: <span style="color: #15803d;">${data.presentCount}</span></div>
    <div class="stats-item">Absent: <span style="color: #b91c1c;">${data.absentCount}</span></div>
    <div class="stats-item">Attendance Ratio: <span style="color: #1e40af; font-size: 12px;">${data.attendancePercentage}%</span></div>
  </div>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 32px; text-align: center;">#</th>
        <th style="width: 110px; text-align: left;">Roll No</th>
        <th style="text-align: left;">Student Name</th>
        <th style="width: 100px; text-align: left;">Branch (Batch)</th>
        <th style="width: 70px; text-align: center;">Status</th>
        <th style="width: 80px; text-align: left;">Check-in Time</th>
        <th style="width: 160px; text-align: left;">Verification Details</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="footer-sign">
    <div class="sign-col">
      <div class="sign-line"></div>
      <div class="sign-role">Subject Faculty</div>
      <div class="sign-name">${data.facultyName}</div>
    </div>
    <div class="sign-col">
      <div class="sign-line"></div>
      <div class="sign-role">Class Coordinator</div>
      <div class="sign-name">Department Coordinator</div>
    </div>
    <div class="sign-col">
      <div class="sign-line"></div>
      <div class="sign-role">Head of Department (HOD)</div>
      <div class="sign-name">Applied Sciences & First Year</div>
    </div>
  </div>

  <div class="audit-stamp">
    <span>AttendIQ Automated Audit Trail • Report Generated: ${generatedAt}</span>
    <span>Immutable Record ID: SBCET-ATT-${data.subjectCode}-${Date.now().toString(36).toUpperCase()}</span>
  </div>
</body>
</html>
  `;
}

/**
 * Generates the clean HTML string for a cumulative subject register report
 */
export function getSubjectCumulativePdfHtml(data: SubjectCumulativePdfData): string {
  const generatedAt = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const rowsHtml = data.students
    .map((s) => {
      const shortageBadge = s.isShortage
        ? `<span style="background-color: #fee2e2; color: #b91c1c; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px;">SHORTAGE (&lt;75%)</span>`
        : `<span style="background-color: #dcfce7; color: #15803d; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px;">ELIGIBLE</span>`;

      return `
        <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
          <td style="padding: 6px 8px; text-align: center; color: #64748b;">${s.sNo}</td>
          <td style="padding: 6px 8px; font-family: monospace; font-weight: 600; color: #1e293b;">${s.rollNo}</td>
          <td style="padding: 6px 8px; font-weight: 600; color: #0f172a;">${s.name}</td>
          <td style="padding: 6px 8px; color: #475569;">${s.branch} (${s.batch})</td>
          <td style="padding: 6px 8px; text-align: center; font-weight: 600;">${s.attendedLectures} / ${s.totalLectures}</td>
          <td style="padding: 6px 8px; text-align: center; font-weight: 700; color: ${s.isShortage ? '#b91c1c' : '#15803d'}; font-size: 12px;">${s.percentage}%</td>
          <td style="padding: 6px 8px; text-align: center;">${shortageBadge}</td>
        </tr>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AttendIQ Cumulative Register - ${data.subjectCode} - ${data.sectionName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      margin: 0;
      padding: 10px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .header-table {
      width: 100%;
      border-bottom: 2px solid #1e3a8a;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .college-name {
      font-size: 18px;
      font-weight: 800;
      color: #1e3a8a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }
    .college-sub {
      font-size: 10px;
      color: #475569;
      margin: 2px 0;
    }
    .doc-title {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      background: #f1f5f9;
      display: inline-block;
      padding: 3px 12px;
      border-radius: 4px;
      margin-top: 4px;
      border: 1px solid #cbd5e1;
    }
    .meta-box {
      width: 100%;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 12px;
      font-size: 11px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px 16px;
    }
    .meta-item strong {
      color: #334155;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      page-break-inside: auto;
    }
    table.data-table thead tr {
      background-color: #f1f5f9;
      border-top: 1px solid #cbd5e1;
      border-bottom: 2px solid #94a3b8;
    }
    table.data-table th {
      padding: 6px 8px;
      font-size: 10px;
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    table.data-table tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    .footer-sign {
      margin-top: 28px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
      padding-top: 15px;
    }
    .sign-col {
      text-align: center;
      width: 28%;
    }
    .sign-line {
      border-top: 1px dashed #64748b;
      margin-bottom: 4px;
      padding-top: 2px;
    }
    .sign-role {
      font-size: 11px;
      font-weight: 600;
      color: #1e293b;
    }
    .sign-name {
      font-size: 10px;
      color: #64748b;
    }
    .audit-stamp {
      font-size: 9px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      margin-top: 16px;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="header-table">
    <table style="width: 100%; border: none;">
      <tr>
        <td style="vertical-align: middle;">
          <h1 class="college-name">${data.collegeName}</h1>
          <div class="college-sub">${data.campusName} • Approved by AICTE, Affiliated to RTU Kota</div>
          <div class="college-sub">${data.departmentName}</div>
          <div class="doc-title">CUMULATIVE COURSE ATTENDANCE REGISTER & SHORTAGE REPORT</div>
        </td>
        <td style="text-align: right; vertical-align: middle; width: 140px;">
          <div style="font-size: 10px; font-weight: 700; color: #1e3a8a; border: 2px solid #1e3a8a; padding: 4px 8px; border-radius: 6px; text-align: center;">
            ATTENDIQ<br/><span style="font-size: 8px; color: #64748b; font-weight: normal;">OFFICIAL REGISTER</span>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <div class="meta-box">
    <div class="meta-grid">
      <div class="meta-item"><strong>Subject:</strong> ${data.subjectName} (${data.subjectCode})</div>
      <div class="meta-item"><strong>Faculty:</strong> ${data.facultyName} ${data.employeeId ? `[${data.employeeId}]` : ''}</div>
      <div class="meta-item"><strong>Class Section:</strong> ${data.sectionName}</div>
      <div class="meta-item"><strong>Total Lectures Conducted:</strong> ${data.totalLecturesConducted}</div>
      <div class="meta-item"><strong>Academic Session:</strong> ${data.academicSession}</div>
      <div class="meta-item"><strong>Statutory Threshold:</strong> 75% Mandatory Attendance</div>
    </div>
  </div>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 32px; text-align: center;">#</th>
        <th style="width: 130px; text-align: left;">Roll No</th>
        <th style="text-align: left;">Student Name</th>
        <th style="width: 120px; text-align: left;">Branch (Batch)</th>
        <th style="width: 100px; text-align: center;">Attended / Total</th>
        <th style="width: 80px; text-align: center;">Percentage</th>
        <th style="width: 120px; text-align: center;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="footer-sign">
    <div class="sign-col">
      <div class="sign-line"></div>
      <div class="sign-role">Subject Faculty</div>
      <div class="sign-name">${data.facultyName}</div>
    </div>
    <div class="sign-col">
      <div class="sign-line"></div>
      <div class="sign-role">Class Coordinator</div>
      <div class="sign-name">Department Coordinator</div>
    </div>
    <div class="sign-col">
      <div class="sign-line"></div>
      <div class="sign-role">Head of Department (HOD)</div>
      <div class="sign-name">Applied Sciences & First Year</div>
    </div>
  </div>

  <div class="audit-stamp">
    <span>AttendIQ Automated Audit Trail • Register Generated: ${generatedAt}</span>
    <span>Institutional Record Token: SBCET-REG-${data.subjectCode}-${Date.now().toString(36).toUpperCase()}</span>
  </div>
</body>
</html>
  `;
}

/**
 * Triggers printing/saving as PDF using an invisible print iframe
 */
export function triggerPrintHtml(htmlContent: string) {
  // Create an invisible iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    alert('Unable to initiate print dialog.');
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  // Wait a moment for styles and layout to evaluate
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    // Clean up iframe after print dialog closes
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);
  }, 350);
}

