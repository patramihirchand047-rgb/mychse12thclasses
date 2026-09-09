import React from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  FileSpreadsheet,
  Calendar,
  Sparkles,
  Eye,
  RefreshCw
} from 'lucide-react';
import { AdminStats, AdminPageView, Student } from '../types';

interface AdminDashboardProps {
  stats: AdminStats | null;
  isLoading: boolean;
  onRefresh: () => void;
  onNavigate: (page: AdminPageView) => void;
  onViewStudent: (student: Student) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  isLoading,
  onRefresh,
  onNavigate,
  onViewStudent
}) => {
  const total = stats?.total || 0;
  const pending = stats?.pending || 0;
  const admitted = stats?.admitted || 0;
  const rejected = stats?.rejected || 0;

  const arts = stats?.streams.arts || 0;
  const science = stats?.streams.science || 0;
  const commerce = stats?.streams.commerce || 0;

  const artsPercent = total > 0 ? Math.round((arts / total) * 100) : 0;
  const sciencePercent = total > 0 ? Math.round((science / total) * 100) : 0;
  const commercePercent = total > 0 ? Math.round((commerce / total) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Quick Actions */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Administrative Overview • 2026 Academic Session
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] tracking-tight">
              Registration Control Center
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Real-time admission status tracking and student record synchronization across local storage and Supabase Cloud.
            </p>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('students')}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-950 hover:bg-blue-50 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-4 h-4 text-blue-700" />
              <span>View All Students</span>
            </button>
            <button
              onClick={() => onNavigate('pending')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-amber-950" />
              <span>Pending Queue ({pending})</span>
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="px-4 py-2.5 rounded-xl bg-blue-800/80 hover:bg-blue-700 text-white font-bold text-xs border border-blue-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-300" />
              <span>Export Data</span>
            </button>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-950 text-blue-200 hover:text-white transition-all border border-blue-800 cursor-pointer disabled:opacity-50"
              title="Refresh Statistics"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 6. FOUR MAIN STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Students Card */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-['Outfit']">
              Total Students
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit']">
              {total}
            </span>
            <span className="text-xs text-slate-400 font-medium">registered</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-700 font-semibold">
            <span>View complete registry</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pending Card */}
        <div
          onClick={() => onNavigate('pending')}
          className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider font-['Outfit']">
              Pending
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-amber-900 font-['Outfit']">
              {pending}
            </span>
            <span className="text-xs text-amber-600 font-medium">awaiting review</span>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-100 flex items-center justify-between text-xs text-amber-800 font-semibold">
            <span>Review pending queue</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Approval Card */}
        <div
          onClick={() => onNavigate('admitted')}
          className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-['Outfit']">
              Approval
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-emerald-900 font-['Outfit']">
              {stats?.approval ?? admitted}
            </span>
            <span className="text-xs text-emerald-600 font-medium">approved admissions</span>
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-800 font-semibold">
            <span>View approval list</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Rejected Card */}
        <div
          onClick={() => onNavigate('rejected')}
          className="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider font-['Outfit']">
              Rejected
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-rose-900 font-['Outfit']">
              {rejected}
            </span>
            <span className="text-xs text-rose-600 font-medium">disqualified</span>
          </div>
          <div className="mt-3 pt-3 border-t border-rose-100 flex items-center justify-between text-xs text-rose-800 font-semibold">
            <span>View rejected records</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 7. STREAM STATISTICS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-700" />
              Stream Distribution Statistics
            </h3>
            <p className="text-xs text-slate-500">
              Dynamically calculated registration count across Science, Arts, and Commerce streams.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            Total Enrollments: {total}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Science */}
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider font-['Outfit']">
                Science Stream
              </span>
              <span className="text-xs font-black text-blue-800 bg-blue-200/70 px-2 py-0.5 rounded-md">
                {sciencePercent}%
              </span>
            </div>
            <div className="text-3xl font-black text-blue-950 font-['Outfit']">
              {science} <span className="text-xs font-medium text-blue-700">students</span>
            </div>
            <div className="w-full bg-blue-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${sciencePercent}%` }}
              />
            </div>
            <p className="text-[11px] text-blue-700/80">
              Physics, Chemistry, Mathematics, Biology, IT
            </p>
          </div>

          {/* Arts */}
          <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider font-['Outfit']">
                Arts Stream
              </span>
              <span className="text-xs font-black text-purple-800 bg-purple-200/70 px-2 py-0.5 rounded-md">
                {artsPercent}%
              </span>
            </div>
            <div className="text-3xl font-black text-purple-950 font-['Outfit']">
              {arts} <span className="text-xs font-medium text-purple-700">students</span>
            </div>
            <div className="w-full bg-purple-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${artsPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-purple-700/80">
              History, Political Science, Economics, Odia, Sanskrit
            </p>
          </div>

          {/* Commerce */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider font-['Outfit']">
                Commerce Stream
              </span>
              <span className="text-xs font-black text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded-md">
                {commercePercent}%
              </span>
            </div>
            <div className="text-3xl font-black text-emerald-950 font-['Outfit']">
              {commerce} <span className="text-xs font-medium text-emerald-700">students</span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${commercePercent}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-700/80">
              Accountancy, Business Studies, Banking, Cost Accounting
            </p>
          </div>
        </div>
      </div>

      {/* 8. RECENT REGISTRATIONS TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
              Recent Registrations
            </h3>
            <p className="text-xs text-slate-500">
              Latest students submitted through the official MY CHSE 12TH CLASSES User Panel.
            </p>
          </div>

          <button
            onClick={() => onNavigate('students')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>View All Students</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-700" />
          </button>
        </div>

        {/* Table / List */}
        {!stats?.recentRegistrations || stats.recentRegistrations.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No students registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px] font-['Outfit']">
                  <th className="pb-3 pr-4">Registration ID</th>
                  <th className="pb-3 px-4">Student Name</th>
                  <th className="pb-3 px-4">Stream</th>
                  <th className="pb-3 px-4">Registration Date</th>
                  <th className="pb-3 px-4">Admission Status</th>
                  <th className="pb-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {stats.recentRegistrations.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pr-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {student.registration_id}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{student.full_name}</div>
                      <div className="text-[11px] text-slate-400">{student.gmail}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold">
                        {student.stream}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(student.registration_date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {student.admission_status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          🟡 Pending
                        </span>
                      )}
                      {(student.admission_status === 'Approval' || student.admission_status === 'Admitted') && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          🟢 Approval
                        </span>
                      )}
                      {student.admission_status === 'Rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
                          🔴 Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onViewStudent(student)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs transition-colors cursor-pointer border border-blue-200"
                        title="View Full Student Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-700" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
