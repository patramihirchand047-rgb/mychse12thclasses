import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Search,
  Home,
  FileText,
  Printer,
  Calendar,
  User,
  BookOpen,
  Clock,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Mail,
  GraduationCap,
  Phone
} from 'lucide-react';
import { Student, PageView } from '../types';

interface SuccessPageProps {
  student: Student;
  onNavigate: (page: PageView) => void;
  onCheckStatusWithId: (id: string) => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({
  student,
  onNavigate,
  onCheckStatusWithId
}) => {
  const [copied, setCopied] = useState(false);
  const [showSlipModal, setShowSlipModal] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(student.registration_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(student.registration_date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* SCREEN VIEW (Hidden during print) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center space-y-8 relative overflow-hidden print:hidden">
        {/* Top subtle ribbon */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-amber-500 to-emerald-500" />

        {/* Icon & Heading */}
        <div className="space-y-4 pt-2">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-100 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 font-['Outfit']">
              Registration Successful!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Your registration has been successfully submitted to MY CHSE 12TH CLASSES.
            </p>
          </div>
        </div>

        {/* Registration ID Highlight Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border-2 border-blue-200 rounded-2xl p-6 max-w-md mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block font-['Outfit']">
            Your Official Registration ID
          </span>
          <div className="flex items-center justify-center gap-3">
            <span
              id="success-registration-id"
              className="text-2xl sm:text-3xl font-black text-blue-950 tracking-wider font-mono select-all"
            >
              {student.registration_id}
            </span>
            <button
              onClick={handleCopyId}
              id="btn-copy-registration-id"
              className="p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-blue-700 transition-colors shadow-xs cursor-pointer"
              title="Copy Registration ID"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          {copied && (
            <span className="text-xs text-emerald-700 font-semibold inline-block">
              ✓ Registration ID copied to clipboard!
            </span>
          )}
        </div>

        {/* Key Student Details Summary Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-left max-w-md mx-auto space-y-3.5 text-xs sm:text-sm">
          <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" /> Student Name
            </span>
            <span className="font-bold text-slate-900">{student.full_name}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-slate-400" /> Stream
            </span>
            <span className="font-bold text-blue-800 bg-blue-100/70 px-2.5 py-0.5 rounded-md">
              {student.stream}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" /> Registration Date
            </span>
            <span className="font-semibold text-slate-800">{formattedDate}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> Registration Status
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              🟡 Pending
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Database Storage
            </span>
            <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Encrypted Cloud Storage
            </span>
          </div>
        </div>

        {/* Mandatory Important Note */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-left max-w-md mx-auto flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="font-bold block mb-0.5 font-['Outfit']">Important Notice</strong>
            Please save your Registration ID. You will need it to check your registration status.
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 max-w-lg mx-auto">
          {/* Requested Button: Print Registration Details */}
          <button
            onClick={handlePrint}
            id="btn-print-registration-details"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs sm:text-sm border border-blue-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 text-blue-700" />
            <span>Print Registration Details</span>
          </button>

          {/* Button: View Registration Slip Modal */}
          <button
            onClick={() => setShowSlipModal(true)}
            id="btn-view-registration"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>View Slip</span>
          </button>

          {/* Button: Check Status */}
          <button
            onClick={() => onCheckStatusWithId(student.registration_id)}
            id="btn-success-check-status"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4 text-amber-300" />
            <span>Check Status</span>
          </button>

          {/* Button: Back to Home */}
          <button
            onClick={() => onNavigate('home')}
            id="btn-back-home"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Student Helpdesk Support Strip */}
        <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50/80 p-4 rounded-2xl">
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

      {/* PRINT-ONLY OFFICIAL REGISTRATION DETAILS DOCUMENT */}
      {/* This renders cleanly when window.print() is executed from either the page button or modal button */}
      <div className="hidden print:block bg-white text-slate-900 p-8 border-2 border-slate-800 rounded-lg printable-area">
        {/* Document Header */}
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
            Official Student Registration Details Slip
          </div>
        </div>

        {/* Primary Identification Bar */}
        <div className="grid grid-cols-2 gap-4 my-6 p-4 bg-slate-50 border border-slate-300 rounded">
          <div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
              Official Registration ID
            </span>
            <span className="text-xl font-black font-mono text-slate-900 tracking-wider">
              {student.registration_id}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
              Current Admission Status
            </span>
            <span className="inline-block font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded text-xs">
              🟡 PENDING VERIFICATION
            </span>
          </div>
        </div>

        {/* Details Section Grid */}
        <div className="space-y-4 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">
            1. Student Information
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[10px]">Full Name:</span>
              <span className="font-bold text-slate-900">{student.full_name}</span>
            </div>
            <div className="p-2 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[10px]">Registered Gmail:</span>
              <span className="font-semibold text-slate-900">{student.gmail}</span>
            </div>
            <div className="p-2 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[10px]">Age:</span>
              <span className="font-semibold text-slate-900">{student.age} Years</span>
            </div>
            <div className="p-2 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[10px]">Registration Timestamp:</span>
              <span className="font-semibold text-slate-900">{formattedDate}</span>
            </div>
          </div>

          <h3 className="font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 pt-2">
            2. Academic Curriculum &amp; Subjects
          </h3>
          <div className="p-2 border border-slate-200 rounded bg-slate-50/50 mb-2">
            <span className="text-slate-500 block text-[10px]">Enrolled CHSE Stream:</span>
            <span className="font-bold text-blue-900 text-sm">{student.stream} (+2 12th)</span>
          </div>

          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-1.5 w-16 text-center font-bold">Sl No.</th>
                <th className="border border-slate-300 p-1.5 font-bold">Subject Category</th>
                <th className="border border-slate-300 p-1.5 font-bold">Selected Subject</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 p-1.5 text-center font-semibold">1</td>
                <td className="border border-slate-300 p-1.5 text-slate-600">Compulsory Subject 1</td>
                <td className="border border-slate-300 p-1.5 font-bold">{student.subject_1}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-1.5 text-center font-semibold">2</td>
                <td className="border border-slate-300 p-1.5 text-slate-600">Compulsory Subject 2</td>
                <td className="border border-slate-300 p-1.5 font-bold">{student.subject_2}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-1.5 text-center font-semibold">3</td>
                <td className="border border-slate-300 p-1.5 text-slate-600">Elective Subject 1</td>
                <td className="border border-slate-300 p-1.5 font-bold">{student.subject_3}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-1.5 text-center font-semibold">4</td>
                <td className="border border-slate-300 p-1.5 text-slate-600">Elective Subject 2</td>
                <td className="border border-slate-300 p-1.5 font-bold">{student.subject_4}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-1.5 text-center font-semibold">5</td>
                <td className="border border-slate-300 p-1.5 text-slate-600">Elective Subject 3</td>
                <td className="border border-slate-300 p-1.5 font-bold">{student.subject_5}</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-1.5 text-center font-semibold">6</td>
                <td className="border border-slate-300 p-1.5 text-slate-600">4th Elective (Optional)</td>
                <td className="border border-slate-300 p-1.5 font-bold">{student.subject_6}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 pt-2">
            3. Address &amp; Geographical Details
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[10px]">State:</span>
              <span className="font-semibold">{student.state}</span>
            </div>
            <div className="p-2 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[10px]">District:</span>
              <span className="font-semibold">{student.district}</span>
            </div>
            <div className="p-2 border border-slate-200 rounded">
              <span className="text-slate-500 block text-[10px]">Block:</span>
              <span className="font-semibold">{student.block}</span>
            </div>
          </div>
          <div className="p-2 border border-slate-200 rounded">
            <span className="text-slate-500 block text-[10px]">Full Residential Address:</span>
            <span className="font-medium text-slate-800">{student.address}</span>
          </div>
        </div>

        {/* Declaration & Institutional Footer */}
        <div className="mt-8 pt-4 border-t border-slate-400 flex items-end justify-between text-[11px] text-slate-600">
          <div className="max-w-xs space-y-1">
            <p className="font-semibold text-slate-800">Important Instructions:</p>
            <p>1. Keep this Registration Details Slip safely for future academic correspondence.</p>
            <p>2. Check your status online using your Registration ID on the MY CHSE 12TH CLASSES portal.</p>
          </div>
          <div className="text-center space-y-8">
            <div className="text-[10px] text-slate-400">System Generated Document</div>
            <div className="border-t border-slate-700 w-44 pt-1 font-semibold text-slate-800">
              Authorized Signatory / Portal Seal
            </div>
          </div>
        </div>
      </div>

      {/* Registration Slip Modal */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in print:hidden">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 text-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="text-left">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-['Outfit']">
                  Official Registration Acknowledgment
                </span>
                <h2 className="text-xl font-extrabold text-blue-950 font-['Outfit']">
                  MY CHSE 12TH CLASSES
                </h2>
                <p className="text-xs text-slate-500">Learn Today • Succeed Tomorrow</p>
              </div>
              <button
                onClick={() => setShowSlipModal(false)}
                className="text-slate-400 hover:text-slate-700 p-2 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Slip Content */}
            <div className="space-y-4 text-xs text-left">
              <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[11px]">Registration ID</span>
                  <span className="font-bold text-blue-900 font-mono text-base">
                    {student.registration_id}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Status</span>
                  <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    🟡 Pending
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                  <span className="text-slate-500 block">Student Name:</span>
                  <span className="font-bold text-slate-900">{student.full_name}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                  <span className="text-slate-500 block">Stream:</span>
                  <span className="font-bold text-slate-900">{student.stream}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                  <span className="text-slate-500 block">State:</span>
                  <span className="font-semibold text-slate-800">{student.state}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                  <span className="text-slate-500 block">District &amp; Block:</span>
                  <span className="font-semibold text-slate-800">
                    {student.district}, {student.block}
                  </span>
                </div>
              </div>

              {/* Subjects in slip */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 space-y-2">
                <span className="font-bold text-slate-700 block">Selected Subjects (6):</span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div>1. {student.subject_1}</div>
                  <div>2. {student.subject_2}</div>
                  <div>3. {student.subject_3}</div>
                  <div>4. {student.subject_4}</div>
                  <div>5. {student.subject_5}</div>
                  <div>6. {student.subject_6}</div>
                </div>
              </div>
            </div>

            {/* Print & Close */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Registration Details</span>
              </button>
              <button
                onClick={() => setShowSlipModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
