'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout, UserProfile } from '@/lib/api';
import { BadgeCheck, Mail, MapPin, User, CreditCard } from 'lucide-react';

function getInitials(name?: string, email?: string) {
  if (name) return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (email?.[0] ?? '?').toUpperCase();
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }

    const raw = localStorage.getItem('authUser');
    if (!raw) { router.push('/login'); return; }

    try {
      setProfile(JSON.parse(raw));
    } catch {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => { logout(); router.push('/login'); };

  if (!profile) {
    return <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Loading…</div>;
  }

  const initials = getInitials(profile.full_name, profile.email);
  const address = profile.address;

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{profile.full_name ?? profile.email}</h1>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <span className={`inline-flex items-center gap-1 text-xs mt-1 ${profile.isAccountVerified ? 'text-green-600' : 'text-gray-400'}`}>
            <BadgeCheck size={13} />
            {profile.isAccountVerified ? 'Account Verified' : 'Not Verified'}
          </span>
        </div>
      </div>

      {/* Personal */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
          <User size={14} /> Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name" value={profile.full_name} />
          <Field label="Mobile" value={profile.mobile} />
          <Field label="Date of Birth" value={profile.date_of_birth} />
          <Field label="Gender" value={profile.gender === 'M' ? 'Male' : profile.gender === 'F' ? 'Female' : profile.gender} />
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
          <Mail size={14} /> Contact & Verification
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email" value={profile.email} />
          <Field label="Email Verified" value={profile.email_verified === 'Y' ? 'Yes' : 'No'} />
          <Field label="Aadhaar Seeded" value={profile.isAadhaarSeeded === 'Y' ? 'Yes' : 'No'} />
          <Field label="Verified By" value={profile.verified_by} />
        </div>
      </div>

      {/* Address */}
      {address && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
            <MapPin size={14} /> Address
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Care Of" value={address.careOf} />
            <Field label="House No." value={address.houseNumber} />
            <Field label="Street" value={address.street} />
            <Field label="Locality" value={address.locality} />
            <Field label="Landmark" value={address.landmark} />
            <Field label="Sub-District" value={address.subDistrict} />
            <Field label="District" value={address.district} />
            <Field label="State" value={address.state} />
            <Field label="Pincode" value={address.pincode} />
            <Field label="Post Office" value={address.postOffice} />
          </div>
        </div>
      )}

      {/* Documents */}
      {(profile.pan || profile.masked_aadhaar) && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
            <CreditCard size={14} /> Documents
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="PAN" value={profile.pan} />
            <Field label="Masked Aadhaar" value={profile.masked_aadhaar} />
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="w-full bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-xl hover:bg-red-100 font-medium transition-colors text-sm"
      >
        Logout
      </button>
    </div>
  );
}
