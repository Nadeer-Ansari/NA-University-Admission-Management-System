import React, { useState } from 'react';
import { 
  AcademicYear, 
  AdmissionApplication, 
  AdmissionStatus, 
  ApplicationUser, 
  AuditLog, 
  Course, 
  ProgramLevel,
  TeacherCourse, 
  TeacherProfile, 
  UserRole 
} from '../types';
import { UNIVERSITY_SETTINGS } from '../data/universitySettings';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Activity, 
  BarChart3, 
  Search, 
  Layers, 
  UserCheck, 
  UserX,
  X,
  TrendingUp,
  Download,
  GraduationCap,
  Filter
} from 'lucide-react';

interface AdminPortalProps {
  currentUser: ApplicationUser;
  users: ApplicationUser[];
  courses: Course[];
  academicYears: AcademicYear[];
  applications: AdmissionApplication[];
  teacherProfiles: TeacherProfile[];
  teacherCourses: TeacherCourse[];
  auditLogs: AuditLog[];
  onUpdateAppStatus: (appId: string, newStatus: AdmissionStatus, remarks: string) => void;
  onAddCourse: (course: Course) => void;
  onAddAcademicYear: (ay: AcademicYear) => void;
  onAssignTeacherCourse: (teacherProfileId: string, courseId: string) => void;
  onRemoveTeacherCourse: (assignmentId: string) => void;
  onToggleUserActive: (userId: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  users,
  courses,
  academicYears,
  applications,
  teacherProfiles,
  teacherCourses,
  auditLogs,
  onUpdateAppStatus,
  onAddCourse,
  onAddAcademicYear,
  onAssignTeacherCourse,
  onRemoveTeacherCourse,
  onToggleUserActive,
}) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'courses' | 'teachers' | 'users' | 'audit' | 'reports'>('apps');

  // Status Change Modal State
  const [selectedAppForStatus, setSelectedAppForStatus] = useState<AdmissionApplication | null>(null);
  const [newStatus, setNewStatus] = useState<AdmissionStatus>('Approved');
  const [statusRemarks, setStatusRemarks] = useState('');

  // Course Modal State
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newCourseLevel, setNewCourseLevel] = useState<ProgramLevel>('Undergraduate');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDept, setNewCourseDept] = useState('School of Engineering & Technology');
  const [newCourseSeats, setNewCourseSeats] = useState(60);
  const [newCourseFee, setNewCourseFee] = useState(65000);

  // Assignment Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(teacherProfiles[0]?.id || '');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');

  // Search & Filters
  const [appSearch, setAppSearch] = useState('');
  const [appProgramFilter, setAppProgramFilter] = useState<'All' | 'Undergraduate' | 'Postgraduate'>('All');
  const [courseProgramFilter, setCourseProgramFilter] = useState<'All' | 'Undergraduate' | 'Postgraduate'>('All');
  const [courseSearch, setCourseSearch] = useState('');
  const [auditSearch, setAuditSearch] = useState('');

  // KPI Metrics Calculations
  const beCourses = courses.filter(c => c.programLevel === 'Undergraduate');
  const meCourses = courses.filter(c => c.programLevel === 'Postgraduate');
  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.isActive).length;

  const totalApps = applications.length;
  const beApps = applications.filter(a => a.programLevel === 'Undergraduate' || (!a.programLevel && courses.find(c => c.id === a.courseId)?.programLevel === 'Undergraduate'));
  const meApps = applications.filter(a => a.programLevel === 'Postgraduate' || courses.find(c => c.id === a.courseId)?.programLevel === 'Postgraduate');

  const submittedApps = applications.filter(a => a.status === 'Submitted').length;
  const approvedApps = applications.filter(a => a.status === 'Approved').length;
  const confirmedAdmissions = applications.filter(a => a.status === 'AdmissionConfirmed').length;
  const rejectedApps = applications.filter(a => a.status === 'Rejected').length;
  
  const totalFeesCollected = applications.reduce((acc, app) => {
    const verified = app.payments?.filter(p => p.verificationStatus === 'Verified').reduce((sum, p) => sum + p.amountPaid, 0) || 0;
    return acc + verified;
  }, 0);

  const beFeesCollected = beApps.reduce((acc, app) => {
    const verified = app.payments?.filter(p => p.verificationStatus === 'Verified').reduce((sum, p) => sum + p.amountPaid, 0) || 0;
    return acc + verified;
  }, 0);

  const meFeesCollected = meApps.reduce((acc, app) => {
    const verified = app.payments?.filter(p => p.verificationStatus === 'Verified').reduce((sum, p) => sum + p.amountPaid, 0) || 0;
    return acc + verified;
  }, 0);

  // Filtered Lists
  const filteredApps = applications.filter(a => {
    const matchesSearch = 
      a.fullName.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.applicationNumber.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(appSearch.toLowerCase());

    const matchesProgram = 
      appProgramFilter === 'All' ||
      (appProgramFilter === 'Undergraduate' && (a.programLevel === 'Undergraduate' || (!a.programLevel && courses.find(c => c.id === a.courseId)?.programLevel === 'Undergraduate'))) ||
      (appProgramFilter === 'Postgraduate' && (a.programLevel === 'Postgraduate' || courses.find(c => c.id === a.courseId)?.programLevel === 'Postgraduate'));

    return matchesSearch && matchesProgram;
  });

  const filteredCourses = courses.filter(c => {
    const matchesProgram = courseProgramFilter === 'All' || c.programLevel === courseProgramFilter;
    const matchesSearch = 
      c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.department.toLowerCase().includes(courseSearch.toLowerCase());

    return matchesProgram && matchesSearch;
  });

  const filteredAudits = auditLogs.filter(log => 
    log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.entityName.toLowerCase().includes(auditSearch.toLowerCase())
  );

  const handleConfirmStatusChange = () => {
    if (!selectedAppForStatus) return;
    onUpdateAppStatus(
      selectedAppForStatus.id,
      newStatus,
      statusRemarks || `Status transitioned to ${newStatus} by Administrator ${UNIVERSITY_SETTINGS.administratorDisplayName}.`
    );
    setSelectedAppForStatus(null);
    setStatusRemarks('');
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode || !newCourseName) return;

    const course: Course = {
      id: `course-${newCourseCode.toLowerCase()}-${Date.now()}`,
      code: newCourseCode.toUpperCase().trim(),
      name: newCourseName.trim(),
      programLevel: newCourseLevel,
      department: newCourseDept.trim(),
      durationYears: newCourseLevel === 'Undergraduate' ? 4 : 2,
      totalSemesters: newCourseLevel === 'Undergraduate' ? 8 : 4,
      totalSeats: Number(newCourseSeats),
      semesterFee: Number(newCourseFee),
      isActive: true,
    };

    onAddCourse(course);
    setShowCourseModal(false);
    setNewCourseCode('');
    setNewCourseName('');
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    onAssignTeacherCourse(selectedTeacherId, selectedCourseId);
    setShowAssignModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Executive Admin Banner */}
      <div className="bg-[var(--nau-card-bg)] rounded-2xl p-6 sm:p-7 text-[var(--nau-text-primary)] shadow-xl border border-[var(--nau-border)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-blue-900/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[var(--nau-primary)] text-xs font-bold uppercase tracking-wider">
            <span>{UNIVERSITY_SETTINGS.universityName} Central Administration</span>
            <span className="text-[var(--nau-text-muted)]">•</span>
            <span>Founder: {UNIVERSITY_SETTINGS.founderName}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--nau-text-primary)] mt-1.5 tracking-tight">
            Administrator Control Center
          </h1>
          <p className="text-[var(--nau-text-secondary)] text-xs mt-1 max-w-2xl leading-relaxed">
            Logged in as <strong>{UNIVERSITY_SETTINGS.administratorDisplayName}</strong>. Oversee 58 engineering disciplines (28 BE + 30 ME), manage application verification lifecycle, teacher-course mappings, and real-time revenue collection.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setShowCourseModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[var(--nau-primary)] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Add Engineering Course
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[var(--nau-surface)] hover:bg-[var(--nau-surface-tertiary)] text-[var(--nau-text-primary)] rounded-xl text-xs font-bold border border-[var(--nau-border)] transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[var(--nau-primary)]" />
            Assign Teacher
          </button>
        </div>
      </div>

      {/* Primary KPI Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        <div className="bg-[var(--nau-card-bg)] p-4.5 rounded-2xl border border-[var(--nau-border)] shadow-md">
          <span className="text-[11px] font-semibold text-[var(--nau-text-muted)] block">Total Applications</span>
          <span className="text-2xl font-extrabold text-[var(--nau-text-primary)] mt-1 block tracking-tight font-mono">{totalApps}</span>
          <span className="text-[10px] text-[var(--nau-text-muted)] mt-0.5 block">
            BE: <strong className="text-[var(--nau-primary)] font-mono">{beApps.length}</strong> | ME: <strong className="text-purple-400 font-mono">{meApps.length}</strong>
          </span>
        </div>

        <div className="bg-[var(--nau-card-bg)] p-4.5 rounded-2xl border border-[var(--nau-border)] shadow-md">
          <span className="text-[11px] font-semibold text-[var(--nau-text-muted)] block">Total Courses (Catalog)</span>
          <span className="text-2xl font-extrabold text-[var(--nau-primary)] mt-1 block tracking-tight font-mono">{totalCourses}</span>
          <span className="text-[10px] text-[var(--nau-text-muted)] mt-0.5 block">
            BE: <strong className="text-[var(--nau-primary)] font-mono">{beCourses.length}</strong> | ME: <strong className="text-purple-400 font-mono">{meCourses.length}</strong>
          </span>
        </div>

        <div className="bg-[var(--nau-card-bg)] p-4.5 rounded-2xl border border-[var(--nau-border)] shadow-md">
          <span className="text-[11px] font-semibold text-[var(--nau-text-muted)] block">Pending Review</span>
          <span className="text-2xl font-extrabold text-amber-400 mt-1 block tracking-tight font-mono">{submittedApps}</span>
          <span className="text-[10px] text-amber-300 font-medium mt-0.5 block">Faculty evaluation</span>
        </div>

        <div className="bg-[var(--nau-card-bg)] p-4.5 rounded-2xl border border-[var(--nau-border)] shadow-md">
          <span className="text-[11px] font-semibold text-[var(--nau-text-muted)] block">Academic Approved</span>
          <span className="text-2xl font-extrabold text-[var(--nau-primary)] mt-1 block tracking-tight font-mono">{approvedApps}</span>
          <span className="text-[10px] text-[var(--nau-text-secondary)] font-medium mt-0.5 block">Fee deposit stage</span>
        </div>

        <div className="bg-[var(--nau-card-bg)] p-4.5 rounded-2xl border border-[var(--nau-border)] shadow-md">
          <span className="text-[11px] font-semibold text-[var(--nau-text-muted)] block">Confirmed Seats</span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1 block tracking-tight font-mono">{confirmedAdmissions}</span>
          <span className="text-[10px] text-emerald-300 font-medium mt-0.5 block">Enrolled & paid</span>
        </div>

        <div className="bg-[var(--nau-card-bg)] p-4.5 rounded-2xl border border-[var(--nau-border)] shadow-md">
          <span className="text-[11px] font-semibold text-[var(--nau-text-muted)] block">Total Revenue (INR)</span>
          <span className="text-xl font-extrabold text-emerald-400 mt-1 block font-mono tracking-tight">₹{totalFeesCollected.toLocaleString()}</span>
          <span className="text-[10px] text-[var(--nau-text-muted)] mt-0.5 block">
            BE: ₹{beFeesCollected.toLocaleString()} | ME: ₹{meFeesCollected.toLocaleString()}
          </span>
        </div>

      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[var(--nau-border)] gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('apps')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'apps' ? 'border-[var(--nau-primary)] text-[var(--nau-primary)]' : 'border-transparent text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          Applications ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'courses' ? 'border-[var(--nau-primary)] text-[var(--nau-primary)]' : 'border-transparent text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Engineering Courses ({courses.length})
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'teachers' ? 'border-[var(--nau-primary)] text-[var(--nau-primary)]' : 'border-transparent text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)]'
          }`}
        >
          <Layers className="w-4 h-4" />
          Teacher-Course Mappings ({teacherCourses.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'users' ? 'border-[var(--nau-primary)] text-[var(--nau-primary)]' : 'border-transparent text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)]'
          }`}
        >
          <Users className="w-4 h-4" />
          User Management ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'audit' ? 'border-[var(--nau-primary)] text-[var(--nau-primary)]' : 'border-transparent text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)]'
          }`}
        >
          <Activity className="w-4 h-4" />
          Security & Audit Logs ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'reports' ? 'border-[var(--nau-primary)] text-[var(--nau-primary)]' : 'border-transparent text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Program Reports & Analytics
        </button>
      </div>

      {/* TAB 1: APPLICATIONS MANAGEMENT */}
      {activeTab === 'apps' && (
        <div className="bg-[var(--nau-card-bg)] rounded-2xl border border-[var(--nau-border)] shadow-xl overflow-hidden">
          
          {/* Header Controls & Filters */}
          <div className="p-4 sm:p-5 border-b border-[var(--nau-border)] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--nau-surface)]">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[var(--nau-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                placeholder="Search name, app no., email..."
                className="w-full pl-9 pr-3 py-2 bg-[var(--nau-surface-tertiary)] border border-[var(--nau-border)] rounded-xl text-xs text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] focus:border-[var(--nau-primary)] focus:outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-[var(--nau-text-muted)] flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[var(--nau-text-muted)]" />
                Level:
              </span>
              <div className="flex rounded-xl bg-[var(--nau-surface-tertiary)] p-1 text-xs font-semibold border border-[var(--nau-border)]">
                <button
                  onClick={() => setAppProgramFilter('All')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    appProgramFilter === 'All' ? 'bg-[var(--nau-primary)] text-white shadow-sm' : 'text-[var(--nau-text-secondary)] hover:text-[var(--nau-text-primary)]'
                  }`}
                >
                  All ({applications.length})
                </button>
                <button
                  onClick={() => setAppProgramFilter('Undergraduate')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    appProgramFilter === 'Undergraduate' ? 'bg-[var(--nau-primary)] text-white shadow-sm' : 'text-[var(--nau-text-secondary)] hover:text-[var(--nau-text-primary)]'
                  }`}
                >
                  BE ({beApps.length})
                </button>
                <button
                  onClick={() => setAppProgramFilter('Postgraduate')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    appProgramFilter === 'Postgraduate' ? 'bg-purple-600 text-white shadow-sm' : 'text-[var(--nau-text-secondary)] hover:text-[var(--nau-text-primary)]'
                  }`}
                >
                  ME ({meApps.length})
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[var(--nau-surface)] text-[var(--nau-text-secondary)] border-b border-[var(--nau-border)]">
                <tr>
                  <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Application No</th>
                  <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Candidate Info</th>
                  <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Program & Course</th>
                  <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Aadhaar Protection</th>
                  <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Merit Score</th>
                  <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Current Status</th>
                  <th className="py-3.5 px-4 text-right font-bold uppercase tracking-wider text-[11px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nau-border)] text-[var(--nau-text-primary)]">
                {filteredApps.map((app) => {
                  const course = courses.find(c => c.id === app.courseId);
                  const isME = app.programLevel === 'Postgraduate' || course?.programLevel === 'Postgraduate';

                  return (
                    <tr key={app.id} className="bg-[var(--nau-card-bg)] hover:bg-[var(--nau-surface)] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[var(--nau-primary)]">
                        {app.applicationNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[var(--nau-text-primary)]">{app.fullName}</div>
                        <div className="text-[var(--nau-text-muted)] text-[11px]">{app.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isME ? 'bg-purple-950/80 text-purple-400 border border-purple-800/60' : 'bg-blue-950/80 text-[var(--nau-primary)] border border-blue-800/60'
                          }`}>
                            {isME ? 'ME' : 'BE'}
                          </span>
                          <span className="font-semibold text-[var(--nau-text-primary)]">{course?.code || 'BE-COMP'}</span>
                        </div>
                        <div className="text-[var(--nau-text-muted)] text-[11px] truncate max-w-[200px]">
                          {course?.name || 'Engineering Course'}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <span className="px-2 py-0.5 bg-[var(--nau-surface)] text-[var(--nau-text-secondary)] rounded border border-[var(--nau-border)]">
                          {app.aadhaarMasked || 'XXXX-XXXX-1012'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono font-semibold text-[var(--nau-text-secondary)]">{app.previousPercentage}%</div>
                        {isME && app.bachelorPercentageOrCGPA && (
                          <div className="text-[10px] text-purple-400 font-mono">
                            UG: {app.bachelorPercentageOrCGPA} CGPA
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          app.status === 'AdmissionConfirmed' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' :
                          app.status === 'Approved' ? 'bg-blue-950/80 text-blue-400 border border-blue-800/60' :
                          app.status === 'Submitted' ? 'bg-indigo-950/80 text-indigo-400 border border-indigo-800/60' :
                          app.status === 'UnderReview' ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' :
                          app.status === 'Rejected' ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60' :
                          'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedAppForStatus(app);
                            setNewStatus(app.status);
                          }}
                          className="px-3 py-1.5 bg-[var(--nau-surface)] hover:bg-[var(--nau-surface-tertiary)] text-[var(--nau-primary)] hover:text-blue-400 rounded-lg font-semibold border border-[var(--nau-border)] transition-colors cursor-pointer"
                        >
                          Change Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: COURSE CATALOG */}
      {activeTab === 'courses' && (
        <div className="bg-[var(--nau-card-bg)] rounded-2xl border border-[var(--nau-border)] shadow-xl overflow-hidden space-y-4 p-5">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[var(--nau-text-primary)]">
                {UNIVERSITY_SETTINGS.universityName} Engineering Courses (58 Disciplines)
              </h2>
              <p className="text-xs text-[var(--nau-text-muted)]">
                28 Bachelor of Engineering (BE) + 30 Master of Engineering (ME) Programs
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="w-4 h-4 text-[var(--nau-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Filter courses..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl text-xs text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] focus:border-[var(--nau-primary)] focus:outline-none"
                />
              </div>

              <div className="flex rounded-xl bg-[var(--nau-surface)] p-1 text-xs font-semibold border border-[var(--nau-border)]">
                <button
                  onClick={() => setCourseProgramFilter('All')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    courseProgramFilter === 'All' ? 'bg-[var(--nau-primary)] text-white shadow-sm' : 'text-[var(--nau-text-secondary)] hover:text-[var(--nau-text-primary)]'
                  }`}
                >
                  All (58)
                </button>
                <button
                  onClick={() => setCourseProgramFilter('Undergraduate')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    courseProgramFilter === 'Undergraduate' ? 'bg-[var(--nau-primary)] text-white shadow-sm' : 'text-[var(--nau-text-secondary)] hover:text-[var(--nau-text-primary)]'
                  }`}
                >
                  BE (28)
                </button>
                <button
                  onClick={() => setCourseProgramFilter('Postgraduate')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    courseProgramFilter === 'Postgraduate' ? 'bg-purple-600 text-white shadow-sm' : 'text-[var(--nau-text-secondary)] hover:text-[var(--nau-text-primary)]'
                  }`}
                >
                  ME (30)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-[var(--nau-border)] bg-[var(--nau-surface)] hover:border-[var(--nau-primary)]/50 transition-all shadow-md space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold ${
                      c.programLevel === 'Postgraduate' ? 'bg-purple-950/80 text-purple-400 border border-purple-800/60' : 'bg-blue-950/80 text-blue-400 border border-blue-800/60'
                    }`}>
                      {c.code}
                    </span>
                    <span className="text-[10px] font-semibold text-[var(--nau-text-muted)]">
                      {c.programLevel === 'Postgraduate' ? 'ME (2 Yrs / 4 Sem)' : 'BE (4 Yrs / 8 Sem)'}
                    </span>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${c.isActive ? 'bg-emerald-500' : 'bg-slate-600'}`} title={c.isActive ? 'Active' : 'Inactive'} />
                </div>

                <div className="font-bold text-xs text-[var(--nau-text-primary)] line-clamp-1">
                  {c.name}
                </div>
                <div className="text-[11px] text-[var(--nau-text-muted)] truncate">
                  {c.department}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--nau-border)] text-[11px]">
                  <div>
                    <span className="text-[var(--nau-text-muted)] block">Intake Capacity:</span>
                    <span className="font-mono font-bold text-[var(--nau-text-secondary)]">{c.totalSeats} Seats</span>
                  </div>
                  <div>
                    <span className="text-[var(--nau-text-muted)] block">Semester Fee:</span>
                    <span className="font-mono font-bold text-emerald-400">₹{c.semesterFee.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: TEACHER ASSIGNMENTS */}
      {activeTab === 'teachers' && (
        <div className="bg-[var(--nau-card-bg)] rounded-2xl border border-[var(--nau-border)] shadow-xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[var(--nau-border)] flex items-center justify-between bg-[var(--nau-surface)]">
            <div>
              <h2 className="text-base font-bold text-[var(--nau-text-primary)]">Faculty Course Assignments</h2>
              <p className="text-xs text-[var(--nau-text-muted)]">Associate teaching faculties with BE / ME engineering courses</p>
            </div>
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--nau-primary)] text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              New Assignment
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[var(--nau-surface)] text-[var(--nau-text-secondary)] border-b border-[var(--nau-border)]">
                <tr>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Faculty Member</th>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Designation & Dept</th>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Assigned Course</th>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Program Level</th>
                  <th className="py-3 px-4 text-right font-bold uppercase tracking-wider text-[11px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nau-border)] text-[var(--nau-text-primary)]">
                {teacherCourses.map((tc) => {
                  const prof = teacherProfiles.find(p => p.id === tc.teacherProfileId);
                  const user = users.find(u => u.id === prof?.userId);
                  const course = courses.find(c => c.id === tc.courseId);

                  return (
                    <tr key={tc.id} className="bg-[var(--nau-card-bg)] hover:bg-[var(--nau-surface)] transition-colors">
                      <td className="py-3 px-4 font-bold text-[var(--nau-text-primary)]">{user?.fullName || 'Faculty Member'}</td>
                      <td className="py-3 px-4 text-[var(--nau-text-muted)]">{prof?.designation || 'Professor'} • {prof?.department}</td>
                      <td className="py-3 px-4 font-semibold text-[var(--nau-primary)]">{course?.code} - {course?.name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          course?.programLevel === 'Postgraduate' ? 'bg-purple-950/80 text-purple-400 border border-purple-800/60' : 'bg-blue-950/80 text-blue-400 border border-blue-800/60'
                        }`}>
                          {course?.programLevel === 'Postgraduate' ? 'Postgraduate (ME)' : 'Undergraduate (BE)'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onRemoveTeacherCourse(tc.id)}
                          className="text-rose-400 hover:text-rose-300 p-1 transition-colors cursor-pointer"
                          title="Remove assignment"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-[var(--nau-card-bg)] rounded-2xl border border-[var(--nau-border)] shadow-xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[var(--nau-border)] bg-[var(--nau-surface)]">
            <h2 className="text-base font-bold text-[var(--nau-text-primary)]">User Identity & Access Management</h2>
            <p className="text-xs text-[var(--nau-text-muted)]">Manage institutional accounts, role memberships, and account lockouts</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[var(--nau-surface)] text-[var(--nau-text-secondary)] border-b border-[var(--nau-border)]">
                <tr>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-[11px]">User Name</th>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Email Address</th>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-[11px]">System Role</th>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Account Status</th>
                  <th className="py-3 px-4 text-right font-bold uppercase tracking-wider text-[11px]">Toggle Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nau-border)] text-[var(--nau-text-primary)]">
                {users.map((u) => (
                  <tr key={u.id} className="bg-[var(--nau-card-bg)] hover:bg-[var(--nau-surface)] transition-colors">
                    <td className="py-3 px-4 font-bold text-[var(--nau-text-primary)]">{u.fullName}</td>
                    <td className="py-3 px-4 text-[var(--nau-text-muted)] font-mono">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--nau-surface)] text-[var(--nau-text-secondary)] border border-[var(--nau-border)]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isActive ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' : 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                      }`}>
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onToggleUserActive(u.id)}
                        className="text-xs font-semibold text-[var(--nau-primary)] hover:text-blue-400 p-1 transition-colors cursor-pointer"
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-[var(--nau-card-bg)] rounded-2xl border border-[var(--nau-border)] shadow-xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[var(--nau-border)] flex items-center justify-between bg-[var(--nau-surface)]">
            <div>
              <h2 className="text-base font-bold text-[var(--nau-text-primary)]">Security & Tamper-Proof Audit Trail</h2>
              <p className="text-xs text-[var(--nau-text-muted)]">Immutable chronological logs of lifecycle updates, payment verifications, and logins</p>
            </div>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-[var(--nau-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search audit trail..."
                className="w-full pl-9 pr-3 py-1.5 bg-[var(--nau-surface-tertiary)] border border-[var(--nau-border)] rounded-xl text-xs text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] focus:border-[var(--nau-primary)] focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[var(--nau-surface)] text-[var(--nau-text-secondary)] border-b border-[var(--nau-border)]">
                <tr>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Timestamp</th>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Actor</th>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Action & Target</th>
                  <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Audit Payload</th>
                  <th className="py-3 px-4 text-right font-bold uppercase tracking-wider text-[11px]">Client IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--nau-border)] text-[var(--nau-text-primary)]">
                {filteredAudits.map((log) => (
                  <tr key={log.id} className="bg-[var(--nau-card-bg)] hover:bg-[var(--nau-surface)] transition-colors">
                    <td className="py-3 px-4 font-mono text-[var(--nau-text-muted)] text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[var(--nau-text-primary)]">{log.userName}</div>
                      <div className="text-[10px] text-[var(--nau-text-muted)]">{log.userRole}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[var(--nau-primary)] block">{log.action}</span>
                      <span className="text-[10px] text-[var(--nau-text-secondary)]">{log.entityName}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[var(--nau-text-muted)] max-w-xs truncate">
                      {log.newValues || log.oldValues || 'Action recorded.'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[var(--nau-text-muted)]">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: REPORTS & PROGRAM ANALYTICS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Program Level Breakdown */}
            <div className="bg-[var(--nau-card-bg)] p-6 rounded-2xl border border-[var(--nau-border)] shadow-xl space-y-4">
              <h3 className="font-bold text-sm text-[var(--nau-text-primary)] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[var(--nau-primary)]" />
                Program Level Distribution (BE vs ME)
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--nau-surface)] rounded-xl border border-blue-900/50">
                  <div className="text-xs font-bold text-blue-400">Undergraduate (BE)</div>
                  <div className="text-2xl font-extrabold text-[var(--nau-text-primary)] font-mono mt-1">{beCourses.length} Courses</div>
                  <div className="text-[11px] text-[var(--nau-text-secondary)] mt-1">{beApps.length} Total Applicants</div>
                  <div className="text-[11px] text-emerald-400 font-mono font-bold">₹{beFeesCollected.toLocaleString()} Collected</div>
                </div>

                <div className="p-4 bg-[var(--nau-surface)] rounded-xl border border-purple-900/50">
                  <div className="text-xs font-bold text-purple-400">Postgraduate (ME)</div>
                  <div className="text-2xl font-extrabold text-[var(--nau-text-primary)] font-mono mt-1">{meCourses.length} Courses</div>
                  <div className="text-[11px] text-[var(--nau-text-secondary)] mt-1">{meApps.length} Total Applicants</div>
                  <div className="text-[11px] text-emerald-400 font-mono font-bold">₹{meFeesCollected.toLocaleString()} Collected</div>
                </div>
              </div>
            </div>

            {/* Revenue Analytics */}
            <div className="bg-[var(--nau-card-bg)] p-6 rounded-2xl border border-[var(--nau-border)] shadow-xl space-y-4">
              <h3 className="font-bold text-sm text-[var(--nau-text-primary)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Financial Overview & Collections
              </h3>

              <div className="p-4 bg-[var(--nau-surface)] rounded-xl border border-emerald-900/50 space-y-2">
                <div className="text-xs text-emerald-400 font-semibold">Total Verified Fee Revenue</div>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">₹{totalFeesCollected.toLocaleString()}</div>
                <div className="text-xs text-[var(--nau-text-muted)]">Across {activeAcademicYearsName(academicYears)}</div>
              </div>

              <div className="text-xs space-y-1.5 pt-2 text-[var(--nau-text-secondary)]">
                <div className="flex justify-between">
                  <span>Undergraduate Collection:</span>
                  <span className="font-mono font-bold text-[var(--nau-text-primary)]">₹{beFeesCollected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Postgraduate Collection:</span>
                  <span className="font-mono font-bold text-[var(--nau-text-primary)]">₹{meFeesCollected.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Update Application Status Modal */}
      {selectedAppForStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[var(--nau-card-bg)] rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-[var(--nau-border)] space-y-5 text-[var(--nau-text-primary)] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[var(--nau-border)] pb-3.5">
              <h3 className="text-base font-bold text-[var(--nau-text-primary)] tracking-tight">
                Update Admission Lifecycle Status
              </h3>
              <button onClick={() => setSelectedAppForStatus(null)} className="p-1.5 text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)] rounded-xl hover:bg-[var(--nau-hover-bg)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs bg-[var(--nau-surface)] p-4 rounded-2xl border border-[var(--nau-border)] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[var(--nau-text-muted)]">Candidate:</span>
                <span className="font-bold text-[var(--nau-text-primary)]">{selectedAppForStatus.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--nau-text-muted)]">App No:</span>
                <span className="font-mono font-bold text-[var(--nau-primary)]">{selectedAppForStatus.applicationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--nau-text-muted)]">Current Status:</span>
                <span className="font-semibold text-[var(--nau-text-secondary)]">{selectedAppForStatus.status}</span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                  New Lifecycle State *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AdmissionStatus)}
                  className="w-full px-3.5 py-2.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl text-xs font-medium text-[var(--nau-text-primary)] focus:border-[var(--nau-primary)] focus:outline-none transition-all"
                >
                  <option value="Draft" className="bg-[var(--nau-surface)] text-[var(--nau-text-primary)]">Draft</option>
                  <option value="Submitted" className="bg-[var(--nau-surface)] text-[var(--nau-text-primary)]">Submitted</option>
                  <option value="UnderReview" className="bg-[var(--nau-surface)] text-[var(--nau-text-primary)]">Under Review</option>
                  <option value="DocumentsPending" className="bg-[var(--nau-surface)] text-[var(--nau-text-primary)]">Documents Pending</option>
                  <option value="Approved" className="bg-[var(--nau-surface)] text-[var(--nau-text-primary)]">Approved</option>
                  <option value="Rejected" className="bg-[var(--nau-surface)] text-[var(--nau-text-primary)]">Rejected</option>
                  <option value="AdmissionConfirmed" className="bg-[var(--nau-surface)] text-[var(--nau-text-primary)]">Admission Confirmed</option>
                  <option value="Cancelled" className="bg-[var(--nau-surface)] text-[var(--nau-text-primary)]">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                  Status Change Remarks / Evaluation Notes *
                </label>
                <textarea
                  rows={2}
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl text-xs text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] focus:border-[var(--nau-primary)] focus:outline-none transition-all"
                  placeholder="Enter evaluation notes..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--nau-border)]">
              <button
                type="button"
                onClick={() => setSelectedAppForStatus(null)}
                className="px-4 py-2.5 bg-[var(--nau-surface)] hover:bg-[var(--nau-surface-tertiary)] text-[var(--nau-text-secondary)] rounded-xl text-xs font-semibold border border-[var(--nau-border)] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                className="px-5 py-2.5 bg-[var(--nau-primary)] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 cursor-pointer transition-all"
              >
                Save Status Transition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[var(--nau-card-bg)] rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-[var(--nau-border)] space-y-5 text-[var(--nau-text-primary)] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[var(--nau-border)] pb-3.5">
              <h3 className="text-base font-bold text-[var(--nau-text-primary)] tracking-tight">
                Add Engineering Course
              </h3>
              <button onClick={() => setShowCourseModal(false)} className="p-1.5 text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)] rounded-xl hover:bg-[var(--nau-hover-bg)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-[var(--nau-text-secondary)] mb-1.5">Program Level *</label>
                <select
                  value={newCourseLevel}
                  onChange={(e) => setNewCourseLevel(e.target.value as ProgramLevel)}
                  className="w-full px-3.5 py-2.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl font-medium text-[var(--nau-text-primary)] focus:border-[var(--nau-primary)] focus:outline-none"
                >
                  <option value="Undergraduate" className="bg-[var(--nau-surface)]">Undergraduate (BE - 4 Years, 8 Semesters)</option>
                  <option value="Postgraduate" className="bg-[var(--nau-surface)]">Postgraduate (ME - 2 Years, 4 Semesters)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-[var(--nau-text-secondary)] mb-1.5">Course Code (e.g. BE-AERO, ME-DATA) *</label>
                <input
                  type="text"
                  required
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl uppercase font-mono font-bold text-[var(--nau-text-primary)] focus:border-[var(--nau-primary)] focus:outline-none"
                  placeholder={newCourseLevel === 'Undergraduate' ? 'BE-ROBO' : 'ME-ROBO'}
                />
              </div>

              <div>
                <label className="block font-medium text-[var(--nau-text-secondary)] mb-1.5">Program Full Title *</label>
                <input
                  type="text"
                  required
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl font-medium text-[var(--nau-text-primary)] focus:border-[var(--nau-primary)] focus:outline-none"
                  placeholder={newCourseLevel === 'Undergraduate' ? 'BE in Robotics and Automation' : 'ME in Robotics Engineering'}
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-medium text-[var(--nau-text-secondary)] mb-1.5">Intake Capacity *</label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={newCourseSeats}
                    onChange={(e) => setNewCourseSeats(parseInt(e.target.value) || 60)}
                    className="w-full px-3.5 py-2.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl font-mono font-bold text-[var(--nau-text-primary)] focus:border-[var(--nau-primary)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[var(--nau-text-secondary)] mb-1.5">Semester Fee (INR) *</label>
                  <input
                    type="number"
                    min="10000"
                    step="1000"
                    value={newCourseFee}
                    onChange={(e) => setNewCourseFee(parseInt(e.target.value) || 65000)}
                    className="w-full px-3.5 py-2.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl font-mono font-bold text-[var(--nau-text-primary)] focus:border-[var(--nau-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--nau-border)]">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2.5 bg-[var(--nau-surface)] hover:bg-[var(--nau-surface-tertiary)] text-[var(--nau-text-secondary)] rounded-xl font-semibold border border-[var(--nau-border)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[var(--nau-primary)] hover:bg-blue-600 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  Add Course to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Teacher Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[var(--nau-card-bg)] rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-[var(--nau-border)] space-y-5 text-[var(--nau-text-primary)] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[var(--nau-border)] pb-3.5">
              <h3 className="text-base font-bold text-[var(--nau-text-primary)] tracking-tight">
                Assign Faculty to Engineering Course
              </h3>
              <button onClick={() => setShowAssignModal(false)} className="p-1.5 text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)] rounded-xl hover:bg-[var(--nau-hover-bg)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-[var(--nau-text-secondary)] mb-1.5">Select Teaching Faculty *</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl font-medium text-[var(--nau-text-primary)] focus:border-[var(--nau-primary)] focus:outline-none"
                >
                  {teacherProfiles.map((tp) => {
                    const u = users.find(usr => usr.id === tp.userId);
                    return (
                      <option key={tp.id} value={tp.id} className="bg-[var(--nau-surface)]">
                        {u?.fullName || 'Faculty'} ({tp.designation} - {tp.department})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-medium text-[var(--nau-text-secondary)] mb-1.5">Select Engineering Course *</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl font-medium text-[var(--nau-text-primary)] focus:border-[var(--nau-primary)] focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[var(--nau-surface)]">
                      [{c.programLevel === 'Postgraduate' ? 'ME' : 'BE'}] {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--nau-border)]">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2.5 bg-[var(--nau-surface)] hover:bg-[var(--nau-surface-tertiary)] text-[var(--nau-text-secondary)] rounded-xl font-semibold border border-[var(--nau-border)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[var(--nau-primary)] hover:bg-blue-600 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  Assign Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

function activeAcademicYearsName(academicYears: AcademicYear[]): string {
  return academicYears.find(ay => ay.isCurrent)?.yearName || '2026-2027';
}
