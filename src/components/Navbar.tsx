import React, { useState } from 'react';
import { ApplicationUser, UserRole } from '../types';
import { UNIVERSITY_SETTINGS } from '../data/universitySettings';
import { 
  GraduationCap, 
  Code2, 
  Calendar,
  ChevronDown,
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  LayoutDashboard,
  Moon,
  Sun
} from 'lucide-react';
import { ThemeMode } from '../services/themeService';

interface NavbarProps {
  currentUser: ApplicationUser;
  availableUsers: ApplicationUser[];
  onSwitchUser: (user: ApplicationUser) => void;
  onOpenCodeExplorer: () => void;
  onOpenAuthView?: () => void;
  activeAcademicYear: string;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  availableUsers,
  onSwitchUser,
  onOpenCodeExplorer,
  onOpenAuthView,
  activeAcademicYear,
  theme,
  onToggleTheme,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const isDark = theme === 'dark';
  const toggleLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'Administrator':
        return isDark 
          ? 'bg-purple-950/80 text-purple-300 border-purple-800/60'
          : 'bg-purple-100 text-purple-800 border-purple-300';
      case 'AccountsOfficer':
        return isDark 
          ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
          : 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Teacher':
        return isDark 
          ? 'bg-blue-950/80 text-blue-300 border-blue-800/60'
          : 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Student':
      default:
        return isDark 
          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
          : 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  const getRoleAvatarBg = (role: UserRole) => {
    switch (role) {
      case 'Administrator':
        return 'bg-purple-600 text-white';
      case 'AccountsOfficer':
        return 'bg-amber-600 text-white';
      case 'Teacher':
        return 'bg-blue-600 text-white';
      case 'Student':
      default:
        return 'bg-emerald-600 text-white';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--nau-bg-sidebar)]/95 backdrop-blur-md border-b border-[var(--nau-border)] shadow-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Logo & University Brand */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-[var(--nau-bg-card)] rounded-xl flex items-center justify-center text-white shadow-inner border border-[var(--nau-border)] transition-colors duration-200">
                <GraduationCap className="w-5 h-5 text-[var(--nau-primary)]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[var(--nau-text-primary)] tracking-tight text-base">
                    {UNIVERSITY_SETTINGS.universityName}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--nau-bg-card)] text-[var(--nau-text-secondary)] border border-[var(--nau-border)]">
                    <Calendar className="w-3 h-3 text-[var(--nau-text-muted)]" />
                    AY {activeAcademicYear}
                  </span>
                </div>
                <p className="text-xs text-[var(--nau-text-muted)] font-medium">
                  Founder: {UNIVERSITY_SETTINGS.founderName} • Admission Management Portal
                </p>
              </div>
            </div>

            {/* Right: Navigation Actions, Theme Toggle & User Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Theme Toggle Button (Moon in Light, Sun in Dark) */}
              <button
                id="nau-theme-toggle-btn"
                type="button"
                onClick={onToggleTheme}
                title={toggleLabel}
                aria-label={toggleLabel}
                className="p-2 rounded-xl border border-[var(--nau-border)] bg-[var(--nau-bg-card)] hover:bg-[var(--nau-hover)] text-[var(--nau-text-primary)] transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--nau-primary)]/50 flex items-center justify-center group"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-200" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-600 group-hover:-rotate-12 transition-transform duration-200" />
                )}
                <span className="sr-only">{toggleLabel}</span>
              </button>

              {/* Dashboard Indicator Link */}
              <div className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--nau-bg-card)] border border-[var(--nau-border)] text-xs text-[var(--nau-text-secondary)]">
                <LayoutDashboard className="w-3.5 h-3.5 text-[var(--nau-primary)]" />
                <span className="font-medium">
                  {currentUser.role === 'Administrator' ? 'Admin Console' :
                   currentUser.role === 'AccountsOfficer' ? 'Accounts Desk' :
                   currentUser.role === 'Teacher' ? 'Faculty Portal' :
                   'Student Desk'}
                </span>
              </div>

              {/* C# Code Explorer Trigger */}
              <button
                onClick={onOpenCodeExplorer}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[var(--nau-bg-card)] hover:bg-[var(--nau-hover)] text-[var(--nau-text-primary)] rounded-xl text-xs font-semibold border border-[var(--nau-border)] transition-all cursor-pointer shadow-xs"
                title="Explore ASP.NET Core 8 MVC Clean Architecture Source Code"
              >
                <Code2 className="w-4 h-4 text-[var(--nau-secondary)]" />
                <span className="hidden md:inline">C# Solution Files</span>
                <span className="md:hidden">C# Code</span>
              </button>

              {/* User Persona & Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-[var(--nau-border)] bg-[var(--nau-bg-card)] hover:bg-[var(--nau-hover)] transition-all cursor-pointer text-left focus:ring-2 focus:ring-[var(--nau-primary)]/50"
                  aria-expanded={dropdownOpen}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${getRoleAvatarBg(currentUser.role)}`}>
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-[var(--nau-text-primary)] truncate max-w-[130px]">
                      {currentUser.fullName}
                    </div>
                    <div className="text-[10px] text-[var(--nau-text-muted)] font-medium">
                      {currentUser.role === 'AccountsOfficer' ? 'Accounts Officer' : currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--nau-text-muted)]" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-[var(--nau-bg-card)] rounded-2xl shadow-2xl border border-[var(--nau-border)] z-50 p-2 divide-y divide-[var(--nau-border)] animate-in fade-in zoom-in-95 duration-150">
                      
                      {/* User Info Header */}
                      <div className="px-3 py-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-[var(--nau-text-muted)] uppercase tracking-wider">
                            Active User
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getRoleBadgeStyle(currentUser.role)}`}>
                            {currentUser.role}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-[var(--nau-text-primary)] mt-1">
                          {currentUser.fullName}
                        </div>
                        <div className="text-xs text-[var(--nau-text-muted)] font-mono truncate">
                          {currentUser.email}
                        </div>

                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            onClick={() => {
                              setProfileModalOpen(true);
                              setDropdownOpen(false);
                            }}
                            className="flex-1 text-center py-1 px-2 rounded-lg bg-[var(--nau-bg-secondary)] hover:bg-[var(--nau-hover)] border border-[var(--nau-border)] text-[11px] font-medium text-[var(--nau-text-secondary)] transition-colors"
                          >
                            View Profile
                          </button>
                          {onOpenAuthView && (
                            <button
                              onClick={() => {
                                onOpenAuthView();
                                setDropdownOpen(false);
                              }}
                              className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-[11px] font-medium text-rose-600 dark:text-rose-300 transition-colors"
                            >
                              <LogOut className="w-3 h-3" />
                              Sign Out
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Switch Persona Options */}
                      <div className="py-1.5">
                        <span className="px-3 py-1 block text-[10px] font-bold text-[var(--nau-text-muted)] uppercase tracking-wider">
                          Switch Role / Persona
                        </span>
                        {availableUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => {
                              onSwitchUser(user);
                              setDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                              currentUser.id === user.id 
                                ? 'bg-[var(--nau-bg-secondary)] font-bold text-[var(--nau-text-primary)] border border-[var(--nau-border)]' 
                                : 'hover:bg-[var(--nau-hover)] text-[var(--nau-text-secondary)]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] ${getRoleAvatarBg(user.role)}`}>
                                {user.fullName.charAt(0)}
                              </div>
                              <div>
                                <div className="text-xs font-medium text-[var(--nau-text-primary)]">{user.fullName}</div>
                                <div className="text-[10px] text-[var(--nau-text-muted)]">{user.role}</div>
                              </div>
                            </div>
                            {currentUser.id === user.id && (
                              <UserCheck className="w-4 h-4 text-[var(--nau-primary)]" />
                            )}
                          </button>
                        ))}
                      </div>

                    </div>
                  </>
                )}
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* User Profile Quick Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--nau-bg-card)] border border-[var(--nau-border)] text-[var(--nau-text-primary)] rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--nau-border)]">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${getRoleAvatarBg(currentUser.role)}`}>
                  {currentUser.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--nau-text-primary)]">{currentUser.fullName}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getRoleBadgeStyle(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="text-[var(--nau-text-muted)] hover:text-[var(--nau-text-primary)] p-1 rounded-lg hover:bg-[var(--nau-hover)] transition-colors"
                aria-label="Close Profile Dialog"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-[var(--nau-bg-secondary)] rounded-xl border border-[var(--nau-border)]">
                <span className="text-[var(--nau-text-muted)] block text-[11px]">Email Address</span>
                <span className="font-mono text-[var(--nau-text-primary)] font-medium">{currentUser.email}</span>
              </div>
              <div className="p-3 bg-[var(--nau-bg-secondary)] rounded-xl border border-[var(--nau-border)]">
                <span className="text-[var(--nau-text-muted)] block text-[11px]">Phone Contact</span>
                <span className="font-mono text-[var(--nau-text-primary)] font-medium">{currentUser.phoneNumber || '+91 9876543210'}</span>
              </div>
              <div className="p-3 bg-[var(--nau-bg-secondary)] rounded-xl border border-[var(--nau-border)]">
                <span className="text-[var(--nau-text-muted)] block text-[11px]">Affiliated Institution</span>
                <span className="text-[var(--nau-text-primary)] font-medium">{UNIVERSITY_SETTINGS.universityName}</span>
              </div>
              <div className="p-3 bg-[var(--nau-bg-secondary)] rounded-xl border border-[var(--nau-border)]">
                <span className="text-[var(--nau-text-muted)] block text-[11px]">Account Security Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Active & Authenticated with Identity Role Claims
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setProfileModalOpen(false)}
                className="px-4 py-2 bg-[var(--nau-primary)] hover:opacity-90 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
