import React, { useState } from 'react';
import {
  Menu,
  X,
  CheckCircle2,
  Search,
  UserPlus,
  Info,
  Phone,
  Home,
  Sparkles,
  Lock
} from 'lucide-react';
import { PageView } from '../types';
import { ChseEmblemLogo } from './ChseEmblemLogo';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onSwitchToAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onSwitchToAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'register', label: 'Student Registration', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'status', label: 'Registration Status', icon: <Search className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> }
  ];

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs print:hidden">
        {/* Top micro announcement bar */}
        <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                2026 SESSION
              </span>
              <span className="hidden sm:inline text-slate-300">
                Online Admissions &amp; Enrollment Open for +2 Arts, Science &amp; Commerce
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-slate-300">
              <span className="hidden md:inline font-medium">
                Tagline: Learn Today • Succeed Tomorrow
              </span>
              <button
                onClick={() => handleNavClick('status')}
                className="text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Check Status
              </button>
              {onSwitchToAdmin && (
                <button
                  onClick={onSwitchToAdmin}
                  id="header-admin-portal-link"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer shadow-xs"
                  title="Switch to Office Login"
                >
                  <Lock className="w-3 h-3" />
                  <span>Office Login</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Brand Identity with the official emblem logo */}
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              {/* Navbar Emblem Logo */}
              <div
                id="navbar-brand-logo"
                className="relative shrink-0 p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-blue-600 shadow-md group-hover:shadow-amber-500/20 group-hover:scale-105 transition-all duration-200"
                title="MY CHSE 12TH CLASSES Official Emblem"
              >
                <ChseEmblemLogo size={52} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-2xl font-black tracking-tight text-blue-950 font-['Outfit']">
                    MY CHSE 12TH CLASSES
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] sm:text-xs font-semibold text-amber-700 tracking-wide">
                    Learn Today • Succeed Tomorrow
                  </p>
                  <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span className="hidden sm:inline-block text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 uppercase">
                    CHSE ODISHA
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <nav className="flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = currentPage === item.id;
                  const isRegister = item.id === 'register';

                  if (isRegister) {
                    return (
                      <button
                        key={item.id}
                        id="nav-register-btn"
                        onClick={() => handleNavClick(item.id)}
                        className="ml-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 border border-blue-600 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-amber-300" />
                        Student Registration
                      </button>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      id={`nav-link-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100/70'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="p-2.5 rounded-lg text-slate-700 hover:text-blue-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 pt-3 pb-6 space-y-1.5">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                const isRegister = item.id === 'register';

                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors cursor-pointer ${
                      isRegister
                        ? 'bg-blue-700 text-white font-semibold shadow-sm'
                        : isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                    {isRegister && (
                      <span className="ml-auto text-[11px] font-bold bg-amber-400 text-blue-950 px-2 py-0.5 rounded-full">
                        Open
                      </span>
                    )}
                  </button>
                );
              })}

              {onSwitchToAdmin && (
                <button
                  id="mobile-nav-admin-portal"
                  onClick={() => {
                    onSwitchToAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer shadow-xs"
                >
                  <Lock className="w-4 h-4" />
                  <span>Office Login</span>
                  <span className="ml-auto text-[10px] uppercase font-extrabold tracking-wider bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full">
                    Staff
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
