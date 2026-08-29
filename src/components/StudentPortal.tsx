import React, { useState, useEffect } from 'react';
import { 
  AcademicYear, 
  AdmissionApplication, 
  AdmissionFormInput, 
  AdmissionStatus, 
  ApplicationUser, 
  Course, 
  FeePayment, 
  PaymentFormInput, 
  PaymentMethod,
  ProgramLevel 
} from '../types';
import { UNIVERSITY_SETTINGS } from '../data/universitySettings';
import { SensitiveDataProtectionService } from '../services/sensitiveDataService';
import { ApplicationNumberGenerator } from '../services/applicationNumberGenerator';
import { 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Receipt, 
  PlusCircle, 
  Send, 
  Save, 
  ArrowRight,
  Eye,
  CheckCircle,
  GraduationCap,
  Sparkles,
  BookOpen,
  Building2,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentPortalProps {
  currentUser: ApplicationUser;
  applications: AdmissionApplication[];
  courses: Course[];
  academicYears: AcademicYear[];
  onSaveDraft: (app: AdmissionApplication) => void;
  onSubmitApplication: (appId: string) => void;
  onSubmitPayment: (input: PaymentFormInput) => void;
  onViewReceipt: (app: AdmissionApplication, payment: FeePayment) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentUser,
  applications,
  courses,
  academicYears,
  onSaveDraft,
  onSubmitApplication,
  onSubmitPayment,
  onViewReceipt,
}) => {
  const currentAcademicYear = academicYears.find(ay => ay.isCurrent) || academicYears[0];
  const userApplications = applications.filter(a => a.studentUserId === currentUser.id);
  const activeApplication = userApplications[0]; // Primary application

  const [activeTab, setActiveTab] = useState<'form' | 'status' | 'fee'>('form');

  // Initial Program Level derived from existing app or default 'Undergraduate'
  const initialProgramLevel: ProgramLevel = activeApplication?.programLevel || 'Undergraduate';
  const [selectedProgramLevel, setSelectedProgramLevel] = useState<ProgramLevel>(initialProgramLevel);

  // Active filtered courses based on program level
  const activeCoursesForLevel = courses.filter(
    c => c.isActive && c.programLevel === selectedProgramLevel
  );

  const initialCourse = activeCoursesForLevel.find(c => c.id === activeApplication?.courseId) || activeCoursesForLevel[0] || courses[0];

  // Form State
  const [formData, setFormData] = useState<AdmissionFormInput>({
    fullName: activeApplication?.fullName || currentUser.fullName,
    dateOfBirth: activeApplication?.dateOfBirth || '2006-04-15',
    gender: activeApplication?.gender || 'Male',
    email: activeApplication?.email || currentUser.email,
    mobileNumber: activeApplication?.mobileNumber || currentUser.phoneNumber || '9876543210',
    addressLine: activeApplication?.addressLine || 'House 42, Sector 8, Innovation Park',
    city: activeApplication?.city || 'Bengaluru',
    state: activeApplication?.state || 'Karnataka',
    pinCode: activeApplication?.pinCode || '560034',
    aadhaarNumber: '987654321012',
    programLevel: selectedProgramLevel,
    courseId: activeApplication?.courseId || initialCourse?.id || '',
    academicYearId: activeApplication?.academicYearId || currentAcademicYear?.id || '',
    previousQualification: activeApplication?.previousQualification || (selectedProgramLevel === 'Undergraduate' ? 'Higher Secondary (10+2 PCM)' : 'B.Tech / BE in Engineering'),
    previousInstitute: activeApplication?.previousInstitute || 'Senior Secondary School of Science',
    previousPercentage: activeApplication?.previousPercentage || 92.5,
    bachelorDegreeName: activeApplication?.bachelorDegreeName || '',
    bachelorUniversityName: activeApplication?.bachelorUniversityName || '',
    bachelorGraduationYear: activeApplication?.bachelorGraduationYear || 2025,
    bachelorPercentageOrCGPA: activeApplication?.bachelorPercentageOrCGPA || 8.5,
    studentDeclaration: activeApplication?.studentDeclaration ?? true,
  });

  // Keep courseId synchronized when program level changes
  useEffect(() => {
    setFormData(prev => {
      const validCourses = courses.filter(c => c.isActive && c.programLevel === selectedProgramLevel);
      const isCurrentCourseValid = validCourses.some(c => c.id === prev.courseId);
      const nextCourseId = isCurrentCourseValid ? prev.courseId : (validCourses[0]?.id || '');

      return {
        ...prev,
        programLevel: selectedProgramLevel,
        courseId: nextCourseId,
        previousQualification: prev.previousQualification || (selectedProgramLevel === 'Undergraduate' ? 'Higher Secondary (10+2 PCM)' : 'B.Tech / BE Degree')
      };
    });
  }, [selectedProgramLevel, courses]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Payment Form States
  const currentSelectedCourse = courses.find(c => c.id === formData.courseId) || courses[0];
  const [paymentAmount, setPaymentAmount] = useState<number>(activeApplication?.totalFeePayable || currentSelectedCourse?.semesterFee || 65000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [refNumber, setRefNumber] = useState('');
  const [paymentRemarks, setPaymentRemarks] = useState('First semester academic tuition fee');

  // Status Badge Helper matching prompt specifications
  const renderStatusBadge = (status: AdmissionStatus | string) => {
    switch (status) {
      case 'Draft':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">Draft</span>;
      case 'Submitted':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-400 border border-blue-800/60">Submitted</span>;
      case 'UnderReview':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-400 border border-purple-800/60">Under Review</span>;
      case 'DocumentsPending':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/60">Documents Pending</span>;
      case 'Approved':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">Approved</span>;
      case 'Rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/60">Rejected</span>;
      case 'AdmissionConfirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-900/90 text-emerald-300 border border-emerald-700/80">Admission Confirmed</span>;
      case 'Pending':
      case 'PendingPayment':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/60">Pending Payment</span>;
      case 'Paid':
      case 'Verified':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">Paid</span>;
      case 'PartiallyPaid':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/60">Partially Paid</span>;
      case 'Failed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/60">Failed</span>;
      case 'Refunded':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">Refunded</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">{status}</span>;
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full legal candidate name is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    if (!formData.mobileNumber || formData.mobileNumber.length < 10) errs.mobileNumber = '10-digit mobile number required';
    if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) errs.aadhaarNumber = '12-digit Aadhaar number required for verification';
    if (!formData.courseId) errs.courseId = 'Please choose an engineering degree course';
    if (formData.previousPercentage <= 0 || formData.previousPercentage > 100) errs.previousPercentage = 'Valid percentage between 1 and 100 required';
    if (!formData.studentDeclaration) errs.studentDeclaration = 'Candidate declaration must be agreed to proceed';

    if (selectedProgramLevel === 'Postgraduate') {
      if (!formData.bachelorDegreeName?.trim()) errs.bachelorDegreeName = 'Qualifying Bachelor degree title is required for ME';
      if (!formData.bachelorUniversityName?.trim()) errs.bachelorUniversityName = 'Graduation university name is required';
      if (!formData.bachelorPercentageOrCGPA) errs.bachelorPercentageOrCGPA = 'Bachelor CGPA / % is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveOrSubmit = (isFinalSubmit: boolean) => {
    if (isFinalSubmit && !validateForm()) {
      return;
    }

    const selectedCourse = courses.find(c => c.id === formData.courseId) || courses[0];
    const selectedYear = academicYears.find(y => y.id === formData.academicYearId) || currentAcademicYear;

    const appNumber = activeApplication?.applicationNumber || 
      ApplicationNumberGenerator.generate(selectedYear.yearName, selectedCourse.code, applications.length);

    const updatedApp: AdmissionApplication = {
      id: activeApplication?.id || `app-${Date.now()}`,
      applicationNumber: appNumber,
      studentUserId: currentUser.id,
      courseId: formData.courseId,
      academicYearId: formData.academicYearId,
      programLevel: formData.programLevel,
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      addressLine: formData.addressLine,
      city: formData.city,
      state: formData.state,
      pinCode: formData.pinCode,
      aadhaarMasked: SensitiveDataProtectionService.maskAadhaar(formData.aadhaarNumber),
      aadhaarEncrypted: SensitiveDataProtectionService.encrypt(formData.aadhaarNumber),
      aadhaarHash: SensitiveDataProtectionService.hashAadhaar(formData.aadhaarNumber),
      previousQualification: formData.previousQualification,
      previousInstitute: formData.previousInstitute,
      previousPercentage: Number(formData.previousPercentage),
      bachelorDegreeName: formData.bachelorDegreeName,
      bachelorUniversityName: formData.bachelorUniversityName,
      bachelorGraduationYear: formData.bachelorGraduationYear,
      bachelorPercentageOrCGPA: formData.bachelorPercentageOrCGPA ? Number(formData.bachelorPercentageOrCGPA) : undefined,
      studentDeclaration: formData.studentDeclaration,
      status: isFinalSubmit ? 'Submitted' : (activeApplication?.status || 'Draft'),
      applicationDate: activeApplication?.applicationDate || new Date().toISOString(),
      submissionDate: isFinalSubmit ? new Date().toISOString() : activeApplication?.submissionDate,
      totalFeePayable: selectedCourse.semesterFee,
      feeStatus: activeApplication?.feeStatus || 'Pending',
      statusHistories: [
        ...(activeApplication?.statusHistories || []),
        {
          id: `sh-${Date.now()}`,
          admissionApplicationId: activeApplication?.id || `app-${Date.now()}`,
          previousStatus: activeApplication?.status || 'Draft',
          newStatus: isFinalSubmit ? 'Submitted' : 'Draft',
          changedByUserId: currentUser.id,
          changedByName: currentUser.fullName,
          changedAt: new Date().toISOString(),
          remarks: isFinalSubmit ? `Candidate submitted application for ${selectedCourse.name} (${selectedCourse.code}).` : 'Draft updated.',
        }
      ],
      payments: activeApplication?.payments || []
    };

    onSaveDraft(updatedApp);
    if (isFinalSubmit) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      setActiveTab('status');
    }
  };

  const selectedCourseDetails = courses.find(c => c.id === (activeApplication?.courseId || formData.courseId));
  const verifiedPaymentsTotal = activeApplication?.payments
    ?.filter(p => p.verificationStatus === 'Verified')
    .reduce((sum, p) => sum + p.amountPaid, 0) || 0;
  const remainingFee = Math.max(0, (activeApplication?.totalFeePayable || currentSelectedCourse?.semesterFee || 65000) - verifiedPaymentsTotal);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome Card */}
      <div className="bg-[var(--nau-card-bg)] rounded-2xl border border-[var(--nau-border)] p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--nau-primary)] bg-[var(--nau-surface)] border border-[var(--nau-border)] px-2.5 py-0.5 rounded-full">
              {UNIVERSITY_SETTINGS.universityName} • Student Admission Portal
            </span>
            <span className="text-xs text-[var(--nau-text-muted)] font-medium">
              Academic Session {currentAcademicYear?.yearName}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--nau-text-primary)] mt-1.5">
            Welcome, {currentUser.fullName}
          </h1>
          <p className="text-xs text-[var(--nau-text-secondary)] mt-0.5 max-w-2xl leading-relaxed">
            Submit your undergraduate (BE) or postgraduate (ME) engineering application, track document verification, and manage semester fees securely.
          </p>
        </div>

        {activeApplication && (
          <div className="bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl p-3.5 flex items-center gap-4">
            <div>
              <div className="text-[10px] text-[var(--nau-text-muted)] font-semibold uppercase tracking-wider">
                Application Number
              </div>
              <div className="font-mono font-bold text-xs text-[var(--nau-primary)] mt-0.5">
                {activeApplication.applicationNumber}
              </div>
            </div>
            <div className="h-8 w-px bg-[var(--nau-border)]" />
            <div>
              <div className="text-[10px] text-[var(--nau-text-muted)] font-semibold uppercase tracking-wider">
                Current Status
              </div>
              <div className="mt-0.5">
                {renderStatusBadge(activeApplication.status)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--nau-border)] pb-2.5">
        <button
          onClick={() => setActiveTab('form')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'form'
              ? 'bg-[var(--nau-primary)] text-white shadow-lg shadow-blue-500/20'
              : 'text-[var(--nau-text-secondary)] hover:bg-[var(--nau-card-bg)] hover:text-[var(--nau-text-primary)]'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-200" />
          <span>1. Admission Application Form</span>
        </button>

        <button
          onClick={() => setActiveTab('status')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'status'
              ? 'bg-[var(--nau-primary)] text-white shadow-lg shadow-blue-500/20'
              : 'text-[var(--nau-text-secondary)] hover:bg-[var(--nau-card-bg)] hover:text-[var(--nau-text-primary)]'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-300" />
          <span>2. Application Status & Audit History</span>
        </button>

        <button
          onClick={() => setActiveTab('fee')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'fee'
              ? 'bg-[var(--nau-primary)] text-white shadow-lg shadow-blue-500/20'
              : 'text-[var(--nau-text-secondary)] hover:bg-[var(--nau-card-bg)] hover:text-[var(--nau-text-primary)]'
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-300" />
          <span>3. Fee Payment & Official Receipt</span>
        </button>
      </div>

      {/* TAB 1: ADMISSION APPLICATION FORM */}
      {activeTab === 'form' && (
        <div className="bg-[var(--nau-card-bg)] rounded-2xl border border-[var(--nau-border)] p-6 sm:p-7 shadow-xl space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--nau-border)] pb-4">
            <div>
              <h2 className="text-base font-bold text-[var(--nau-text-primary)]">
                {UNIVERSITY_SETTINGS.universityName} Engineering Admission Form
              </h2>
              <p className="text-xs text-[var(--nau-text-muted)] mt-0.5">
                Select your program level (BE or ME), choose your engineering discipline, and provide verified qualifications.
              </p>
            </div>
            {activeApplication?.status && activeApplication.status !== 'Draft' && (
              <div className="self-start sm:self-auto">
                {renderStatusBadge(activeApplication.status)}
              </div>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSaveOrSubmit(true); }} className="space-y-8">
            
            {/* STEP 1: PROGRAM LEVEL SELECTION (BE vs ME) */}
            <div className="space-y-3 bg-[var(--nau-surface-tertiary)] p-5 rounded-2xl border border-[var(--nau-border)]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[var(--nau-text-secondary)] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[var(--nau-primary)] text-white flex items-center justify-center text-[11px] font-bold">1</span>
                  Select Degree Program Level
                </h3>
                <span className="text-[11px] text-[var(--nau-text-muted)] font-medium">
                  Step 1 of 4 • Select BE or ME
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                
                {/* Undergraduate (BE) Card */}
                <button
                  type="button"
                  onClick={() => setSelectedProgramLevel('Undergraduate')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                    selectedProgramLevel === 'Undergraduate'
                      ? 'border-[var(--nau-primary)] bg-[var(--nau-surface)] shadow-lg shadow-blue-500/10 ring-2 ring-[var(--nau-primary)]/30'
                      : 'border-[var(--nau-border)] bg-[var(--nau-card-bg)] hover:border-slate-500 hover:bg-[var(--nau-surface)]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        selectedProgramLevel === 'Undergraduate' ? 'bg-[var(--nau-primary)] text-white' : 'bg-[var(--nau-surface-tertiary)] text-[var(--nau-text-muted)] border border-[var(--nau-border)]'
                      }`}>
                        BE
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[var(--nau-text-primary)]">
                          Bachelor of Engineering (BE)
                        </div>
                        <div className="text-[11px] text-[var(--nau-text-muted)]">
                          Undergraduate Degree Program
                        </div>
                      </div>
                    </div>
                    {selectedProgramLevel === 'Undergraduate' && (
                      <CheckCircle2 className="w-4 h-4 text-[var(--nau-primary)]" />
                    )}
                  </div>
                  <div className="mt-3 text-[11px] text-[var(--nau-text-secondary)] grid grid-cols-2 gap-2 pt-2 border-t border-[var(--nau-border)]">
                    <div>Duration: <span className="font-semibold text-[var(--nau-text-primary)]">4 Years</span></div>
                    <div>Semesters: <span className="font-semibold text-[var(--nau-text-primary)]">8 Semesters</span></div>
                    <div className="col-span-2 text-[var(--nau-primary)] font-medium">
                      28 Specializations Available (BE-COMP, BE-IT, BE-AI-DS, etc.)
                    </div>
                  </div>
                </button>

                {/* Postgraduate (ME) Card */}
                <button
                  type="button"
                  onClick={() => setSelectedProgramLevel('Postgraduate')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                    selectedProgramLevel === 'Postgraduate'
                      ? 'border-[var(--nau-secondary)] bg-[var(--nau-surface)] shadow-lg shadow-purple-500/10 ring-2 ring-[var(--nau-secondary)]/30'
                      : 'border-[var(--nau-border)] bg-[var(--nau-card-bg)] hover:border-slate-500 hover:bg-[var(--nau-surface)]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        selectedProgramLevel === 'Postgraduate' ? 'bg-[var(--nau-secondary)] text-white' : 'bg-[var(--nau-surface-tertiary)] text-[var(--nau-text-muted)] border border-[var(--nau-border)]'
                      }`}>
                        ME
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[var(--nau-text-primary)]">
                          Master of Engineering (ME)
                        </div>
                        <div className="text-[11px] text-[var(--nau-text-muted)]">
                          Postgraduate Degree Program
                        </div>
                      </div>
                    </div>
                    {selectedProgramLevel === 'Postgraduate' && (
                      <CheckCircle2 className="w-4 h-4 text-[var(--nau-secondary)]" />
                    )}
                  </div>
                  <div className="mt-3 text-[11px] text-[var(--nau-text-secondary)] grid grid-cols-2 gap-2 pt-2 border-t border-[var(--nau-border)]">
                    <div>Duration: <span className="font-semibold text-[var(--nau-text-primary)]">2 Years</span></div>
                    <div>Semesters: <span className="font-semibold text-[var(--nau-text-primary)]">4 Semesters</span></div>
                    <div className="col-span-2 text-[var(--nau-secondary)] font-medium">
                      30 Advanced Disciplines (ME-COMP, ME-AI, ME-VLSI, ME-CYBER, etc.)
                    </div>
                  </div>
                </button>

              </div>
            </div>

            {/* STEP 2: COURSE & ACADEMIC YEAR SELECTION */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[var(--nau-text-muted)] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--nau-surface)] text-[var(--nau-primary)] border border-[var(--nau-border)] flex items-center justify-center text-[11px] font-bold">2</span>
                Choose Engineering Course ({selectedProgramLevel === 'Undergraduate' ? 'BE Courses' : 'ME Courses'})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Engineering Discipline ({selectedProgramLevel === 'Undergraduate' ? 'BE - 28 Courses' : 'ME - 30 Courses'}) <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => {
                      const cId = e.target.value;
                      setFormData({ ...formData, courseId: cId });
                      const sel = courses.find(c => c.id === cId);
                      if (sel) setPaymentAmount(sel.semesterFee);
                    }}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none bg-[var(--nau-surface)] text-[var(--nau-text-primary)] transition-all ${
                      errors.courseId ? 'border-rose-500' : 'border-[var(--nau-border)]'
                    }`}
                  >
                    {activeCoursesForLevel.map((course) => (
                      <option key={course.id} value={course.id} className="bg-[var(--nau-surface)] text-[var(--nau-text-primary)]">
                        {course.code} - {course.name} ({course.durationYears} Yrs / {course.totalSemesters} Semesters) - Semester Fee: ₹{course.semesterFee.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  {errors.courseId && <p className="text-[11px] text-rose-400 mt-1">{errors.courseId}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Academic Session <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.academicYearId}
                    onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[var(--nau-border)] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none bg-[var(--nau-surface)] text-[var(--nau-text-primary)] transition-all"
                  >
                    {academicYears.map((ay) => (
                      <option key={ay.id} value={ay.id} className="bg-[var(--nau-surface)] text-[var(--nau-text-primary)]">
                        {ay.yearName} {ay.isCurrent ? `(${UNIVERSITY_SETTINGS.universityName} Active Session)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* STEP 3: PERSONAL & CONTACT INFORMATION */}
            <div className="space-y-4 pt-4 border-t border-[var(--nau-border)]">
              <h3 className="text-xs font-bold text-[var(--nau-text-muted)] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--nau-surface)] text-[var(--nau-primary)] border border-[var(--nau-border)] flex items-center justify-center text-[11px] font-bold">3</span>
                Personal Details & Aadhaar Protection
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Full Name (As per Certificates) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none transition-all bg-[var(--nau-surface)] text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] ${
                      errors.fullName ? 'border-rose-500' : 'border-[var(--nau-border)]'
                    }`}
                    placeholder="Candidate full name"
                  />
                  {errors.fullName && <p className="text-[11px] text-rose-400 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Date of Birth <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[var(--nau-border)] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none bg-[var(--nau-surface)] text-[var(--nau-text-primary)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Gender <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[var(--nau-border)] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none bg-[var(--nau-surface)] text-[var(--nau-text-primary)] transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none transition-all bg-[var(--nau-surface)] text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] ${
                      errors.email ? 'border-rose-500' : 'border-[var(--nau-border)]'
                    }`}
                    placeholder="student@example.com"
                  />
                  {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Mobile Number (10 Digits) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none transition-all bg-[var(--nau-surface)] text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] ${
                      errors.mobileNumber ? 'border-rose-500' : 'border-[var(--nau-border)]'
                    }`}
                    placeholder="9876543210"
                  />
                  {errors.mobileNumber && <p className="text-[11px] text-rose-400 mt-1">{errors.mobileNumber}</p>}
                </div>

                {/* Aadhaar with Security Banner */}
                <div>
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Aadhaar Number (12 Digits) <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={12}
                      value={formData.aadhaarNumber}
                      onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value.replace(/\D/g, '') })}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-mono font-semibold focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none transition-all bg-[var(--nau-surface)] text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] ${
                        errors.aadhaarNumber ? 'border-rose-500' : 'border-[var(--nau-border)]'
                      }`}
                      placeholder="12 digit Aadhaar"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>AES-256 Encrypted; Masked: <strong className="font-mono text-[var(--nau-text-primary)]">{SensitiveDataProtectionService.maskAadhaar(formData.aadhaarNumber)}</strong></span>
                  </div>
                  {errors.aadhaarNumber && <p className="text-[11px] text-rose-400 mt-1">{errors.aadhaarNumber}</p>}
                </div>
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Residential Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine}
                    onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[var(--nau-border)] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none bg-[var(--nau-surface)] text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] transition-all"
                    placeholder="Street, flat/door number, locality"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    City <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[var(--nau-border)] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none bg-[var(--nau-surface)] text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    State & PIN Code <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2.5 border border-[var(--nau-border)] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none bg-[var(--nau-surface)] text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] transition-all"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, '') })}
                      className={`w-full px-3 py-2.5 border rounded-xl text-xs font-mono font-medium focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none transition-all bg-[var(--nau-surface)] text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] ${
                        errors.pinCode ? 'border-rose-500' : 'border-[var(--nau-border)]'
                      }`}
                      placeholder="PIN"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4: ACADEMIC BACKGROUND */}
            <div className="space-y-4 pt-4 border-t border-[var(--nau-border)]">
              <h3 className="text-xs font-bold text-[var(--nau-text-muted)] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[var(--nau-surface)] text-[var(--nau-primary)] border border-[var(--nau-border)] flex items-center justify-center text-[11px] font-bold">4</span>
                {selectedProgramLevel === 'Undergraduate' ? 'Secondary / 10+2 Academic Background' : 'Qualifying Examination Details'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Qualifying Examination <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.previousQualification}
                    onChange={(e) => setFormData({ ...formData, previousQualification: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[var(--nau-border)] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none bg-[var(--nau-surface)] text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] transition-all"
                    placeholder={selectedProgramLevel === 'Undergraduate' ? 'e.g. Higher Secondary (10+2 PCM)' : 'e.g. BE / B.Tech Degree'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Previous Institute / School / College <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.previousInstitute}
                    onChange={(e) => setFormData({ ...formData, previousInstitute: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[var(--nau-border)] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none bg-[var(--nau-surface)] text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] transition-all"
                    placeholder="Institute name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Aggregated Percentage (0 - 100) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="100"
                    value={formData.previousPercentage}
                    onChange={(e) => setFormData({ ...formData, previousPercentage: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-mono font-semibold focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none transition-all bg-[var(--nau-surface)] text-[var(--nau-text-primary)] ${
                      errors.previousPercentage ? 'border-rose-500' : 'border-[var(--nau-border)]'
                    }`}
                  />
                  {errors.previousPercentage && <p className="text-[11px] text-rose-400 mt-1">{errors.previousPercentage}</p>}
                </div>
              </div>

              {/* POSTGRADUATE (ME) CONDITIONAL FIELDS */}
              {selectedProgramLevel === 'Postgraduate' && (
                <div className="mt-4 p-4.5 bg-[var(--nau-surface-tertiary)] rounded-xl border border-[var(--nau-secondary)]/30 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--nau-secondary)]">
                    <GraduationCap className="w-4 h-4 text-[var(--nau-secondary)]" />
                    <span>Bachelor Degree Details (Required for Master of Engineering Admission)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                        Bachelor Degree Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.bachelorDegreeName || ''}
                        onChange={(e) => setFormData({ ...formData, bachelorDegreeName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[var(--nau-secondary)] focus:border-[var(--nau-secondary)] focus:outline-none bg-[var(--nau-surface)] text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] transition-all ${
                          errors.bachelorDegreeName ? 'border-rose-500' : 'border-[var(--nau-border)]'
                        }`}
                        placeholder="e.g. BE in Computer Science"
                      />
                      {errors.bachelorDegreeName && <p className="text-[11px] text-rose-400 mt-1">{errors.bachelorDegreeName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                        Bachelor University Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.bachelorUniversityName || ''}
                        onChange={(e) => setFormData({ ...formData, bachelorUniversityName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-medium focus:ring-1 focus:ring-[var(--nau-secondary)] focus:border-[var(--nau-secondary)] focus:outline-none bg-[var(--nau-surface)] text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] transition-all ${
                          errors.bachelorUniversityName ? 'border-rose-500' : 'border-[var(--nau-border)]'
                        }`}
                        placeholder="University / Institute name"
                      />
                      {errors.bachelorUniversityName && <p className="text-[11px] text-rose-400 mt-1">{errors.bachelorUniversityName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                        Graduation Year
                      </label>
                      <input
                        type="number"
                        min="2010"
                        max="2026"
                        value={formData.bachelorGraduationYear || 2025}
                        onChange={(e) => setFormData({ ...formData, bachelorGraduationYear: parseInt(e.target.value) || 2025 })}
                        className="w-full px-3.5 py-2.5 border border-[var(--nau-border)] rounded-xl text-xs font-mono font-medium focus:ring-1 focus:ring-[var(--nau-secondary)] focus:border-[var(--nau-secondary)] focus:outline-none bg-[var(--nau-surface)] text-[var(--nau-text-primary)] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                        Bachelor CGPA / % <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        max="100"
                        value={formData.bachelorPercentageOrCGPA || ''}
                        onChange={(e) => setFormData({ ...formData, bachelorPercentageOrCGPA: parseFloat(e.target.value) || 0 })}
                        className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-mono font-semibold focus:ring-1 focus:ring-[var(--nau-secondary)] focus:border-[var(--nau-secondary)] focus:outline-none bg-[var(--nau-surface)] text-[var(--nau-text-primary)] transition-all ${
                          errors.bachelorPercentageOrCGPA ? 'border-rose-500' : 'border-[var(--nau-border)]'
                        }`}
                        placeholder="e.g. 8.84 or 88.4"
                      />
                      {errors.bachelorPercentageOrCGPA && <p className="text-[11px] text-rose-400 mt-1">{errors.bachelorPercentageOrCGPA}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Declaration & Submission Actions */}
            <div className="p-4 sm:p-5 bg-[var(--nau-surface-tertiary)] rounded-xl border border-[var(--nau-border)] space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.studentDeclaration}
                  onChange={(e) => setFormData({ ...formData, studentDeclaration: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded border-[var(--nau-border)] bg-[var(--nau-surface)] text-[var(--nau-primary)] focus:ring-[var(--nau-primary)]/40 cursor-pointer"
                />
                <span className="text-xs text-[var(--nau-text-secondary)] leading-relaxed">
                  I hereby declare that all information submitted in this application form is true, complete, and correct to the best of my knowledge. I agree to abide by the rules and admission regulations of {UNIVERSITY_SETTINGS.universityName} (Founder: {UNIVERSITY_SETTINGS.founderName}).
                </span>
              </label>
              {errors.studentDeclaration && <p className="text-[11px] text-rose-400">{errors.studentDeclaration}</p>}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--nau-border)]">
              <button
                type="button"
                onClick={() => handleSaveOrSubmit(false)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--nau-surface)] hover:bg-[var(--nau-surface-tertiary)] text-[var(--nau-text-secondary)] hover:text-[var(--nau-text-primary)] rounded-xl text-xs font-bold border border-[var(--nau-border)] transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-[var(--nau-primary)] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Submit Application for Verification
              </button>
            </div>

          </form>

        </div>
      )}

      {/* TAB 2: APPLICATION STATUS & AUDIT TIMELINE */}
      {activeTab === 'status' && (
        <div className="bg-[var(--nau-card-bg)] rounded-2xl border border-[var(--nau-border)] p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--nau-border)] pb-4">
            <div>
              <h2 className="text-base font-bold text-[var(--nau-text-primary)]">
                Application Review Status & Timeline
              </h2>
              <p className="text-xs text-[var(--nau-text-muted)] mt-0.5">
                Real-time review updates by department faculties and university administration.
              </p>
            </div>
            {activeApplication && (
              <span className="text-xs font-mono font-bold text-[var(--nau-primary)] bg-[var(--nau-surface)] border border-[var(--nau-border)] px-3 py-1.5 rounded-xl">
                {activeApplication.applicationNumber}
              </span>
            )}
          </div>

          {activeApplication ? (
            <div className="space-y-6">
              
              {/* Application Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4.5 bg-[var(--nau-surface)] rounded-xl border border-[var(--nau-border)] text-xs">
                <div>
                  <span className="text-[var(--nau-text-muted)] block font-medium">Program Level</span>
                  <span className="font-bold text-[var(--nau-text-primary)] mt-0.5 block">
                    {activeApplication.programLevel === 'Postgraduate' ? 'Postgraduate (ME)' : 'Undergraduate (BE)'}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--nau-text-muted)] block font-medium">Enrolled Course</span>
                  <span className="font-semibold text-[var(--nau-text-primary)] mt-0.5 block">
                    {selectedCourseDetails?.name || 'Engineering Program'} ({selectedCourseDetails?.code})
                  </span>
                </div>
                <div>
                  <span className="text-[var(--nau-text-muted)] block font-medium">Admission Status</span>
                  <div className="mt-1">
                    {renderStatusBadge(activeApplication.status)}
                  </div>
                </div>
                <div>
                  <span className="text-[var(--nau-text-muted)] block font-medium">Semester Fee</span>
                  <span className="font-mono font-bold text-[var(--nau-text-primary)] mt-0.5 block">₹{activeApplication.totalFeePayable.toLocaleString()}</span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[var(--nau-text-muted)] uppercase tracking-wider">
                  Audit Log & Status Transitions
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--nau-border)]">
                  {activeApplication.statusHistories && activeApplication.statusHistories.length > 0 ? (
                    activeApplication.statusHistories.map((sh, idx) => (
                      <div key={sh.id || idx} className="relative group">
                        <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--nau-card-bg)] bg-[var(--nau-primary)] shadow-xs" />
                        <div className="bg-[var(--nau-surface)] p-4 rounded-xl border border-[var(--nau-border)] shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--nau-text-primary)]">
                              Status changed to <span className="text-[var(--nau-primary)] font-extrabold">{sh.newStatus}</span>
                            </span>
                            <span className="text-[11px] text-[var(--nau-text-muted)] font-mono">
                              {new Date(sh.changedAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--nau-text-secondary)] mt-1.5">
                            {sh.remarks}
                          </p>
                          <div className="text-[11px] text-[var(--nau-text-muted)] mt-2 flex items-center gap-1.5">
                            <span>Action by:</span>
                            <span className="font-semibold text-[var(--nau-text-secondary)]">{sh.changedByName}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[var(--nau-text-muted)] italic">No status transitions logged yet.</p>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-[var(--nau-text-muted)] text-xs">
              No application submitted yet. Please complete the form in Tab 1.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FEE PAYMENT & OFFICIAL RECEIPT */}
      {activeTab === 'fee' && (
        <div className="bg-[var(--nau-card-bg)] rounded-2xl border border-[var(--nau-border)] p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--nau-border)] pb-4">
            <div>
              <h2 className="text-base font-bold text-[var(--nau-text-primary)]">
                {UNIVERSITY_SETTINGS.universityName} Fee Payment & Receipt Desk
              </h2>
              <p className="text-xs text-[var(--nau-text-muted)] mt-0.5">
                Pay tuition fees online or submit bank reference numbers for verification.
              </p>
            </div>
          </div>

          {activeApplication ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Payment Overview & Submission */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Fee Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[var(--nau-surface)] border border-[var(--nau-border)]">
                    <div className="text-[11px] font-semibold text-[var(--nau-text-muted)]">Total Fee</div>
                    <div className="text-lg font-bold font-mono text-[var(--nau-text-primary)] mt-0.5">
                      ₹{activeApplication.totalFeePayable.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50">
                    <div className="text-[11px] font-semibold text-emerald-400">Verified Paid</div>
                    <div className="text-lg font-bold font-mono text-emerald-300 mt-0.5">
                      ₹{verifiedPaymentsTotal.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/50">
                    <div className="text-[11px] font-semibold text-amber-400">Remaining Balance</div>
                    <div className="text-lg font-bold font-mono text-amber-300 mt-0.5">
                      ₹{remainingFee.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Make a Payment Form if balance remains */}
                {remainingFee > 0 ? (
                  <div className="p-5 bg-[var(--nau-surface)] rounded-2xl border border-[var(--nau-border)] space-y-4">
                    <h3 className="text-xs font-bold text-[var(--nau-text-primary)] uppercase tracking-wider flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[var(--nau-primary)]" />
                      Make Online Fee Payment / Submit UTR Reference
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1">
                          Payment Amount (INR) <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="number"
                          value={paymentAmount}
                          max={remainingFee}
                          min={1000}
                          onChange={(e) => setPaymentAmount(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 border border-[var(--nau-border)] rounded-xl text-xs font-mono font-bold focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none bg-[var(--nau-surface-tertiary)] text-[var(--nau-text-primary)]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1">
                          Payment Channel <span className="text-rose-400">*</span>
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                          className="w-full px-3.5 py-2.5 border border-[var(--nau-border)] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none bg-[var(--nau-surface-tertiary)] text-[var(--nau-text-primary)]"
                        >
                          <option value="UPI">UPI (GooglePay / PhonePe / Paytm / BHIM)</option>
                          <option value="NetBanking">Net Banking (NEFT / RTGS / IMPS)</option>
                          <option value="Card">Debit / Credit Card</option>
                          <option value="DemandDraft">Demand Draft (DD)</option>
                          <option value="Cash">Cash at University Cash Counter</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1">
                          Transaction Reference Number / UTR / Challan No. <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={refNumber}
                          onChange={(e) => setRefNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-[var(--nau-border)] rounded-xl text-xs font-mono focus:ring-1 focus:ring-[var(--nau-primary)] focus:border-[var(--nau-primary)] focus:outline-none bg-[var(--nau-surface-tertiary)] text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)]"
                          placeholder="e.g. UPI/HDFC/9871234567"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!refNumber.trim()) return;
                        onSubmitPayment({
                          applicationId: activeApplication.id,
                          amountPaid: paymentAmount,
                          paymentMethod,
                          externalReferenceNumber: refNumber,
                          remarks: paymentRemarks,
                        });
                        confetti({ particleCount: 50, spread: 45 });
                      }}
                      className="w-full py-2.5 bg-[var(--nau-primary)] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Submit ₹{paymentAmount.toLocaleString()} Payment for Accounts Verification
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/60 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <span>Full course fee has been cleared. Your admission seat is confirmed!</span>
                  </div>
                )}

              </div>

              {/* Right 1 Col: Payments & Printable Receipt Cards */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-[var(--nau-text-muted)] uppercase tracking-wider">
                  Payment History & Official Receipts
                </h3>

                {activeApplication.payments && activeApplication.payments.length > 0 ? (
                  <div className="space-y-3">
                    {activeApplication.payments.map((p) => (
                      <div key={p.id} className="p-4 rounded-xl border border-[var(--nau-border)] bg-[var(--nau-surface)] shadow-md space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-[var(--nau-text-primary)]">
                            ₹{p.amountPaid.toLocaleString()}
                          </span>
                          <div>
                            {renderStatusBadge(p.verificationStatus === 'Verified' ? 'Verified' : p.verificationStatus)}
                          </div>
                        </div>
                        <div className="text-[11px] text-[var(--nau-text-muted)] font-mono">
                          Txn: {p.transactionNumber}
                        </div>
                        <div className="text-[11px] text-[var(--nau-text-secondary)]">
                          {p.paymentMethod} • {new Date(p.paymentDate).toLocaleDateString()}
                        </div>

                        {p.verificationStatus === 'Verified' && (
                          <button
                            onClick={() => onViewReceipt(activeApplication, p)}
                            className="w-full mt-2 flex items-center justify-center gap-1.5 py-1.5 bg-[var(--nau-card-bg)] hover:bg-[var(--nau-hover-bg)] text-white rounded-lg text-xs font-medium border border-[var(--nau-border)] transition-colors cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5 text-[var(--nau-primary)]" />
                            View & Print Official Receipt
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--nau-text-muted)] italic">No payments logged yet.</p>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-[var(--nau-text-muted)] text-xs">
              Please submit an application first to access the fee payment portal.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
