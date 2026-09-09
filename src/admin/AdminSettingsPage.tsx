import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  Lock,
  Database,
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  Download,
  UploadCloud,
  ExternalLink
} from 'lucide-react';
import { AdminProfile, AuditLog, SupabaseStatusInfo } from '../types';

interface AdminSettingsPageProps {
  admin: AdminProfile;
  supabaseStatus: SupabaseStatusInfo | null;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({
  admin,
  supabaseStatus,
  onShowToast
}) => {
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const token = sessionStorage.getItem('chse_admin_token') || '';
      const res = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setAuditLogs(json);
      }
    } catch (err) {
      // non-blocking
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsSavingPassword(true);
    try {
      const token = sessionStorage.getItem('chse_admin_token') || '';
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || 'Failed to update password.');
        setIsSavingPassword(false);
        return;
      }

      onShowToast('success', 'Admin password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      fetchAuditLogs();
    } catch (err: any) {
      setPasswordError('Network error while updating password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
          <Settings className="w-3.5 h-3.5 text-slate-600" />
          <span>Institutional Administration Setup</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
          Portal Security &amp; Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
          Manage administrator security credentials, review database infrastructure connectivity, and inspect immutable audit activity logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Password Management & Profile */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-900 font-black text-lg flex items-center justify-center border border-blue-200">
                {admin.name?.charAt(0) || 'A'}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 font-['Outfit'] text-base">
                  {admin.name}
                </h3>
                <span className="text-xs text-blue-700 font-semibold">{admin.role}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500">Administrator Email:</span>
                <span className="font-mono font-bold text-slate-900">{admin.email}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500">Privilege Level:</span>
                <span className="font-bold text-emerald-700">Full System Administrator</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500">Password Storage:</span>
                <span className="font-mono text-slate-700">PBKDF2 SHA-512 (Salted)</span>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <KeyRound className="w-5 h-5 text-blue-700" />
              <h3 className="font-bold text-slate-900 font-['Outfit'] text-base">
                Change Administrator Password
              </h3>
            </div>

            {passwordError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter existing password"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Password (minimum 8 characters)
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter secure new password"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingPassword}
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isSavingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Security Credentials...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Database Infrastructure & Audit Logs */}
        <div className="space-y-6">
          {/* Netlify 1-Click Deploy ZIP Card */}
          <div className="bg-gradient-to-br from-blue-950 to-indigo-900 rounded-3xl p-6 sm:p-7 border border-blue-800/80 shadow-md text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-800/50">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white font-['Outfit'] text-base">
                  Netlify Instant Deployment
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1 border border-emerald-400/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ready to Deploy</span>
              </span>
            </div>

            <p className="text-xs text-blue-100/90 leading-relaxed">
              If GitHub connection is blocked on mobile, download this pre-compiled production ZIP directly to your phone/PC and upload to Netlify Drop:
            </p>

            <div className="space-y-2.5">
              <a
                href="/download-deploy-zip"
                download="mychse_netlify_deploy.zip"
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer font-['Outfit']"
              >
                <Download className="w-4 h-4 text-blue-950" />
                <span>Download Netlify Deploy ZIP</span>
              </a>

              <a
                href="https://app.netlify.com/drop"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
              >
                <span>Open Netlify Drop (Upload Here)</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
              </a>
            </div>

            <div className="p-3 bg-blue-950/60 rounded-xl border border-blue-800/60 text-[11px] text-blue-200/90 space-y-1">
              <div className="font-bold text-amber-300">How to use on Mobile:</div>
              <ol className="list-decimal list-inside space-y-0.5 text-blue-100/80">
                <li>Tap "Download Netlify Deploy ZIP" above.</li>
                <li>Open <b>app.netlify.com/drop</b> in browser.</li>
                <li>Select the downloaded ZIP file and upload. Done!</li>
              </ol>
            </div>
          </div>

          {/* Database Infrastructure Status */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 font-['Outfit'] text-base">
                  Database Infrastructure
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Connected</span>
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 font-semibold">Supabase Project ID:</span>
                <div className="font-mono font-bold text-blue-900">
                  {supabaseStatus?.projectId || 'ozvjfrpnqcciupluuppc'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500 font-semibold">Database Schema / Table:</span>
                <div className="font-mono text-slate-800 font-bold">
                  public.students (Unified Single Table Architecture)
                </div>
                <div className="text-[11px] text-slate-400">
                  Dual-write persistence with local JSON cache and Supabase PostgreSQL.
                </div>
              </div>
            </div>
          </div>

          {/* Audit & Activity Logs */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 font-['Outfit'] text-base">
                  Audit Activity Logs
                </h3>
              </div>
              <button
                onClick={fetchAuditLogs}
                disabled={isLoadingLogs}
                className="text-xs text-blue-700 hover:text-blue-900 font-bold cursor-pointer"
              >
                Refresh
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {auditLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No administrative actions logged yet in this session.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-950 font-['Outfit'] uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-blue-100/70 text-blue-900">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="text-slate-700 font-medium">{log.details}</div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span>By: {log.admin_email}</span>
                      {log.registration_id && (
                        <span className="font-mono text-blue-800">{log.registration_id}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
