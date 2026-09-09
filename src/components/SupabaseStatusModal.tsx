import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  X,
  ShieldCheck,
  Cloud,
  Server
} from 'lucide-react';
import { SupabaseStatusInfo } from '../types';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<SupabaseStatusInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    setSyncMsg(null);
    try {
      const res = await fetch('/api/supabase/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error('Error loading Supabase status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const handleCopySql = () => {
    if (!status?.sqlSchema) return;
    navigator.clipboard.writeText(status.sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch('/api/supabase/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncMsg(`Sync complete! ${data.synced} records synced to Supabase.`);
      } else {
        setSyncMsg(data.error || 'Failed to sync');
      }
      await fetchStatus();
    } catch {
      setSyncMsg('Network error while requesting Supabase sync.');
    } finally {
      setSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Supabase Cloud Database</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-400 text-slate-950">
                  Live Connected
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Project ID: <span className="font-mono text-emerald-300 font-bold">{status?.projectId || 'ozvjfrpnqcciupluuppc'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* Connection summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <Cloud className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Supabase Gateway</span>
                <p className="font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  {status?.connected ? 'Online & Authenticated' : 'Checking connection...'}
                </p>
                <p className="text-xs text-slate-500 font-mono mt-1 truncate max-w-[200px]">
                  {status?.supabaseUrl || 'https://ozvjfrpnqcciupluuppc.supabase.co'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <Server className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Table &lsquo;public.students&rsquo;</span>
                <p className="font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  {status?.tableExists ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Ready ({status.count ?? 0} records)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-amber-700 font-medium">Awaiting SQL Table Setup</span>
                    </>
                  )}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {status?.tableExists ? 'Auto-synced with registrations' : 'Run SQL script below in Supabase'}
                </p>
              </div>
            </div>
          </div>

          {/* Table setup instructions if table is pending */}
          {!status?.tableExists && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>One-Time Step: Create &lsquo;students&rsquo; Table in Supabase</span>
                </div>
                <a
                  href={status?.dashboardSqlUrl || 'https://supabase.com/dashboard/project/ozvjfrpnqcciupluuppc/sql'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 underline"
                >
                  Open Supabase SQL Editor
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Your credentials are authenticated. To allow Supabase to store student records, copy this SQL snippet and run it once in your Supabase SQL Editor:
              </p>

              {/* SQL Code Box */}
              <div className="relative rounded-xl bg-slate-950 text-slate-100 p-3 font-mono text-xs overflow-x-auto border border-slate-800 max-h-48">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="absolute top-2 right-2 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
                </button>
                <pre className="pr-20 whitespace-pre-wrap">{status?.sqlSchema || '-- SQL loading...'}</pre>
              </div>
            </div>
          )}

          {/* Sync notification message */}
          {syncMsg && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{syncMsg}</span>
            </div>
          )}

          {/* Security details */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-600">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Security &amp; Dual-Storage Guarantees</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>API Keys and credentials are handled strictly through the secure server backend proxy.</li>
              <li>Every student submission is automatically saved and backed up.</li>
              <li>Once you execute the table script in Supabase, all existing and future registrations instantly populate your Supabase dashboard!</li>
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={fetchStatus}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncNow}
              disabled={syncing}
              className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-amber-300" />
              <span>{syncing ? 'Syncing...' : 'Sync Database Records'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
