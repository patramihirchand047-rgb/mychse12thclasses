import React, { useState, useEffect } from 'react';
import {
  AdminProfile,
  AdminPageView,
  AdminStats,
  Student,
  AdmissionStatus,
  ToastMessage,
  SupabaseStatusInfo
} from '../types';
import { AdminLogin } from './AdminLogin';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminDashboard } from './AdminDashboard';
import { AdminStudentsTable } from './AdminStudentsTable';
import { AdminReportsPage } from './AdminReportsPage';
import { AdminSettingsPage } from './AdminSettingsPage';
import { StudentDetailsModal } from './StudentDetailsModal';
import { EditStudentModal } from './EditStudentModal';
import { ConfirmationModal, ConfirmationType } from './ConfirmationModal';
import { AdminToast } from './AdminToast';

interface AdminPortalProps {
  onSwitchToStudentPortal: () => void;
  supabaseStatus: SupabaseStatusInfo | null;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onSwitchToStudentPortal,
  supabaseStatus
}) => {
  // Authentication state
  const [admin, setAdmin] = useState<AdminProfile | null>(() => {
    const cached = sessionStorage.getItem('chse_admin_profile');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState<string>(() => {
    return sessionStorage.getItem('chse_admin_token') || '';
  });

  // Current Admin View
  const [currentPage, setCurrentPage] = useState<AdminPageView>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Statistics
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Active Modals & Selected Student
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Confirmation Modal State
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    type: ConfirmationType;
    student?: Student;
    bulkIds?: string[];
    isLoading: boolean;
  }>({
    isOpen: false,
    type: 'admit',
    isLoading: false
  });

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      message
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch dynamic statistics
  const fetchStats = async () => {
    if (!token) return;
    setIsLoadingStats(true);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const json = await res.json();
        setStats(json);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      // non-blocking
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token, refreshTrigger]);

  const handleLoginSuccess = (profile: AdminProfile, authToken: string) => {
    setAdmin(profile);
    setToken(authToken);
    setCurrentPage('dashboard');
    addToast('success', `Welcome back, ${profile.name}!`);
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      // ignore
    } finally {
      sessionStorage.removeItem('chse_admin_token');
      sessionStorage.removeItem('chse_admin_profile');
      setAdmin(null);
      setToken('');
      addToast('info', 'Logged out successfully.');
    }
  };

  // Single Student Actions
  const handleAdmitStudent = (student: Student) => {
    setConfirmModalState({
      isOpen: true,
      type: 'admit',
      student,
      isLoading: false
    });
  };

  const handleRejectStudent = (student: Student) => {
    setConfirmModalState({
      isOpen: true,
      type: 'reject',
      student,
      isLoading: false
    });
  };

  const handleDeleteStudent = (student: Student) => {
    setConfirmModalState({
      isOpen: true,
      type: 'delete',
      student,
      isLoading: false
    });
  };

  const handleChangeStatusDirectly = async (student: Student, newStatus: AdmissionStatus) => {
    try {
      const res = await fetch(`/api/admin/students/${student.registration_id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (!res.ok) {
        addToast('error', data.error || 'Failed to update admission status.');
        return;
      }

      addToast('success', `Status updated to ${newStatus} for ${student.full_name}.`);
      if (viewingStudent && viewingStudent.registration_id === student.registration_id) {
        setViewingStudent(data.student);
      }
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      addToast('error', 'Network error updating status.');
    }
  };

  // Bulk Actions
  const handleBulkAdmit = (registrationIds: string[]) => {
    setConfirmModalState({
      isOpen: true,
      type: 'bulk-admit',
      bulkIds: registrationIds,
      isLoading: false
    });
  };

  const handleBulkReject = (registrationIds: string[]) => {
    setConfirmModalState({
      isOpen: true,
      type: 'bulk-reject',
      bulkIds: registrationIds,
      isLoading: false
    });
  };

  const handleBulkDelete = (registrationIds: string[]) => {
    setConfirmModalState({
      isOpen: true,
      type: 'bulk-delete',
      bulkIds: registrationIds,
      isLoading: false
    });
  };

  // Confirm Modal Execution
  const executeConfirmation = async () => {
    const { type, student, bulkIds } = confirmModalState;
    setConfirmModalState((prev) => ({ ...prev, isLoading: true }));

    try {
      if (type === 'admit' && student) {
        const res = await fetch(`/api/admin/students/${student.registration_id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'Approval' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        addToast('success', 'Student admission marked as Approval successfully.');
        if (viewingStudent && viewingStudent.registration_id === student.registration_id) {
          setViewingStudent(data.student);
        }
      } else if (type === 'reject' && student) {
        const res = await fetch(`/api/admin/students/${student.registration_id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'Rejected' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        addToast('success', 'Student rejected successfully.');
        if (viewingStudent && viewingStudent.registration_id === student.registration_id) {
          setViewingStudent(data.student);
        }
      } else if (type === 'delete' && student) {
        const res = await fetch(`/api/admin/students/${student.registration_id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        addToast('success', 'Student registration deleted successfully.');
        if (viewingStudent && viewingStudent.registration_id === student.registration_id) {
          setViewingStudent(null);
        }
      } else if (type === 'bulk-admit' && bulkIds) {
        const res = await fetch('/api/admin/students/bulk-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ registration_ids: bulkIds, status: 'Approval' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        addToast('success', data.message || `Approved ${bulkIds.length} students successfully.`);
      } else if (type === 'bulk-reject' && bulkIds) {
        const res = await fetch('/api/admin/students/bulk-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ registration_ids: bulkIds, status: 'Rejected' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        addToast('success', data.message || `Marked ${bulkIds.length} students as Rejected.`);
      } else if (type === 'bulk-delete' && bulkIds) {
        const res = await fetch('/api/admin/students/bulk-delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ registration_ids: bulkIds })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        addToast('success', data.message || `Deleted ${bulkIds.length} students successfully.`);
      }

      setRefreshTrigger((prev) => prev + 1);
      setConfirmModalState({ isOpen: false, type: 'admit', isLoading: false });
    } catch (err: any) {
      addToast('error', err?.message || 'Operation failed.');
      setConfirmModalState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Edit Student Save Handler
  const handleSaveStudentEdit = async (
    registrationId: string,
    updatedData: Partial<Student>
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/students/${registrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update student details.');
      }

      addToast('success', 'Student details updated successfully.');
      if (viewingStudent && viewingStudent.registration_id === registrationId) {
        setViewingStudent(data.student);
      }
      setRefreshTrigger((prev) => prev + 1);
      return true;
    } catch (err: any) {
      addToast('error', err?.message || 'Error updating student record.');
      return false;
    }
  };

  // Export Trigger
  const handleExport = (filters: Record<string, string>, format: 'csv' | 'json' = 'csv') => {
    const params = new URLSearchParams({
      ...filters,
      format
    });
    // Trigger download via protected token endpoint
    const url = `/api/admin/export?${params.toString()}`;
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Export failed.');
        return res.blob();
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `MY_CHSE_12TH_${filters.status || 'All'}_Students_${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        addToast('success', `Export generated and downloaded (${format.toUpperCase()}).`);
      })
      .catch((err) => {
        addToast('error', 'Failed to generate export.');
      });
  };

  // If unauthenticated, show Admin Login view
  if (!admin || !token) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToPortal={onSwitchToStudentPortal}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 flex">
      {/* 1. SIDEBAR */}
      <AdminSidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        onSwitchToStudentPortal={onSwitchToStudentPortal}
        stats={stats}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 print:hidden">
        {/* Top Header Bar */}
        <AdminHeader
          currentPage={currentPage}
          admin={admin}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onSwitchToStudentPortal={onSwitchToStudentPortal}
          onLogout={handleLogout}
        />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'dashboard' && (
            <AdminDashboard
              stats={stats}
              isLoading={isLoadingStats}
              onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
              onNavigate={setCurrentPage}
              onViewStudent={setViewingStudent}
            />
          )}

          {currentPage === 'students' && (
            <AdminStudentsTable
              viewType="students"
              onViewStudent={setViewingStudent}
              onEditStudent={setEditingStudent}
              onAdmitStudent={handleAdmitStudent}
              onRejectStudent={handleRejectStudent}
              onDeleteStudent={handleDeleteStudent}
              onBulkAdmit={handleBulkAdmit}
              onBulkReject={handleBulkReject}
              onBulkDelete={handleBulkDelete}
              onExportFiltered={handleExport}
              refreshTrigger={refreshTrigger}
            />
          )}

          {currentPage === 'pending' && (
            <AdminStudentsTable
              viewType="pending"
              onViewStudent={setViewingStudent}
              onEditStudent={setEditingStudent}
              onAdmitStudent={handleAdmitStudent}
              onRejectStudent={handleRejectStudent}
              onDeleteStudent={handleDeleteStudent}
              onBulkAdmit={handleBulkAdmit}
              onBulkReject={handleBulkReject}
              onBulkDelete={handleBulkDelete}
              onExportFiltered={handleExport}
              refreshTrigger={refreshTrigger}
            />
          )}

          {currentPage === 'admitted' && (
            <AdminStudentsTable
              viewType="admitted"
              onViewStudent={setViewingStudent}
              onEditStudent={setEditingStudent}
              onAdmitStudent={handleAdmitStudent}
              onRejectStudent={handleRejectStudent}
              onDeleteStudent={handleDeleteStudent}
              onBulkAdmit={handleBulkAdmit}
              onBulkReject={handleBulkReject}
              onBulkDelete={handleBulkDelete}
              onExportFiltered={handleExport}
              refreshTrigger={refreshTrigger}
            />
          )}

          {currentPage === 'rejected' && (
            <AdminStudentsTable
              viewType="rejected"
              onViewStudent={setViewingStudent}
              onEditStudent={setEditingStudent}
              onAdmitStudent={handleAdmitStudent}
              onRejectStudent={handleRejectStudent}
              onDeleteStudent={handleDeleteStudent}
              onBulkAdmit={handleBulkAdmit}
              onBulkReject={handleBulkReject}
              onBulkDelete={handleBulkDelete}
              onExportFiltered={handleExport}
              refreshTrigger={refreshTrigger}
            />
          )}

          {currentPage === 'reports' && (
            <AdminReportsPage
              stats={stats}
              onExport={handleExport}
            />
          )}

          {currentPage === 'settings' && (
            <AdminSettingsPage
              admin={admin}
              supabaseStatus={supabaseStatus}
              onShowToast={addToast}
            />
          )}
        </main>
      </div>

      {/* 3. MODALS & TOASTS */}
      {/* Student Details Dossier Modal */}
      <StudentDetailsModal
        student={viewingStudent}
        isOpen={Boolean(viewingStudent)}
        onClose={() => setViewingStudent(null)}
        onAdmit={handleAdmitStudent}
        onReject={handleRejectStudent}
        onChangeStatus={handleChangeStatusDirectly}
        onEdit={(student) => {
          setViewingStudent(null);
          setEditingStudent(student);
        }}
        onDelete={handleDeleteStudent}
      />

      {/* Edit Student Record Modal */}
      <EditStudentModal
        student={editingStudent}
        isOpen={Boolean(editingStudent)}
        onClose={() => setEditingStudent(null)}
        onSave={handleSaveStudentEdit}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalState.isOpen}
        type={confirmModalState.type}
        count={confirmModalState.bulkIds?.length || 1}
        studentName={confirmModalState.student?.full_name}
        registrationId={confirmModalState.student?.registration_id}
        isLoading={confirmModalState.isLoading}
        onConfirm={executeConfirmation}
        onCancel={() =>
          setConfirmModalState({ isOpen: false, type: 'admit', isLoading: false })
        }
      />

      {/* Floating Notifications */}
      <AdminToast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
