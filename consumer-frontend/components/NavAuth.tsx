'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, BadgeCheck, Mail, User, Phone, Calendar, MapPin } from 'lucide-react';
import { logout, UserProfile } from '@/lib/api';

function getInitials(name?: string, email?: string): string {
  if (name) return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (email?.[0] ?? '?').toUpperCase();
}

function readStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem('authUser');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export default function NavAuth() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const syncAuth = () => {
    setProfile(readStoredUser());
  };

  useEffect(() => {
    syncAuth();
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setProfile(null);
    setOpen(false);
    router.push('/login');
  };

  if (!profile) {
    return (
      <a href="/login" className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 font-medium transition-colors">
        Login
      </a>
    );
  }

  const initials = getInitials(profile?.full_name, profile?.email);
  const displayName = profile?.full_name ?? profile?.email ?? '…';

  const Row = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) =>
    value ? (
      <div className="flex items-start gap-3 text-sm">
        <Icon size={14} className="text-gray-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-gray-700">{value}</p>
        </div>
      </div>
    ) : null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 hover:bg-gray-100 rounded-md px-2 py-1.5 transition-colors"
        aria-expanded={open}
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
          {initials}
        </div>
        <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate hidden sm:block">
          {displayName}
        </span>
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {/* Avatar header */}
          <div className="px-4 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
              {profile?.isAccountVerified !== undefined && (
                <span className={`inline-flex items-center gap-1 text-xs mt-0.5 ${profile.isAccountVerified ? 'text-green-600' : 'text-gray-400'}`}>
                  <BadgeCheck size={12} />
                  {profile.isAccountVerified ? 'Verified' : 'Not Verified'}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="px-4 py-3 space-y-3 max-h-72 overflow-y-auto">
            {profile && (
              <>
                <Row icon={User} label="Full Name" value={profile.full_name} />
                <Row icon={Mail} label="Email" value={profile.email} />
                <Row icon={Phone} label="Mobile" value={profile.mobile} />
                <Row icon={Calendar} label="Date of Birth" value={profile.date_of_birth} />
                <Row icon={User} label="Gender" value={profile.gender === 'M' ? 'Male' : profile.gender === 'F' ? 'Female' : profile.gender} />

                {profile.address && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Address</p>
                      <p className="text-gray-700 text-xs leading-relaxed">
                        {[
                          profile.address.houseNumber,
                          profile.address.street,
                          profile.address.locality,
                          profile.address.district,
                          profile.address.state,
                          profile.address.pincode,
                        ].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {profile.pan && <Row icon={User} label="PAN" value={profile.pan} />}
                {profile.masked_aadhaar && <Row icon={User} label="Aadhaar" value={profile.masked_aadhaar} />}

                <div className="flex items-start gap-3 text-sm">
                  <Mail size={14} className="text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Email Verified</p>
                    <p className={profile.email_verified === 'Y' ? 'text-green-600' : 'text-gray-500'}>
                      {profile.email_verified === 'Y' ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 px-4 py-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-sm text-red-600 hover:bg-red-50 py-2 rounded-md transition-colors font-medium"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
