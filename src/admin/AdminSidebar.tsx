import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Settings,
  LogOut,
  GraduationCap,
  ArrowUpRight,
  X
} from 'lucide-react';
import { AdminPageView, AdminStats } from '../types';

interface AdminSidebarProps {
  currentPage: AdminPageView;
  onNavigate: (page: AdminPageView) => void;
  onLogout: () => void;
  onSwitchToStudentPortal: () => void;
  stats: AdminStats | null;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPage,
  onNavigate,
  onLogout,
  onSwitchToStudentPortal,
  stats,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItemClass = (page: AdminPageView) => {
    const isActive = currentPage === page || (page === 'admitted' && currentPage === 'approval');
    return `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
      isActive
        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-bold'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
    }`;
  };

  const handleNavClick = (page: AdminPageView) => {
    onNavigate(page);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Brand */}
        <div>
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-950 border border-blue-400/20 shrink-0">
                <GraduationCap className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-white tracking-tight font-['Outfit'] leading-tight">
                  MY CHSE 12TH CLASSES
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Office Portal
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)]">
            {/* MAIN SECTION */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-['Outfit']">
                MAIN
              </div>
              <button
                id="nav-admin-dashboard"
                onClick={() => handleNavClick('dashboard')}
                className={navItemClass('dashboard')}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-blue-400" />
                  <span>Dashboard</span>
                </div>
              </button>
              <button
                id="nav-admin-students"
                onClick={() => handleNavClick('students')}
                className={navItemClass('students')}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>Students</span>
                </div>
                {stats && (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-slate-800 text-slate-300">
                    {stats.total}
                  </span>
                )}
              </button>
            </div>

            {/* ADMISSION SECTION (Filtered views of SAME students) */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-['Outfit'] flex items-center justify-between">
                <span>ADMISSION</span>
                <span className="text-[9px] text-slate-500 lowercase">filtered</span>
              </div>
              <button
                id="nav-admin-pending"
                onClick={() => handleNavClick('pending')}
                className={navItemClass('pending')}
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Pending</span>
                </div>
                {stats && stats.pending > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {stats.pending}
                  </span>
                )}
              </button>
              <button
                id="nav-admin-admitted"
                onClick={() => handleNavClick('admitted')}
                className={navItemClass('admitted')}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Approval</span>
                </div>
                {stats && (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {stats.approval ?? stats.admitted}
                  </span>
                )}
              </button>
              <button
                id="nav-admin-rejected"
                onClick={() => handleNavClick('rejected')}
                className={navItemClass('rejected')}
              >
                <div className="flex items-center gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Rejected</span>
                </div>
                {stats && (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {stats.rejected}
                  </span>
                )}
              </button>
            </div>

            {/* MANAGEMENT SECTION */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-['Outfit']">
                MANAGEMENT
              </div>
              <button
                id="nav-admin-reports"
                onClick={() => handleNavClick('reports')}
                className={navItemClass('reports')}
              >
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                  <span>Reports / Export</span>
                </div>
              </button>
              <button
                id="nav-admin-settings"
                onClick={() => handleNavClick('settings')}
                className={navItemClass('settings')}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </div>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom Switcher & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-2 bg-slate-900/60">
          {/* Switch to Student Portal */}
          <button
            onClick={onSwitchToStudentPortal}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Student Portal View</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
          </button>

          {/* Logout */}
          <button
            id="nav-admin-logout"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
