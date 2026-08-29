import React, { useState } from 'react';
import { 
  AcademicYear, 
  AdmissionApplication, 
  ApplicationUser, 
  Course, 
  TeacherCourse, 
  TeacherProfile 
} from '../types';
import { UNIVERSITY_SETTINGS } from '../data/universitySettings';
import { 
  Users, 
  Search, 
  Filter, 
  BookOpen, 
  ShieldCheck, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  X,
  FileSpreadsheet,
  Building2,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

interface TeacherPortalProps {
  currentUser: ApplicationUser;
  teacherProfiles: TeacherProfile[];
  teacherCourses: TeacherCourse[];
  courses: Course[];
  academicYears: AcademicYear[];
  applications: AdmissionApplication[];
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  currentUser,
  teacherProfiles,
  teacherCourses,
  courses,
  academicYears,
  applications,
}) => {
  // Find current teacher's profile
  const profile = teacherProfiles.find(tp => tp.userId === currentUser.id) || {
    id: 'tp-default',
    userId: currentUser.id,
    employeeCode: 'EMP-FAC-01',
    department: 'Department of Computer Science',
    designation: 'Senior Faculty & Course Coordinator',
    qualification: 'Ph.D. in Computer Science',
  };

  // Find assigned courses for this teacher
  const assignedCourseIds = teacherCourses
    .filter(tc => tc.teacherProfileId === profile.id)
    .map(tc => tc.courseId);

  // Filter available courses to only those assigned
  const assignedCourses = courses.filter(c => assignedCourseIds.includes(c.id));

  // Strict Course-Filtered Students
  const teacherAccessibleApplications = applications.filter(app => 
    assignedCourseIds.includes(app.courseId)
  );

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedAppModal, setSelectedAppModal] = useState<AdmissionApplication | null>(null);

  // Filtered applications list
  const filteredApps = teacherAccessibleApplications.filter(app => {
    const matchesSearch = 
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = selectedCourseFilter === 'ALL' || app.courseId === selectedCourseFilter;
    const matchesYear = selectedYearFilter === 'ALL' || app.academicYearId === selectedYearFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || app.status === selectedStatusFilter;

    return matchesSearch && matchesCourse && matchesYear && matchesStatus;
  });

  const getCourseName = (courseId: string) => {
    return courses.find(c => c.id === courseId)?.name || 'Unknown Course';
  };

  const getCourseCode = (courseId: string) => {
    return courses.find(c => c.id === courseId)?.code || 'GEN';
  };

  const getYearName = (yearId: string) => {
    return academicYears.find(y => y.id === yearId)?.yearName || '2026-2027';
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'AdmissionConfirmed':
        return (
          <span className="px-2.5 py-0.5 bg-emerald-900/90 text-emerald-300 border border-emerald-700/80 rounded-full font-bold text-[10px] whitespace-nowrap inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'Approved':
        return (
          <span className="px-2.5 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded-full font-bold text-[10px] whitespace-nowrap">
            Approved
          </span>
        );
      case 'UnderReview':
        return (
          <span className="px-2.5 py-0.5 bg-purple-950/80 text-purple-400 border border-purple-800/60 rounded-full font-bold text-[10px] whitespace-nowrap">
            Under Review
          </span>
        );
      case 'Submitted':
        return (
          <span className="px-2.5 py-0.5 bg-blue-950/80 text-blue-400 border border-blue-800/60 rounded-full font-bold text-[10px] whitespace-nowrap">
            Submitted
          </span>
        );
      case 'DocumentsPending':
        return (
          <span className="px-2.5 py-0.5 bg-amber-950/80 text-amber-400 border border-amber-800/60 rounded-full font-bold text-[10px] whitespace-nowrap">
            Documents Pending
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-0.5 bg-rose-950/80 text-rose-400 border border-rose-800/60 rounded-full font-bold text-[10px] whitespace-nowrap">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-full font-bold text-[10px] whitespace-nowrap">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Teacher Profile Header Card */}
      <div className="bg-[var(--nau-card-bg)] rounded-2xl p-6 sm:p-7 text-[var(--nau-text-primary)] shadow-xl border border-[var(--nau-border)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-blue-900/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-13 h-13 rounded-2xl bg-[var(--nau-surface)] border border-[var(--nau-border)] flex items-center justify-center text-[var(--nau-primary)] font-bold shrink-0 shadow-inner">
            <GraduationCap className="w-7 h-7 text-[var(--nau-primary)]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-extrabold text-[var(--nau-text-primary)] tracking-tight">{currentUser.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-[var(--nau-surface)] text-[var(--nau-primary)] border border-[var(--nau-border)]">
                {profile.employeeCode}
              </span>
            </div>
            <p className="text-xs text-[var(--nau-text-secondary)] font-medium mt-1">
              {profile.designation} • <span className="text-[var(--nau-primary)] font-semibold">{profile.department}</span>
            </p>
            <p className="text-[11px] text-[var(--nau-text-muted)] mt-0.5">
              {profile.qualification} • {UNIVERSITY_SETTINGS.universityName}
            </p>
          </div>
        </div>

        {/* Assigned Courses Badges */}
        <div className="bg-[var(--nau-surface)] rounded-xl p-4 border border-[var(--nau-border)] min-w-[280px] relative z-10 shadow-inner">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-bold text-[var(--nau-text-muted)] uppercase tracking-wider">
              Assigned Courses
            </span>
            <span className="text-[10px] font-mono font-bold bg-[var(--nau-card-bg)] text-[var(--nau-primary)] px-2 py-0.5 rounded-md border border-[var(--nau-border)]">
              {assignedCourses.length} Assigned
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {assignedCourses.length > 0 ? (
              assignedCourses.map(c => (
                <span key={c.id} className="px-2.5 py-1 bg-[var(--nau-card-bg)] text-[var(--nau-text-secondary)] border border-[var(--nau-border)] rounded-lg text-xs font-semibold">
                  {c.code}: {c.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-[var(--nau-text-muted)] italic">No courses assigned currently.</span>
            )}
          </div>
        </div>
      </div>

      {/* Roster & Filter Controls */}
      <div className="bg-[var(--nau-card-bg)] rounded-2xl border border-[var(--nau-border)] shadow-xl p-6 md:p-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--nau-border)] pb-5">
          <div>
            <h2 className="text-base font-bold text-[var(--nau-text-primary)] flex items-center gap-2 tracking-tight">
              <Users className="w-4 h-4 text-[var(--nau-primary)]" />
              Course-Wise Student Admission Roster
            </h2>
            <p className="text-xs text-[var(--nau-text-muted)] mt-0.5">
              Strictly filtered to students registered in your assigned courses and departments.
            </p>
          </div>

          <div className="text-xs font-medium text-[var(--nau-text-secondary)] bg-[var(--nau-surface)] border border-[var(--nau-border)] px-3.5 py-1.5 rounded-xl self-start md:self-auto">
            Showing <strong className="text-[var(--nau-text-primary)] font-bold">{filteredApps.length}</strong> enrolled candidates
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-[var(--nau-surface)] p-4 rounded-2xl border border-[var(--nau-border)]">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[var(--nau-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Name / ADM No..."
              className="w-full pl-9 pr-3.5 py-2 bg-[var(--nau-surface-tertiary)] border border-[var(--nau-border)] rounded-xl text-xs text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] focus:border-[var(--nau-primary)] focus:outline-none transition-all"
            />
          </div>

          {/* Course Filter */}
          <div>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="w-full px-3.5 py-2 bg-[var(--nau-surface-tertiary)] border border-[var(--nau-border)] rounded-xl text-xs font-medium text-[var(--nau-text-primary)] focus:border-[var(--nau-primary)] focus:outline-none transition-all"
            >
              <option value="ALL">All Assigned Courses ({assignedCourses.length})</option>
              {assignedCourses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          {/* Academic Year Filter */}
          <div>
            <select
              value={selectedYearFilter}
              onChange={(e) => setSelectedYearFilter(e.target.value)}
              className="w-full px-3.5 py-2 bg-[var(--nau-surface-tertiary)] border border-[var(--nau-border)] rounded-xl text-xs font-medium text-[var(--nau-text-primary)] focus:border-[var(--nau-primary)] focus:outline-none transition-all"
            >
              <option value="ALL">All Academic Years</option>
              {academicYears.map(ay => (
                <option key={ay.id} value={ay.id}>{ay.yearName}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2 bg-[var(--nau-surface-tertiary)] border border-[var(--nau-border)] rounded-xl text-xs font-medium text-[var(--nau-text-primary)] focus:border-[var(--nau-primary)] focus:outline-none transition-all"
            >
              <option value="ALL">All Admission Statuses</option>
              <option value="AdmissionConfirmed">Admission Confirmed</option>
              <option value="Approved">Approved</option>
              <option value="UnderReview">Under Review</option>
              <option value="Submitted">Submitted</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

        </div>

        {/* Student Table */}
        <div className="border border-[var(--nau-border)] rounded-2xl overflow-x-auto shadow-md">
          <table className="w-full text-xs">
            <thead className="bg-[var(--nau-surface)] text-[var(--nau-text-secondary)] border-b border-[var(--nau-border)]">
              <tr>
                <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Application No</th>
                <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Student Name</th>
                <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Course & Year</th>
                <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Prior %</th>
                <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Admission Status</th>
                <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Fee Status</th>
                <th className="py-3.5 px-4 text-right font-bold uppercase tracking-wider text-[11px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--nau-border)] text-[var(--nau-text-primary)]">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr key={app.id} className="bg-[var(--nau-card-bg)] hover:bg-[var(--nau-surface)] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[var(--nau-primary)]">
                      {app.applicationNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[var(--nau-text-primary)]">{app.fullName}</div>
                      <div className="text-[11px] text-[var(--nau-text-muted)] flex items-center gap-2 mt-0.5">
                        <span>{app.email}</span>
                        <span>•</span>
                        <span>+91 {app.mobileNumber}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[var(--nau-text-primary)] block">{getCourseCode(app.courseId)}</span>
                      <span className="text-[10px] text-[var(--nau-text-muted)]">{getYearName(app.academicYearId)}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[var(--nau-text-secondary)]">
                      {app.previousPercentage}%
                    </td>
                    <td className="py-3 px-4">
                      {renderStatusBadge(app.status)}
                    </td>
                    <td className="py-3 px-4">
                      {app.feeStatus === 'Paid' ? (
                        <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Full Paid
                        </span>
                      ) : app.feeStatus === 'UnderVerification' ? (
                        <span className="text-amber-400 font-semibold text-[11px] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Pending Audit
                        </span>
                      ) : (
                        <span className="text-[var(--nau-text-muted)] text-[11px]">Pending Deposit</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedAppModal(app)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[var(--nau-surface)] hover:bg-[var(--nau-surface-tertiary)] hover:text-[var(--nau-primary)] text-[var(--nau-text-secondary)] rounded-xl text-xs font-semibold transition-all cursor-pointer border border-[var(--nau-border)]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[var(--nau-text-muted)] bg-[var(--nau-card-bg)]">
                    No students match the selected filter criteria or course assignments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Student Details View Modal */}
      {selectedAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[var(--nau-card-bg)] rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-7 border border-[var(--nau-border)] space-y-6 text-[var(--nau-text-primary)] animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-[var(--nau-border)] pb-4">
              <div>
                <h3 className="text-base font-bold text-[var(--nau-text-primary)] tracking-tight">
                  Student Academic Profile & Admission Record
                </h3>
                <span className="font-mono text-xs font-bold text-[var(--nau-primary)] mt-0.5 block">
                  {selectedAppModal.applicationNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedAppModal(null)}
                className="p-1.5 text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)] rounded-xl hover:bg-[var(--nau-hover-bg)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[var(--nau-surface)] p-5 rounded-2xl border border-[var(--nau-border)]">
              <div>
                <span className="text-[var(--nau-text-muted)] block text-[11px]">Candidate Full Name:</span>
                <span className="font-bold text-[var(--nau-text-primary)] text-sm mt-0.5 block">{selectedAppModal.fullName}</span>
              </div>
              <div>
                <span className="text-[var(--nau-text-muted)] block text-[11px]">Date of Birth / Gender:</span>
                <span className="font-semibold text-[var(--nau-text-secondary)] mt-0.5 block">{selectedAppModal.dateOfBirth} ({selectedAppModal.gender})</span>
              </div>
              <div>
                <span className="text-[var(--nau-text-muted)] block text-[11px]">Email Address:</span>
                <span className="font-medium text-[var(--nau-text-secondary)] mt-0.5 block">{selectedAppModal.email}</span>
              </div>
              <div>
                <span className="text-[var(--nau-text-muted)] block text-[11px]">Contact Phone:</span>
                <span className="font-medium text-[var(--nau-text-secondary)] mt-0.5 block font-mono">+91 {selectedAppModal.mobileNumber}</span>
              </div>
              <div>
                <span className="text-[var(--nau-text-muted)] block text-[11px]">Enrolled Program:</span>
                <span className="font-bold text-[var(--nau-primary)] mt-0.5 block">{getCourseName(selectedAppModal.courseId)}</span>
              </div>
              <div>
                <span className="text-[var(--nau-text-muted)] block text-[11px]">Academic Year:</span>
                <span className="font-medium text-[var(--nau-text-secondary)] mt-0.5 block">{getYearName(selectedAppModal.academicYearId)}</span>
              </div>
              <div>
                <span className="text-[var(--nau-text-muted)] block text-[11px]">Prior Qualification:</span>
                <span className="font-medium text-[var(--nau-text-secondary)] mt-0.5 block">{selectedAppModal.previousQualification} ({selectedAppModal.previousInstitute})</span>
              </div>
              <div>
                <span className="text-[var(--nau-text-muted)] block text-[11px]">Merit Percentage:</span>
                <span className="font-bold text-emerald-400 mt-0.5 block font-mono">{selectedAppModal.previousPercentage}%</span>
              </div>
            </div>

            {/* Verified Fee Status */}
            <div className="p-4 bg-[var(--nau-surface)] rounded-2xl border border-[var(--nau-border)] text-xs">
              <span className="font-bold text-[var(--nau-text-primary)] block mb-1">Fee Clearance Details</span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[var(--nau-text-secondary)] gap-2">
                <span>Total Semester Fee: <strong className="font-mono text-[var(--nau-text-primary)]">₹{selectedAppModal.totalFeePayable.toLocaleString()}</strong></span>
                <span>Fee Status: <strong className="text-emerald-400 font-semibold">{selectedAppModal.feeStatus}</strong></span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAppModal(null)}
                className="px-5 py-2.5 bg-[var(--nau-surface-tertiary)] hover:bg-[var(--nau-hover-bg)] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
