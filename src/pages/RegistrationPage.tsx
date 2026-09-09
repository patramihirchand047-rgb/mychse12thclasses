import React, { useState, useMemo } from 'react';
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  MapPin,
  CheckSquare,
  AlertCircle,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { StreamType, StudentRegistrationInput, Student } from '../types';
import { STREAM_SUBJECTS, RECOMMENDED_STREAM_SUBJECTS } from '../data/subjects';
import { apiSubmitRegistration } from '../services/apiClient';
import {
  ALL_INDIAN_STATES,
  getDistrictsForState,
  getBlocksForDistrict
} from '../data/locations';

interface RegistrationPageProps {
  onSuccess: (student: Student) => void;
  onNavigateStatus: (prefillId?: string) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onSuccess,
  onNavigateStatus
}) => {
  // Form State
  const [formData, setFormData] = useState<StudentRegistrationInput>({
    full_name: '',
    gmail: '',
    age: '',
    stream: '',
    subject_1: '',
    subject_2: '',
    subject_3: '',
    subject_4: '',
    subject_5: '',
    subject_6: '',
    state: 'Odisha', // Default to Odisha for CHSE convenience, user can change to any Indian state
    district: '',
    block: '',
    address: '',
    confirmed: false
  });

  // State search filter for searchable dropdown
  const [stateSearch, setStateSearch] = useState('');

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateGmailError, setDuplicateGmailError] = useState<{
    message: string;
    existingId?: string;
  } | null>(null);

  // Available subjects for the chosen stream
  const currentStreamSubjects = useMemo(() => {
    if (!formData.stream) return [];
    return STREAM_SUBJECTS[formData.stream as StreamType] || [];
  }, [formData.stream]);

  // Selected subjects array for duplicate checking
  const selectedSubjectsList = useMemo(() => {
    return [
      formData.subject_1,
      formData.subject_2,
      formData.subject_3,
      formData.subject_4,
      formData.subject_5,
      formData.subject_6
    ].filter(Boolean);
  }, [
    formData.subject_1,
    formData.subject_2,
    formData.subject_3,
    formData.subject_4,
    formData.subject_5,
    formData.subject_6
  ]);

  // Dependent Districts
  const availableDistricts = useMemo(() => {
    if (!formData.state) return [];
    return getDistrictsForState(formData.state);
  }, [formData.state]);

  // Dependent Blocks
  const availableBlocks = useMemo(() => {
    if (!formData.state || !formData.district) return [];
    return getBlocksForDistrict(formData.state, formData.district);
  }, [formData.state, formData.district]);

  // Filtered States list
  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return ALL_INDIAN_STATES;
    return ALL_INDIAN_STATES.filter((s) =>
      s.toLowerCase().includes(stateSearch.trim().toLowerCase())
    );
  }, [stateSearch]);

  // Handle stream change: RESETS all 6 subjects as specified in requirements
  const handleStreamChange = (newStream: StreamType) => {
    setFormData((prev) => ({
      ...prev,
      stream: newStream,
      subject_1: '',
      subject_2: '',
      subject_3: '',
      subject_4: '',
      subject_5: '',
      subject_6: ''
    }));

    // Clear stream and subject errors
    setErrors((prev) => {
      const next = { ...prev };
      delete next.stream;
      delete next.subjects;
      delete next.subject_1;
      delete next.subject_2;
      delete next.subject_3;
      delete next.subject_4;
      delete next.subject_5;
      delete next.subject_6;
      return next;
    });
  };

  // Auto-fill standard recommended combinations for the stream
  const handleAutoFillSubjects = () => {
    if (!formData.stream) return;
    const rec = RECOMMENDED_STREAM_SUBJECTS[formData.stream as StreamType];
    if (rec) {
      setFormData((prev) => ({
        ...prev,
        subject_1: rec[0],
        subject_2: rec[1],
        subject_3: rec[2],
        subject_4: rec[3],
        subject_5: rec[4],
        subject_6: rec[5]
      }));
      // Clear subject errors
      setErrors((prev) => {
        const next = { ...prev };
        delete next.subjects;
        delete next.subject_1;
        delete next.subject_2;
        delete next.subject_3;
        delete next.subject_4;
        delete next.subject_5;
        delete next.subject_6;
        return next;
      });
    }
  };

  // Handle State Change: RESETS District and Block as required
  const handleStateChange = (newState: string) => {
    setFormData((prev) => ({
      ...prev,
      state: newState,
      district: '',
      block: ''
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next.state;
      delete next.district;
      delete next.block;
      return next;
    });
  };

  // Handle District Change: RESETS Block as required
  const handleDistrictChange = (newDistrict: string) => {
    setFormData((prev) => ({
      ...prev,
      district: newDistrict,
      block: ''
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next.district;
      delete next.block;
      return next;
    });
  };

  // Validate form client-side
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name cannot be empty.';
    } else if (formData.full_name.trim().length < 3) {
      newErrors.full_name = 'Please enter at least 3 characters.';
    }

    // Gmail ID
    const trimmedGmail = formData.gmail.trim().toLowerCase();
    if (!trimmedGmail) {
      newErrors.gmail = 'Gmail ID is required.';
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(trimmedGmail)) {
      newErrors.gmail = 'Please enter a valid Gmail ID ending with @gmail.com.';
    }

    // Age
    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum)) {
      newErrors.age = 'Age is required and must be a number.';
    } else if (ageNum < 14 || ageNum > 35) {
      newErrors.age = 'Please enter a valid student age between 14 and 35.';
    }

    // Stream
    if (!formData.stream) {
      newErrors.stream = 'Please select your stream (Arts, Science, or Commerce).';
    }

    // 6 Subjects
    const subjects = [
      formData.subject_1,
      formData.subject_2,
      formData.subject_3,
      formData.subject_4,
      formData.subject_5,
      formData.subject_6
    ];

    subjects.forEach((subj, idx) => {
      if (!subj) {
        newErrors[`subject_${idx + 1}`] = `Subject ${idx + 1} is required.`;
      }
    });

    // Duplicate subjects check
    const filledSubjects = subjects.filter(Boolean);
    const unique = new Set(filledSubjects);
    if (filledSubjects.length > 0 && unique.size < filledSubjects.length) {
      newErrors.subjects = 'Duplicate subject selection is not allowed. Each of the 6 subjects must be unique.';
    }

    // Location
    if (!formData.state) {
      newErrors.state = 'Please select your State.';
    }
    if (!formData.district) {
      newErrors.district = 'Please select your District.';
    }
    if (!formData.block) {
      newErrors.block = 'Please select your Block.';
    }

    // Address
    if (!formData.address.trim()) {
      newErrors.address = 'Complete residential address is required.';
    } else if (formData.address.trim().length < 8) {
      newErrors.address = 'Please enter a complete address (minimum 8 characters).';
    }

    // Confirmation checkbox
    if (!formData.confirmed) {
      newErrors.confirmed = 'You must confirm that the information provided is correct.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateGmailError(null);

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const errorElement = document.getElementById(`field-${firstErrorKey}`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        gmail: formData.gmail.trim().toLowerCase(),
        age: Number(formData.age),
        full_name: formData.full_name.trim(),
        address: formData.address.trim()
      };

      const data = await apiSubmitRegistration(payload);

      // Success
      if (data.success && data.student) {
        onSuccess(data.student as Student);
      }
    } catch (err: any) {
      if (err.code === 'DUPLICATE_GMAIL') {
        setDuplicateGmailError({
          message: 'This Gmail ID is already registered.',
          existingId: err.existingRegistrationId
        });
        window.scrollTo({ top: 150, behavior: 'smooth' });
        setIsSubmitting(false);
        return;
      }

      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ submit: err.message || 'Registration failed. Please check your inputs.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Official Registration Form • Session 2026
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 font-['Outfit']">
          Student Registration
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Please fill in all details carefully.
        </p>
      </div>

      {/* Duplicate Gmail Notification Banner */}
      {duplicateGmailError && (
        <div
          id="duplicate-gmail-banner"
          className="mb-8 p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-200"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-bold text-amber-950">
                This Gmail ID is already registered.
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                An active registration already exists for this Gmail account. Each student can register once.
                {duplicateGmailError.existingId && (
                  <span className="font-semibold block mt-1">
                    Registration ID: {duplicateGmailError.existingId}
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateStatus(duplicateGmailError.existingId)}
            className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold text-xs shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Check Registration Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* General Submit Error */}
      {errors.submit && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errors.submit}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* ======================================================== */}
        {/* SECTION A — PERSONAL DETAILS */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
                SECTION A — Personal Details
              </h2>
              <p className="text-xs text-slate-500">
                Provide your official identity information
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div id="field-full_name" className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="input-full-name"
                  value={formData.full_name}
                  onChange={(e) => {
                    setFormData({ ...formData, full_name: e.target.value });
                    if (errors.full_name) setErrors({ ...errors, full_name: '' });
                  }}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.full_name
                      ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
              </div>
              {errors.full_name && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.full_name}
                </p>
              )}
            </div>

            {/* Gmail ID */}
            <div id="field-gmail" className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Gmail ID <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="input-gmail"
                  value={formData.gmail}
                  onChange={(e) => {
                    setFormData({ ...formData, gmail: e.target.value });
                    if (errors.gmail) setErrors({ ...errors, gmail: '' });
                    if (duplicateGmailError) setDuplicateGmailError(null);
                  }}
                  placeholder="Enter your Gmail ID"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.gmail
                      ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-500">
                Only valid @gmail.com addresses are accepted.
              </p>
              {errors.gmail && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.gmail}
                </p>
              )}
            </div>

            {/* Age */}
            <div id="field-age" className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Age <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="input-age"
                  min={14}
                  max={35}
                  value={formData.age}
                  onChange={(e) => {
                    setFormData({ ...formData, age: e.target.value });
                    if (errors.age) setErrors({ ...errors, age: '' });
                  }}
                  placeholder="Enter your age"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.age
                      ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                <Calendar className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-500">
                Valid student age between 14 and 35 years.
              </p>
              {errors.age && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.age}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION B — STREAM */}
        {/* ======================================================== */}
        <div id="field-stream" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
                  SECTION B — Academic Stream
                </h2>
                <p className="text-xs text-slate-500">
                  Select your +2 course of study (Arts, Science, or Commerce)
                </p>
              </div>
            </div>
            {formData.stream && (
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                Stream: {formData.stream}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Select Stream <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['Arts', 'Science', 'Commerce'] as StreamType[]).map((streamOption) => {
                const isSelected = formData.stream === streamOption;
                return (
                  <button
                    type="button"
                    key={streamOption}
                    id={`stream-option-${streamOption.toLowerCase()}`}
                    onClick={() => handleStreamChange(streamOption)}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-bold text-slate-900 font-['Outfit'] text-base">
                        {streamOption}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {streamOption === 'Arts' && 'Humanities & Social Sciences'}
                      {streamOption === 'Science' && 'Physics, Chem, Math, Bio'}
                      {streamOption === 'Commerce' && 'Accountancy & Management'}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-amber-700 font-medium">
              Note: Changing your stream automatically resets all 6 subject selections.
            </p>
            {errors.stream && (
              <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.stream}
              </p>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION C — SIX SUBJECTS */}
        {/* ======================================================== */}
        <div id="field-subjects" className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
                SECTION C — Six Subjects Selection
              </h2>
              <p className="text-xs text-slate-500">
                Select exactly six distinct subjects required for CHSE curriculum
              </p>
            </div>

            {formData.stream && (
              <button
                type="button"
                id="btn-autofill-subjects"
                onClick={handleAutoFillSubjects}
                className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-200 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Fill Standard {formData.stream} Subjects
              </button>
            )}
          </div>

          {!formData.stream ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">
                Please select your Stream first in Section B
              </p>
              <p className="text-xs text-slate-500">
                Subject options dynamically populate based on Arts, Science, or Commerce.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Duplicate subject warning */}
              {errors.subjects && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errors.subjects}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const fieldKey = `subject_${num}` as keyof StudentRegistrationInput;
                  const currentVal = formData[fieldKey] as string;
                  const errorMsg = errors[fieldKey];

                  return (
                    <div key={num} id={`field-subject_${num}`} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Subject {num} <span className="text-rose-600">*</span>
                        </label>
                        {num === 1 && (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            Compulsory 1
                          </span>
                        )}
                        {num === 2 && (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            Compulsory 2 (MIL)
                          </span>
                        )}
                        {num >= 3 && (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            Elective {num - 2}
                          </span>
                        )}
                      </div>

                      <select
                        id={`select-subject-${num}`}
                        value={currentVal}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            [fieldKey]: val
                          }));
                          // Clear specific error
                          if (errors[fieldKey]) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next[fieldKey];
                              delete next.subjects;
                              return next;
                            });
                          }
                        }}
                        className={`w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none transition-all ${
                          errorMsg || errors.subjects
                            ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                            : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                        }`}
                      >
                        <option value="">-- Select Subject {num} --</option>
                        {currentStreamSubjects.map((subj) => {
                          // Prevent selecting duplicate: disable if selected in ANOTHER subject dropdown
                          const isSelectedElsewhere =
                            selectedSubjectsList.includes(subj) && currentVal !== subj;

                          return (
                            <option
                              key={subj}
                              value={subj}
                              disabled={isSelectedElsewhere}
                            >
                              {subj} {isSelectedElsewhere ? '(Already selected)' : ''}
                            </option>
                          );
                        })}
                      </select>

                      {errorMsg && (
                        <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errorMsg}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  According to CHSE guidelines, Subject 1 is English, Subject 2 is Modern Indian Language (Odia/Hindi/Alt English), and Subjects 3-6 are stream electives. All 6 must be unique.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SECTION D — LOCATION SYSTEM (State -> District -> Block) */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Outfit']">
                SECTION D — Location &amp; Residential Address
              </h2>
              <p className="text-xs text-slate-500">
                3-level dependent location selection (State → District → Block)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Level 1: State */}
            <div id="field-state" className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Select State <span className="text-rose-600">*</span>
              </label>
              <select
                id="select-state"
                value={formData.state}
                onChange={(e) => handleStateChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none transition-all ${
                  errors.state
                    ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                }`}
              >
                <option value="">-- Select State --</option>
                {ALL_INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st} {st === 'Odisha' ? '(CHSE Odisha)' : ''}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.state}
                </p>
              )}
            </div>

            {/* Level 2: District */}
            <div id="field-district" className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Select District <span className="text-rose-600">*</span>
                </label>
                {!formData.state && (
                  <span className="text-[10px] text-amber-700 font-medium">Requires State</span>
                )}
              </div>
              <select
                id="select-district"
                disabled={!formData.state}
                value={formData.district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                  !formData.state
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : errors.district
                    ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                    : 'bg-white border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                }`}
              >
                <option value="">
                  {formData.state
                    ? `-- Select District (${availableDistricts.length} available) --`
                    : '-- Initially disabled --'}
                </option>
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.district}
                </p>
              )}
            </div>

            {/* Level 3: Block */}
            <div id="field-block" className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Select Block <span className="text-rose-600">*</span>
                </label>
                {!formData.district && (
                  <span className="text-[10px] text-amber-700 font-medium">Requires District</span>
                )}
              </div>
              <select
                id="select-block"
                disabled={!formData.district}
                value={formData.block}
                onChange={(e) => {
                  setFormData({ ...formData, block: e.target.value });
                  if (errors.block) setErrors({ ...errors, block: '' });
                }}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                  !formData.district
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : errors.block
                    ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                    : 'bg-white border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
                }`}
              >
                <option value="">
                  {formData.district
                    ? `-- Select Block (${availableBlocks.length} available) --`
                    : '-- Initially disabled --'}
                </option>
                {availableBlocks.map((blk) => (
                  <option key={blk} value={blk}>
                    {blk}
                  </option>
                ))}
              </select>
              {errors.block && (
                <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.block}
                </p>
              )}
            </div>
          </div>

          {/* Full Address Textarea */}
          <div id="field-address" className="space-y-1.5 pt-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Full Address <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="textarea-address"
              rows={3}
              value={formData.address}
              onChange={(e) => {
                setFormData({ ...formData, address: e.target.value });
                if (errors.address) setErrors({ ...errors, address: '' });
              }}
              placeholder="Enter your complete residential address (Village/Town, Street, Post Office, Police Station, PIN Code, etc.)"
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                errors.address
                  ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
              }`}
            />
            <p className="text-[11px] text-slate-500">
              Provide complete postal details for official dispatch and correspondence.
            </p>
            {errors.address && (
              <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.address}
              </p>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION E — FORM SUMMARY & CONFIRMATION */}
        {/* ======================================================== */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-['Outfit']">
                  Please Check Your Details
                </h2>
                <p className="text-xs text-slate-400">
                  Review all entered details carefully before final registration
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300">
              Pre-Submission Summary
            </span>
          </div>

          {/* Live Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block mb-1">Full Name</span>
              <span className="font-bold text-slate-100 text-sm">
                {formData.full_name.trim() || '—'}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block mb-1">Gmail ID</span>
              <span className="font-bold text-slate-100 text-sm break-all">
                {formData.gmail.trim() || '—'}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block mb-1">Age</span>
              <span className="font-bold text-slate-100 text-sm">
                {formData.age ? `${formData.age} Years` : '—'}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
              <span className="text-slate-400 block mb-1">Stream</span>
              <span className="font-bold text-amber-400 text-sm">
                {formData.stream || '—'}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 sm:col-span-2">
              <span className="text-slate-400 block mb-1">State, District &amp; Block</span>
              <span className="font-bold text-slate-100 text-sm">
                {formData.state ? `${formData.state}` : '—'}
                {formData.district ? ` • ${formData.district}` : ''}
                {formData.block ? ` • ${formData.block}` : ''}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 sm:col-span-3">
              <span className="text-slate-400 block mb-1.5">Six Chosen Subjects</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const s = formData[`subject_${num}` as keyof StudentRegistrationInput] as string;
                  return (
                    <div key={num} className="bg-slate-900/60 px-2.5 py-1.5 rounded-lg text-slate-300">
                      <span className="text-slate-500 mr-1.5 font-bold">Sub {num}:</span>
                      <span className="font-medium text-slate-200">{s || 'Not selected'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 sm:col-span-3">
              <span className="text-slate-400 block mb-1">Complete Address</span>
              <span className="font-medium text-slate-200 text-xs">
                {formData.address.trim() || '—'}
              </span>
            </div>
          </div>

          {/* Mandatory Confirmation Checkbox */}
          <div id="field-confirmed" className="pt-2 border-t border-slate-800 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                id="checkbox-confirm"
                checked={formData.confirmed}
                onChange={(e) => {
                  setFormData({ ...formData, confirmed: e.target.checked });
                  if (errors.confirmed) setErrors({ ...errors, confirmed: '' });
                }}
                className="w-5 h-5 mt-0.5 rounded border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer accent-blue-600"
              />
              <span className="text-xs sm:text-sm text-slate-300 font-medium select-none group-hover:text-white transition-colors">
                I confirm that the information provided by me is correct.
              </span>
            </label>
            {errors.confirmed && (
              <p className="text-xs text-rose-400 flex items-center gap-1 font-semibold pl-8">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.confirmed}
              </p>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SUBMIT BUTTON */}
        {/* ======================================================== */}
        <div className="pt-2">
          <button
            type="submit"
            id="btn-submit-registration"
            disabled={isSubmitting}
            className={`w-full py-4 px-8 rounded-xl font-extrabold text-base transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer ${
              isSubmitting
                ? 'bg-blue-800 text-blue-200 cursor-not-allowed opacity-90'
                : 'bg-blue-700 hover:bg-blue-800 text-white hover:shadow-xl hover:shadow-blue-700/30'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                <span>Submitting Registration...</span>
              </>
            ) : (
              <>
                <span>Register Now</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-500 mt-3">
            Upon submission, a unique Registration ID will be generated and your admission status set to Pending for review.
          </p>
        </div>
      </form>
    </div>
  );
};
