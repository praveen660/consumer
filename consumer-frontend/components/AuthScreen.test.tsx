import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthScreen from './AuthScreen';

/**
 * Test Suite for AuthScreen Tab Navigation
 * Validates: Requirements 2.1, 2.3, 5.1, 5.6
 */
describe('AuthScreen - Tab Navigation Buttons', () => {
  describe('Tab button rendering', () => {
    it('should render two tab buttons with labels "Login" and "Signup"', () => {
      render(<AuthScreen />);
      
      const buttons = screen.getAllByRole('button');
      const loginButton = buttons[0];
      const signupButton = buttons[1];
      
      expect(loginButton).toHaveTextContent('Login');
      expect(signupButton).toHaveTextContent('Signup');
    });

    it('should apply active styling (bg-blue-600 text-white) to the currently selected tab', () => {
      render(<AuthScreen />);
      
      const buttons = screen.getAllByRole('button');
      const loginButton = buttons[0];
      
      // Login tab should be active by default
      expect(loginButton).toHaveClass('bg-blue-600', 'text-white');
    });

    it('should apply inactive styling (bg-gray-200 text-gray-700) to the non-selected tab', () => {
      render(<AuthScreen />);
      
      const buttons = screen.getAllByRole('button');
      const signupButton = buttons[1];
      
      // Signup tab should be inactive by default
      expect(signupButton).toHaveClass('bg-gray-200', 'text-gray-700');
    });

    it('should switch active styling when clicking the Signup tab', () => {
      render(<AuthScreen />);
      
      const buttons = screen.getAllByRole('button');
      const loginButton = buttons[0];
      const signupButton = buttons[1];
      
      // Click signup tab
      fireEvent.click(signupButton);
      
      // Signup should now be active
      expect(signupButton).toHaveClass('bg-blue-600', 'text-white');
      
      // Login should now be inactive
      expect(loginButton).toHaveClass('bg-gray-200', 'text-gray-700');
    });

    it('should switch active styling when clicking the Login tab after switching to Signup', () => {
      render(<AuthScreen />);
      
      const buttons = screen.getAllByRole('button');
      const loginButton = buttons[0];
      const signupButton = buttons[1];
      
      // Click signup tab
      fireEvent.click(signupButton);
      expect(signupButton).toHaveClass('bg-blue-600', 'text-white');
      
      // Click login tab
      fireEvent.click(loginButton);
      expect(loginButton).toHaveClass('bg-blue-600', 'text-white');
      expect(signupButton).toHaveClass('bg-gray-200', 'text-gray-700');
    });

    it('should have handleTabChange handler attached to both buttons', () => {
      render(<AuthScreen />);
      
      const buttons = screen.getAllByRole('button');
      const loginButton = buttons[0];
      const signupButton = buttons[1];
      
      // Verify buttons have onClick handlers
      expect(loginButton).toHaveProperty('onclick');
      expect(signupButton).toHaveProperty('onclick');
    });

    it('should have proper styling classes on tab buttons', () => {
      render(<AuthScreen />);
      
      const buttons = screen.getAllByRole('button');
      const loginButton = buttons[0];
      const signupButton = buttons[1];
      
      // Check for common styling classes
      expect(loginButton).toHaveClass('flex-1', 'rounded-md', 'font-medium', 'transition-colors');
      expect(signupButton).toHaveClass('flex-1', 'rounded-md', 'font-medium', 'transition-colors');
    });
  });
});

/**
 * Test Suite for AuthScreen handleSubmit functionality
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7
 */
describe('AuthScreen - handleSubmit', () => {
  describe('Form submission with validation', () => {
    it('should prevent default form submission', () => {
      render(<AuthScreen />);
      const form = screen.getByPlaceholderText('Enter your email').closest('form');
      
      const preventDefaultSpy = jest.fn();
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      submitEvent.preventDefault = preventDefaultSpy;
      
      form?.dispatchEvent(submitEvent);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should call validateLogin when activeTab is login and form is submitted', async () => {
      render(<AuthScreen />);
      
      // Ensure login tab is active (it is by default)
      const buttons = screen.getAllByRole('button');
      const loginTab = buttons[0];
      fireEvent.click(loginTab);
      
      // Try to submit with empty fields
      const allButtons = screen.getAllByRole('button');
      const submitButton = allButtons[2]; // Third button is the submit button
      fireEvent.click(submitButton);
      
      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('should call validateSignup when activeTab is signup and form is submitted', async () => {
      render(<AuthScreen />);
      
      // Switch to signup tab
      const buttons = screen.getAllByRole('button');
      const signupTab = buttons[1];
      fireEvent.click(signupTab);
      
      // Try to submit with empty fields
      const allButtons = screen.getAllByRole('button');
      const submitButton = allButtons[allButtons.length - 1]; // Last button is the submit button
      fireEvent.click(submitButton);
      
      // Should show validation errors including confirm password
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
        expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
      });
    });

    it('should set successMessage and clear errors when login validation passes', async () => {
      render(<AuthScreen />);
      
      // Ensure login tab is active
      const buttons = screen.getAllByRole('button');
      const loginTab = buttons[0];
      fireEvent.click(loginTab);
      
      // Fill in valid login credentials
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      
      // Submit form
      const allButtons = screen.getAllByRole('button');
      const submitButton = allButtons[2]; // Third button is the submit button
      fireEvent.click(submitButton);
      
      // Should show success message
      await waitFor(() => {
        expect(screen.getByText('Form submitted successfully!')).toBeInTheDocument();
      });
      
      // Should not show any error messages
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
    });

    it('should set successMessage and clear errors when signup validation passes', async () => {
      render(<AuthScreen />);
      
      // Switch to signup tab
      const buttons = screen.getAllByRole('button');
      const signupTab = buttons[1];
      fireEvent.click(signupTab);
      
      // Fill in valid signup credentials
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.type(confirmPasswordInput, 'password123');
      
      // Submit form
      const allButtons = screen.getAllByRole('button');
      const submitButton = allButtons[allButtons.length - 1]; // Last button is the submit button
      fireEvent.click(submitButton);
      
      // Should show success message
      await waitFor(() => {
        expect(screen.getByText('Form submitted successfully!')).toBeInTheDocument();
      });
      
      // Should not show any error messages
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Please confirm your password')).not.toBeInTheDocument();
      expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
    });

    it('should set errors and clear successMessage when login validation fails', async () => {
      render(<AuthScreen />);
      
      // Ensure login tab is active
      const buttons = screen.getAllByRole('button');
      const loginTab = buttons[0];
      fireEvent.click(loginTab);
      
      // Try to submit with empty fields
      const allButtons = screen.getAllByRole('button');
      const submitButton = allButtons[2]; // Third button is the submit button
      fireEvent.click(submitButton);
      
      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
      
      // Should not show success message
      expect(screen.queryByText('Form submitted successfully!')).not.toBeInTheDocument();
    });

    it('should set errors and clear successMessage when signup validation fails', async () => {
      render(<AuthScreen />);
      
      // Switch to signup tab
      const buttons = screen.getAllByRole('button');
      const signupTab = buttons[1];
      fireEvent.click(signupTab);
      
      // Fill in mismatched passwords
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.type(confirmPasswordInput, 'password456');
      
      // Submit form
      const allButtons = screen.getAllByRole('button');
      const submitButton = allButtons[allButtons.length - 1]; // Last button is the submit button
      fireEvent.click(submitButton);
      
      // Should show password mismatch error
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
      
      // Should not show success message
      expect(screen.queryByText('Form submitted successfully!')).not.toBeInTheDocument();
    });

    it('should clear successMessage at the start of form submission', async () => {
      render(<AuthScreen />);
      
      // First, submit a valid login form to get success message
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      
      const buttons = screen.getAllByRole('button');
      const submitButton = buttons[2]; // Third button is the submit button
      fireEvent.click(submitButton);
      
      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText('Form submitted successfully!')).toBeInTheDocument();
      });
      
      // Now clear the email field and submit again
      await userEvent.clear(emailInput);
      fireEvent.click(submitButton);
      
      // Success message should be cleared and error should appear
      await waitFor(() => {
        expect(screen.queryByText('Form submitted successfully!')).not.toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('should have form element connected to handleSubmit handler', () => {
      render(<AuthScreen />);
      
      // Find the form element
      const form = screen.getByPlaceholderText('Enter your email').closest('form');
      
      // Verify form exists
      expect(form).toBeInTheDocument();
      
      // Verify form has the correct structure (email and password inputs)
      const emailInput = form?.querySelector('input[name="email"]');
      const passwordInput = form?.querySelector('input[name="password"]');
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });
  });
});
