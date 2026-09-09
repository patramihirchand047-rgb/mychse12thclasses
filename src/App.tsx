import React, { useState, useEffect } from 'react';
import { PageView, Student, SupabaseStatusInfo } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { RegistrationPage } from './pages/RegistrationPage';
import { SuccessPage } from './pages/SuccessPage';
import { StatusPage } from './pages/StatusPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPortal } from './admin/AdminPortal';

export default function App() {
  // Mode: 'user' (Public Student Portal) vs 'admin' (Administrative Control Panel)
  const [viewMode, setViewMode] = useState<'user' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('view') === 'admin' || window.location.hash === '#admin') {
        return 'admin';
      }
    }
    return 'user';
  });

  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [registeredStudent, setRegisteredStudent] = useState<Student | null>(null);
  const [statusSearchId, setStatusSearchId] = useState<string>('');
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatusInfo | null>(null);

  // Check Supabase Cloud Database Status
  useEffect(() => {
    fetch('/api/supabase/status')
      .then((res) => res.json())
      .then((data) => setSupabaseStatus(data))
      .catch(() => {
        // non-blocking
      });
  }, []);

  // Listen to hash changes (e.g. #admin or #user)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setViewMode('admin');
      } else if (window.location.hash === '#user') {
        setViewMode('user');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistrationSuccess = (student: Student) => {
    setRegisteredStudent(student);
    setCurrentPage('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckStatusWithId = (id?: string) => {
    if (id) {
      setStatusSearchId(id);
    }
    setCurrentPage('status');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchToAdmin = () => {
    setViewMode('admin');
    window.history.pushState(null, '', '?view=admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchToUser = () => {
    setViewMode('user');
    window.history.pushState(null, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Admin Mode is active, render the complete, secure Admin Panel
  if (viewMode === 'admin') {
    return (
      <AdminPortal
        onSwitchToStudentPortal={handleSwitchToUser}
        supabaseStatus={supabaseStatus}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Header Navigation */}
      <Header
        currentPage={currentPage}
        onNavigate={navigateTo}
        onSwitchToAdmin={handleSwitchToAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={navigateTo} />}

        {currentPage === 'register' && (
          <RegistrationPage
            onSuccess={handleRegistrationSuccess}
            onNavigateStatus={handleCheckStatusWithId}
          />
        )}

        {currentPage === 'success' && registeredStudent && (
          <SuccessPage
            student={registeredStudent}
            onNavigate={navigateTo}
            onCheckStatusWithId={handleCheckStatusWithId}
          />
        )}

        {currentPage === 'success' && !registeredStudent && (
          // Fallback if accessed directly without previous registration
          <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-800">No active registration in this session</h2>
            <p className="text-sm text-slate-600">Please register or check your status using your Registration ID.</p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => navigateTo('register')}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold"
              >
                Register Now
              </button>
              <button
                onClick={() => navigateTo('status')}
                className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg text-sm font-semibold"
              >
                Check Status
              </button>
            </div>
          </div>
        )}

        {currentPage === 'status' && (
          <StatusPage
            initialRegistrationId={statusSearchId}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'about' && <AboutPage onNavigate={navigateTo} />}

        {currentPage === 'contact' && <ContactPage onNavigate={navigateTo} />}
      </main>

      {/* Footer Navigation & Legal */}
      <Footer onNavigate={navigateTo} onSwitchToAdmin={handleSwitchToAdmin} />
    </div>
  );
}
