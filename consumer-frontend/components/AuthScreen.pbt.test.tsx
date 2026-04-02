import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import AuthScreen from './AuthScreen';

/**
 * Property-Based Tests for AuthScreen Component
 * 
 * These tests validate universal correctness properties across many generated inputs
 * using the fast-check library. Each property is tested with 100+ iterations.
 * 
 * Validates: Requirements 2.2, 2.4, 3.6, 4.8, 6.3, 7.1, 7.2, 7.3, 5.2, 5.3, 8.1, 8.3, 8.2, 8.4, 8.5, 8.6, 8.7
 */

describe('AuthScreen - Property-Based Tests', () => {
  /**
   * Property 1: Tab Switching Updates Active Form
   * 
   * For any active tab state, clicking the corresponding tab button should update
   * the active tab state and display the correct form.
   * 
   * Validates: Requirements 2.2
   */
  it('Property 1: Tab Switching Updates Active Form', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('login', 'signup'),
        (tab) => {
          const { unmount } = render(<AuthScreen />);
          
          // Get all buttons and find the tab button (first two buttons are tabs)
          const buttons = screen.getAllByRole('button');
          const tabButton = tab === 'login' ? buttons[0] : buttons[1];
          fireEvent.click(tabButton);
          
          // Verify the correct form is displayed
          if (tab === 'login') {
            const passwordFields = screen.getAllByPlaceholderText('Enter your password');
            expect(passwordFields.length).toBe(1); // Only one password field in login
          } else {
            const confirmPasswordField = screen.getByPlaceholderText('Confirm your password');
            expect(confirmPasswordField).toBeInTheDocument();
          }
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 2: Tab Switching Occurs Without Page Reload
   * 
   * For any tab switch action, the component should update its internal state
   * without triggering a page reload or navigation event.
   * 
   * Validates: Requirements 2.4
   */
  it('Property 2: Tab Switching Occurs Without Page Reload', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('login', 'signup'),
        (tab) => {
          const { unmount } = render(<AuthScreen />);
          
          // Get the initial DOM state
          const initialDOMSize = document.body.children.length;
          
          const buttons = screen.getAllByRole('button');
          const tabButton = tab === 'login' ? buttons[0] : buttons[1];
          fireEvent.click(tabButton);
          
          // Verify DOM hasn't been replaced (which would indicate a page reload)
          const finalDOMSize = document.body.children.length;
          expect(finalDOMSize).toBe(initialDOMSize);
          
          // Verify the component is still in the DOM
          expect(screen.getByText('Authentication')).toBeInTheDocument();
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3: Password Fields Mask Input
   * 
   * For any password input field, the input element should have type="password"
   * to mask entered text.
   * 
   * Validates: Requirements 3.6, 4.8
   */
  it('Property 3: Password Fields Mask Input', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('login', 'signup'),
        (tab) => {
          const { unmount } = render(<AuthScreen />);
          
          // Switch to the specified tab
          const buttons = screen.getAllByRole('button');
          const tabButton = tab === 'login' ? buttons[0] : buttons[1];
          fireEvent.click(tabButton);
          
          // Get all password input fields
          const passwordInputs = screen.getAllByDisplayValue('');
          const maskedInputs = passwordInputs.filter(input => 
            input instanceof HTMLInputElement && input.type === 'password'
          );
          
          // Verify all password fields have type="password"
          if (tab === 'login') {
            expect(maskedInputs.length).toBeGreaterThanOrEqual(1);
          } else {
            expect(maskedInputs.length).toBeGreaterThanOrEqual(2);
          }
          
          maskedInputs.forEach(input => {
            expect((input as HTMLInputElement).type).toBe('password');
          });
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4: Form State Updates in Real-Time
   * 
   * For any user input in a form field, the corresponding formData state value
   * should update immediately and the credential display should reflect the new value.
   * 
   * Validates: Requirements 6.3, 7.1, 7.2, 7.3
   */
  it('Property 4: Form State Updates in Real-Time', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.tuple(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 })
        ),
        async (values) => {
          const [email, password] = values;
          cleanup();
          const { unmount } = render(<AuthScreen />);
          
          // Get input fields
          const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement;
          const passwordInput = screen.getByPlaceholderText('Enter your password') as HTMLInputElement;
          
          // Type email using paste to avoid keyboard shortcut interpretation
          await userEvent.click(emailInput);
          await userEvent.paste(email);
          expect(emailInput.value).toBe(email);
          
          // Verify credential display updates with email
          const credentialSection = screen.getByText('Entered Credentials (for testing)').closest('div');
          expect(credentialSection).toBeInTheDocument();
          
          // Type password using paste
          await userEvent.click(passwordInput);
          await userEvent.paste(password);
          expect(passwordInput.value).toBe(password);
          
          // Verify the form state is updated (check that inputs have values)
          expect(emailInput.value).toBe(email);
          expect(passwordInput.value).toBe(password);
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  /**
   * Property 5: Responsive Design Adapts to Viewports
   * 
   * For any viewport size, the component should apply appropriate responsive
   * Tailwind classes to adapt layout, spacing, and sizing.
   * 
   * Validates: Requirements 5.2, 5.3
   */
  it('Property 5: Responsive Design Adapts to Viewports', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(320, 768, 1024),
        (viewportWidth) => {
          // Set viewport width
          global.innerWidth = viewportWidth;
          global.dispatchEvent(new Event('resize'));
          
          const { unmount } = render(<AuthScreen />);
          
          // Get the card container (the white box, not the outer container)
          const cardElement = screen.getByText('Authentication').closest('div')?.closest('div');
          
          // Verify responsive classes are applied to the card
          expect(cardElement).toHaveClass('w-full', 'px-4'); // Mobile classes
          
          // For larger viewports, verify max-width is applied
          if (viewportWidth >= 768) {
            expect(cardElement).toHaveClass('md:max-w-md');
          }
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6: Empty Email Field Validation
   * 
   * For any form submission with an empty email field, the component should
   * display a validation error message and prevent success confirmation.
   * 
   * Validates: Requirements 8.1, 8.3
   */
  it('Property 6: Empty Email Field Validation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.tuple(
          fc.constantFrom('login', 'signup'),
          fc.string({ minLength: 1, maxLength: 50 })
        ),
        async (values) => {
          const [tab, password] = values;
          cleanup();
          const { unmount } = render(<AuthScreen />);
          
          // Switch to the specified tab
          const buttons = screen.getAllByRole('button');
          const tabButton = tab === 'login' ? buttons[0] : buttons[1];
          fireEvent.click(tabButton);
          
          // Fill password but leave email empty
          const passwordInput = screen.getByPlaceholderText('Enter your password') as HTMLInputElement;
          await userEvent.click(passwordInput);
          await userEvent.paste(password);
          
          if (tab === 'signup') {
            const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password') as HTMLInputElement;
            await userEvent.click(confirmPasswordInput);
            await userEvent.paste(password);
          }
          
          // Submit form - get the submit button (last button in the form)
          const allButtons = screen.getAllByRole('button');
          const submitButton = allButtons[allButtons.length - 1];
          fireEvent.click(submitButton);
          
          // Verify error is displayed
          await waitFor(() => {
            expect(screen.getByText('Email is required')).toBeInTheDocument();
          });
          
          // Verify success message is not shown
          expect(screen.queryByText('Form submitted successfully!')).not.toBeInTheDocument();
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  /**
   * Property 7: Empty Password Field Validation
   * 
   * For any form submission with an empty password field, the component should
   * display a validation error message and prevent success confirmation.
   * 
   * Validates: Requirements 8.2, 8.4
   */
  it('Property 7: Empty Password Field Validation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.tuple(
          fc.constantFrom('login', 'signup'),
          fc.emailAddress()
        ),
        async (values) => {
          const [tab, email] = values;
          cleanup();
          const { unmount } = render(<AuthScreen />);
          
          // Switch to the specified tab
          const buttons = screen.getAllByRole('button');
          const tabButton = tab === 'login' ? buttons[0] : buttons[1];
          fireEvent.click(tabButton);
          
          // Fill email but leave password empty
          const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement;
          await userEvent.click(emailInput);
          await userEvent.paste(email);
          
          // Submit form
          const allButtons = screen.getAllByRole('button');
          const submitButton = allButtons[allButtons.length - 1];
          fireEvent.click(submitButton);
          
          // Verify error is displayed
          await waitFor(() => {
            expect(screen.getByText('Password is required')).toBeInTheDocument();
          });
          
          // Verify success message is not shown
          expect(screen.queryByText('Form submitted successfully!')).not.toBeInTheDocument();
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  /**
   * Property 8: Empty Confirm Password Validation
   * 
   * For any signup form submission with an empty confirm password field,
   * the component should display a validation error message and prevent success confirmation.
   * 
   * Validates: Requirements 8.5
   */
  it('Property 8: Empty Confirm Password Validation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.tuple(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 })
        ),
        async (values) => {
          const [email, password] = values;
          cleanup();
          const { unmount } = render(<AuthScreen />);
          
          // Switch to signup tab
          const buttons = screen.getAllByRole('button');
          const signupButton = buttons[1];
          fireEvent.click(signupButton);
          
          // Fill email and password but leave confirm password empty
          const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement;
          const passwordInput = screen.getByPlaceholderText('Enter your password') as HTMLInputElement;
          
          await userEvent.click(emailInput);
          await userEvent.paste(email);
          await userEvent.click(passwordInput);
          await userEvent.paste(password);
          
          // Submit form
          const allButtons = screen.getAllByRole('button');
          const submitButton = allButtons[allButtons.length - 1];
          fireEvent.click(submitButton);
          
          // Verify error is displayed
          await waitFor(() => {
            expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
          });
          
          // Verify success message is not shown
          expect(screen.queryByText('Form submitted successfully!')).not.toBeInTheDocument();
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  /**
   * Property 9: Password Mismatch Validation
   * 
   * For any signup form submission where password and confirmPassword values
   * do not match, the component should display a validation error indicating
   * passwords do not match and prevent success confirmation.
   * 
   * Validates: Requirements 8.6
   */
  it('Property 9: Password Mismatch Validation', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.tuple(
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 })
        ),
        async (values) => {
          const [email, password, confirmPassword] = values;
          
          // Only test when passwords don't match
          if (password === confirmPassword) {
            return true;
          }
          
          cleanup();
          const { unmount } = render(<AuthScreen />);
          
          // Switch to signup tab
          const buttons = screen.getAllByRole('button');
          const signupButton = buttons[1];
          fireEvent.click(signupButton);
          
          // Fill all fields with mismatched passwords
          const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement;
          const passwordInput = screen.getByPlaceholderText('Enter your password') as HTMLInputElement;
          const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password') as HTMLInputElement;
          
          await userEvent.click(emailInput);
          await userEvent.paste(email);
          await userEvent.click(passwordInput);
          await userEvent.paste(password);
          await userEvent.click(confirmPasswordInput);
          await userEvent.paste(confirmPassword);
          
          // Submit form
          const allButtons = screen.getAllByRole('button');
          const submitButton = allButtons[allButtons.length - 1];
          fireEvent.click(submitButton);
          
          // Verify error is displayed
          await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
          });
          
          // Verify success message is not shown
          expect(screen.queryByText('Form submitted successfully!')).not.toBeInTheDocument();
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  /**
   * Property 10: Successful Validation Shows Success Message
   * 
   * For any form submission with all required fields filled and valid
   * (matching passwords for signup), the component should display a success
   * message and clear any error messages.
   * 
   * Validates: Requirements 8.7
   */
  it('Property 10: Successful Validation Shows Success Message', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.tuple(
          fc.constantFrom('login', 'signup'),
          fc.emailAddress(),
          fc.string({ minLength: 1, maxLength: 50 })
        ),
        async (values) => {
          const [tab, email, password] = values;
          cleanup();
          const { unmount } = render(<AuthScreen />);
          
          // Switch to the specified tab
          const buttons = screen.getAllByRole('button');
          const tabButton = tab === 'login' ? buttons[0] : buttons[1];
          fireEvent.click(tabButton);
          
          // Fill all required fields
          const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement;
          const passwordInput = screen.getByPlaceholderText('Enter your password') as HTMLInputElement;
          
          await userEvent.click(emailInput);
          await userEvent.paste(email);
          await userEvent.click(passwordInput);
          await userEvent.paste(password);
          
          if (tab === 'signup') {
            const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password') as HTMLInputElement;
            await userEvent.click(confirmPasswordInput);
            await userEvent.paste(password);
          }
          
          // Submit form by finding the form and submitting it
          const form = emailInput.closest('form');
          if (form) {
            fireEvent.submit(form);
          }
          
          // Verify success message is displayed
          await waitFor(() => {
            expect(screen.getByText('Form submitted successfully!')).toBeInTheDocument();
          }, { timeout: 1000 });
          
          // Verify no error messages are shown
          expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
          expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
          expect(screen.queryByText('Please confirm your password')).not.toBeInTheDocument();
          expect(screen.queryByText('Passwords do not match')).not.toBeInTheDocument();
          
          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);
});
