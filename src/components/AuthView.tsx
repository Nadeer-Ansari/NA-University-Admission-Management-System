import React, { useState } from 'react';
import { ApplicationUser, UserRole } from '../types';
import { UNIVERSITY_SETTINGS } from '../data/universitySettings';
import { 
  GraduationCap, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: (user: ApplicationUser) => void;
  availableUsers: ApplicationUser[];
  onCancel?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLoginSuccess,
  availableUsers,
  onCancel,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Student');
  
  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);

  // Quick Persona selection
  const handleSelectPersona = (user: ApplicationUser) => {
    setEmail(user.email);
    setPassword('Password@123');
    onLoginSuccess(user);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setAuthError(null);

    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = 'Official or registered email address is required';
    if (!password.trim()) newErrors.password = 'Security password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Authenticate against seeded personas
    const matchedUser = availableUsers.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matchedUser) {
      if (!matchedUser.isActive) {
        setAuthError('This account has been deactivated by administrator Nadeer Ansari. Please contact helpdesk.');
        return;
      }
      onLoginSuccess(matchedUser);
    } else {
      // Create transient guest session
      const newUser: ApplicationUser = {
        id: `user-${Date.now()}`,
        userName: email.trim().split('@')[0],
        fullName: fullName || email.split('@')[0],
        email: email.trim(),
        role: selectedRole,
        isActive: true,
        phoneNumber: phoneNumber || '9876543210',
        createdAt: new Date().toISOString(),
      };
      onLoginSuccess(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--nau-page-bg)] text-[var(--nau-text-primary)] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--nau-surface)] rounded-xl flex items-center justify-center text-[var(--nau-primary)] border border-[var(--nau-border)] shadow-xs">
            <GraduationCap className="w-5 h-5 text-[var(--nau-primary)]" />
          </div>
          <div>
            <span className="font-extrabold text-[var(--nau-text-primary)] text-base tracking-tight">
              {UNIVERSITY_SETTINGS.universityName}
            </span>
            <div className="text-[11px] text-[var(--nau-text-muted)]">
              Founder: {UNIVERSITY_SETTINGS.founderName} • Portal Access
            </div>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs text-[var(--nau-text-secondary)] hover:text-[var(--nau-text-primary)] px-3 py-1.5 rounded-lg bg-[var(--nau-surface)] border border-[var(--nau-border)] transition-colors cursor-pointer"
          >
            ← Back to Portal Preview
          </button>
        )}
      </header>

      {/* Main Authentication Card */}
      <div className="relative z-10 max-w-md w-full mx-auto my-8">
        <div className="bg-[var(--nau-card-bg)] border border-[var(--nau-border)] rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
          
          {/* University Emblem & Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-[var(--nau-surface-tertiary)] border border-[var(--nau-border)] rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner">
              <GraduationCap className="w-8 h-8 text-[var(--nau-primary)]" />
            </div>
            <div className="text-xs font-bold text-[var(--nau-secondary)] uppercase tracking-wider">
              {UNIVERSITY_SETTINGS.universityShortName} Admission System
            </div>
            <h1 className="text-2xl font-bold text-[var(--nau-heading)] mt-1">
              {isRegisterMode ? 'Create Applicant Account' : 'Sign In to Portal'}
            </h1>
            <p className="text-xs text-[var(--nau-text-muted)] mt-1">
              {isRegisterMode
                ? 'Register to apply for BE and ME engineering degree programs'
                : 'Access student admission desk, faculty allocation, or administration'}
            </p>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-rose-950/60 border border-red-200 dark:border-rose-800 text-red-600 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {isRegisterMode && (
              <>
                <div>
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[var(--nau-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full bg-[var(--nau-input-bg)] border border-[var(--nau-border)] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] focus:border-[var(--nau-primary)] focus:ring-1 focus:ring-[var(--nau-primary)] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                    Mobile Contact Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[var(--nau-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full bg-[var(--nau-input-bg)] border border-[var(--nau-border)] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] focus:border-[var(--nau-primary)] focus:ring-1 focus:ring-[var(--nau-primary)] outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                Official Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--nau-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@nauniversity.edu.in"
                  className={`w-full bg-[var(--nau-input-bg)] border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] focus:border-[var(--nau-primary)] focus:ring-1 focus:ring-[var(--nau-primary)] outline-none transition-all ${
                    errors.email ? 'border-rose-500' : 'border-[var(--nau-border)]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--nau-text-secondary)] mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--nau-text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full bg-[var(--nau-input-bg)] border rounded-xl pl-10 pr-10 py-2.5 text-xs text-[var(--nau-text-primary)] placeholder-[var(--nau-text-muted)] focus:border-[var(--nau-primary)] focus:ring-1 focus:ring-[var(--nau-primary)] outline-none transition-all ${
                    errors.password ? 'border-rose-500' : 'border-[var(--nau-border)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-[var(--nau-primary)] hover:bg-[var(--nau-primary-hover)] text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isRegisterMode ? 'Complete Registration' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle between Register and Sign in */}
          <div className="text-center mt-4 pt-4 border-t border-[var(--nau-border)]">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrors({});
                setAuthError(null);
              }}
              className="text-xs text-[var(--nau-primary)] hover:text-[var(--nau-primary-hover)] font-medium transition-colors cursor-pointer"
            >
              {isRegisterMode
                ? 'Already have an account? Sign in'
                : "New candidate? Create an admission account"}
            </button>
          </div>

          {/* Persona Demo Quick Sign-in Section */}
          <div className="mt-6 pt-5 border-t border-[var(--nau-border)]">
            <div className="text-[11px] font-bold text-[var(--nau-text-muted)] uppercase tracking-wider text-center mb-3">
              One-Click Role Authentication (Demo)
            </div>
            <div className="grid grid-cols-2 gap-2">
              {availableUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectPersona(u)}
                  className="p-2.5 rounded-xl bg-[var(--nau-surface-tertiary)] hover:bg-[var(--nau-hover-bg)] border border-[var(--nau-border)] hover:border-[var(--nau-primary)] text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[var(--nau-primary)] uppercase font-bold">
                      {u.role === 'Administrator' ? 'ADMIN' : u.role}
                    </span>
                    <ArrowRight className="w-3 h-3 text-[var(--nau-text-muted)] group-hover:text-[var(--nau-primary)] transition-colors" />
                  </div>
                  <div className="text-xs font-bold text-[var(--nau-text-primary)] truncate mt-0.5">
                    {u.fullName}
                  </div>
                  <div className="text-[10px] text-[var(--nau-text-muted)] truncate font-mono">
                    {u.email}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-[var(--nau-text-muted)] py-4">
        <div>© N.A. University | Founded by Nadeer Ansari</div>
      </footer>

    </div>
  );
};
