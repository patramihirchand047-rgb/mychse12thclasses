import { StreamType } from '../types';

export interface StreamSubjectConfig {
  stream: StreamType;
  description: string;
  subjects: string[];
}

export const STREAM_SUBJECTS: Record<StreamType, string[]> = {
  Arts: [
    'English',
    'MIL (Odia)',
    'MIL (Hindi)',
    'MIL (Bengali)',
    'MIL (Telugu)',
    'Alternative English',
    'History',
    'Political Science',
    'Economics',
    'Education',
    'Sociology',
    'Logic',
    'Geography',
    'Home Science',
    'Sanskrit',
    'Psychology',
    'Information Technology',
    'Statistics',
    'Anthropology'
  ],
  Science: [
    'English',
    'MIL (Odia)',
    'MIL (Hindi)',
    'Alternative English',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biology (Botany & Zoology)',
    'Information Technology',
    'Computer Science',
    'Statistics',
    'Electronics',
    'Geology',
    'Biotechnology'
  ],
  Commerce: [
    'English',
    'MIL (Odia)',
    'MIL (Hindi)',
    'Alternative English',
    'Accountancy',
    'Business Studies & Management (BSM)',
    'Business Mathematics & Statistics (BMS)',
    'Cost Accounting',
    'Fundamentals of Management Accounting',
    'Banking & Insurance',
    'Information Technology',
    'Rural Development',
    'Commercial Geography'
  ]
};

// Recommended default combinations to make form filling intuitive if student wants recommendations
export const RECOMMENDED_STREAM_SUBJECTS: Record<StreamType, [string, string, string, string, string, string]> = {
  Arts: [
    'English',
    'MIL (Odia)',
    'History',
    'Political Science',
    'Economics',
    'Education'
  ],
  Science: [
    'English',
    'MIL (Odia)',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biology (Botany & Zoology)'
  ],
  Commerce: [
    'English',
    'MIL (Odia)',
    'Accountancy',
    'Business Studies & Management (BSM)',
    'Business Mathematics & Statistics (BMS)',
    'Banking & Insurance'
  ]
};
