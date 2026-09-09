import { supabase } from '../lib/supabaseClient';
import { Student } from '../types';

export interface SubmitRegistrationResult {
  success: boolean;
  student: {
    registration_id: string;
    full_name: string;
    stream: string;
    registration_date: string;
    admission_status: string;
  };
  supabase_synced?: boolean;
}

export interface RegistrationStatusResult {
  registration_id: string;
  full_name: string;
  stream: string;
  registration_date: string;
  admission_status: 'Pending' | 'Approval' | 'Admitted' | 'Rejected';
  admission_date: string | null;
  synced_to_supabase?: boolean;
}

// Generate fallback registration ID if backend API is unavailable (static Netlify Drop)
async function generateNextRegistrationId(): Promise<string> {
  try {
    const { data } = await supabase
      .from('students')
      .select('registration_id')
      .order('registration_date', { ascending: false })
      .limit(100);

    let maxNum = 3;
    if (data && data.length > 0) {
      for (const row of data) {
        const match = row.registration_id?.match(/MYCHSE-2026-(\d+)/i);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (num > maxNum && num < 90000) {
            maxNum = num;
          }
        }
      }
    }
    const nextNum = maxNum + 1;
    return `MYCHSE-2026-${String(nextNum).padStart(5, '0')}`;
  } catch {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `MYCHSE-2026-${randomSuffix}`;
  }
}

/**
 * Submit student registration:
 * 1. Tries Express backend endpoint (/api/students/register)
 * 2. If 404 (static hosting like Netlify Drop), seamlessly submits directly to Supabase Cloud
 */
export async function apiSubmitRegistration(formData: any): Promise<SubmitRegistrationResult> {
  try {
    const res = await fetch('/api/students/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.status === 404) {
      // Static Netlify Drop detected: fallback to direct Supabase
      return await directSupabaseRegister(formData);
    }

    const data = await res.json();
    if (!res.ok) {
      const err: any = new Error(data.error || 'Registration failed');
      err.code = data.code;
      err.status = res.status;
      err.errors = data.errors;
      err.existingRegistrationId = data.existingRegistrationId;
      throw err;
    }

    return data;
  } catch (err: any) {
    if (err.status && err.status !== 404) {
      throw err;
    }
    // Network / static 404 fallback
    return await directSupabaseRegister(formData);
  }
}

async function directSupabaseRegister(formData: any): Promise<SubmitRegistrationResult> {
  const normalizedGmail = formData.gmail.trim().toLowerCase();

  // Check duplicate Gmail in Supabase
  const { data: existing } = await supabase
    .from('students')
    .select('registration_id, full_name')
    .ilike('gmail', normalizedGmail)
    .maybeSingle();

  if (existing) {
    const error: any = new Error('This Gmail ID is already registered.');
    error.code = 'DUPLICATE_GMAIL';
    error.existingRegistrationId = existing.registration_id;
    throw error;
  }

  const registration_id = await generateNextRegistrationId();
  const now = new Date().toISOString();
  const newStudent: Student = {
    id: 'std_' + (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2)),
    registration_id,
    full_name: formData.full_name.trim(),
    gmail: normalizedGmail,
    age: Number(formData.age),
    stream: formData.stream,
    subject_1: formData.subject_1,
    subject_2: formData.subject_2,
    subject_3: formData.subject_3,
    subject_4: formData.subject_4,
    subject_5: formData.subject_5,
    subject_6: formData.subject_6,
    state: formData.state,
    district: formData.district,
    block: formData.block,
    address: formData.address.trim(),
    admission_status: 'Pending',
    registration_date: now,
    admission_date: null,
    created_at: now,
    updated_at: now,
    synced_to_supabase: true
  };

  const { error: insertErr } = await supabase.from('students').insert(newStudent);
  if (insertErr) {
    console.error('Direct Supabase insert error:', insertErr);
  }

  return {
    success: true,
    supabase_synced: !insertErr,
    student: {
      registration_id: newStudent.registration_id,
      full_name: newStudent.full_name,
      stream: newStudent.stream,
      registration_date: newStudent.registration_date,
      admission_status: newStudent.admission_status
    }
  };
}

/**
 * Check student admission status:
 * 1. Tries backend endpoint (/api/students/status/:regId)
 * 2. If 404 (static hosting), queries Supabase Cloud directly
 */
export async function apiCheckStatus(regId: string): Promise<RegistrationStatusResult> {
  const normalizedId = regId.trim().toUpperCase();

  try {
    const res = await fetch(`/api/students/status/${encodeURIComponent(normalizedId)}`);
    if (res.status === 404) {
      const data = await res.json().catch(() => ({}));
      if (data.message && !data.message.includes('Cannot GET')) {
        throw new Error(data.error || 'Registration ID not found.');
      }
      // Static Netlify Drop detected: fallback to Supabase
      return await directSupabaseCheckStatus(normalizedId);
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Registration ID not found.');
    }

    return await res.json();
  } catch (err: any) {
    if (err.message && err.message !== 'Failed to fetch' && !err.message.includes('404')) {
      throw err;
    }
    return await directSupabaseCheckStatus(normalizedId);
  }
}

async function directSupabaseCheckStatus(regId: string): Promise<RegistrationStatusResult> {
  const { data, error } = await supabase
    .from('students')
    .select('registration_id, full_name, stream, registration_date, admission_status, admission_date')
    .ilike('registration_id', regId.trim())
    .maybeSingle();

  if (error || !data) {
    throw new Error('Registration ID not found. Please check your ID and try again.');
  }

  return {
    registration_id: data.registration_id,
    full_name: data.full_name,
    stream: data.stream,
    registration_date: data.registration_date,
    admission_status: data.admission_status || 'Pending',
    admission_date: data.admission_date,
    synced_to_supabase: true
  };
}

/**
 * Real-time check if Gmail is already registered
 */
export async function apiCheckGmail(gmail: string): Promise<{ isRegistered: boolean; registration_id?: string }> {
  const normalized = gmail.trim().toLowerCase();
  try {
    const res = await fetch(`/api/students/check-gmail?gmail=${encodeURIComponent(normalized)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  const { data } = await supabase
    .from('students')
    .select('registration_id')
    .ilike('gmail', normalized)
    .maybeSingle();

  if (data) {
    return { isRegistered: true, registration_id: data.registration_id };
  }
  return { isRegistered: false };
}
