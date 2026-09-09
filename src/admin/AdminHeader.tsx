import React from 'react';
import {
  Menu,
  Database,
  UserCheck,
  ExternalLink,
  LogOut,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { AdminProfile, AdminPageView } from '../types';

interface AdminHeaderProps {
  currentPage: AdminPageView;
  admin: AdminProfile;
  onOpenMobileSidebar: () => void;
  onSwitchToStudentPortal: () => void;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentPage,
  admin,
  onOpenMobileSidebar,
  onSwitchToStudentPortal,
  onLogout
}) => {
  const getPageTitle = (page: AdminPageView) => {
    switch (page) {
      case 'dashboard':
        return { title: 'Admin Dashboard', subtitle: 'Manage MY CHSE 12TH CLASSES student registrations' };
      case 'students':
        return { title: 'Students Registration', subtitle: 'Complete institutional student register' };
      case 'pending':
        return { title: 'Pending Students', subtitle: 'Filter: admission_status = Pending' };
      case 'admitted':
      case 'approval':
        return { title: 'Approval Students', subtitle: 'Filter: admission_status = Approval' };
      case 'rejected':
        return { title: 'Rejected Students', subtitle: 'Filter: admission_status = Rejected' };
      case 'reports':
        return { title: 'Reports / Export', subtitle: 'Generate and download official registration records' };
      case 'settings':
        return { title: 'Admin Settings', subtitle: 'Security configuration and audit activity logs' };
      default:
        return { title: 'Office Portal', subtitle: 'MY CHSE 12TH CLASSES' };
    }
  };

  const { title, subtitle } = getPageTitle(currentPage);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-blue-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 font-['Outfit'] tracking-tight flex items-center gap-2">
            <span>{title}</span>
            {currentPage === 'pending' && (
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                🟡 Pending
              </span>
            )}
            {(currentPage === 'admitted' || currentPage === 'approval') && (
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                🟢 Approval
              </span>
            )}
            {currentPage === 'rejected' && (
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
                🔴 Rejected
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions & Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Database Status Chip */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Supabase Sync Active</span>
        </div>

        {/* View Student Portal Button */}
        <button
          onClick={onSwitchToStudentPortal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer border border-slate-200"
          title="Open User Portal View"
        >
          <span>Student Portal</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {/* Admin Profile Chip */}
        <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 text-blue-900 font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
            {admin.name ? admin.name.charAt(0) : 'A'}
          </div>
          <div className="hidden xl:block text-left leading-tight">
            <div className="text-xs font-bold text-slate-800 font-['Outfit']">
              {admin.name}
            </div>
            <div className="text-[10px] text-slate-500">
              {admin.email}
            </div>
          </div>
        </div>

        {/* Quick Logout Button */}
        <button
          onClick={onLogout}
          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
