import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  FileText,
  Loader2,
  Sparkles
} from 'lucide-react';
import { AdminStats } from '../types';

interface AdminReportsPageProps {
  stats: AdminStats | null;
  onExport: (filters: Record<string, string>, format?: 'csv' | 'json') => void;
}

export const AdminReportsPage: React.FC<AdminReportsPageProps> = ({
  stats,
  onExport
}) => {
  const [selectedStream, setSelectedStream] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedBlock, setSelectedBlock] = useState('All');

  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<string[]>([]);

  useEffect(() => {
    // Load available filter options from the api
    const loadFilterOptions = async () => {
      try {
        const token = sessionStorage.getItem('chse_admin_token') || '';
        const res = await fetch('/api/admin/students?limit=1', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.availableStates) setAvailableStates(json.availableStates);
          if (json.availableDistricts) setAvailableDistricts(json.availableDistricts);
          if (json.availableBlocks) setAvailableBlocks(json.availableBlocks);
        }
      } catch (err) {
        // non-blocking
      }
    };
    loadFilterOptions();
  }, []);

  const handleQuickExport = (status: string) => {
    onExport({
      status,
      stream: 'All',
      state: 'All',
      district: 'All',
      block: 'All'
    }, 'csv');
  };

  const handleCustomExport = (format: 'csv' | 'json') => {
    onExport({
      status: selectedStatus,
      stream: selectedStream,
      state: selectedState,
      district: selectedDistrict,
      block: selectedBlock
    }, format);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider">
          <FileSpreadsheet className="w-3.5 h-3.5 text-purple-700" />
          <span>Institutional Reporting Engine</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
          Reports &amp; Data Export Center
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
          Generate official Council of Higher Secondary Education (CHSE) compliant registration dossiers. Export clean CSV datasets compatible with Microsoft Excel, Google Sheets, and state education databases.
        </p>
      </div>

      {/* Quick Export Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Export All */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-blue-300 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 font-['Outfit'] text-sm sm:text-base">
              All Registrations
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Entire student roster ({stats?.total || 0} students)
            </p>
          </div>
          <button
            onClick={() => handleQuickExport('All')}
            className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Full CSV</span>
          </button>
        </div>

        {/* Export Pending */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm space-y-4 hover:border-amber-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-amber-900 font-['Outfit'] text-sm sm:text-base">
              Pending Students
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Awaiting admission decision ({stats?.pending || 0} students)
            </p>
          </div>
          <button
            onClick={() => handleQuickExport('Pending')}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Pending List</span>
          </button>
        </div>

        {/* Export Approval */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-4 hover:border-emerald-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-emerald-900 font-['Outfit'] text-sm sm:text-base">
              Approval Students
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Officially approved roster ({stats?.approval ?? stats?.admitted ?? 0} students)
            </p>
          </div>
          <button
            onClick={() => handleQuickExport('Approval')}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Approval List</span>
          </button>
        </div>

        {/* Export Rejected */}
        <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm space-y-4 hover:border-rose-400 transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <XCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-rose-900 font-['Outfit'] text-sm sm:text-base">
              Rejected Records
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Disqualified applications ({stats?.rejected || 0} students)
            </p>
          </div>
          <button
            onClick={() => handleQuickExport('Rejected')}
            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Rejected List</span>
          </button>
        </div>
      </div>

      {/* Filtered Custom Export */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 font-['Outfit']">
              Custom Filtered Export
            </h3>
            <p className="text-xs text-slate-500">
              Select specific criteria to tailor your exported spreadsheet.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Admission Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approval">Approval</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Academic Stream
            </label>
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
            >
              <option value="All">All Streams</option>
              <option value="Arts">Arts</option>
              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
            >
              <option value="All">All States</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
            >
              <option value="All">All Districts</option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Block</label>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none font-medium"
            >
              <option value="All">All Blocks</option>
              {availableBlocks.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Export includes all 18 student data fields with UTF-8 character encoding.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCustomExport('json')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Export JSON
            </button>
            <button
              onClick={() => handleCustomExport('csv')}
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Filtered CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
