import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trash2,
  X,
  Loader2
} from 'lucide-react';

export type ConfirmationType = 'admit' | 'reject' | 'delete' | 'bulk-admit' | 'bulk-reject' | 'bulk-delete';

interface ConfirmationModalProps {
  isOpen: boolean;
  type: ConfirmationType;
  title?: string;
  message?: string;
  count?: number;
  studentName?: string;
  registrationId?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  type,
  title,
  message,
  count = 1,
  studentName,
  registrationId,
  isLoading = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const getConfig = () => {
    switch (type) {
      case 'admit':
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          defaultTitle: 'Confirm Student Approval',
          defaultMessage: 'Are you sure you want to approve this student? Their status will be set to Approval and approval date recorded.',
          confirmText: 'Confirm Approval',
          confirmBtnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white'
        };
      case 'reject':
        return {
          icon: <XCircle className="w-8 h-8 text-rose-600" />,
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
          defaultTitle: 'Reject Student Registration',
          defaultMessage: 'Are you sure you want to reject this student? Their status will be set to Rejected.',
          confirmText: 'Reject Student',
          confirmBtnClass: 'bg-rose-600 hover:bg-rose-700 text-white'
        };
      case 'delete':
        return {
          icon: <Trash2 className="w-8 h-8 text-rose-600" />,
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
          defaultTitle: 'Delete Student Registration',
          defaultMessage: 'Are you sure you want to permanently delete this registration? This action cannot be undone.',
          confirmText: 'Delete Registration',
          confirmBtnClass: 'bg-rose-600 hover:bg-rose-700 text-white'
        };
      case 'bulk-admit':
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          defaultTitle: 'Bulk Approval Confirmation',
          defaultMessage: `Are you sure you want to approve ${count} selected students?`,
          confirmText: `Approve ${count} Students (Approval)`,
          confirmBtnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white'
        };
      case 'bulk-reject':
        return {
          icon: <XCircle className="w-8 h-8 text-rose-600" />,
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
          defaultTitle: 'Bulk Rejection Confirmation',
          defaultMessage: `Are you sure you want to mark ${count} selected students as Rejected?`,
          confirmText: `Reject ${count} Students`,
          confirmBtnClass: 'bg-rose-600 hover:bg-rose-700 text-white'
        };
      case 'bulk-delete':
        return {
          icon: <Trash2 className="w-8 h-8 text-rose-600" />,
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
          defaultTitle: 'Bulk Permanent Deletion',
          defaultMessage: `Are you sure you want to permanently delete ${count} selected registrations? This action cannot be undone.`,
          confirmText: `Delete ${count} Students`,
          confirmBtnClass: 'bg-rose-600 hover:bg-rose-700 text-white'
        };
    }
  };

  const config = getConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative space-y-5 animate-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl ${config.bgColor} border ${config.borderColor} shrink-0`}>
            {config.icon}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              {title || config.defaultTitle}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {message || config.defaultMessage}
            </p>
          </div>
        </div>

        {/* Target Details preview */}
        {(studentName || registrationId) && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
            {studentName && (
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{studentName}</span>
              </div>
            )}
            {registrationId && (
              <div className="flex justify-between">
                <span className="text-slate-500">Registration ID:</span>
                <span className="font-mono font-bold text-blue-900">{registrationId}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${config.confirmBtnClass}`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{config.confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
