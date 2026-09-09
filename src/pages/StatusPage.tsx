import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  BookOpen,
  Hash,
  Loader2,
  Printer,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { PublicStudentStatus, PageView } from '../types';
import { apiCheckStatus } from '../services/apiClient';

interface StatusPageProps {
  initialRegistrationId?: string;
  onNavigate: (page: PageView) => void;
}

export const StatusPage: React.FC<StatusPageProps> = ({
  initialRegistrationId = '',
  onNavigate
}) => {
  const [searchId, setSearchId] = useState(initialRegistrationId);
  const [isLoading, setIsLoading] = useState(false);
  const [statusResult, setStatusResult] = useState<PublicStudentStatus | null>(null);
  const [notFoundError, setNotFoundError] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [inputError, setInputError] = useState('');

  // Auto-search if initialRegistrationId was passed
  useEffect(() => {
    if (initialRegistrationId) {
      setSearchId(initialRegistrationId);
      performStatusLookup(initialRegistrationId);
    }
  }, [initialRegistrationId]);

  const performStatusLookup = async (idToSearch: string) => {
    const trimmed = idToSearch.trim().toUpperCase();
    if (!trimmed) {
      setInputError('Please enter a Registration ID.');
      return;
    }

    setInputError('');
    setIsLoading(true);
    setStatusResult(null);
    setNotFoundError(null);

    try {
      const data = await apiCheckStatus(trimmed);
      setStatusResult(data as PublicStudentStatus);
    } catch (err: any) {
      console.error('Status lookup error:', err);
      if (err.message && (err.message.includes('not found') || err.message.includes('check your ID') || err.message.includes('check your Registration ID'))) {
        setNotFoundError({
          title: 'Registration ID not found.',
          message: err.message || 'Please check your Registration ID and try again.'
        });
      } else {
        setInputError(err.message || 'Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performStatusLookup(searchId);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Top Search Controls (Hidden in Print) */}
      <div className="space-y-8 print:hidden">
        {/* Page Title & Subtitle */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            Official Verification Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 font-['Outfit']">
            Check Registration Status
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            Enter your Registration ID to view your current registration status.
          </p>
        </div>

        {/* Search Input Box Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="input-search-reg-id"
                className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-['Outfit']"
              >
                Registration ID <span className="text-rose-600">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="input-search-reg-id"
                    value={searchId}
                    onChange={(e) => {
                      setSearchId(e.target.value.toUpperCase());
                      if (inputError) setInputError('');
                      if (notFoundError) setNotFoundError(null);
                    }}
                    placeholder="Enter Registration ID (e.g. MYCHSE-2026-00001)"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 text-sm font-mono tracking-wider focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 uppercase"
                  />
                  <Hash className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  id="btn-check-status-submit"
                  disabled={isLoading}
                  className="px-7 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 text-amber-300" />
                      <span>Check Status</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {inputError && (
              <p className="text-xs text-rose-600 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                {inputError}
              </p>
            )}
          </form>
        </div>

        {/* NOT FOUND ERROR STATE */}
        {notFoundError && (
          <div
            id="status-not-found-card"
            className="bg-white rounded-3xl p-8 border-2 border-rose-200 shadow-sm text-center space-y-4 animate-in fade-in"
          >
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border-2 border-rose-100">
              <XCircle className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-rose-950 font-['Outfit']">
                {notFoundError.title}
              </h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                {notFoundError.message}
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
              <button
                onClick={() => onNavigate('register')}
                className="text-blue-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Need to register first? Click here <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* STATUS RESULT CARD (Interactive Screen View) */}
      {statusResult && (
        <div
          id="status-result-card"
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 animate-in fade-in print:hidden"
        >
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-['Outfit']">
                Student Registration
              </span>
              <h2 className="text-2xl font-black text-blue-950 font-['Outfit']">
                {statusResult.full_name}
              </h2>
            </div>

            {/* Dynamic Status Badge */}
            <div className="self-start sm:self-auto">
              {statusResult.admission_status === 'Pending' && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-900 border-2 border-amber-300 shadow-xs font-bold text-sm">
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>🟡 Pending</span>
                </div>
              )}
              {(statusResult.admission_status === 'Approval' || statusResult.admission_status === 'Admitted') && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-900 border-2 border-emerald-400 shadow-xs font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>🟢 Approval</span>
                </div>
              )}
              {statusResult.admission_status === 'Rejected' && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-900 border-2 border-rose-300 shadow-xs font-bold text-sm">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>🔴 Rejected</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Specific Official Message as required */}
          <div
            className={`p-5 rounded-2xl border text-left flex items-start gap-3.5 ${
              statusResult.admission_status === 'Approval' || statusResult.admission_status === 'Admitted'
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : statusResult.admission_status === 'Rejected'
                ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}
          >
            {(statusResult.admission_status === 'Approval' || statusResult.admission_status === 'Admitted') && (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            )}
            {statusResult.admission_status === 'Pending' && (
              <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            )}
            {statusResult.admission_status === 'Rejected' && (
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            )}

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider block font-['Outfit'] opacity-75">
                Official Status Notification
              </span>
              <p className="text-sm sm:text-base font-semibold leading-relaxed">
                {statusResult.admission_status === 'Pending' &&
                  'Your registration is currently under review.'}
                {(statusResult.admission_status === 'Approval' || statusResult.admission_status === 'Admitted') &&
                  'Congratulations! Your admission has received official Approval for MY CHSE 12TH CLASSES.'}
                {statusResult.admission_status === 'Rejected' &&
                  'Your registration status has been marked as rejected. Please contact the administration for more information.'}
              </p>
            </div>
          </div>

          {/* Verified Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-left">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 font-medium block mb-1">Registration ID</span>
              <span className="font-mono font-bold text-slate-900 text-base">
                {statusResult.registration_id}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 font-medium block mb-1">Student Name</span>
              <span className="font-bold text-slate-900 text-base">
                {statusResult.full_name}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 font-medium block mb-1">Stream</span>
              <span className="font-bold text-blue-800 text-base">
                {statusResult.stream}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 font-medium block mb-1">Registration Date</span>
              <span className="font-semibold text-slate-800 text-sm">
                {new Date(statusResult.registration_date).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>

            {/* If status is Approval/Admitted, display Admission Date as required */}
            {(statusResult.admission_status === 'Approval' || statusResult.admission_status === 'Admitted') && statusResult.admission_date && (
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 sm:col-span-2">
                <span className="text-emerald-800 font-bold block mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Approval / Admission Date
                </span>
                <span className="font-bold text-emerald-950 text-base">
                  {new Date(statusResult.admission_date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Action Row with Requested Print Registration Details Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified CHSE Record
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Cloud Database Synced
              </span>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              id="btn-print-registration-details"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Print Registration Details</span>
            </button>
          </div>

          {/* Students Help Desk Support Bar */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50/80 p-3.5 rounded-xl">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Phone className="w-4 h-4 text-blue-700" />
              <span>Students Help Desk:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4">
              <a
                href="tel:8917408498"
                className="font-bold text-blue-700 hover:text-blue-900 transition-colors"
              >
                📞 8917408498
              </a>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <a
                href="mailto:patramihirchand66@gmail.com"
                className="font-medium text-slate-800 hover:text-blue-700 transition-colors"
              >
                ✉️ patramihirchand66@gmail.com
              </a>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Bhubaneswar, India
              </span>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY OFFICIAL RECORD SLIP */}
      {statusResult && (
        <div className="hidden print:block bg-white text-slate-900 p-8 border-2 border-slate-800 rounded-lg printable-area">
          {/* Header */}
          <div className="text-center pb-6 border-b-2 border-slate-800 space-y-1">
            <div className="flex items-center justify-center gap-2 text-blue-900 font-bold text-sm uppercase tracking-wider">
              <GraduationCap className="w-5 h-5 text-amber-600" />
              Council of Higher Secondary Education (+2)
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-['Outfit'] uppercase tracking-tight">
              MY CHSE 12TH CLASSES
            </h1>
            <p className="text-xs font-semibold text-slate-700">
              Learn Today • Succeed Tomorrow
            </p>
            <div className="inline-block mt-2 px-3 py-1 bg-slate-100 border border-slate-400 rounded text-xs font-bold uppercase tracking-widest text-slate-900">
              Official Registration Status &amp; Admission Slip
            </div>
          </div>

          {/* Registration ID & Status */}
          <div className="grid grid-cols-2 gap-4 my-6 p-4 bg-slate-50 border border-slate-300 rounded">
            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                Registration ID
              </span>
              <span className="text-xl font-black font-mono text-slate-900 tracking-wider">
                {statusResult.registration_id}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                Official Admission Status
              </span>
              <span
                className={`inline-block font-bold px-3 py-1 rounded text-xs border ${
                  statusResult.admission_status === 'Approval' || statusResult.admission_status === 'Admitted'
                    ? 'text-emerald-950 bg-emerald-100 border-emerald-400'
                    : statusResult.admission_status === 'Rejected'
                    ? 'text-rose-950 bg-rose-100 border-rose-400'
                    : 'text-amber-950 bg-amber-100 border-amber-400'
                }`}
              >
                {(statusResult.admission_status === 'Approval' || statusResult.admission_status === 'Admitted') && '🟢 APPROVAL'}
                {statusResult.admission_status === 'Pending' && '🟡 PENDING REVIEW'}
                {statusResult.admission_status === 'Rejected' && '🔴 REJECTED'}
              </span>
            </div>
          </div>

          {/* Student Details Grid */}
          <div className="space-y-4 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">
              Verified Student Record
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">Student Name:</span>
                <span className="font-bold text-slate-900 text-sm">{statusResult.full_name}</span>
              </div>
              <div className="p-2.5 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">Enrolled Stream:</span>
                <span className="font-bold text-blue-900 text-sm">{statusResult.stream}</span>
              </div>
              <div className="p-2.5 border border-slate-200 rounded">
                <span className="text-slate-500 block text-[10px]">Registration Date:</span>
                <span className="font-semibold text-slate-900">
                  {new Date(statusResult.registration_date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              {statusResult.admission_date && (
                <div className="p-2.5 border border-emerald-300 bg-emerald-50/50 rounded">
                  <span className="text-emerald-700 block text-[10px] font-bold">
                    Official Approval / Admission Date:
                  </span>
                  <span className="font-bold text-emerald-950">
                    {new Date(statusResult.admission_date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Official Status Remarks */}
            <div className="p-3 border border-slate-300 rounded bg-slate-50">
              <span className="font-bold text-slate-700 block text-[11px] mb-1">
                Portal Status Notification Remarks:
              </span>
              <p className="text-slate-900 font-medium italic">
                {statusResult.admission_status === 'Pending' &&
                  'Your registration is currently under review.'}
                {(statusResult.admission_status === 'Approval' || statusResult.admission_status === 'Admitted') &&
                  'Congratulations! Your admission has received official Approval for MY CHSE 12TH CLASSES.'}
                {statusResult.admission_status === 'Rejected' &&
                  'Your registration status has been marked as rejected. Please contact the administration for more information.'}
              </p>
            </div>
          </div>

          {/* Verification Footer */}
          <div className="mt-10 pt-4 border-t border-slate-400 flex items-end justify-between text-[11px] text-slate-600">
            <div className="max-w-xs space-y-1">
              <p className="font-semibold text-slate-800">Verification Seal:</p>
              <p>Generated via MY CHSE 12TH CLASSES online verification system.</p>
              <p>Printed on: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div className="text-center space-y-8">
              <div className="text-[10px] text-slate-400">Computer Generated Copy</div>
              <div className="border-t border-slate-700 w-44 pt-1 font-semibold text-slate-800">
                Authorized Signatory / Seal
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
