import React from 'react';
import { AdmissionApplication, Course, FeePayment } from '../types';
import { UNIVERSITY_SETTINGS } from '../data/universitySettings';
import { Printer, X, ShieldCheck, CheckCircle2, GraduationCap } from 'lucide-react';

interface ReceiptModalProps {
  application: AdmissionApplication;
  payment: FeePayment;
  course?: Course;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  application,
  payment,
  course,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const programDisplay = application.programLevel === 'Postgraduate' || (course && course.programLevel === 'Postgraduate')
    ? 'Postgraduate (ME)'
    : 'Undergraduate (BE)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[var(--nau-card-bg)] text-[var(--nau-text-primary)] rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-[var(--nau-border)] animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Modal Action Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-[var(--nau-surface-tertiary)] text-[var(--nau-text-primary)] border-b border-[var(--nau-border)] print:hidden">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[var(--nau-primary)]" />
            <span className="font-semibold text-sm">Official University Admission Fee Receipt</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--nau-primary)] hover:bg-[var(--nau-primary-hover)] text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)] rounded-lg hover:bg-[var(--nau-hover-bg)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div className="p-8 bg-white text-slate-900 print:p-0 print:m-0" id="admission-receipt-printable">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-xs border border-slate-800">
                  <GraduationCap className="w-9 h-9 text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {UNIVERSITY_SETTINGS.universityName}
                  </h1>
                  <p className="text-xs font-semibold text-indigo-700">
                    Founder: {UNIVERSITY_SETTINGS.founderName}
                  </p>
                  <p className="text-xs text-slate-600 font-medium">
                    Office of the Registrar & Finance Division • Directorate of Admissions
                  </p>
                  {UNIVERSITY_SETTINGS.address && (
                    <p className="text-xs text-slate-500">
                      {UNIVERSITY_SETTINGS.address}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  OFFICIALLY VERIFIED
                </span>
                <div className="mt-2 text-xs text-slate-500 font-mono">
                  Receipt No: <span className="font-bold text-slate-800">{payment.receiptNumber || 'REC-2026-00412'}</span>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Receipt Date: {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Student & Application Info Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-6">
            <div>
              <span className="text-slate-500 block">Candidate Full Name:</span>
              <span className="font-bold text-sm text-slate-900">{application.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Application Number:</span>
              <span className="font-mono font-bold text-indigo-700 text-sm">{application.applicationNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Program Level:</span>
              <span className="font-bold text-slate-800">{programDisplay}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Course Code:</span>
              <span className="font-mono font-bold text-slate-800">{course?.code || 'BE-COMP'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Admitted Course Name:</span>
              <span className="font-semibold text-slate-800">{course ? course.name : 'BE in Computer Engineering'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Academic Year:</span>
              <span className="font-semibold text-slate-800">2026-2027</span>
            </div>
            <div>
              <span className="text-slate-500 block">Contact Email:</span>
              <span className="font-medium text-slate-700">{application.email}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Aadhaar (Data Protection):</span>
              <span className="font-mono font-medium text-slate-700">
                {application.aadhaarMasked || 'XXXX-XXXX-1012'} (Masked)
              </span>
            </div>
          </div>

          {/* Fee Payment Breakdown Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Fee Particulars</th>
                  <th className="p-3">Transaction Details</th>
                  <th className="p-3">Payment Method</th>
                  <th className="p-3 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3">
                    <div className="font-semibold text-slate-900">Tuition & Admission Fee</div>
                    <div className="text-slate-500 text-[11px]">{course?.name || 'Engineering Program'} - Semester 1</div>
                  </td>
                  <td className="p-3 font-mono text-[11px]">
                    <div>Txn: <span className="font-bold text-slate-800">{payment.transactionNumber}</span></div>
                    <div className="text-slate-500">Ref: {payment.externalReferenceNumber}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium border border-slate-200">
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    ₹{payment.amountPaid.toLocaleString()}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200 font-semibold text-xs text-slate-800">
                <tr>
                  <td colSpan={3} className="p-3 text-right">Total Course Fee:</td>
                  <td className="p-3 text-right font-mono">₹{payment.totalFee.toLocaleString()}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-3 text-right text-emerald-700 font-bold">Total Amount Paid:</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-700">₹{payment.amountPaid.toLocaleString()}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-3 text-right text-slate-600">Remaining Balance:</td>
                  <td className="p-3 text-right font-mono text-slate-600">₹{payment.remainingAmount.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Verification & Sign-off Details */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs text-slate-600 items-end">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Verification Audit Trail</span>
              </div>
              <div className="text-[11px] text-slate-500 space-y-0.5">
                <div>Payment Status: <span className="font-semibold text-slate-700">{payment.paymentStatus}</span></div>
                <div>Payment Date: {new Date(payment.paymentDate).toLocaleString()}</div>
                <div>Verified By: <span className="font-semibold text-slate-700">{payment.verifiedByName || 'Chief Accounts Officer'}</span></div>
                <div>Verification Timestamp: {new Date(payment.verifiedAt || payment.paymentDate).toLocaleString()}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block border-b border-slate-400 pb-1 w-48 text-center mb-1">
                <span className="font-signature font-serif italic text-slate-800 text-sm">{payment.verifiedByName || 'Authorized Signatory'}</span>
              </div>
              <p className="text-[11px] font-bold text-slate-700">Authorized Accounts Officer</p>
              <p className="text-[10px] text-slate-500">{UNIVERSITY_SETTINGS.universityName}</p>
            </div>
          </div>

          {/* Disclaimer / Note */}
          <div className="mt-6 pt-4 border-t border-dashed border-slate-200 text-[10px] text-slate-400 text-center">
            This is an official computer-generated fee receipt issued by {UNIVERSITY_SETTINGS.universityName} (Founder: {UNIVERSITY_SETTINGS.founderName}). Retain this document for future academic references and enrollment verification.
          </div>

        </div>

      </div>
    </div>
  );
};
