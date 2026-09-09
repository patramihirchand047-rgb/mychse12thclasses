import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Eye,
  Edit,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  Student,
  AdmissionStatus,
  AdminPageView,
  AdminStudentsResponse
} from '../types';

interface AdminStudentsTableProps {
  viewType: 'students' | 'pending' | 'admitted' | 'rejected';
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onAdmitStudent: (student: Student) => void;
  onRejectStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onBulkAdmit: (registrationIds: string[]) => void;
  onBulkReject: (registrationIds: string[]) => void;
  onBulkDelete: (registrationIds: string[]) => void;
  onExportFiltered: (filters: Record<string, string>) => void;
  refreshTrigger: number;
}

export const AdminStudentsTable: React.FC<AdminStudentsTableProps> = ({
  viewType,
  onViewStudent,
  onEditStudent,
  onAdmitStudent,
  onRejectStudent,
  onDeleteStudent,
  onBulkAdmit,
  onBulkReject,
  onBulkDelete,
  onExportFiltered,
  refreshTrigger
}) => {
  // Query state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStream, setSelectedStream] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState(
    viewType === 'pending'
      ? 'Pending'
      : viewType === 'admitted' || (viewType as string) === 'approval'
      ? 'Approval'
      : viewType === 'rejected'
      ? 'Rejected'
      : 'All'
  );
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedBlock, setSelectedBlock] = useState('All');

  const [sortBy, setSortBy] = useState<'registration_date' | 'full_name' | 'stream' | 'admission_status' | 'admission_date'>('registration_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  // Response state
  const [data, setData] = useState<AdminStudentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Selected checkbox rows
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Update status filter whenever viewType prop changes
  useEffect(() => {
    if (viewType === 'pending') setSelectedStatus('Pending');
    else if (viewType === 'admitted' || (viewType as string) === 'approval') setSelectedStatus('Approval');
    else if (viewType === 'rejected') setSelectedStatus('Rejected');
    else setSelectedStatus('All');
    setPage(1);
    setSelectedIds([]);
  }, [viewType]);

  // Fetch students from protected endpoint
  const fetchStudents = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = sessionStorage.getItem('chse_admin_token') || '';
      const params = new URLSearchParams({
        search: searchTerm,
        stream: selectedStream,
        status: selectedStatus,
        state: selectedState,
        district: selectedDistrict,
        block: selectedBlock,
        sortBy,
        sortOrder,
        page: page.toString(),
        limit: limit.toString()
      });

      const res = await fetch(`/api/admin/students?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to load students registry.');
      }

      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err?.message || 'Failed to load students.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch on query change or refreshTrigger
  useEffect(() => {
    fetchStudents();
  }, [
    searchTerm,
    selectedStream,
    selectedStatus,
    selectedState,
    selectedDistrict,
    selectedBlock,
    sortBy,
    sortOrder,
    page,
    limit,
    refreshTrigger
  ]);

  // Handle select all checkbox on current page
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data?.students) return;
    if (e.target.checked) {
      const pageIds = data.students.map((s) => s.registration_id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    } else {
      const pageIds = new Set(data.students.map((s) => s.registration_id));
      setSelectedIds(selectedIds.filter((id) => !pageIds.has(id)));
    }
  };

  const handleSelectOne = (registrationId: string) => {
    setSelectedIds((prev) =>
      prev.includes(registrationId)
        ? prev.filter((id) => id !== registrationId)
        : [...prev, registrationId]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStream('All');
    if (viewType === 'students') {
      setSelectedStatus('All');
    }
    setSelectedState('All');
    setSelectedDistrict('All');
    setSelectedBlock('All');
    setSortBy('registration_date');
    setSortOrder('desc');
    setPage(1);
    setSelectedIds([]);
  };

  const isAllOnPageSelected =
    Boolean(data?.students?.length) &&
    data!.students.every((s) => selectedIds.includes(s.registration_id));

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* 1. FILTER & SEARCH CONTROL TOOLBAR */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search by Name, Gmail, or Registration ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Actions & Reset */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset all filters to default"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Filters</span>
            </button>

            <button
              onClick={() =>
                onExportFiltered({
                  status: selectedStatus,
                  stream: selectedStream,
                  state: selectedState,
                  district: selectedDistrict,
                  block: selectedBlock
                })
              }
              className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-700" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100">
          {/* Stream Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 font-['Outfit']">
              Stream
            </label>
            <select
              value={selectedStream}
              onChange={(e) => {
                setSelectedStream(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 outline-none focus:bg-white"
            >
              <option value="All">All Streams</option>
              <option value="Arts">Arts</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
            </select>
          </div>

          {/* Status Filter (locked if on dedicated tab) */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 font-['Outfit']">
              Status
            </label>
            <select
              value={selectedStatus}
              disabled={viewType !== 'students'}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 outline-none focus:bg-white disabled:opacity-60"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">🟡 Pending</option>
              <option value="Approval">🟢 Approval</option>
              <option value="Rejected">🔴 Rejected</option>
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 font-['Outfit']">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('All');
                setSelectedBlock('All');
                setPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 outline-none focus:bg-white"
            >
              <option value="All">All States</option>
              {data?.availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 font-['Outfit']">
              District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedBlock('All');
                setPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 outline-none focus:bg-white"
            >
              <option value="All">All Districts</option>
              {data?.availableDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Block Filter */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 font-['Outfit']">
              Block
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => {
                setSelectedBlock(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 outline-none focus:bg-white"
            >
              <option value="All">All Blocks</option>
              {data?.availableBlocks.map((blk) => (
                <option key={blk} value={blk}>
                  {blk}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. BULK ACTIONS BAR (Visible when any rows are checked) */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 bg-blue-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-mono">
              {selectedIds.length}
            </span>
            <span>Students Selected for Batch Action</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onBulkAdmit(selectedIds)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve / Approval Selected ({selectedIds.length})</span>
            </button>

            <button
              onClick={() => onBulkReject(selectedIds)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject Selected ({selectedIds.length})</span>
            </button>

            <button
              onClick={() => onBulkDelete(selectedIds)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Delete ({selectedIds.length})</span>
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 rounded-xl text-blue-200 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN TABLE CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-slate-200 text-blue-900 text-xs font-bold">
              <Loader2 className="w-4 h-4 animate-spin text-blue-700" />
              <span>Loading Student Records...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-6 text-center text-rose-600 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="overflow-x-auto min-h-[360px]">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px] font-['Outfit']">
                {/* Select All Checkbox */}
                <th className="py-3.5 pl-4 pr-2 w-10">
                  <input
                    type="checkbox"
                    checked={isAllOnPageSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                    title="Select all on this page"
                  />
                </th>

                {/* Registration ID */}
                <th className="py-3.5 px-3">Registration ID</th>

                {/* Student Name */}
                <th
                  onClick={() => {
                    if (sortBy === 'full_name') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('full_name');
                      setSortOrder('asc');
                    }
                  }}
                  className="py-3.5 px-3 cursor-pointer hover:text-blue-900 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Student Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Age & Stream */}
                <th className="py-3.5 px-3">Stream</th>

                {/* Location */}
                <th className="py-3.5 px-3">District / State</th>

                {/* Status */}
                <th
                  onClick={() => {
                    if (sortBy === 'admission_status') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('admission_status');
                      setSortOrder('asc');
                    }
                  }}
                  className="py-3.5 px-3 cursor-pointer hover:text-blue-900 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Admission Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Registration Date */}
                <th
                  onClick={() => {
                    if (sortBy === 'registration_date') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('registration_date');
                      setSortOrder('desc');
                    }
                  }}
                  className="py-3.5 px-3 cursor-pointer hover:text-blue-900 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Reg Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Actions */}
                <th className="py-3.5 pl-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {!data?.students || data.students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 text-xs sm:text-sm">
                    No student records match the specified filters.
                  </td>
                </tr>
              ) : (
                data.students.map((student) => {
                  const isChecked = selectedIds.includes(student.registration_id);
                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isChecked ? 'bg-blue-50/70' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 pl-4 pr-2 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(student.registration_id)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                      </td>

                      {/* Registration ID */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-mono font-bold text-blue-900 text-xs">
                          {student.registration_id}
                        </span>
                      </td>

                      {/* Student Name & Gmail */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 whitespace-nowrap">
                          {student.full_name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {student.gmail} • Age {student.age}
                        </div>
                      </td>

                      {/* Stream */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold ${
                            student.stream === 'Science'
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : student.stream === 'Arts'
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}
                        >
                          {student.stream}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 text-xs">
                          {student.district}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {student.block}, {student.state}
                        </div>
                      </td>

                      {/* Admission Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {student.admission_status === 'Pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            🟡 Pending
                          </span>
                        )}
                        {(student.admission_status === 'Approval' || student.admission_status === 'Admitted') && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            🟢 Approval
                          </span>
                        )}
                        {student.admission_status === 'Rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
                            🔴 Rejected
                          </span>
                        )}
                      </td>

                      {/* Registration Date */}
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap text-xs">
                        {new Date(student.registration_date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3 pl-3 pr-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Full Dossier */}
                          <button
                            onClick={() => onViewStudent(student)}
                            className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Approve / Approval */}
                          {student.admission_status !== 'Approval' && student.admission_status !== 'Admitted' && (
                            <button
                              onClick={() => onAdmitStudent(student)}
                              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title="Approve Student (Approval)"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Quick Reject */}
                          {student.admission_status !== 'Rejected' && (
                            <button
                              onClick={() => onRejectStudent(student)}
                              className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                              title="Reject Student"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit Details */}
                          <button
                            onClick={() => onEditStudent(student)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Student Information"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Registration */}
                          <button
                            onClick={() => onDeleteStudent(student)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Delete Student Registration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION FOOTER */}
        <div className="p-4 bg-slate-50/90 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-500">
              Showing{' '}
              <span className="font-bold text-slate-800">
                {data?.students ? (page - 1) * limit + 1 : 0}
              </span>{' '}
              to{' '}
              <span className="font-bold text-slate-800">
                {data?.students
                  ? Math.min(page * limit, data.totalCount)
                  : 0}
              </span>{' '}
              of <span className="font-bold text-slate-800">{data?.totalCount || 0}</span> students
            </span>

            <div className="flex items-center gap-1">
              <span className="text-slate-400">Rows:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1 bg-white border border-slate-300 rounded-md font-bold text-slate-700"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="px-3 py-1 font-mono font-bold text-slate-800">
              Page {page} of {data?.totalPages || 1}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, data?.totalPages || 1))}
              disabled={page >= (data?.totalPages || 1)}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
