'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { signup, login, SignupPayload } from '@/lib/api';

type ActiveTab = 'login' | 'signup';

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  mobile: string;
  date_of_birth: string;
  gender: string;
  district: string;
  state: string;
  pincode: string;
  careOf: string;
  houseNumber: string;
  street: string;
  locality: string;
  landmark: string;
  postOffice: string;
  subDistrict: string;
}

function PasswordInput({
  id, name, value, onChange, placeholder, className,
}: {
  id: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; className?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        id={id} name={name} value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${className} pr-10`}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

const EMPTY_SIGNUP: SignupForm = {
  email: '', password: '', confirmPassword: '',
  full_name: '', mobile: '', date_of_birth: '', gender: '',
  district: '', state: '', pincode: '',
  careOf: '', houseNumber: '', street: '', locality: '',
  landmark: '', postOffice: '', subDistrict: '',
};

const MOCK_USER: SignupForm = {
  email: 'ali.khan@outlook.com',
  password: 'Test@1234',
  confirmPassword: 'Test@1234',
  full_name: 'Mohammed Ali Khan',
  mobile: '+91-7654321098',
  date_of_birth: '1978-11-08',
  gender: 'M',
  district: 'Bangalore Urban',
  state: 'Karnataka',
  pincode: '560001',
  careOf: 'S/O Abdul Rahman Khan',
  houseNumber: '67/A',
  street: 'Residency Road',
  locality: 'Shivaji Nagar',
  landmark: 'Opposite Metro Station',
  postOffice: 'Bangalore GPO',
  subDistrict: 'Bangalore North',
};

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('login');
  const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState<SignupForm>(EMPTY_SIGNUP);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setErrors({});
    setSuccessMessage('');
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    const newErrors: Record<string, string> = {};
    if (!loginForm.email.trim()) newErrors.email = 'Email is required';
    if (!loginForm.password.trim()) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    try {
      await login(loginForm.email, loginForm.password);
      router.push('/');
    } catch (err: any) {
      setErrors({ email: err.message });
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    const newErrors: Record<string, string> = {};

    if (!signupForm.email.trim()) newErrors.email = 'Email is required';
    if (!signupForm.password.trim()) newErrors.password = 'Password is required';
    if (!signupForm.confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your password';
    if (signupForm.password && signupForm.confirmPassword && signupForm.password !== signupForm.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!signupForm.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!signupForm.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!signupForm.date_of_birth.trim()) newErrors.date_of_birth = 'Date of birth is required';
    if (!signupForm.gender) newErrors.gender = 'Gender is required';
    if (!signupForm.district.trim()) newErrors.district = 'District is required';
    if (!signupForm.state.trim()) newErrors.state = 'State is required';
    if (!signupForm.pincode.trim()) newErrors.pincode = 'Pincode is required';

    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    const payload: SignupPayload = {
      email: signupForm.email,
      password: signupForm.password,
      full_name: signupForm.full_name,
      mobile: signupForm.mobile,
      date_of_birth: signupForm.date_of_birth,
      gender: signupForm.gender,
      address: {
        district: signupForm.district,
        state: signupForm.state,
        pincode: signupForm.pincode,
        ...(signupForm.careOf && { careOf: signupForm.careOf }),
        ...(signupForm.houseNumber && { houseNumber: signupForm.houseNumber }),
        ...(signupForm.street && { street: signupForm.street }),
        ...(signupForm.locality && { locality: signupForm.locality }),
        ...(signupForm.landmark && { landmark: signupForm.landmark }),
        ...(signupForm.postOffice && { postOffice: signupForm.postOffice }),
        ...(signupForm.subDistrict && { subDistrict: signupForm.subDistrict }),
      },
    };

    try {
      await signup(payload);
      router.push('/');
    } catch (err: any) {
      setErrors({ email: err.message });
    }
  };

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
  const errorCls = 'text-xs text-red-600 mt-1';
  const fieldCls = 'flex flex-col';

  return (
    <div className="min-h-screen bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center"> NSSO Authentication</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['login', 'signup'] as ActiveTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors capitalize cursor-pointer ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            {/* Dev helper */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setLoginForm({ email: 'ali.khan@outlook.com', password: 'Test@1234' })}
                className="text-xs bg-amber-50 border border-amber-300 text-amber-700 px-3 py-1 rounded-md hover:bg-amber-100 transition-colors font-medium"
              >
                ⚡ Fill Test Credentials
              </button>
            </div>
            <div className={fieldCls}>
              <label htmlFor="login-email" className={labelCls}>Email</label>
              <input type="email" id="login-email" name="email" value={loginForm.email}
                onChange={handleLoginChange} className={inputCls} placeholder="Enter your email" />
              {errors.email && <p className={errorCls}>{errors.email}</p>}
            </div>
            <div className={fieldCls}>
              <label htmlFor="login-password" className={labelCls}>Password</label>
              <PasswordInput id="login-password" name="password" value={loginForm.password}
                onChange={handleLoginChange} className={inputCls} placeholder="Enter your password" />
              {errors.password && <p className={errorCls}>{errors.password}</p>}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium cursor-pointer">
              Login
            </button>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
            {/* Dev helper */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">Fields marked <span className="text-red-500">*</span> are required.</p>
              <button
                type="button"
                onClick={() => { setSignupForm(MOCK_USER); setErrors({}); }}
                className="text-xs bg-amber-50 border border-amber-300 text-amber-700 px-3 py-1 rounded-md hover:bg-amber-100 transition-colors font-medium"
              >
                ⚡ Fill Test Data
              </button>
            </div>

            {/* Identity */}
            <div className={fieldCls}>
              <label htmlFor="full_name" className={labelCls}>Full Name <span className="text-red-500">*</span></label>
              <input type="text" id="full_name" name="full_name" value={signupForm.full_name}
                onChange={handleSignupChange} className={inputCls} placeholder="Mohammed Ali Khan" />
              {errors.full_name && <p className={errorCls}>{errors.full_name}</p>}
            </div>

            <div className={fieldCls}>
              <label htmlFor="signup-email" className={labelCls}>Email <span className="text-red-500">*</span></label>
              <input type="email" id="signup-email" name="email" value={signupForm.email}
                onChange={handleSignupChange} className={inputCls} placeholder="you@example.com" />
              {errors.email && <p className={errorCls}>{errors.email}</p>}
            </div>

            <div className={fieldCls}>
              <label htmlFor="mobile" className={labelCls}>Mobile <span className="text-red-500">*</span></label>
              <input type="tel" id="mobile" name="mobile" value={signupForm.mobile}
                onChange={handleSignupChange} className={inputCls} placeholder="+91-9876543210" />
              {errors.mobile && <p className={errorCls}>{errors.mobile}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className={fieldCls}>
                <label htmlFor="date_of_birth" className={labelCls}>Date of Birth <span className="text-red-500">*</span></label>
                <input type="date" id="date_of_birth" name="date_of_birth" value={signupForm.date_of_birth}
                  onChange={handleSignupChange} className={inputCls} />
                {errors.date_of_birth && <p className={errorCls}>{errors.date_of_birth}</p>}
              </div>
              <div className={fieldCls}>
                <label htmlFor="gender" className={labelCls}>Gender <span className="text-red-500">*</span></label>
                <select id="gender" name="gender" value={signupForm.gender}
                  onChange={handleSignupChange} className={inputCls}>
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
                {errors.gender && <p className={errorCls}>{errors.gender}</p>}
              </div>
            </div>

            <div className={fieldCls}>
              <label htmlFor="signup-password" className={labelCls}>Password <span className="text-red-500">*</span></label>
              <PasswordInput id="signup-password" name="password" value={signupForm.password}
                onChange={handleSignupChange} className={inputCls} placeholder="Create a password" />
              {errors.password && <p className={errorCls}>{errors.password}</p>}
            </div>
            <div className={fieldCls}>
              <label htmlFor="confirmPassword" className={labelCls}>Confirm Password <span className="text-red-500">*</span></label>
              <PasswordInput id="confirmPassword" name="confirmPassword" value={signupForm.confirmPassword}
                onChange={handleSignupChange} className={inputCls} placeholder="Repeat your password" />
              {errors.confirmPassword && <p className={errorCls}>{errors.confirmPassword}</p>}
            </div>

            {/* Address — required */}
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mt-1">Address</p>
            <div className="grid grid-cols-2 gap-3">
              <div className={fieldCls}>
                <label htmlFor="district" className={labelCls}>District <span className="text-red-500">*</span></label>
                <input type="text" id="district" name="district" value={signupForm.district}
                  onChange={handleSignupChange} className={inputCls} placeholder="Bangalore Urban" />
                {errors.district && <p className={errorCls}>{errors.district}</p>}
              </div>
              <div className={fieldCls}>
                <label htmlFor="state" className={labelCls}>State <span className="text-red-500">*</span></label>
                <input type="text" id="state" name="state" value={signupForm.state}
                  onChange={handleSignupChange} className={inputCls} placeholder="Karnataka" />
                {errors.state && <p className={errorCls}>{errors.state}</p>}
              </div>
            </div>
            <div className={fieldCls}>
              <label htmlFor="pincode" className={labelCls}>Pincode <span className="text-red-500">*</span></label>
              <input type="text" id="pincode" name="pincode" value={signupForm.pincode}
                onChange={handleSignupChange} className={inputCls} placeholder="560001" />
              {errors.pincode && <p className={errorCls}>{errors.pincode}</p>}
            </div>

            {/* Address — optional */}
            <details className="text-sm">
              <summary className="cursor-pointer text-blue-600 hover:underline select-none">+ Additional address details (optional)</summary>
              <div className="flex flex-col gap-3 mt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className={fieldCls}>
                    <label htmlFor="houseNumber" className={labelCls}>House No.</label>
                    <input type="text" id="houseNumber" name="houseNumber" value={signupForm.houseNumber}
                      onChange={handleSignupChange} className={inputCls} placeholder="67/A" />
                  </div>
                  <div className={fieldCls}>
                    <label htmlFor="street" className={labelCls}>Street</label>
                    <input type="text" id="street" name="street" value={signupForm.street}
                      onChange={handleSignupChange} className={inputCls} placeholder="Residency Road" />
                  </div>
                </div>
                <div className={fieldCls}>
                  <label htmlFor="careOf" className={labelCls}>Care Of</label>
                  <input type="text" id="careOf" name="careOf" value={signupForm.careOf}
                    onChange={handleSignupChange} className={inputCls} placeholder="S/O Abdul Rahman Khan" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={fieldCls}>
                    <label htmlFor="locality" className={labelCls}>Locality</label>
                    <input type="text" id="locality" name="locality" value={signupForm.locality}
                      onChange={handleSignupChange} className={inputCls} placeholder="Shivaji Nagar" />
                  </div>
                  <div className={fieldCls}>
                    <label htmlFor="landmark" className={labelCls}>Landmark</label>
                    <input type="text" id="landmark" name="landmark" value={signupForm.landmark}
                      onChange={handleSignupChange} className={inputCls} placeholder="Opp. Metro Station" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={fieldCls}>
                    <label htmlFor="postOffice" className={labelCls}>Post Office</label>
                    <input type="text" id="postOffice" name="postOffice" value={signupForm.postOffice}
                      onChange={handleSignupChange} className={inputCls} placeholder="Bangalore GPO" />
                  </div>
                  <div className={fieldCls}>
                    <label htmlFor="subDistrict" className={labelCls}>Sub-District</label>
                    <input type="text" id="subDistrict" name="subDistrict" value={signupForm.subDistrict}
                      onChange={handleSignupChange} className={inputCls} placeholder="Bangalore North" />
                  </div>
                </div>
              </div>
            </details>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium cursor-pointer mt-2">
              Create Account
            </button>
          </form>
        )}

        {successMessage && (
          <p className="text-sm text-green-600 mt-4 text-center">{successMessage}</p>
        )}
      </div>
    </div>
  );
}
