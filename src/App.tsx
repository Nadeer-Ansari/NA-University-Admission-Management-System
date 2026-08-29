import React, { useState } from 'react';
import { 
  AcademicYear, 
  AdmissionApplication, 
  AdmissionStatus, 
  ApplicationUser, 
  AuditLog, 
  Course, 
  FeePayment, 
  PaymentFormInput, 
  PaymentMethod, 
  TeacherCourse, 
  TeacherProfile 
} from './types';
import { 
  INITIAL_ACADEMIC_YEARS, 
  INITIAL_APPLICATIONS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_COURSES, 
  INITIAL_TEACHER_COURSES, 
  INITIAL_TEACHER_PROFILES, 
  INITIAL_USERS 
} from './data/initialSeed';
import { Navbar } from './components/Navbar';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { AccountsPortal } from './components/AccountsPortal';
import { AdminPortal } from './components/AdminPortal';
import { ReceiptModal } from './components/ReceiptModal';
import { CodeExplorerModal } from './components/CodeExplorerModal';
import { ApplicationNumberGenerator } from './services/applicationNumberGenerator';
import { UNIVERSITY_SETTINGS } from './data/universitySettings';
import { useTheme } from './hooks/useTheme';
import { 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ExternalLink
} from 'lucide-react';

export default function App() {
  // Theme management hook
  const { theme, toggleTheme } = useTheme();

  // App State
  const [users, setUsers] = useState<ApplicationUser[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<ApplicationUser>(INITIAL_USERS[4]); // Default to Student Rahul Verma
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(INITIAL_ACADEMIC_YEARS);
  const [teacherProfiles, setTeacherProfiles] = useState<TeacherProfile[]>(INITIAL_TEACHER_PROFILES);
  const [teacherCourses, setTeacherCourses] = useState<TeacherCourse[]>(INITIAL_TEACHER_COURSES);
  const [applications, setApplications] = useState<AdmissionApplication[]>(INITIAL_APPLICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Modal States
  const [activeReceipt, setActiveReceipt] = useState<{ app: AdmissionApplication; payment: FeePayment } | null>(null);
  const [showCodeExplorer, setShowCodeExplorer] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper: Append Audit Log
  const logAuditAction = (action: string, entityName: string, entityId: string, oldValues?: string, newValues?: string) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      action,
      entityName,
      entityId,
      oldValues,
      newValues,
      ipAddress: '127.0.0.1 (Local Session)',
      createdAt: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Student Actions
  const handleSaveDraftApplication = (updatedApp: AdmissionApplication) => {
    setApplications(prev => {
      const idx = prev.findIndex(a => a.id === updatedApp.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedApp;
        return next;
      }
      return [updatedApp, ...prev];
    });

    logAuditAction(
      updatedApp.status === 'Submitted' ? 'SubmitAdmissionApplication' : 'SaveDraftAdmission',
      'AdmissionApplication',
      updatedApp.id,
      undefined,
      JSON.stringify({ appNo: updatedApp.applicationNumber, status: updatedApp.status, aadhaar: updatedApp.aadhaarMasked })
    );

    showToast(
      updatedApp.status === 'Submitted'
        ? `Application ${updatedApp.applicationNumber} submitted successfully!`
        : 'Application draft saved.'
    );
  };

  const handleSubmitApplication = (appId: string) => {
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status: 'Submitted',
          submissionDate: new Date().toISOString(),
          statusHistories: [
            ...(a.statusHistories || []),
            {
              id: `sh-${Date.now()}`,
              admissionApplicationId: a.id,
              previousStatus: a.status,
              newStatus: 'Submitted',
              changedByUserId: currentUser.id,
              changedByName: currentUser.fullName,
              changedAt: new Date().toISOString(),
              remarks: 'Candidate submitted application online.',
            }
          ]
        };
      }
      return a;
    }));

    logAuditAction('SubmitAdmissionApplication', 'AdmissionApplication', appId, 'Draft', 'Submitted');
    showToast('Application submitted for academic review.');
  };

  const handleSubmitPayment = (input: PaymentFormInput) => {
    const txnNumber = ApplicationNumberGenerator.generateTransactionNumber();
    
    setApplications(prev => prev.map(app => {
      if (app.id === input.applicationId) {
        const currentVerified = app.payments?.filter(p => p.verificationStatus === 'Verified').reduce((sum, p) => sum + p.amountPaid, 0) || 0;
        const remaining = Math.max(0, app.totalFeePayable - (currentVerified + input.amountPaid));

        const newPayment: FeePayment = {
          id: `pay-${Date.now()}`,
          admissionApplicationId: app.id,
          transactionNumber: txnNumber,
          totalFee: app.totalFeePayable,
          amountPaid: input.amountPaid,
          remainingAmount: remaining,
          paymentMethod: input.paymentMethod,
          externalReferenceNumber: input.externalReferenceNumber,
          paymentDate: new Date().toISOString(),
          paymentStatus: 'UnderVerification',
          verificationStatus: 'Pending',
          remarks: input.remarks,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return {
          ...app,
          feeStatus: 'UnderVerification',
          payments: [...(app.payments || []), newPayment]
        };
      }
      return app;
    }));

    logAuditAction('SubmitFeePayment', 'FeePayment', txnNumber, undefined, JSON.stringify({ amount: input.amountPaid, method: input.paymentMethod }));
    showToast(`Payment reference ${input.externalReferenceNumber} submitted for verification.`);
  };

  // Accounts Actions
  const handleVerifyPayment = (paymentId: string, isApproved: boolean, remarks: string) => {
    setApplications(prev => prev.map(app => {
      if (!app.payments) return app;
      const paymentIndex = app.payments.findIndex(p => p.id === paymentId);
      if (paymentIndex === -1) return app;

      const updatedPayments = [...app.payments];
      const targetPayment = updatedPayments[paymentIndex];

      const receiptNo = isApproved ? ApplicationNumberGenerator.generateReceiptNumber() : undefined;

      updatedPayments[paymentIndex] = {
        ...targetPayment,
        verificationStatus: isApproved ? 'Verified' : 'Rejected',
        paymentStatus: isApproved ? 'Paid' : 'Rejected',
        verifiedByUserId: currentUser.id,
        verifiedByName: currentUser.fullName,
        verifiedAt: new Date().toISOString(),
        remarks,
        receiptNumber: receiptNo,
      };

      const totalVerified = updatedPayments
        .filter(p => p.verificationStatus === 'Verified')
        .reduce((sum, p) => sum + p.amountPaid, 0);

      const isFullyPaid = totalVerified >= app.totalFeePayable;
      const newFeeStatus = isFullyPaid ? 'Paid' : (totalVerified > 0 ? 'PartiallyPaid' : 'Failed');
      const newAppStatus = isApproved && isFullyPaid ? 'AdmissionConfirmed' : app.status;

      return {
        ...app,
        feeStatus: newFeeStatus,
        status: newAppStatus,
        payments: updatedPayments,
        statusHistories: (isApproved && isFullyPaid && app.status !== 'AdmissionConfirmed') ? [
          ...(app.statusHistories || []),
          {
            id: `sh-${Date.now()}`,
            admissionApplicationId: app.id,
            previousStatus: app.status,
            newStatus: 'AdmissionConfirmed',
            changedByUserId: currentUser.id,
            changedByName: currentUser.fullName,
            changedAt: new Date().toISOString(),
            remarks: `Full course fee ₹${app.totalFeePayable.toLocaleString()} cleared. Admission confirmed.`,
          }
        ] : app.statusHistories
      };
    }));

    logAuditAction(isApproved ? 'VerifyFeePayment' : 'RejectFeePayment', 'FeePayment', paymentId, 'Pending', isApproved ? 'Verified' : 'Rejected');
    showToast(isApproved ? 'Payment verified and receipt generated!' : 'Payment marked as rejected.', isApproved ? 'success' : 'error');
  };

  const handleRecordOfflinePayment = (appId: string, amount: number, method: PaymentMethod, refNo: string, remarks: string) => {
    const txnNumber = ApplicationNumberGenerator.generateTransactionNumber();
    const receiptNumber = ApplicationNumberGenerator.generateReceiptNumber();

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const verifiedPaid = app.payments?.filter(p => p.verificationStatus === 'Verified').reduce((sum, p) => sum + p.amountPaid, 0) || 0;
        const remaining = Math.max(0, app.totalFeePayable - (verifiedPaid + amount));

        const payment: FeePayment = {
          id: `pay-${Date.now()}`,
          admissionApplicationId: app.id,
          transactionNumber: txnNumber,
          totalFee: app.totalFeePayable,
          amountPaid: amount,
          remainingAmount: remaining,
          paymentMethod: method,
          externalReferenceNumber: refNo,
          paymentDate: new Date().toISOString(),
          paymentStatus: 'Paid',
          verificationStatus: 'Verified',
          verifiedByUserId: currentUser.id,
          verifiedByName: currentUser.fullName,
          verifiedAt: new Date().toISOString(),
          receiptNumber,
          remarks,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const isFullyPaid = (verifiedPaid + amount) >= app.totalFeePayable;

        return {
          ...app,
          feeStatus: isFullyPaid ? 'Paid' : 'PartiallyPaid',
          status: isFullyPaid ? 'AdmissionConfirmed' : app.status,
          payments: [...(app.payments || []), payment],
          statusHistories: isFullyPaid ? [
            ...(app.statusHistories || []),
            {
              id: `sh-${Date.now()}`,
              admissionApplicationId: app.id,
              previousStatus: app.status,
              newStatus: 'AdmissionConfirmed',
              changedByUserId: currentUser.id,
              changedByName: currentUser.fullName,
              changedAt: new Date().toISOString(),
              remarks: 'Counter offline payment verified. Seat confirmed.',
            }
          ] : app.statusHistories
        };
      }
      return app;
    }));

    logAuditAction('RecordOfflineCounterPayment', 'FeePayment', txnNumber, undefined, JSON.stringify({ amount, method, refNo }));
    showToast(`Offline counter payment of ₹${amount.toLocaleString()} recorded and receipt issued.`);
  };

  // Administrator Actions
  const handleUpdateAppStatus = (appId: string, newStatus: AdmissionStatus, remarks: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const prevStatus = app.status;
        return {
          ...app,
          status: newStatus,
          statusHistories: [
            ...(app.statusHistories || []),
            {
              id: `sh-${Date.now()}`,
              admissionApplicationId: app.id,
              previousStatus: prevStatus,
              newStatus,
              changedByUserId: currentUser.id,
              changedByName: currentUser.fullName,
              changedAt: new Date().toISOString(),
              remarks,
            }
          ]
        };
      }
      return app;
    }));

    logAuditAction('UpdateAdmissionStatus', 'AdmissionApplication', appId, undefined, JSON.stringify({ newStatus, remarks }));
    showToast(`Application status updated to ${newStatus}`);
  };

  const handleAddCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
    logAuditAction('CreateCourse', 'Course', course.id, undefined, JSON.stringify({ code: course.code, name: course.name, fee: course.semesterFee }));
    showToast(`Program ${course.code} added to course catalog.`);
  };

  const handleAddAcademicYear = (ay: AcademicYear) => {
    setAcademicYears(prev => [...prev, ay]);
    logAuditAction('CreateAcademicYear', 'AcademicYear', ay.id, undefined, JSON.stringify({ year: ay.yearName }));
    showToast(`Academic session ${ay.yearName} configured.`);
  };

  const handleAssignTeacherCourse = (teacherProfileId: string, courseId: string) => {
    const existing = teacherCourses.find(tc => tc.teacherProfileId === teacherProfileId && tc.courseId === courseId);
    if (existing) {
      showToast('Course is already assigned to this faculty member.', 'info');
      return;
    }

    const newAssignment: TeacherCourse = {
      id: `tc-${Date.now()}`,
      teacherProfileId,
      courseId,
      assignedAt: new Date().toISOString(),
    };

    setTeacherCourses(prev => [...prev, newAssignment]);
    logAuditAction('AssignTeacherCourse', 'TeacherCourse', newAssignment.id, undefined, JSON.stringify({ teacherProfileId, courseId }));
    showToast('Faculty course assignment updated.');
  };

  const handleRemoveTeacherCourse = (assignmentId: string) => {
    setTeacherCourses(prev => prev.filter(tc => tc.id !== assignmentId));
    logAuditAction('RemoveTeacherCourse', 'TeacherCourse', assignmentId);
    showToast('Faculty course allocation revoked.', 'info');
  };

  const handleToggleUserActive = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextState = !u.isActive;
        logAuditAction('ToggleUserActive', 'ApplicationUser', u.id, u.isActive.toString(), nextState.toString());
        return { ...u, isActive: nextState };
      }
      return u;
    }));
    showToast('User account status updated.');
  };

  return (
    <div className="min-h-screen bg-[var(--nau-bg-primary)] flex flex-col font-sans text-[var(--nau-text-primary)] transition-colors duration-200">
      
      {/* Top Universal Navbar */}
      <Navbar
        currentUser={currentUser}
        availableUsers={users}
        onSwitchUser={(user) => {
          setCurrentUser(user);
          showToast(`Switched active session to ${user.fullName} (${user.role})`, 'info');
        }}
        onOpenCodeExplorer={() => setShowCodeExplorer(true)}
        activeAcademicYear={academicYears.find(y => y.isCurrent)?.yearName || '2026-2027'}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Role-Based View */}
        {currentUser.role === 'Student' && (
          <StudentPortal
            currentUser={currentUser}
            applications={applications}
            courses={courses}
            academicYears={academicYears}
            onSaveDraft={handleSaveDraftApplication}
            onSubmitApplication={handleSubmitApplication}
            onSubmitPayment={handleSubmitPayment}
            onViewReceipt={(app, payment) => setActiveReceipt({ app, payment })}
          />
        )}

        {currentUser.role === 'Teacher' && (
          <TeacherPortal
            currentUser={currentUser}
            teacherProfiles={teacherProfiles}
            teacherCourses={teacherCourses}
            courses={courses}
            academicYears={academicYears}
            applications={applications}
          />
        )}

        {currentUser.role === 'AccountsOfficer' && (
          <AccountsPortal
            currentUser={currentUser}
            applications={applications}
            courses={courses}
            onVerifyPayment={handleVerifyPayment}
            onRecordOfflinePayment={handleRecordOfflinePayment}
            onViewReceipt={(app, payment) => setActiveReceipt({ app, payment })}
          />
        )}

        {currentUser.role === 'Administrator' && (
          <AdminPortal
            currentUser={currentUser}
            users={users}
            courses={courses}
            academicYears={academicYears}
            applications={applications}
            teacherProfiles={teacherProfiles}
            teacherCourses={teacherCourses}
            auditLogs={auditLogs}
            onUpdateAppStatus={handleUpdateAppStatus}
            onAddCourse={handleAddCourse}
            onAddAcademicYear={handleAddAcademicYear}
            onAssignTeacherCourse={handleAssignTeacherCourse}
            onRemoveTeacherCourse={handleRemoveTeacherCourse}
            onToggleUserActive={handleToggleUserActive}
          />
        )}

      </main>

      {/* Footer with Branding & Architecture Badges */}
      <footer className="bg-[var(--nau-bg-secondary)] border-t border-[var(--nau-border)] py-6 mt-12 text-[var(--nau-text-muted)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[var(--nau-primary)]" />
            <span className="font-semibold text-[var(--nau-text-primary)]">
              © {UNIVERSITY_SETTINGS.universityName} | Founded by {UNIVERSITY_SETTINGS.founderName}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              AES-256 Aadhaar Protected
            </span>
            <button
              onClick={() => setShowCodeExplorer(true)}
              className="font-bold text-[var(--nau-primary)] hover:underline transition-colors cursor-pointer"
            >
              Explore C# Solution Source Files →
            </button>
          </div>
        </div>
      </footer>

      {/* Printable Fee Receipt Modal */}
      {activeReceipt && (
        <ReceiptModal
          application={activeReceipt.app}
          payment={activeReceipt.payment}
          course={courses.find(c => c.id === activeReceipt.app.courseId)}
          onClose={() => setActiveReceipt(null)}
        />
      )}

      {/* C# ASP.NET Core Solution Code Explorer Modal */}
      {showCodeExplorer && (
        <CodeExplorerModal
          onClose={() => setShowCodeExplorer(false)}
        />
      )}

      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-2xl border border-[var(--nau-border)] flex items-center gap-2.5 text-xs font-semibold ${
            toastMessage.type === 'error' 
              ? 'bg-rose-600 text-white' 
              : toastMessage.type === 'info' 
              ? 'bg-[var(--nau-bg-card)] text-[var(--nau-text-primary)]' 
              : 'bg-emerald-600 text-white'
          }`}>
            {toastMessage.type === 'error' ? <AlertTriangle className="w-4 h-4 text-white" /> :
             toastMessage.type === 'info' ? <Info className="w-4 h-4 text-[var(--nau-primary)]" /> :
             <CheckCircle2 className="w-4 h-4 text-white" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

    </div>
  );
}
