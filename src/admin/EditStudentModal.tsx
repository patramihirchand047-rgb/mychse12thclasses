import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  BookOpen,
  MapPin,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Student, StreamType } from '../types';

interface EditStudentModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (registrationId: string, updatedData: Partial<Student>) => Promise<boolean>;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
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
        address: student.address
      });
      setErrorMessage('');
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.full_name?.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!formData.gmail?.trim() || !formData.gmail.includes('@')) {
      setErrorMessage('A valid Gmail address is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSave(student.registration_id, formData);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update student details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl relative my-8 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 sm:px-8 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-['Outfit']">
              Record Editor
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit']">
              Edit Student Details
            </h2>
            <div className="text-xs text-blue-200 font-mono mt-0.5">
              Registration ID: {student.registration_id}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-blue-300 hover:text-white hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Personal Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Outfit'] border-b border-slate-100 pb-1">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Age <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleChange}
                  min={14}
                  max={35}
                  required
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gmail ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="gmail"
                  value={formData.gmail || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Outfit']">
                Academic &amp; Subjects
              </h4>
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600">Stream:</label>
                <select
                  name="stream"
                  value={formData.stream || 'Science'}
                  onChange={handleChange}
                  className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded-lg font-bold text-blue-900"
                >
                  <option value="Science">Science</option>
                  <option value="Arts">Arts</option>
                  <option value="Commerce">Commerce</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Subject 1 (Compulsory)
                </label>
                <input
                  type="text"
                  name="subject_1"
                  value={formData.subject_1 || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Subject 2 (Compulsory)
                </label>
                <input
                  type="text"
                  name="subject_2"
                  value={formData.subject_2 || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Subject 3 (Elective)
                </label>
                <input
                  type="text"
                  name="subject_3"
                  value={formData.subject_3 || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Subject 4 (Elective)
                </label>
                <input
                  type="text"
                  name="subject_4"
                  value={formData.subject_4 || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Subject 5 (Elective)
                </label>
                <input
                  type="text"
                  name="subject_5"
                  value={formData.subject_5 || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Subject 6 (Elective)
                </label>
                <input
                  type="text"
                  name="subject_6"
                  value={formData.subject_6 || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Outfit'] border-b border-slate-100 pb-1">
              Location Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Block</label>
                <input
                  type="text"
                  name="block"
                  value={formData.block || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg outline-none focus:bg-white"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Address</label>
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  rows={2}
                  required
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
