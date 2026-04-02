# Implementation Plan: Auth Login/Signup Screen

## Overview

This implementation plan breaks down the Auth Login/Signup Screen feature into discrete, manageable coding tasks. The component will be built incrementally, starting with core structure and state management, then adding form rendering, validation, styling, and finally comprehensive property-based testing. Each task builds on previous steps to create a fully functional, tested authentication interface.

## Tasks

- [x] 1. Set up AuthScreen component structure and type definitions
  - Create `consumer-frontend/components/AuthScreen.tsx` file
  - Define TypeScript interfaces: FormData, ValidationErrors, ActiveTab type
  - Set up component skeleton with React imports and functional component structure
  - Export default AuthScreen component
  - _Requirements: 1.1, 6.4, 9.1, 9.2_

- [x] 2. Implement state management with React hooks
  - [x] 2.1 Initialize useState hooks for activeTab, formData, errors, and successMessage
    - Set initial state values (activeTab: 'login', formData with empty strings, empty errors, empty successMessage)
    - _Requirements: 6.1, 6.2_
  
  - [ ]* 2.2 Write property test for form state initialization
    - **Property 4: Form State Updates in Real-Time**
    - **Validates: Requirements 6.3, 7.1, 7.2, 7.3**

- [-] 3. Implement tab navigation and switching logic
  - [x] 3.1 Create handleTabChange event handler
    - Update activeTab state when tab button is clicked
    - Clear errors and successMessage when switching tabs
    - _Requirements: 2.2, 2.3_
  
  - [ ]* 3.2 Write property test for tab switching
    - **Property 1: Tab Switching Updates Active Form**
    - **Validates: Requirements 2.2**
  
  - [ ]* 3.3 Write property test for tab switching without page reload
    - **Property 2: Tab Switching Occurs Without Page Reload**
    - **Validates: Requirements 2.4**

- [x] 4. Implement form input handling and real-time updates
  - [x] 4.1 Create handleInputChange event handler
    - Update formData state for email, password, and confirmPassword fields
    - Clear corresponding error messages when user starts typing
    - _Requirements: 6.3, 7.1, 7.2, 7.3_
  
  - [ ]* 4.2 Write property test for real-time form state updates
    - **Property 4: Form State Updates in Real-Time**
    - **Validates: Requirements 6.3, 7.1, 7.2, 7.3**

- [-] 5. Implement form validation logic
  - [x] 5.1 Create validateLogin function
    - Check for empty email field and set error if empty
    - Check for empty password field and set error if empty
    - Return true if all validations pass, false otherwise
    - _Requirements: 8.1, 8.2_
  
  - [ ]* 5.2 Write property test for empty email validation
    - **Property 6: Empty Email Field Validation**
    - **Validates: Requirements 8.1, 8.3**
  
  - [ ]* 5.3 Write property test for empty password validation
    - **Property 7: Empty Password Field Validation**
    - **Validates: Requirements 8.2, 8.4**

- [-] 6. Implement signup-specific validation logic
  - [x] 6.1 Create validateSignup function
    - Check for empty email field and set error if empty
    - Check for empty password field and set error if empty
    - Check for empty confirmPassword field and set error if empty
    - Check if password and confirmPassword match, set error if they don't
    - Return true if all validations pass, false otherwise
    - _Requirements: 8.3, 8.4, 8.5, 8.6_
  
  - [ ]* 6.2 Write property test for empty confirm password validation
    - **Property 8: Empty Confirm Password Validation**
    - **Validates: Requirements 8.5**
  
  - [ ]* 6.3 Write property test for password mismatch validation
    - **Property 9: Password Mismatch Validation**
    - **Validates: Requirements 8.6**

- [x] 7. Implement form submission and success handling
  - [x] 7.1 Create handleSubmit event handler
    - Prevent default form submission
    - Call appropriate validation function based on activeTab
    - If validation passes, set successMessage and clear errors
    - If validation fails, set errors and clear successMessage
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_
  
  - [ ]* 7.2 Write property test for successful validation
    - **Property 10: Successful Validation Shows Success Message**
    - **Validates: Requirements 8.7**

- [x] 8. Render tab navigation buttons
  - [x] 8.1 Create tab button section with Login and Signup buttons
    - Render two buttons with labels "Login" and "Signup"
    - Apply active styling to the currently selected tab
    - Apply inactive styling to the non-selected tab
    - Attach handleTabChange handler to each button
    - _Requirements: 2.1, 2.3, 5.1, 5.6_

- [x] 9. Render login form conditionally
  - [x] 9.1 Create LoginForm conditional rendering
    - Render form only when activeTab is 'login'
    - Include email input field with label "Email"
    - Include password input field with label "Password" and type="password"
    - Include "Login" button
    - Attach handleInputChange to input fields
    - Attach handleSubmit to form submission
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ]* 9.2 Write property test for password field masking
    - **Property 3: Password Fields Mask Input**
    - **Validates: Requirements 3.6, 4.8**

- [x] 10. Render signup form conditionally
  - [x] 10.1 Create SignupForm conditional rendering
    - Render form only when activeTab is 'signup'
    - Include email input field with label "Email"
    - Include password input field with label "Password" and type="password"
    - Include confirm password input field with label "Confirm Password" and type="password"
    - Include "Signup" button
    - Attach handleInputChange to input fields
    - Attach handleSubmit to form submission
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

- [-] 11. Render credential display section
  - [x] 11.1 Create CredentialDisplay section
    - Render section below the form
    - Display label "Entered Credentials (for testing)"
    - Display email label and entered email value
    - Display password label and entered password value
    - Update in real-time as user types
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 12. Render error and success messages
  - [x] 12.1 Create error message display
    - Display validation errors below the form
    - Show error messages for email, password, confirmPassword, and passwordMatch fields
    - Use error styling (red color)
    - Clear errors when user corrects the field
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  
  - [x] 12.2 Create success message display
    - Display success message below the form when validation passes
    - Use success styling (green color)
    - Show message "Form submitted successfully!"
    - _Requirements: 8.7_

- [x] 13. Apply Tailwind CSS styling to card container and layout
  - [x] 13.1 Style main container and card
    - Apply gradient background to page: from-blue-500 via-purple-500 to-pink-500
    - Center card using flexbox (flex, justify-center, items-center, min-h-screen)
    - Apply card styling: bg-white, rounded-lg, shadow-md, p-8
    - Set maximum width: max-w-md
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1_

- [-] 14. Apply Tailwind CSS styling to tab navigation
  - [x] 14.1 Style tab buttons
    - Apply flex layout with gap-2 between buttons
    - Style active tab: bg-blue-600, text-white, rounded-md, px-6, py-3
    - Style inactive tab: bg-gray-200, text-gray-700, rounded-md, px-6, py-3
    - Add hover state: hover:bg-gray-300 for inactive tabs
    - Add cursor-pointer to both tabs
    - _Requirements: 2.1, 2.3, 5.1, 5.4, 5.5_

- [x] 15. Apply Tailwind CSS styling to form inputs and labels
  - [x] 15.1 Style form elements
    - Apply form layout: flex flex-col gap-4
    - Style labels: text-sm, font-medium, text-gray-700
    - Style input fields: w-full, px-3, py-2, border, border-gray-300, rounded-md, focus:outline-none, focus:ring-2, focus:ring-blue-500
    - Style buttons: w-full, bg-blue-600, text-white, py-2, rounded-md, hover:bg-blue-700, cursor-pointer
    - _Requirements: 5.1, 5.4, 5.5, 5.6_

- [x] 16. Apply Tailwind CSS styling to credential display and messages
  - [x] 16.1 Style credential display section
    - Apply section styling: mt-6, p-4, bg-gray-50, rounded-md
    - Style labels: text-sm, font-medium, text-gray-700
    - Style values: text-sm, font-mono, text-gray-600
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [x] 16.2 Style error and success messages
    - Style error messages: text-sm, text-red-600, mt-2
    - Style success messages: text-sm, text-green-600, mt-2
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [x] 17. Implement responsive design for mobile viewports
  - [x] 17.1 Add responsive classes for mobile (320px - 767px)
    - Apply responsive card width: w-full, px-4 on mobile
    - Apply responsive padding: p-6 on mobile
    - Apply responsive font sizes: text-sm for labels, text-base for inputs
    - Apply responsive button padding: py-2, px-4
    - _Requirements: 5.2, 5.3_

- [-] 18. Implement responsive design for tablet and desktop viewports
  - [x] 18.1 Add responsive classes for tablet and desktop (768px+)
    - Apply responsive card width: max-w-md on tablet/desktop
    - Apply responsive padding: p-8 on tablet/desktop
    - Apply responsive font sizes: text-base for labels, text-lg for inputs
    - Apply responsive button padding: py-3, px-6
    - _Requirements: 5.2, 5.3_

- [x] 19. Checkpoint - Ensure component renders and basic functionality works
  - Verify AuthScreen component renders without errors
  - Verify tab switching works and displays correct form
  - Verify form inputs update state in real-time
  - Verify credential display updates as user types
  - Verify validation errors display on form submission
  - Verify success message displays on valid submission
  - Ask the user if questions arise.

- [-] 20. Write property-based tests for all correctness properties
  - [x] 20.1 Write property test for tab switching
    - **Property 1: Tab Switching Updates Active Form**
    - Generate random sequences of tab clicks
    - Verify active tab state matches clicked tab
    - Verify correct form is displayed
    - _Requirements: 2.2_
  
  - [x] 20.2 Write property test for tab switching without page reload
    - **Property 2: Tab Switching Occurs Without Page Reload**
    - Generate random tab switch actions
    - Verify no page reload event is triggered
    - _Requirements: 2.4_
  
  - [x] 20.3 Write property test for password field masking
    - **Property 3: Password Fields Mask Input**
    - Generate all password input elements
    - Verify each has type="password" attribute
    - _Requirements: 3.6, 4.8_
  
  - [x] 20.4 Write property test for real-time form state updates
    - **Property 4: Form State Updates in Real-Time**
    - Generate random input values for email, password, confirmPassword
    - Verify formData state updates immediately
    - Verify credential display reflects changes
    - _Requirements: 6.3, 7.1, 7.2, 7.3_
  
  - [x] 20.5 Write property test for responsive design
    - **Property 5: Responsive Design Adapts to Viewports**
    - Generate random viewport sizes (320px, 768px, 1024px+)
    - Verify appropriate responsive Tailwind classes are applied
    - _Requirements: 5.2, 5.3_
  
  - [x] 20.6 Write property test for empty email validation
    - **Property 6: Empty Email Field Validation**
    - Generate form submissions with empty email, random password values
    - Verify validation error is displayed
    - Verify success message is not shown
    - _Requirements: 8.1, 8.3_
  
  - [x] 20.7 Write property test for empty password validation
    - **Property 7: Empty Password Field Validation**
    - Generate form submissions with empty password, random email values
    - Verify validation error is displayed
    - Verify success message is not shown
    - _Requirements: 8.2, 8.4_
  
  - [x] 20.8 Write property test for empty confirm password validation
    - **Property 8: Empty Confirm Password Validation**
    - Generate signup form submissions with empty confirm password, random email/password values
    - Verify validation error is displayed
    - Verify success message is not shown
    - _Requirements: 8.5_
  
  - [x] 20.9 Write property test for password mismatch validation
    - **Property 9: Password Mismatch Validation**
    - Generate signup form submissions with non-matching password values
    - Verify validation error is displayed
    - Verify success message is not shown
    - _Requirements: 8.6_
  
  - [x] 20.10 Write property test for successful validation
    - **Property 10: Successful Validation Shows Success Message**
    - Generate form submissions with all valid fields (matching passwords for signup)
    - Verify success message is displayed
    - Verify no error messages are shown
    - _Requirements: 8.7_

- [x] 21. Final checkpoint - Ensure all tests pass
  - Run all property-based tests
  - Verify all tests pass with 100+ iterations for property tests
  - Verify test coverage is comprehensive
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation of functionality
- Property tests validate universal correctness properties across many generated inputs
- Unit tests validate specific examples and edge cases
- All styling uses Tailwind CSS utility classes
- Component is implemented in TypeScript for type safety
- No external authentication libraries are required—this component handles UI and validation only
