import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import os from 'os';
import {
  insertStudentToSupabase,
  updateStudentInSupabase,
  deleteStudentInSupabase,
  findStudentInSupabaseByRegistrationId,
  findStudentInSupabaseByGmail,
  fetchAllStudentsFromSupabase,
  getMaxRegistrationNumberFromSupabase
} from './supabase.ts';
import { addAuditLog } from './adminAuth.ts';

export interface StudentRecord {
  id: string;
  registration_id: string;
  full_name: string;
  gmail: string;
  age: number;
  stream: 'Arts' | 'Science' | 'Commerce';
  subject_1: string;
  subject_2: string;
  subject_3: string;
  subject_4: string;
  subject_5: string;
  subject_6: string;
  state: string;
  district: string;
  block: string;
  address: string;
  admission_status: 'Pending' | 'Approval' | 'Admitted' | 'Rejected';
  registration_date: string;
  admission_date: string | null;
  created_at: string;
  updated_at: string;
  synced_to_supabase?: boolean;
}

export function getDataDir(): string {
  if (process.env.DATA_DIR) {
    return process.env.DATA_DIR;
  }
  // Serverless environments (Netlify, AWS Lambda, Vercel)
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL) {
    return path.join(os.tmpdir(), 'mychse_data');
  }
  const defaultDir = path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(defaultDir)) {
      fs.mkdirSync(defaultDir, { recursive: true });
    }
    return defaultDir;
  } catch {
    return path.join(os.tmpdir(), 'mychse_data');
  }
}

// Initial seed records (empty by default; registrations come from real users)
const INITIAL_STUDENTS: StudentRecord[] = [];

function initDb(): void {
  try {
    const dir = getDataDir();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const dbFile = path.join(dir, 'students.json');
    if (!fs.existsSync(dbFile)) {
      fs.writeFileSync(dbFile, JSON.stringify(INITIAL_STUDENTS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('Storage init note (serverless fallback active):', err);
  }
}

let inMemoryStudents: StudentRecord[] | null = null;
let lastSupabaseFetchTime = 0;
const SUPABASE_CACHE_TTL_MS = 2000; // 2 seconds fresh cache

function getAllStudentsFromDisk(): StudentRecord[] {
  initDb();
  try {
    const dbFile = path.join(getDataDir(), 'students.json');
    if (!fs.existsSync(dbFile)) return [];
    const data = fs.readFileSync(dbFile, 'utf-8');
    const parsed = JSON.parse(data) as StudentRecord[];
    return parsed.filter((s) => !s.id?.startsWith('std_seed_'));
  } catch (err) {
    console.error('Error reading students database:', err);
    return [];
  }
}

export function getAllStudents(): StudentRecord[] {
  if (inMemoryStudents !== null && inMemoryStudents.length > 0) {
    return inMemoryStudents;
  }
  const fromDisk = getAllStudentsFromDisk();
  if (fromDisk.length > 0) {
    inMemoryStudents = fromDisk;
  }
  return inMemoryStudents || [];
}

export function saveStudents(students: StudentRecord[]): void {
  inMemoryStudents = [...students];
  try {
    initDb();
    const dbFile = path.join(getDataDir(), 'students.json');
    const tempFile = `${dbFile}.${Date.now()}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(students, null, 2), 'utf-8');
    fs.renameSync(tempFile, dbFile);
  } catch (err) {
    console.warn('Local file write notice (data safely handled/synced):', err);
  }
}

export async function getFreshStudents(): Promise<StudentRecord[]> {
  const now = Date.now();
  if (inMemoryStudents === null || inMemoryStudents.length === 0 || now - lastSupabaseFetchTime > SUPABASE_CACHE_TTL_MS) {
    try {
      const sbStudents = await fetchAllStudentsFromSupabase();
      if (sbStudents && sbStudents.length > 0) {
        const currentLocal = getAllStudents();
        const sbMap = new Map(sbStudents.map((s) => [s.registration_id.toUpperCase(), s]));
        const merged: StudentRecord[] = sbStudents.map((s) => ({ ...s, synced_to_supabase: true }));
        for (const loc of currentLocal) {
          if (!sbMap.has(loc.registration_id.toUpperCase()) && !loc.synced_to_supabase) {
            merged.push(loc);
          }
        }
        inMemoryStudents = merged;
        lastSupabaseFetchTime = now;
        saveStudents(inMemoryStudents);
        return inMemoryStudents;
      }
    } catch (e) {
      console.warn('Supabase fetch notice:', e);
    }
  }

  return getAllStudents();
}

export function findStudentByGmail(gmail: string): StudentRecord | undefined {
  const normalized = gmail.trim().toLowerCase();
  const students = getAllStudents();
  return students.find((s) => s.gmail.trim().toLowerCase() === normalized);
}

export async function findStudentByGmailAsync(gmail: string): Promise<StudentRecord | undefined> {
  const normalized = gmail.trim().toLowerCase();
  const students = await getFreshStudents();
  const found = students.find((s) => s.gmail.trim().toLowerCase() === normalized);
  if (found) return found;

  const sbStudent = await findStudentInSupabaseByGmail(gmail);
  if (sbStudent) {
    if (!inMemoryStudents) inMemoryStudents = [];
    if (!inMemoryStudents.some((s) => s.gmail.toLowerCase() === normalized)) {
      inMemoryStudents.push({ ...sbStudent, synced_to_supabase: true });
      saveStudents(inMemoryStudents);
    }
    return sbStudent;
  }
  return undefined;
}

export function findStudentByRegistrationId(regId: string): StudentRecord | undefined {
  const normalized = regId.trim().toUpperCase();
  const students = getAllStudents();
  return students.find((s) => s.registration_id.trim().toUpperCase() === normalized);
}

export function generateNextRegistrationId(existingStudents: StudentRecord[], minNumber = 0): string {
  let highestNum = minNumber;
  const prefix = 'MYCHSE-2026-';

  for (const s of existingStudents) {
    if (s.registration_id && s.registration_id.startsWith(prefix)) {
      const numPart = s.registration_id.substring(prefix.length);
      const parsed = parseInt(numPart, 10);
      if (!isNaN(parsed) && parsed > highestNum) {
        highestNum = parsed;
      }
    }
  }

  const nextNum = highestNum + 1;
  const padded = String(nextNum).padStart(5, '0');
  return `${prefix}${padded}`;
}

export async function createStudentWithSupabase(
  data: Omit<StudentRecord, 'id' | 'registration_id' | 'admission_status' | 'registration_date' | 'admission_date' | 'created_at' | 'updated_at' | 'synced_to_supabase'>
): Promise<{ student: StudentRecord; supabaseSynced: boolean; supabaseError?: string }> {
  const students = getAllStudents();

  // 1. Gmail duplicate check (check local first, then Supabase)
  const existingWithGmail = findStudentByGmail(data.gmail);
  if (existingWithGmail) {
    const error: any = new Error('This Gmail ID is already registered.');
    error.code = 'DUPLICATE_GMAIL';
    error.existingRegistrationId = existingWithGmail.registration_id;
    throw error;
  }

  const supabaseExisting = await findStudentInSupabaseByGmail(data.gmail);
  if (supabaseExisting) {
    const error: any = new Error('This Gmail ID is already registered in Supabase database.');
    error.code = 'DUPLICATE_GMAIL';
    error.existingRegistrationId = supabaseExisting.registration_id;
    throw error;
  }

  // Get max registration ID number from Supabase to prevent collisions
  const sbMaxNum = await getMaxRegistrationNumberFromSupabase();
  const registration_id = generateNextRegistrationId(students, sbMaxNum);
  const now = new Date().toISOString();

  const newStudent: StudentRecord = {
    id: 'std_' + crypto.randomUUID(),
    registration_id,
    full_name: data.full_name.trim(),
    gmail: data.gmail.trim().toLowerCase(),
    age: Number(data.age),
    stream: data.stream,
    subject_1: data.subject_1.trim(),
    subject_2: data.subject_2.trim(),
    subject_3: data.subject_3.trim(),
    subject_4: data.subject_4.trim(),
    subject_5: data.subject_5.trim(),
    subject_6: data.subject_6.trim(),
    state: data.state.trim(),
    district: data.district.trim(),
    block: data.block.trim(),
    address: data.address.trim(),
    admission_status: 'Pending',
    registration_date: now,
    admission_date: null,
    created_at: now,
    updated_at: now,
    synced_to_supabase: false
  };

  // Attempt to save to Supabase
  const sbResult = await insertStudentToSupabase(newStudent);
  if (sbResult.success) {
    newStudent.synced_to_supabase = true;
  }

  // Save to persistent local database as well
  students.push(newStudent);
  saveStudents(students);

  return {
    student: newStudent,
    supabaseSynced: sbResult.success,
    supabaseError: sbResult.error
  };
}

export async function findStudentByRegistrationIdAsync(regId: string): Promise<StudentRecord | undefined> {
  const normalized = regId.trim().toUpperCase();
  const students = await getFreshStudents();
  const localStudent = students.find((s) => s.registration_id.trim().toUpperCase() === normalized);
  if (localStudent) {
    return localStudent;
  }

  // If not found in memory, check Supabase directly
  const supabaseStudent = await findStudentInSupabaseByRegistrationId(regId);
  if (supabaseStudent) {
    if (!inMemoryStudents) inMemoryStudents = [];
    if (!inMemoryStudents.some((s) => s.registration_id.toUpperCase() === normalized)) {
      inMemoryStudents.push({ ...supabaseStudent, synced_to_supabase: true });
      saveStudents(inMemoryStudents);
    }
    return supabaseStudent;
  }

  return undefined;
}

export async function syncAllStudentsToSupabase(): Promise<{ total: number; synced: number; failed: number; errors: string[] }> {
  const students = getAllStudents();
  let synced = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const student of students) {
    const res = await insertStudentToSupabase(student);
    if (res.success) {
      student.synced_to_supabase = true;
      synced++;
    } else {
      failed++;
      if (res.error && !errors.includes(res.error)) {
        errors.push(res.error);
      }
    }
  }

  saveStudents(students);
  return { total: students.length, synced, failed, errors };
}

export async function syncFromSupabaseToLocal(): Promise<number> {
  try {
    const supabaseStudents = await fetchAllStudentsFromSupabase();
    if (!supabaseStudents) {
      return 0;
    }
    const localStudents = getAllStudents();
    const localMap = new Map(localStudents.map((s) => [s.registration_id.toUpperCase(), s]));
    const supabaseMap = new Map(supabaseStudents.map((s) => [s.registration_id.toUpperCase(), s]));
    const updatedList: StudentRecord[] = [];
    let changed = false;

    // 1. Process all students from Supabase (source of truth)
    for (const sb of supabaseStudents) {
      const existing = localMap.get(sb.registration_id.toUpperCase());
      if (!existing) {
        updatedList.push({ ...sb, synced_to_supabase: true });
        changed = true;
      } else {
        const merged: StudentRecord = {
          ...existing,
          ...sb,
          admission_status: sb.admission_status,
          admission_date: sb.admission_date,
          updated_at: sb.updated_at || existing.updated_at,
          synced_to_supabase: true
        };
        if (
          existing.admission_status !== sb.admission_status ||
          existing.admission_date !== sb.admission_date ||
          existing.full_name !== sb.full_name
        ) {
          changed = true;
        }
        updatedList.push(merged);
      }
    }

    // 2. Keep any locally created student that hasn't yet reached Supabase
    for (const local of localStudents) {
      if (!supabaseMap.has(local.registration_id.toUpperCase()) && !local.synced_to_supabase) {
        updatedList.push(local);
        changed = true;
      }
    }

    if (changed || updatedList.length !== localStudents.length) {
      saveStudents(updatedList);
    }
    return updatedList.length;
  } catch (err) {
    console.warn('Error syncing from Supabase to local:', err);
    return 0;
  }
}

// -------------------------------------------------------------
// ADMIN MANAGEMENT FUNCTIONS (Strictly operates on SAME "students")
// -------------------------------------------------------------

export async function updateStudentAdmissionStatus(
  registrationId: string,
  newStatus: 'Pending' | 'Approval' | 'Admitted' | 'Rejected',
  adminEmail: string
): Promise<StudentRecord> {
  await syncFromSupabaseToLocal();
  const students = getAllStudents();
  const normalized = registrationId.trim().toUpperCase();
  let index = students.findIndex((s) => s.registration_id.trim().toUpperCase() === normalized);

  if (index === -1) {
    const sbStudent = await findStudentInSupabaseByRegistrationId(registrationId);
    if (sbStudent) {
      students.push({ ...sbStudent, synced_to_supabase: true });
      index = students.length - 1;
    } else {
      throw new Error(`Student with Registration ID ${registrationId} not found.`);
    }
  }

  const student = students[index];
  const oldStatus = student.admission_status;
  const now = new Date().toISOString();

  student.admission_status = newStatus;
  student.updated_at = now;

  if (newStatus === 'Approval' || newStatus === 'Admitted') {
    student.admission_date = now;
  } else {
    student.admission_date = null;
  }

  // Save to persistent storage
  saveStudents(students);

  // Sync update to Supabase
  await updateStudentInSupabase(student);

  // Audit log
  addAuditLog(
    adminEmail,
    newStatus === 'Approval' || newStatus === 'Admitted' ? 'APPROVE_STUDENT' : newStatus === 'Rejected' ? 'REJECT_STUDENT' : 'CHANGE_STATUS',
    `Changed status for ${student.full_name} (${student.registration_id}) from ${oldStatus} to ${newStatus}`,
    student.registration_id
  );

  return student;
}

export async function updateStudentDetails(
  registrationId: string,
  data: Partial<StudentRecord>,
  adminEmail: string
): Promise<StudentRecord> {
  await syncFromSupabaseToLocal();
  const students = getAllStudents();
  const normalized = registrationId.trim().toUpperCase();
  const index = students.findIndex((s) => s.registration_id.trim().toUpperCase() === normalized);

  if (index === -1) {
    throw new Error(`Student with Registration ID ${registrationId} not found.`);
  }

  const student = students[index];

  // If gmail is changed, ensure no other student has it
  if (data.gmail && data.gmail.trim().toLowerCase() !== student.gmail.toLowerCase()) {
    const existing = students.find(
      (s) => s.gmail.toLowerCase() === data.gmail!.trim().toLowerCase() && s.registration_id !== student.registration_id
    );
    if (existing) {
      throw new Error(`Gmail ${data.gmail} is already registered by another student (${existing.registration_id}).`);
    }
    student.gmail = data.gmail.trim().toLowerCase();
  }

  if (data.full_name) student.full_name = data.full_name.trim();
  if (data.age) student.age = Number(data.age);
  if (data.stream) student.stream = data.stream;
  if (data.subject_1) student.subject_1 = data.subject_1.trim();
  if (data.subject_2) student.subject_2 = data.subject_2.trim();
  if (data.subject_3) student.subject_3 = data.subject_3.trim();
  if (data.subject_4) student.subject_4 = data.subject_4.trim();
  if (data.subject_5) student.subject_5 = data.subject_5.trim();
  if (data.subject_6) student.subject_6 = data.subject_6.trim();
  if (data.state) student.state = data.state.trim();
  if (data.district) student.district = data.district.trim();
  if (data.block) student.block = data.block.trim();
  if (data.address) student.address = data.address.trim();

  student.updated_at = new Date().toISOString();

  saveStudents(students);
  await updateStudentInSupabase(student);

  addAuditLog(
    adminEmail,
    'EDIT_STUDENT',
    `Updated details for ${student.full_name} (${student.registration_id})`,
    student.registration_id
  );

  return student;
}

export async function deleteStudent(registrationId: string, adminEmail: string): Promise<boolean> {
  await syncFromSupabaseToLocal();
  const students = getAllStudents();
  const normalized = registrationId.trim().toUpperCase();
  const index = students.findIndex((s) => s.registration_id.trim().toUpperCase() === normalized);

  if (index === -1) {
    throw new Error(`Student with Registration ID ${registrationId} not found.`);
  }

  const [removed] = students.splice(index, 1);
  saveStudents(students);

  await deleteStudentInSupabase(removed.registration_id);

  addAuditLog(
    adminEmail,
    'DELETE_STUDENT',
    `Permanently deleted student ${removed.full_name} (${removed.registration_id})`,
    removed.registration_id
  );

  return true;
}

export async function bulkUpdateAdmissionStatus(
  registrationIds: string[],
  newStatus: 'Pending' | 'Approval' | 'Admitted' | 'Rejected',
  adminEmail: string
): Promise<{ updatedCount: number; updatedIds: string[] }> {
  await syncFromSupabaseToLocal();
  const students = getAllStudents();
  const normalizedIds = new Set(registrationIds.map((id) => id.trim().toUpperCase()));
  const now = new Date().toISOString();
  const updatedIds: string[] = [];

  for (const student of students) {
    if (normalizedIds.has(student.registration_id.trim().toUpperCase())) {
      student.admission_status = newStatus;
      student.updated_at = now;
      if (newStatus === 'Approval' || newStatus === 'Admitted') {
        student.admission_date = now;
      } else {
        student.admission_date = null;
      }
      updatedIds.push(student.registration_id);
      // Attempt supabase update in background
      updateStudentInSupabase(student).catch((e) => console.warn('Supabase bulk update error:', e));
    }
  }

  saveStudents(students);

  addAuditLog(
    adminEmail,
    'BULK_STATUS_CHANGE',
    `Bulk updated ${updatedIds.length} students to ${newStatus}`
  );

  return { updatedCount: updatedIds.length, updatedIds };
}

export async function bulkDeleteStudents(
  registrationIds: string[],
  adminEmail: string
): Promise<{ deletedCount: number; deletedIds: string[] }> {
  await syncFromSupabaseToLocal();
  let students = getAllStudents();
  const normalizedIds = new Set(registrationIds.map((id) => id.trim().toUpperCase()));
  const toDelete = students.filter((s) => normalizedIds.has(s.registration_id.trim().toUpperCase()));
  const deletedIds = toDelete.map((s) => s.registration_id);

  students = students.filter((s) => !normalizedIds.has(s.registration_id.trim().toUpperCase()));
  saveStudents(students);

  for (const id of deletedIds) {
    deleteStudentInSupabase(id).catch((e) => console.warn('Supabase bulk delete error:', e));
  }

  addAuditLog(
    adminEmail,
    'BULK_DELETE',
    `Bulk deleted ${deletedIds.length} students`
  );

  return { deletedCount: deletedIds.length, deletedIds };
}

export function getAdminStatistics(providedStudents?: StudentRecord[]): {
  total: number;
  pending: number;
  approval: number;
  admitted: number;
  rejected: number;
  streams: {
    arts: number;
    science: number;
    commerce: number;
  };
  recentRegistrations: StudentRecord[];
} {
  const students = providedStudents || getAllStudents();

  let pending = 0;
  let approval = 0;
  let rejected = 0;
  let arts = 0;
  let science = 0;
  let commerce = 0;

  for (const s of students) {
    if (s.admission_status === 'Pending') pending++;
    else if (s.admission_status === 'Approval' || s.admission_status === 'Admitted') approval++;
    else if (s.admission_status === 'Rejected') rejected++;

    if (s.stream === 'Arts') arts++;
    else if (s.stream === 'Science') science++;
    else if (s.stream === 'Commerce') commerce++;
  }

  // Sort descending by registration_date for recent registrations
  const recent = [...students]
    .sort((a, b) => new Date(b.registration_date).getTime() - new Date(a.registration_date).getTime())
    .slice(0, 10);

  return {
    total: students.length,
    pending,
    approval,
    admitted: approval,
    rejected,
    streams: {
      arts,
      science,
      commerce
    },
    recentRegistrations: recent
  };
}

export interface StudentQueryOptions {
  search?: string;
  stream?: string;
  status?: string;
  state?: string;
  district?: string;
  block?: string;
  sortBy?: 'registration_date' | 'full_name' | 'stream' | 'admission_status' | 'admission_date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export function getAdminStudentsList(
  options: StudentQueryOptions = {},
  providedStudents?: StudentRecord[]
): {
  students: StudentRecord[];
  totalCount: number;
  page: number;
  totalPages: number;
  limit: number;
  availableStates: string[];
  availableDistricts: string[];
  availableBlocks: string[];
} {
  let list = [...(providedStudents || getAllStudents())];

  // Extract all available location values from existing data
  const availableStates = Array.from(new Set(list.map((s) => s.state).filter(Boolean))).sort();
  const availableDistricts = Array.from(
    new Set(
      list
        .filter((s) => !options.state || s.state.toLowerCase() === options.state.toLowerCase())
        .map((s) => s.district)
        .filter(Boolean)
    )
  ).sort();
  const availableBlocks = Array.from(
    new Set(
      list
        .filter((s) => {
          if (options.state && s.state.toLowerCase() !== options.state.toLowerCase()) return false;
          if (options.district && s.district.toLowerCase() !== options.district.toLowerCase()) return false;
          return true;
        })
        .map((s) => s.block)
        .filter(Boolean)
    )
  ).sort();

  // 1. Search Filter (Full Name, Gmail, Registration ID)
  if (options.search && options.search.trim() !== '') {
    const q = options.search.trim().toLowerCase();
    list = list.filter(
      (s) =>
        s.full_name.toLowerCase().includes(q) ||
        s.gmail.toLowerCase().includes(q) ||
        s.registration_id.toLowerCase().includes(q)
    );
  }

  // 2. Stream Filter
  if (options.stream && options.stream !== 'All') {
    list = list.filter((s) => s.stream.toLowerCase() === options.stream!.toLowerCase());
  }

  // 3. Status Filter
  if (options.status && options.status !== 'All') {
    const filterStatus = options.status.toLowerCase();
    if (filterStatus === 'approval' || filterStatus === 'admitted') {
      list = list.filter(
        (s) =>
          s.admission_status.toLowerCase() === 'approval' ||
          s.admission_status.toLowerCase() === 'admitted'
      );
    } else {
      list = list.filter((s) => s.admission_status.toLowerCase() === filterStatus);
    }
  }

  // 4. State Filter
  if (options.state && options.state !== 'All') {
    list = list.filter((s) => s.state.toLowerCase() === options.state!.toLowerCase());
  }

  // 5. District Filter
  if (options.district && options.district !== 'All') {
    list = list.filter((s) => s.district.toLowerCase() === options.district!.toLowerCase());
  }

  // 6. Block Filter
  if (options.block && options.block !== 'All') {
    list = list.filter((s) => s.block.toLowerCase() === options.block!.toLowerCase());
  }

  // Sorting
  const sortBy = options.sortBy || 'registration_date';
  const sortOrder = options.sortOrder === 'asc' ? 1 : -1;

  list.sort((a, b) => {
    let valA: any = a[sortBy] ?? '';
    let valB: any = b[sortBy] ?? '';

    if (sortBy === 'registration_date' || sortBy === 'admission_date') {
      const timeA = valA ? new Date(valA).getTime() : 0;
      const timeB = valB ? new Date(valB).getTime() : 0;
      return (timeA - timeB) * sortOrder;
    }

    if (typeof valA === 'string') {
      return valA.localeCompare(String(valB)) * sortOrder;
    }

    return (valA - valB) * sortOrder;
  });

  const totalCount = list.length;
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Number(options.limit) || 25);
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const startIndex = (page - 1) * limit;
  const paginatedStudents = list.slice(startIndex, startIndex + limit);

  return {
    students: paginatedStudents,
    totalCount,
    page,
    totalPages,
    limit,
    availableStates,
    availableDistricts,
    availableBlocks
  };
}

