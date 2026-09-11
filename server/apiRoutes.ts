import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import {
  createStudentWithSupabase,
  findStudentByRegistrationIdAsync,
  findStudentByGmail,
  findStudentByGmailAsync,
  syncAllStudentsToSupabase,
  syncFromSupabaseToLocal,
  getAllStudents,
  getFreshStudents,
  updateStudentAdmissionStatus,
  updateStudentDetails,
  deleteStudent,
  bulkUpdateAdmissionStatus,
  bulkDeleteStudents,
  getAdminStatistics,
  getAdminStudentsList,
  StudentRecord
} from './db.ts';
import {
  authenticateAdmin,
  verifyAdminToken,
  logoutAdmin,
  changeAdminPassword,
  getAuditLogs,
  AdminSession
} from './adminAuth.ts';
import {
  checkSupabaseStatus,
  findStudentInSupabaseByGmail,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_SQL_SCHEMA
} from './supabase.ts';

// Admin Authentication Middleware
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-admin-token'] as string | undefined;

  let token: string | undefined;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (customHeader) {
    token = customHeader.trim();
  }

  const session = verifyAdminToken(token);
  if (!session) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access denied. Valid administrator credentials required.'
    });
  }

  (req as any).adminSession = session;
  next();
}

export const apiRouter = Router();

// Health check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MY CHSE 12TH CLASSES API',
    database: 'Supabase Cloud (PostgreSQL) + Persistent Cache',
    supabase_project_id: SUPABASE_PROJECT_ID,
    timestamp: new Date().toISOString()
  });
});

// Download ready-to-deploy zip for Netlify Drop
apiRouter.get('/download-deploy-zip', (req, res) => {
  const zipPath = path.join(process.cwd(), 'netlify_deploy.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="mychse_netlify_deploy.zip"');
    return res.sendFile(zipPath);
  }
  res.status(404).send('Deploy zip not found');
});

// Supabase Connection Status Endpoint
apiRouter.get('/supabase/status', async (req, res) => {
  try {
    const status = await checkSupabaseStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({
      connected: false,
      error: err?.message || 'Error checking Supabase status',
      projectId: SUPABASE_PROJECT_ID,
      supabaseUrl: SUPABASE_URL,
      sqlSchema: SUPABASE_SQL_SCHEMA
    });
  }
});

// Supabase Manual Sync Endpoint (Push all local registrations to Supabase)
apiRouter.post('/supabase/sync', async (req, res) => {
  try {
    const result = await syncAllStudentsToSupabase();
    res.json({
      success: true,
      message: `Processed ${result.total} records: ${result.synced} synced, ${result.failed} failed/pending schema.`,
      ...result
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to sync with Supabase'
    });
  }
});

// Student Registration Endpoint
apiRouter.post('/students/register', async (req, res) => {
  try {
    const {
      full_name,
      gmail,
      age,
      stream,
      subject_1,
      subject_2,
      subject_3,
      subject_4,
      subject_5,
      subject_6,
      state,
      district,
      block,
      address,
      confirmed
    } = req.body;

    const errors: Record<string, string> = {};

    // 1. Full name validation
    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 3) {
      errors.full_name = 'Please enter your complete full name (at least 3 characters).';
    }

    // 2. Gmail validation
    if (!gmail || typeof gmail !== 'string') {
      errors.gmail = 'Please enter your Gmail ID.';
    } else {
      const trimmedGmail = gmail.trim().toLowerCase();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
      if (!emailRegex.test(trimmedGmail)) {
        errors.gmail = 'Please enter a valid Gmail ID ending with @gmail.com.';
      }
    }

    // 3. Age validation
    const numAge = Number(age);
    if (!age || isNaN(numAge) || numAge < 14 || numAge > 35) {
      errors.age = 'Please enter a valid student age between 14 and 35.';
    }

    // 4. Stream validation
    const validStreams = ['Arts', 'Science', 'Commerce'];
    if (!stream || !validStreams.includes(stream)) {
      errors.stream = 'Please select a valid stream (Arts, Science, or Commerce).';
    }

    // 5. Exactly six subjects validation
    const subjects = [subject_1, subject_2, subject_3, subject_4, subject_5, subject_6];
    for (let i = 0; i < 6; i++) {
      if (!subjects[i] || typeof subjects[i] !== 'string' || subjects[i].trim() === '') {
        errors[`subject_${i + 1}`] = `Please select Subject ${i + 1}.`;
      }
    }

    // Check for duplicate subjects among the 6 selected
    const validSelectedSubjects = subjects.filter((s) => s && typeof s === 'string' && s.trim() !== '');
    const uniqueSubjects = new Set(validSelectedSubjects.map((s) => s.trim().toLowerCase()));
    if (validSelectedSubjects.length === 6 && uniqueSubjects.size < 6) {
      errors.subjects = 'All six subjects must be distinct. Duplicate subject selection is not allowed.';
    }

    // 6. Location validation
    if (!state || typeof state !== 'string' || state.trim() === '') {
      errors.state = 'Please select your State.';
    }
    if (!district || typeof district !== 'string' || district.trim() === '') {
      errors.district = 'Please select your District.';
    }
    if (!block || typeof block !== 'string' || block.trim() === '') {
      errors.block = 'Please select your Block.';
    }

    // 7. Address validation
    if (!address || typeof address !== 'string' || address.trim().length < 8) {
      errors.address = 'Please enter your complete residential address (at least 8 characters).';
    }

    // 8. Confirmation checkbox
    if (confirmed !== true) {
      errors.confirmed = 'You must confirm that the provided information is correct.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        errors
      });
    }

    // Save student to Supabase + local cache
    const { student: newStudent, supabaseSynced, supabaseError } = await createStudentWithSupabase({
      full_name,
      gmail,
      age: numAge,
      stream,
      subject_1,
      subject_2,
      subject_3,
      subject_4,
      subject_5,
      subject_6,
      state,
      district,
      block,
      address
    });

    return res.status(201).json({
      success: true,
      supabase_synced: supabaseSynced,
      supabase_error: supabaseError,
      supabase_project_id: SUPABASE_PROJECT_ID,
      student: {
        registration_id: newStudent.registration_id,
        full_name: newStudent.full_name,
        stream: newStudent.stream,
        registration_date: newStudent.registration_date,
        admission_status: newStudent.admission_status
      }
    });
  } catch (err: any) {
    if (err.code === 'DUPLICATE_GMAIL') {
      return res.status(409).json({
        error: 'This Gmail ID is already registered.',
        code: 'DUPLICATE_GMAIL',
        existingRegistrationId: err.existingRegistrationId
      });
    }
    console.error('Server registration error:', err);
    return res.status(500).json({
      error: 'An unexpected server error occurred while processing registration.'
    });
  }
});

// Check Registration Status Endpoint (public, safe, checks both local and Supabase)
apiRouter.get('/students/status/:registrationId', async (req, res) => {
  const { registrationId } = req.params;

  if (!registrationId || typeof registrationId !== 'string' || registrationId.trim() === '') {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Registration ID is required.'
    });
  }

  const student = await findStudentByRegistrationIdAsync(registrationId);

  if (!student) {
    return res.status(404).json({
      error: 'Registration ID not found.',
      message: 'Please check your Registration ID and try again.'
    });
  }

  // Return strictly sanitized public information
  return res.json({
    registration_id: student.registration_id,
    full_name: student.full_name,
    stream: student.stream,
    registration_date: student.registration_date,
    admission_status: student.admission_status,
    admission_date: student.admission_date,
    synced_to_supabase: student.synced_to_supabase
  });
});

// Check if Gmail exists (for real-time friendly hints)
apiRouter.get('/students/check-gmail', async (req, res) => {
  const gmail = req.query.gmail as string;
  if (!gmail) {
    return res.status(400).json({ error: 'gmail is required' });
  }
  const student = findStudentByGmail(gmail);
  if (student) {
    return res.json({
      isRegistered: true,
      registration_id: student.registration_id
    });
  }

  const supabaseStudent = await findStudentInSupabaseByGmail(gmail);
  if (supabaseStudent) {
    return res.json({
      isRegistered: true,
      registration_id: supabaseStudent.registration_id
    });
  }

  return res.json({ isRegistered: false });
});

// =========================================================================
// ADMIN API ENDPOINTS (Protected with requireAdminAuth)
// =========================================================================

// Admin Login
apiRouter.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const auth = authenticateAdmin(email, password);
    return res.json({
      success: true,
      token: auth.session.token,
      admin: auth.admin
    });
  } catch (err: any) {
    return res.status(401).json({
      error: err?.message || 'Invalid email or password.'
    });
  }
});

// Admin Current Session
apiRouter.get('/admin/me', requireAdminAuth, (req, res) => {
  const session = (req as any).adminSession as AdminSession;
  res.json({
    authenticated: true,
    admin: {
      id: session.admin_id,
      email: session.email,
      name: session.name,
      role: session.role
    }
  });
});

// Admin Logout
apiRouter.post('/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7).trim() : (req.headers['x-admin-token'] as string);
  logoutAdmin(token);
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Admin Change Password
apiRouter.post('/admin/change-password', requireAdminAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }
    const session = (req as any).adminSession as AdminSession;
    changeAdminPassword(currentPassword, newPassword, session?.email);
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to update password.' });
  }
});

// Admin Dashboard Statistics
apiRouter.get('/admin/stats', requireAdminAuth, async (req, res) => {
  try {
    const students = await getFreshStudents();
    const stats = getAdminStatistics(students);
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch statistics.' });
  }
});

// Admin Students Query List (Pagination, Search, Filters, Sorting)
apiRouter.get('/admin/students', requireAdminAuth, async (req, res) => {
  try {
    const students = await getFreshStudents();
    const { search, stream, status, state, district, block, sortBy, sortOrder, page, limit } = req.query;
    const result = getAdminStudentsList(
      {
        search: search as string,
        stream: stream as string,
        status: status as string,
        state: state as string,
        district: district as string,
        block: block as string,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 25
      },
      students
    );
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch students list.' });
  }
});

// Admin Single Student Details
apiRouter.get('/admin/students/:registrationId', requireAdminAuth, async (req, res) => {
  try {
    const students = await getFreshStudents();
    const student = students.find(
      (s) => s.registration_id.trim().toUpperCase() === req.params.registrationId.trim().toUpperCase()
    );
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }
    res.json(student);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch student details.' });
  }
});

// Admin Admission Status Change (Approval, Admit, Reject, Reset to Pending)
apiRouter.patch('/admin/students/:registrationId/status', requireAdminAuth, async (req, res) => {
  try {
    let { status } = req.body;
    if (!['Pending', 'Approval', 'Admitted', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be Pending, Approval, or Rejected.' });
    }
    if (status === 'Admitted') {
      status = 'Approval';
    }
    const session = (req as any).adminSession as AdminSession;
    const updated = await updateStudentAdmissionStatus(req.params.registrationId, status, session.email);
    res.json({
      success: true,
      message:
        status === 'Approval' || status === 'Admitted'
          ? 'Student admission approved successfully.'
          : status === 'Rejected'
          ? 'Student rejected successfully.'
          : 'Student status updated successfully.',
      student: updated
    });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to update admission status.' });
  }
});

// Admin Edit Student Information
apiRouter.put('/admin/students/:registrationId', requireAdminAuth, async (req, res) => {
  try {
    const session = (req as any).adminSession as AdminSession;
    const updated = await updateStudentDetails(req.params.registrationId, req.body, session.email);
    res.json({
      success: true,
      message: 'Student details updated successfully.',
      student: updated
    });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to update student details.' });
  }
});

// Admin Delete Student Registration
apiRouter.delete('/admin/students/:registrationId', requireAdminAuth, async (req, res) => {
  try {
    const session = (req as any).adminSession as AdminSession;
    await deleteStudent(req.params.registrationId, session.email);
    res.json({
      success: true,
      message: 'Student registration deleted successfully.'
    });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to delete student registration.' });
  }
});

// Admin Bulk Update Admission Status
apiRouter.post('/admin/students/bulk-status', requireAdminAuth, async (req, res) => {
  try {
    let { registration_ids, status } = req.body;
    if (!Array.isArray(registration_ids) || registration_ids.length === 0) {
      return res.status(400).json({ error: 'registration_ids array is required.' });
    }
    if (!['Pending', 'Approval', 'Admitted', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be Pending, Approval, or Rejected.' });
    }
    if (status === 'Admitted') {
      status = 'Approval';
    }
    const session = (req as any).adminSession as AdminSession;
    const result = await bulkUpdateAdmissionStatus(registration_ids, status, session.email);
    res.json({
      success: true,
      message: `Successfully updated ${result.updatedCount} students to ${status}.`,
      ...result
    });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Bulk status update failed.' });
  }
});

// Admin Bulk Delete Students
apiRouter.post('/admin/students/bulk-delete', requireAdminAuth, async (req, res) => {
  try {
    const { registration_ids } = req.body;
    if (!Array.isArray(registration_ids) || registration_ids.length === 0) {
      return res.status(400).json({ error: 'registration_ids array is required.' });
    }
    const session = (req as any).adminSession as AdminSession;
    const result = await bulkDeleteStudents(registration_ids, session.email);
    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} students.`,
      ...result
    });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Bulk delete failed.' });
  }
});

// Admin Data Export (CSV and JSON)
apiRouter.get('/admin/export', requireAdminAuth, async (req, res) => {
  try {
    const { status, stream, state, district, block, format } = req.query;
    let students = await getFreshStudents();

    if (status && status !== 'All') {
      const filterStatus = (status as string).toLowerCase();
      if (filterStatus === 'approval' || filterStatus === 'admitted') {
        students = students.filter(
          (s) =>
            s.admission_status.toLowerCase() === 'approval' ||
            s.admission_status.toLowerCase() === 'admitted'
        );
      } else {
        students = students.filter((s) => s.admission_status.toLowerCase() === filterStatus);
      }
    }
    if (stream && stream !== 'All') {
      students = students.filter((s) => s.stream.toLowerCase() === (stream as string).toLowerCase());
    }
    if (state && state !== 'All') {
      students = students.filter((s) => s.state.toLowerCase() === (state as string).toLowerCase());
    }
    if (district && district !== 'All') {
      students = students.filter((s) => s.district.toLowerCase() === (district as string).toLowerCase());
    }
    if (block && block !== 'All') {
      students = students.filter((s) => s.block.toLowerCase() === (block as string).toLowerCase());
    }

    if (format === 'json') {
      return res.json(students);
    }

    // Generate CSV
    const headers = [
      'Registration ID',
      'Student Name',
      'Gmail',
      'Age',
      'Stream',
      'Subject 1',
      'Subject 2',
      'Subject 3',
      'Subject 4',
      'Subject 5',
      'Subject 6',
      'State',
      'District',
      'Block',
      'Address',
      'Admission Status',
      'Registration Date',
      'Admission Date'
    ];

    const csvRows = [headers.join(',')];

    for (const s of students) {
      const row = [
        `"${s.registration_id}"`,
        `"${s.full_name.replace(/"/g, '""')}"`,
        `"${s.gmail}"`,
        s.age,
        `"${s.stream}"`,
        `"${s.subject_1.replace(/"/g, '""')}"`,
        `"${s.subject_2.replace(/"/g, '""')}"`,
        `"${s.subject_3.replace(/"/g, '""')}"`,
        `"${s.subject_4.replace(/"/g, '""')}"`,
        `"${s.subject_5.replace(/"/g, '""')}"`,
        `"${s.subject_6.replace(/"/g, '""')}"`,
        `"${s.state.replace(/"/g, '""')}"`,
        `"${s.district.replace(/"/g, '""')}"`,
        `"${s.block.replace(/"/g, '""')}"`,
        `"${s.address.replace(/"/g, '""')}"`,
        `"${s.admission_status}"`,
        `"${s.registration_date}"`,
        `"${s.admission_date || ''}"`
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\r\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="MY_CHSE_Students_${Date.now()}.csv"`);
    return res.send(csvContent);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Export failed.' });
  }
});

// Admin Audit Logs
apiRouter.get('/admin/audit-logs', requireAdminAuth, (req, res) => {
  try {
    const logs = getAuditLogs(50);
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch audit logs.' });
  }
});
