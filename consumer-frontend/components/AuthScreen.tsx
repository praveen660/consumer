'use client';

import React, { useState } from 'react';

/**
 * FormData interface represents the structure of form input values
 * Tracks email, password, and confirm password fields
 */
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * ValidationErrors interface represents validation error messages
 * Each field can have an optional error message
 */
interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  passwordMatch?: string;
}

/**
 * ActiveTab type represents the currently active authentication tab
 * Can be either 'login' or 'signup'
 */
type ActiveTab = 'login' | 'signup';

/**
 * AuthScreen Component
 * 
 * A modern, responsive authentication interface with tab-based navigation
 * between login and signup modes. Features real-time form validation,
 * credential display for testing, and Tailwind CSS styling.
 * 
 * Validates: Requirements 1.1, 6.4, 9.1, 9.2
 */
export default function AuthScreen() {
  // State management
  const [activeTab, setActiveTab] = useState<ActiveTab>('login');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Handles tab switching between login and signup modes
   */
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setErrors({});
    setSuccessMessage('');
  };

  /**
   * Handles input field changes and updates form state in real-time
   * Also clears corresponding error messages when user starts typing
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear corresponding error message when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  /**
   * Validates login form inputs
   */
  const validateLogin = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Validates signup form inputs
   */
  const validateSignup = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    }

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.passwordMatch = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission with validation
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');

    const isValid = activeTab === 'login' ? validateLogin() : validateSignup();

    if (isValid) {
      // Call backend API
      const apiCall = activeTab === 'login' 
        ? import('@/lib/api').then(m => m.login(formData.email, formData.password))
        : import('@/lib/api').then(m => m.signup(formData.email, formData.password));

      apiCall
        .then(() => {
          setSuccessMessage('Form submitted successfully!');
          setErrors({});
          // Reset form
          setFormData({ email: '', password: '', confirmPassword: '' });
        })
        .catch((error) => {
          setErrors({ email: error.message });
          setSuccessMessage('');
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex justify-center items-center">
      <div className="w-full px-4 md:max-w-md bg-white rounded-lg shadow-md p-6 md:p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Authentication
        </h1>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleTabChange('login')}
            className={`flex-1 py-2 md:py-3 px-4 md:px-6 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => handleTabChange('signup')}
            className={`flex-1 py-2 md:py-3 px-4 md:px-6 rounded-md font-medium transition-colors cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Signup
          </button>
        </div>

        {/* Login Form - Rendered only when activeTab is 'login' */}
        {activeTab === 'login' && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="text-sm md:text-base font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-base md:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-2">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="text-sm md:text-base font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-base md:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-2">{errors.password}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 md:py-3 md:px-6 rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Login
            </button>
          </form>
        )}

        {/* Signup Form - Rendered only when activeTab is 'signup' */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="text-sm md:text-base font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-base md:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-2">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="text-sm md:text-base font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-base md:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-2">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="text-sm md:text-base font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-base md:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-2">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Match Error */}
            {errors.passwordMatch && (
              <p className="text-sm text-red-600 mt-2">{errors.passwordMatch}</p>
            )}

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 md:py-3 md:px-6 rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Signup
            </button>
          </form>
        )}

        {/* Success Message */}
        {successMessage && (
          <p className="text-sm text-green-600 mt-2">
            {successMessage}
          </p>
        )}

        {/* Credential Display */}
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h2 className="text-sm font-medium text-gray-700 mb-3">
            Entered Credentials (for testing)
          </h2>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-700">Email: </span>
              <span className="text-sm font-mono text-gray-600">{formData.email || '(empty)'}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Password: </span>
              <span className="text-sm font-mono text-gray-600">{formData.password || '(empty)'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
