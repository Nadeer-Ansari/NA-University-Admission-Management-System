import React, { useState } from 'react';
import { 
  AdmissionApplication, 
  ApplicationUser, 
  Course, 
  FeePayment, 
  PaymentMethod 
} from '../types';
import { UNIVERSITY_SETTINGS } from '../data/universitySettings';
import { 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Receipt, 
  PlusCircle, 
  ShieldCheck, 
  DollarSign, 
  X,
  CreditCard
} from 'lucide-react';
import { ApplicationNumberGenerator } from '../services/applicationNumberGenerator';

interface AccountsPortalProps {
  currentUser: ApplicationUser;
  applications: AdmissionApplication[];
  courses: Course[];
  onVerifyPayment: (paymentId: string, isApproved: boolean, remarks: string) => void;
  onRecordOfflinePayment: (appId: string, amount: number, method: PaymentMethod, refNo: string, remarks: string) => void;
  onViewReceipt: (app: AdmissionApplication, payment: FeePayment) => void;
}

export const AccountsPortal: React.FC<AccountsPortalProps> = ({
  currentUser,
  applications,
  courses,
  onVerifyPayment,
  onRecordOfflinePayment,
  onViewReceipt,
}) => {
  // Aggregate all payments across applications
  const allPayments: { app: AdmissionApplication; payment: FeePayment }[] = [];
  applications.forEach(app => {
    if (app.payments) {
      app.payments.forEach(p => {
        allPayments.push({ app, payment: p });
      });
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'Pending' | 'Verified' | 'All'>('Pending');
  
  // Verification Modal State
  const [activeVerifyPayment, setActiveVerifyPayment] = useState<{ app: AdmissionApplication; payment: FeePayment; action: 'verify' | 'reject' } | null>(null);
  const [verificationRemarks, setVerificationRemarks] = useState('');

  // Offline Payment Modal State
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || '');
  const [offlineAmount, setOfflineAmount] = useState<number>(85000);
  const [offlineMethod, setOfflineMethod] = useState<PaymentMethod>('Cash');
  const [offlineRef, setOfflineRef] = useState(`OFF-REC-${Math.floor(10000 + Math.random() * 90000)}`);
  const [offlineRemarks, setOfflineRemarks] = useState('Payment collected at university finance counter.');

  // Financial Metrics
  const totalVerifiedCollected = allPayments
    .filter(item => item.payment.verificationStatus === 'Verified')
    .reduce((acc, curr) => acc + curr.payment.amountPaid, 0);

  const pendingVerificationAmount = allPayments
    .filter(item => item.payment.verificationStatus === 'Pending')
    .reduce((acc, curr) => acc + curr.payment.amountPaid, 0);

  const pendingCount = allPayments.filter(item => item.payment.verificationStatus === 'Pending').length;

  const filteredPayments = allPayments.filter(({ app, payment }) => {
    const matchesSearch = 
      app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.externalReferenceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = 
      filterTab === 'All' || 
      payment.verificationStatus === filterTab;

    return matchesSearch && matchesTab;
  });

  const handleConfirmVerification = () => {
    if (!activeVerifyPayment) return;
    const isApproved = activeVerifyPayment.action === 'verify';
    onVerifyPayment(
      activeVerifyPayment.payment.id,
      isApproved,
      verificationRemarks || (isApproved ? 'Verified against university bank statement.' : 'Rejected due to invalid transaction reference.')
    );
    setActiveVerifyPayment(null);
    setVerificationRemarks('');
  };

  const handleCreateOfflinePayment = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordOfflinePayment(
      selectedAppId,
      Number(offlineAmount),
      offlineMethod,
      offlineRef,
      offlineRemarks
    );
    setShowOfflineModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Finance Banner */}
      <div className="bg-[var(--nau-card-bg)] rounded-2xl p-6 sm:p-7 text-[var(--nau-text-primary)] shadow-xl border border-[var(--nau-border)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-emerald-900/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span>{UNIVERSITY_SETTINGS.universityName} • Finance & Accounts Division</span>
            <span className="text-[var(--nau-text-muted)]">•</span>
            <span>Fee Verification Desk</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--nau-text-primary)] mt-1.5 tracking-tight">
            Accounts & Fee Management Console
          </h1>
          <p className="text-[var(--nau-text-secondary)] text-xs mt-1 max-w-xl leading-relaxed">
            Audit candidate fee submissions across BE and ME programs, verify bank/UPI transaction references, issue official receipts, and record counter cash payments.
          </p>
        </div>

        <button
          onClick={() => setShowOfflineModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer shrink-0 relative z-10"
        >
          <PlusCircle className="w-4 h-4" />
          Record Counter / Cash Payment
        </button>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-[var(--nau-card-bg)] p-6 rounded-2xl border border-[var(--nau-border)] shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--nau-text-muted)]">Total Verified Deposited</span>
            <div className="p-2.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[var(--nau-text-primary)] mt-2 block tracking-tight font-mono">
            ₹{totalVerifiedCollected.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-400 font-medium mt-1.5 block">Deposited into University Main Account</span>
        </div>

        <div className="bg-[var(--nau-card-bg)] p-6 rounded-2xl border border-[var(--nau-border)] shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--nau-text-muted)]">Pending Verification</span>
            <div className="p-2.5 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/50">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2 block tracking-tight font-mono">
            ₹{pendingVerificationAmount.toLocaleString()}
          </span>
          <span className="text-[11px] text-amber-300 font-medium mt-1.5 block">{pendingCount} transactions awaiting clearance</span>
        </div>

        <div className="bg-[var(--nau-card-bg)] p-6 rounded-2xl border border-[var(--nau-border)] shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--nau-text-muted)]">Total Fee Ledger Records</span>
            <div className="p-2.5 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/50">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[var(--nau-text-primary)] mt-2 block tracking-tight font-mono">
            {allPayments.length}
          </span>
          <span className="text-[11px] text-[var(--nau-text-muted)] mt-1.5 block">Full and partial payment records</span>
        </div>

      </div>

      {/* Queue & Ledger */}
      <div className="bg-[var(--nau-card-bg)] rounded-2xl border border-[var(--nau-border)] shadow-xl p-6 md:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--nau-border)] pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterTab('Pending')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTab === 'Pending'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                  : 'bg-[var(--nau-surface)] text-[var(--nau-text-secondary)] hover:bg-[var(--nau-surface-tertiary)] border border-[var(--nau-border)]'
              }`}
            >
              Pending Verification ({pendingCount})
            </button>
            <button
              onClick={() => setFilterTab('Verified')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTab === 'Verified'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-[var(--nau-surface)] text-[var(--nau-text-secondary)] hover:bg-[var(--nau-surface-tertiary)] border border-[var(--nau-border)]'
              }`}
            >
              Verified ({allPayments.filter(p => p.payment.verificationStatus === 'Verified').length})
            </button>
            <button
              onClick={() => setFilterTab('All')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTab === 'All'
                  ? 'bg-[var(--nau-primary)] text-white shadow-lg shadow-blue-500/20'
                  : 'bg-[var(--nau-surface)] text-[var(--nau-text-secondary)] hover:bg-[var(--nau-surface-tertiary)] border border-[var(--nau-border)]'
              }`}
            >
              All Transactions ({allPayments.length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[var(--nau-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search App / Txn / Candidate..."
              className="w-full pl-9 pr-3.5 py-2 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl text-xs text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] focus:border-[var(--nau-primary)] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="border border-[var(--nau-border)] rounded-2xl overflow-x-auto shadow-md">
          <table className="w-full text-xs">
            <thead className="bg-[var(--nau-surface)] text-[var(--nau-text-secondary)] border-b border-[var(--nau-border)]">
              <tr>
                <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Transaction / Ref</th>
                <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Application & Student</th>
                <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Payment Mode</th>
                <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Amount Paid</th>
                <th className="py-3.5 px-4 text-left font-bold uppercase tracking-wider text-[11px]">Status</th>
                <th className="py-3.5 px-4 text-right font-bold uppercase tracking-wider text-[11px]">Officer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--nau-border)] text-[var(--nau-text-primary)]">
              {filteredPayments.length > 0 ? (
                filteredPayments.map(({ app, payment }) => {
                  const isPending = payment.verificationStatus === 'Pending';
                  const isVerified = payment.verificationStatus === 'Verified';

                  return (
                    <tr key={payment.id} className="bg-[var(--nau-card-bg)] hover:bg-[var(--nau-surface)] transition-colors">
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-[var(--nau-text-primary)] block">{payment.transactionNumber}</span>
                        <span className="text-[10px] text-[var(--nau-text-muted)]">Ref: {payment.externalReferenceNumber}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[var(--nau-primary)] block">{app.applicationNumber}</span>
                        <span className="font-semibold text-[var(--nau-text-secondary)]">{app.fullName}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-[var(--nau-text-secondary)]">{payment.paymentMethod}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[var(--nau-text-primary)] text-sm">
                        ₹{payment.amountPaid.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        {isVerified ? (
                          <span className="px-2.5 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded-full font-bold text-[10px] inline-flex items-center gap-1 whitespace-nowrap">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        ) : payment.verificationStatus === 'Rejected' ? (
                          <span className="px-2.5 py-0.5 bg-rose-950/80 text-rose-400 border border-rose-800/60 rounded-full font-bold text-[10px] inline-flex items-center gap-1 whitespace-nowrap">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-800/60 rounded-full font-bold text-[10px] inline-flex items-center gap-1 whitespace-nowrap">
                            <Clock className="w-3 h-3" /> Awaiting Review
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => {
                                setActiveVerifyPayment({ app, payment, action: 'verify' });
                                setVerificationRemarks('Bank ledger verified and matched.');
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => {
                                setActiveVerifyPayment({ app, payment, action: 'reject' });
                                setVerificationRemarks('UTR number could not be matched with bank ledger.');
                              }}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : isVerified ? (
                          <button
                            onClick={() => onViewReceipt(app, payment)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[var(--nau-surface)] text-[var(--nau-primary)] hover:bg-[var(--nau-surface-tertiary)] rounded-xl font-bold text-xs border border-[var(--nau-border)] transition-all cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            Receipt
                          </button>
                        ) : (
                          <span className="text-[var(--nau-text-muted)] text-[11px] italic">No actions</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[var(--nau-text-muted)] bg-[var(--nau-card-bg)]">
                    No fee payments found matching your filter query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Verification / Rejection Modal */}
      {activeVerifyPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[var(--nau-card-bg)] rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-7 border border-[var(--nau-border)] space-y-5 text-[var(--nau-text-primary)] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[var(--nau-border)] pb-3.5">
              <h3 className="text-base font-bold text-[var(--nau-text-primary)] flex items-center gap-2 tracking-tight">
                <ShieldCheck className="w-5 h-5 text-[var(--nau-primary)]" />
                {activeVerifyPayment.action === 'verify' ? 'Confirm Fee Verification' : 'Reject Fee Payment'}
              </h3>
              <button onClick={() => setActiveVerifyPayment(null)} className="p-1.5 text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)] rounded-xl hover:bg-[var(--nau-hover-bg)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-2 bg-[var(--nau-surface)] p-4 rounded-2xl border border-[var(--nau-border)]">
              <div className="flex justify-between">
                <span className="text-[var(--nau-text-muted)]">Candidate:</span>
                <span className="font-bold text-[var(--nau-text-primary)]">{activeVerifyPayment.app.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--nau-text-muted)]">Application Number:</span>
                <span className="font-mono font-bold text-[var(--nau-primary)]">{activeVerifyPayment.app.applicationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--nau-text-muted)]">Transaction Ref:</span>
                <span className="font-mono text-[var(--nau-text-secondary)]">{activeVerifyPayment.payment.externalReferenceNumber}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--nau-border)] pt-2.5 mt-2">
                <span className="text-[var(--nau-text-secondary)] font-bold">Amount to Clear:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">₹{activeVerifyPayment.payment.amountPaid.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                Accounts Officer Verification Remarks *
              </label>
              <textarea
                rows={2}
                value={verificationRemarks}
                onChange={(e) => setVerificationRemarks(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl text-xs text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] focus:border-[var(--nau-primary)] focus:outline-none transition-all"
                placeholder="Enter audit / clearance remarks..."
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setActiveVerifyPayment(null)}
                className="px-4 py-2.5 bg-[var(--nau-surface)] hover:bg-[var(--nau-surface-tertiary)] text-[var(--nau-text-secondary)] rounded-xl text-xs font-semibold border border-[var(--nau-border)] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmVerification}
                className={`px-5 py-2.5 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all ${
                  activeVerifyPayment.action === 'verify'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                }`}
              >
                Confirm {activeVerifyPayment.action === 'verify' ? 'Verification' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Counter Payment Modal */}
      {showOfflineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[var(--nau-card-bg)] rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-7 border border-[var(--nau-border)] space-y-5 text-[var(--nau-text-primary)] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[var(--nau-border)] pb-3.5">
              <h3 className="text-base font-bold text-[var(--nau-text-primary)] flex items-center gap-2 tracking-tight">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                Record Offline Counter Payment
              </h3>
              <button onClick={() => setShowOfflineModal(false)} className="p-1.5 text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)] rounded-xl hover:bg-[var(--nau-hover-bg)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOfflinePayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[var(--nau-text-secondary)] mb-1.5">
                  Select Admission Application *
                </label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl text-xs font-medium text-[var(--nau-text-primary)] focus:border-[var(--nau-primary)] focus:outline-none transition-all"
                >
                  {applications.map(app => (
                    <option key={app.id} value={app.id} className="bg-[var(--nau-surface)] text-[var(--nau-text-primary)]">
                      {app.applicationNumber} - {app.fullName} (Total Fee: ₹{app.totalFeePayable.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Amount Collected (₹) *
                  </label>
                  <input
                    type="number"
                    value={offlineAmount}
                    onChange={(e) => setOfflineAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl text-xs font-mono font-bold text-[var(--nau-text-primary)] focus:border-[var(--nau-primary)] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Payment Instrument *
                  </label>
                  <select
                    value={offlineMethod}
                    onChange={(e) => setOfflineMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3.5 py-2.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl text-xs font-medium text-[var(--nau-text-primary)] focus:border-[var(--nau-primary)] focus:outline-none transition-all"
                  >
                    <option value="Cash">Cash at Counter</option>
                    <option value="DemandDraft">Demand Draft (DD)</option>
                    <option value="BankTransfer">Bank Challan</option>
                    <option value="Card">POS Card Swipe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[var(--nau-text-secondary)] mb-1.5">
                  Challan / DD / Counter Receipt Ref No *
                </label>
                <input
                  type="text"
                  value={offlineRef}
                  onChange={(e) => setOfflineRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl text-xs font-mono font-medium text-[var(--nau-text-primary)] focus:border-[var(--nau-primary)] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-medium text-[var(--nau-text-secondary)] mb-1.5">
                  Accounting Remarks *
                </label>
                <textarea
                  rows={2}
                  value={offlineRemarks}
                  onChange={(e) => setOfflineRemarks(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--nau-surface)] border border-[var(--nau-border)] rounded-xl text-xs text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] focus:border-[var(--nau-primary)] focus:outline-none transition-all"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--nau-border)]">
                <button
                  type="button"
                  onClick={() => setShowOfflineModal(false)}
                  className="px-4 py-2.5 bg-[var(--nau-surface)] hover:bg-[var(--nau-surface-tertiary)] text-[var(--nau-text-secondary)] rounded-xl text-xs font-semibold border border-[var(--nau-border)] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 cursor-pointer transition-all"
                >
                  Record & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
