import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StudentRecord } from './db.ts';

export const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID || 'ozvjfrpnqcciupluuppc';
export const SUPABASE_URL = process.env.SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_oQk1hTI2WzzARMf7sq9KrA_syp3IuAt';

export const SUPABASE_SQL_SCHEMA = `-- ==========================================================
-- MY CHSE 12TH CLASSES - SUPABASE DATABASE TABLE SETUP
-- Project ID: ${SUPABASE_PROJECT_ID}
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  registration_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  gmail TEXT UNIQUE NOT NULL,
  age INTEGER NOT NULL,
  stream TEXT NOT NULL,
  subject_1 TEXT NOT NULL,
  subject_2 TEXT NOT NULL,
  subject_3 TEXT NOT NULL,
  subject_4 TEXT NOT NULL,
  subject_5 TEXT NOT NULL,
  subject_6 TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  block TEXT NOT NULL,
  address TEXT NOT NULL,
  admission_status TEXT NOT NULL DEFAULT 'Pending',
  registration_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  admission_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Allow public read access to verify student registration status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'students' AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access" ON public.students
      FOR SELECT
      USING (true);
  END IF;
END $$;

-- Allow public insert for submitting new student registrations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'students' AND policyname = 'Allow public insert'
  ) THEN
    CREATE POLICY "Allow public insert" ON public.students
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Allow public update and delete for management
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'students' AND policyname = 'Allow public update'
  ) THEN
    CREATE POLICY "Allow public update" ON public.students
      FOR UPDATE
      USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'students' AND policyname = 'Allow public delete'
  ) THEN
    CREATE POLICY "Allow public delete" ON public.students
      FOR DELETE
      USING (true);
  END IF;
END $$;
`;

// Purged demo IDs to prevent lingering sample records from resurfacing
export const PURGED_DEMO_REG_IDS = new Set(['MYCHSE-2026-00001', 'MYCHSE-2026-00002', 'MYCHSE-2026-00003']);
export const PURGED_DEMO_EMAILS = new Set(['aarav.mohapatra@gmail.com', 'priyanka.das.chse@gmail.com', 'rohan.tripathy2026@gmail.com']);

// Ensure WebSocket constructor exists in serverless environments (like Netlify functions on Node < 22)
// to prevent @supabase/realtime-js from throwing "Node.js detected but native WebSocket not found"
if (typeof globalThis.WebSocket === 'undefined') {
  try {
    // Provide a minimal WebSocket stub for environments without realtime requirement
    (globalThis as any).WebSocket = class ServerlessWebSocketStub {
      static readonly CONNECTING = 0;
      static readonly OPEN = 1;
      static readonly CLOSING = 2;
      static readonly CLOSED = 3;
      readyState = 3;
      send() {}
      close() {}
      addEventListener() {}
      removeEventListener() {}
    };
  } catch {
    // Non-blocking fallback
  }
}

let clientInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!clientInstance) {
    clientInstance = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }
  return clientInstance;
}

export interface SupabaseStatus {
  connected: boolean;
  projectId: string;
  supabaseUrl: string;
  tableExists: boolean;
  tableError?: string;
  count?: number;
  sqlSchema: string;
  dashboardSqlUrl: string;
}

export async function checkSupabaseStatus(): Promise<SupabaseStatus> {
  const dashboardSqlUrl = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql`;
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('students')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return {
          connected: true,
          projectId: SUPABASE_PROJECT_ID,
          supabaseUrl: SUPABASE_URL,
          tableExists: false,
          tableError: "Table 'public.students' does not exist in Supabase schema yet.",
          sqlSchema: SUPABASE_SQL_SCHEMA,
          dashboardSqlUrl
        };
      }
      return {
        connected: false,
        projectId: SUPABASE_PROJECT_ID,
        supabaseUrl: SUPABASE_URL,
        tableExists: false,
        tableError: error.message,
        sqlSchema: SUPABASE_SQL_SCHEMA,
        dashboardSqlUrl
      };
    }

    // Table exists, now get actual count
    const countRes = await supabase.from('students').select('*', { count: 'exact' });

    return {
      connected: true,
      projectId: SUPABASE_PROJECT_ID,
      supabaseUrl: SUPABASE_URL,
      tableExists: true,
      count: countRes.count ?? (data ? data.length : 0),
      sqlSchema: SUPABASE_SQL_SCHEMA,
      dashboardSqlUrl
    };
  } catch (err: any) {
    return {
      connected: false,
      projectId: SUPABASE_PROJECT_ID,
      supabaseUrl: SUPABASE_URL,
      tableExists: false,
      tableError: err?.message || 'Connection error',
      sqlSchema: SUPABASE_SQL_SCHEMA,
      dashboardSqlUrl
    };
  }
}

export async function insertStudentToSupabase(student: StudentRecord): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('students').insert({
      id: student.id,
      registration_id: student.registration_id,
      full_name: student.full_name,
      gmail: student.gmail,
      age: student.age,
      stream: student.stream,
      subject_1: student.subject_1,
      subject_2: student.subject_2,
      subject_3: student.subject_3,
      subject_4: student.subject_4,
      subject_5: student.subject_5,
      subject_6: student.subject_6,
      state: student.state,
      district: student.district,
      block: student.block,
      address: student.address,
      admission_status: student.admission_status,
      registration_date: student.registration_date,
      admission_date: student.admission_date,
      created_at: student.created_at,
      updated_at: student.updated_at
    });

    if (error) {
      console.warn('Supabase insert warning:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase unexpected error during insert:', err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

export async function findStudentInSupabaseByRegistrationId(regId: string): Promise<StudentRecord | null> {
  const normalized = regId.trim().toUpperCase();
  if (PURGED_DEMO_REG_IDS.has(normalized)) {
    return null;
  }
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .ilike('registration_id', normalized)
      .limit(1)
      .maybeSingle();

    if (error || !data || PURGED_DEMO_REG_IDS.has(data.registration_id?.toUpperCase())) {
      return null;
    }

    return data as StudentRecord;
  } catch {
    return null;
  }
}

export async function findStudentInSupabaseByGmail(gmail: string): Promise<StudentRecord | null> {
  const normalized = gmail.trim().toLowerCase();
  if (PURGED_DEMO_EMAILS.has(normalized)) {
    return null;
  }
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .ilike('gmail', normalized)
      .limit(1)
      .maybeSingle();

    if (error || !data || PURGED_DEMO_EMAILS.has(data.gmail?.toLowerCase())) {
      return null;
    }

    return data as StudentRecord;
  } catch {
    return null;
  }
}

export async function updateStudentInSupabase(student: StudentRecord): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('students')
      .update({
        full_name: student.full_name,
        gmail: student.gmail,
        age: student.age,
        stream: student.stream,
        subject_1: student.subject_1,
        subject_2: student.subject_2,
        subject_3: student.subject_3,
        subject_4: student.subject_4,
        subject_5: student.subject_5,
        subject_6: student.subject_6,
        state: student.state,
        district: student.district,
        block: student.block,
        address: student.address,
        admission_status: student.admission_status,
        admission_date: student.admission_date,
        updated_at: student.updated_at
      })
      .eq('registration_id', student.registration_id);

    if (error) {
      console.warn('Supabase update warning:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase unexpected error during update:', err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

export async function deleteStudentInSupabase(registrationId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('registration_id', registrationId);

    if (error) {
      console.warn('Supabase delete warning:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Supabase unexpected error during delete:', err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

export async function fetchAllStudentsFromSupabase(): Promise<StudentRecord[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data) {
      return [];
    }

    return (data as StudentRecord[]).filter(
      (s) => !PURGED_DEMO_REG_IDS.has(s.registration_id?.toUpperCase()) && !PURGED_DEMO_EMAILS.has(s.gmail?.toLowerCase())
    );
  } catch {
    return [];
  }
}

export async function getMaxRegistrationNumberFromSupabase(): Promise<number> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('students')
      .select('registration_id')
      .order('registration_id', { ascending: false })
      .limit(100);

    if (error || !data) return 0;

    const prefix = 'MYCHSE-2026-';
    let max = 0;
    for (const row of data) {
      if (row.registration_id && row.registration_id.startsWith(prefix)) {
        const num = parseInt(row.registration_id.substring(prefix.length), 10);
        if (!isNaN(num) && num > max) {
          max = num;
        }
      }
    }
    return max;
  } catch {
    return 0;
  }
}

