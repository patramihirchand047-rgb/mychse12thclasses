export type StreamType = 'Arts' | 'Science' | 'Commerce';

export type AdmissionStatus = 'Pending' | 'Approval' | 'Admitted' | 'Rejected';

export interface Student {
  id: string;
  registration_id: string;
  full_name: string;
  gmail: string;
  age: number;
  stream: StreamType;
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
  admission_status: AdmissionStatus;
  registration_date: string;
  admission_date: string | null;
  synced_to_supabase?: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentRegistrationInput {
  full_name: string;
  gmail: string;
  age: number | string;
  stream: StreamType | '';
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
  confirmed: boolean;
}

export interface PublicStudentStatus {
  registration_id: string;
  full_name: string;
  stream: StreamType;
  registration_date: string;
  admission_status: AdmissionStatus;
  admission_date: string | null;
  synced_to_supabase?: boolean;
}

export interface SupabaseStatusInfo {
  connected: boolean;
  projectId: string;
  supabaseUrl: string;
  tableExists: boolean;
  tableError?: string;
  count?: number;
  sqlSchema: string;
  dashboardSqlUrl: string;
}

export interface SubjectOption {
  id: string;
  name: string;
  category: 'compulsory' | 'elective';
}

export type PageView = 
  | 'home'
  | 'register'
  | 'success'
  | 'status'
  | 'about'
  | 'contact';

export type AdminPageView =
  | 'dashboard'
  | 'students'
  | 'pending'
  | 'approval'
  | 'admitted'
  | 'rejected'
  | 'reports'
  | 'settings';

export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AdminStats {
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
  recentRegistrations: Student[];
}

export interface AdminStudentsResponse {
  students: Student[];
  totalCount: number;
  page: number;
  totalPages: number;
  limit: number;
  availableStates: string[];
  availableDistricts: string[];
  availableBlocks: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  admin_email: string;
  action: string;
  registration_id?: string;
  details: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

