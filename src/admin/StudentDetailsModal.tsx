import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Calendar,
  BookOpen,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Printer,
  ShieldCheck,
  ChevronDown,
  GraduationCap
} from 'lucide-react';
import { Student, AdmissionStatus } from '../types';

interface StudentDetailsModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onAdmit: (student: Student) => void;
  onReject: (student: Student) => void;
  onChangeStatus: (student: Student, newStatus: AdmissionStatus) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  student,
  isOpen,
  onClose,
  onAdmit,
  onReject,
  onChangeStatus,
  onEdit,
  onDelete
}) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    try {
      window.focus();
      window.print();
    } catch (err) {
      console.error('Print failed:', err);
    }
  };

  const formattedRegDate = student.registration_date
    ? new Date(student.registration_date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'N/A';

  const formattedAdmDate = student.admission_date
    ? new Date(student.admission_date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : null;

  return (
    <>
      {/* ON-SCREEN INTERACTIVE MODAL (Hidden in print) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in print:hidden">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl relative my-8 overflow-hidden animate-in zoom-in-95">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-950 to-blue-900 px-6 sm:px-8 py-5 text-white flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-['Outfit']">
              Official Student Dossier
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight">
              {student.full_name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-blue-200 font-mono">
              <span>{student.registration_id}</span>
              <span>•</span>
              <span className="capitalize">{student.stream} Stream</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-blue-300 hover:text-white hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Status & Admission Action Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase font-['Outfit']">
                Current Status:
              </span>
              {student.admission_status === 'Pending' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  🟡 Pending
                </span>
              )}
              {(student.admission_status === 'Approval' || student.admission_status === 'Admitted') && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  🟢 Approval
                </span>
              )}
              {student.admission_status === 'Rejected' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  🔴 Rejected
                </span>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2 relative">
              {student.admission_status !== 'Approval' && student.admission_status !== 'Admitted' && (
                <button
                  type="button"
                  onClick={() => onAdmit(student)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approval</span>
                </button>
              )}

              {student.admission_status !== 'Rejected' && (
                <button
                  type="button"
                  onClick={() => onReject(student)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              )}

              {/* Status change dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Change Status</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showStatusDropdown && (
                  <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-20 text-xs font-semibold">
                    <button
                      onClick={() => {
                        setShowStatusDropdown(false);
                        onChangeStatus(student, 'Pending');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-amber-50 text-amber-900 flex items-center gap-2 cursor-pointer"
                    >
                      <span>🟡 Pending</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowStatusDropdown(false);
                        onChangeStatus(student, 'Approval');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 text-emerald-900 flex items-center gap-2 cursor-pointer"
                    >
                      <span>🟢 Approval</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowStatusDropdown(false);
                        onChangeStatus(student, 'Rejected');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-900 flex items-center gap-2 cursor-pointer"
                    >
                      <span>🔴 Rejected</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 1: Registration Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Outfit'] border-b border-slate-100 pb-1">
              Registration Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-slate-500">Registration ID</span>
                <div className="font-mono font-bold text-blue-900 text-sm">
                  {student.registration_id}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-slate-500">Registration Date</span>
                <div className="font-bold text-slate-800 text-sm">
                  {new Date(student.registration_date).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-slate-500">Admission Status</span>
                <div className="font-bold text-slate-800 text-sm">
                  {student.admission_status}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-slate-500">Approval / Admission Date</span>
                <div className="font-bold text-slate-800 text-sm">
                  {student.admission_date
                    ? new Date(student.admission_date).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Not Approved Yet'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Outfit'] border-b border-slate-100 pb-1">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5 sm:col-span-2">
                <span className="text-slate-500">Full Name</span>
                <div className="font-bold text-slate-900 text-sm">{student.full_name}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-slate-500">Age</span>
                <div className="font-bold text-slate-900 text-sm">{student.age} Years</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5 sm:col-span-3">
                <span className="text-slate-500">Gmail ID</span>
                <div className="font-bold text-blue-900 text-sm font-mono">{student.gmail}</div>
              </div>
            </div>
          </div>

          {/* Section 3: Academic Information (Stream & 6 Subjects) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Outfit']">
                Academic Information
              </h4>
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Stream: {student.stream}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Subject 1 (Compulsory):</span>
                <span className="font-bold text-slate-900">{student.subject_1}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Subject 2 (Compulsory):</span>
                <span className="font-bold text-slate-900">{student.subject_2}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Subject 3 (Elective):</span>
                <span className="font-bold text-slate-900">{student.subject_3}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Subject 4 (Elective):</span>
                <span className="font-bold text-slate-900">{student.subject_4}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Subject 5 (Elective):</span>
                <span className="font-bold text-slate-900">{student.subject_5}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Subject 6 (Elective):</span>
                <span className="font-bold text-slate-900">{student.subject_6}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Location Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Outfit'] border-b border-slate-100 pb-1">
              Location & Residential Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-slate-500">State</span>
                <div className="font-bold text-slate-900 text-sm">{student.state}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-slate-500">District</span>
                <div className="font-bold text-slate-900 text-sm">{student.district}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-slate-500">Block</span>
                <div className="font-bold text-slate-900 text-sm">{student.block}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5 sm:col-span-3">
                <span className="text-slate-500">Full Address</span>
                <div className="font-medium text-slate-800 text-xs sm:text-sm">
                  {student.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(student)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Edit className="w-3.5 h-3.5 text-blue-600" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={() => onDelete(student)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Delete</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-blue-700" />
              <span>Print Record</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* PRINT-ONLY OFFICIAL STUDENT DOSSIER RECORD SLIP */}
    <div className="hidden print:block bg-white text-slate-900 p-8 border-2 border-slate-800 rounded-lg printable-area">
      {/* Institutional Document Header */}
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
          Official Student Academic Dossier &amp; Admission Record Slip
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
            Official Admission Status
          </span>
          <span
            className={`inline-block font-bold px-3 py-1 rounded text-xs border ${
              student.admission_status === 'Approval' || student.admission_status === 'Admitted'
                ? 'text-emerald-950 bg-emerald-100 border-emerald-400'
                : student.admission_status === 'Rejected'
                ? 'text-rose-950 bg-rose-100 border-rose-400'
                : 'text-amber-950 bg-amber-100 border-amber-400'
            }`}
          >
            {(student.admission_status === 'Approval' || student.admission_status === 'Admitted') && '🟢 APPROVAL'}
            {student.admission_status === 'Pending' && '🟡 PENDING REVIEW'}
            {student.admission_status === 'Rejected' && '🔴 REJECTED'}
          </span>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-4 text-xs">
        <h3 className="font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1">
          1. Personal Information
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
            <span className="text-slate-500 block text-[10px]">Registration Date:</span>
            <span className="font-semibold text-slate-900">{formattedRegDate}</span>
          </div>
          {formattedAdmDate && (
            <div className="p-2 border border-emerald-300 bg-emerald-50/50 rounded col-span-2">
              <span className="text-emerald-700 block text-[10px] font-bold">
                Official Admission Timestamp:
              </span>
              <span className="font-bold text-emerald-950">{formattedAdmDate}</span>
            </div>
          )}
        </div>

        <h3 className="font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 pt-2">
          2. Academic Curriculum &amp; Subjects
        </h3>
        <div className="p-2 border border-slate-200 rounded bg-slate-50/50 mb-2">
          <span className="text-slate-500 block text-[10px]">CHSE Stream (+2 12th):</span>
          <span className="font-bold text-blue-900 text-sm">{student.stream} Stream</span>
        </div>

        <table className="w-full text-left border-collapse border border-slate-300 text-xs">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 p-1.5 w-16 text-center font-bold">Sl No.</th>
              <th className="border border-slate-300 p-1.5 font-bold">Subject Category</th>
              <th className="border border-slate-300 p-1.5 font-bold">Subject Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 p-1.5 text-center font-semibold">1</td>
              <td className="border border-slate-300 p-1.5 text-slate-600">Compulsory 1</td>
              <td className="border border-slate-300 p-1.5 font-bold">{student.subject_1}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-1.5 text-center font-semibold">2</td>
              <td className="border border-slate-300 p-1.5 text-slate-600">Compulsory 2</td>
              <td className="border border-slate-300 p-1.5 font-bold">{student.subject_2}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-1.5 text-center font-semibold">3</td>
              <td className="border border-slate-300 p-1.5 text-slate-600">Elective 1</td>
              <td className="border border-slate-300 p-1.5 font-bold">{student.subject_3}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-1.5 text-center font-semibold">4</td>
              <td className="border border-slate-300 p-1.5 text-slate-600">Elective 2</td>
              <td className="border border-slate-300 p-1.5 font-bold">{student.subject_4}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 p-1.5 text-center font-semibold">5</td>
              <td className="border border-slate-300 p-1.5 text-slate-600">Elective 3</td>
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
          3. Residential &amp; Geographical Location
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

      {/* Institutional Seal & Signatures */}
      <div className="mt-8 pt-4 border-t border-slate-400 flex items-end justify-between text-[11px] text-slate-600">
        <div className="max-w-xs space-y-1">
          <p className="font-semibold text-slate-800">Administrative Record:</p>
          <p>Verified from MY CHSE 12TH CLASSES student management database.</p>
        </div>
        <div className="text-center space-y-8">
          <div className="text-[10px] text-slate-400">System Generated Academic Record</div>
          <div className="border-t border-slate-700 w-44 pt-1 font-semibold text-slate-800">
            Principal / Admission Incharge
          </div>
        </div>
      </div>
    </div>
  </>
  );
};
