export type UserRole = 'Student' | 'Teacher' | 'AccountsOfficer' | 'Administrator';

export type ProgramLevel = 'Undergraduate' | 'Postgraduate';

export type AdmissionStatus = 
  | 'Draft'
  | 'Submitted'
  | 'UnderReview'
  | 'DocumentsPending'
  | 'Approved'
  | 'Rejected'
  | 'AdmissionConfirmed'
  | 'Cancelled';

export type PaymentMethod = 
  | 'Cash'
  | 'UPI'
  | 'Card'
  | 'NetBanking'
  | 'BankTransfer'
  | 'DemandDraft';

export type PaymentStatus = 
  | 'Pending'
  | 'Submitted'
  | 'UnderVerification'
  | 'Paid'
  | 'PartiallyPaid'
  | 'Failed'
  | 'Rejected'
  | 'Refunded';

export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected';

export interface UniversitySettings {
  universityName: string;
  founderName: string;
  administratorDisplayName: string;
  universityShortName: string;
  establishedYear?: string;
  address?: string;
  contactEmail?: string;
  contactNumber?: string;
  websiteUrl?: string;
  logoPath: string;
}

export interface ApplicationUser {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  phoneNumber?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  aadhaarEncrypted: string;
  aadhaarLastFour: string;
  aadhaarHash: string; // Used for unique constraint check without decrypting
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  previousQualification: string;
  previousInstitute: string;
  previousPercentage: number;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  employeeCode: string;
  department: string;
  designation: string;
  qualification: string;
}

export interface Course {
  id: string;
  code: string; // e.g. "BE-COMP", "ME-CSE"
  name: string;
  programLevel: ProgramLevel; // 'Undergraduate' (BE) | 'Postgraduate' (ME)
  department: string;
  durationYears: number; // 4 for BE, 2 for ME
  totalSemesters: number; // 8 for BE, 4 for ME
  totalSeats: number;
  semesterFee: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeacherCourse {
  id: string;
  teacherProfileId: string;
  courseId: string;
  assignedAt: string;
}

export interface AcademicYear {
  id: string;
  yearName: string; // e.g. "2026-2027"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface AdmissionStatusHistory {
  id: string;
  admissionApplicationId: string;
  previousStatus: AdmissionStatus;
  newStatus: AdmissionStatus;
  changedByUserId: string;
  changedByName: string;
  changedAt: string;
  remarks: string;
}

export interface AdmissionApplication {
  id: string;
  applicationNumber: string; // e.g. ADM-2026-BE-COMP-000001
  studentUserId: string;
  courseId: string;
  academicYearId: string;
  programLevel: ProgramLevel;
  
  // Student Details Snapshot
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  mobileNumber: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  aadhaarMasked: string;
  aadhaarEncrypted: string;
  aadhaarHash: string;
  
  previousQualification: string;
  previousInstitute: string;
  previousPercentage: number;

  // Postgraduate (ME) Specific Qualifications
  bachelorDegreeName?: string;
  bachelorUniversityName?: string;
  bachelorGraduationYear?: number;
  bachelorPercentageOrCGPA?: number;

  studentDeclaration: boolean;
  
  status: AdmissionStatus;
  applicationDate: string;
  submissionDate?: string;
  totalFeePayable: number;
  feeStatus: PaymentStatus;
  
  statusHistories?: AdmissionStatusHistory[];
  payments?: FeePayment[];
}

export interface PaymentStatusHistory {
  id: string;
  feePaymentId: string;
  previousStatus: PaymentStatus;
  newStatus: PaymentStatus;
  changedByUserId: string;
  changedByName: string;
  changedAt: string;
  remarks: string;
}

export interface FeePayment {
  id: string;
  admissionApplicationId: string;
  transactionNumber: string; // TXN-2026-000001
  totalFee: number;
  amountPaid: number;
  remainingAmount: number;
  paymentMethod: PaymentMethod;
  externalReferenceNumber: string; // e.g. UPI Ref / Challan No / Bank UTR
  paymentDate: string;
  paymentStatus: PaymentStatus;
  verificationStatus: VerificationStatus;
  verifiedByUserId?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  receiptNumber?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityName: string;
  entityId: string;
  oldValues?: string;
  newValues?: string;
  ipAddress: string;
  createdAt: string;
}

export interface AdmissionFormInput {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  mobileNumber: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  aadhaarNumber: string;
  programLevel: ProgramLevel;
  courseId: string;
  academicYearId: string;
  previousQualification: string;
  previousInstitute: string;
  previousPercentage: number;
  
  // Postgraduate optional / validated fields
  bachelorDegreeName?: string;
  bachelorUniversityName?: string;
  bachelorGraduationYear?: number;
  bachelorPercentageOrCGPA?: number;
  
  studentDeclaration: boolean;
}

export interface PaymentFormInput {
  applicationId: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  externalReferenceNumber: string;
  remarks?: string;
}
