# Design Document: Auth Login/Signup Screen

## Overview

The Auth Login/Signup Screen is a modern, single-component authentication interface built with Next.js (App Router) and Tailwind CSS. It provides a unified, tab-based interface allowing users to seamlessly switch between login and signup modes. The component features a centered card layout with gradient background, real-time form validation, and credential display for testing purposes.

**Key Design Goals:**
- Clean, modern UI with gradient backgrounds and card-based layout
- Seamless tab-based navigation between login and signup modes
- Real-time form validation with clear error messaging
- Responsive design supporting mobile, tablet, and desktop viewports
- Single-file implementation for easy integration and maintenance
- Real-time credential display for testing and verification

## Architecture

### Component Structure

The AuthScreen component follows a functional component architecture with React hooks for state management. The component is self-contained and manages all authentication UI logic internally.

```
AuthScreen (Main Component)
├── State Management (useState)
│   ├── activeTab (login | signup)
│   ├── formData (email, password, confirmPassword)
│   └── errors (validation errors)
├── Tab Navigation
│   ├── Login Tab Button
│   └── Signup Tab Button
├── Form Rendering
│   ├── LoginForm (conditional)
│   └── SignupForm (conditional)
├── Credential Display
│   └── Real-time email and password display
└── Styling (Tailwind CSS)
    ├── Gradient background
    ├── Centered card container
    └── Responsive layout
```

### State Management Approach

The component uses React's `useState` hook to manage three primary state objects:

1. **activeTab**: Tracks which form is currently displayed ("login" or "signup")
2. **formData**: Object containing email, password, and confirmPassword values
3. **errors**: Object containing validation error messages for each field
4. **successMessage**: String containing success message after validation passes

State updates occur in real-time as users type, ensuring the credential display and validation feedback remain current.

### Data Flow

```
User Input
    ↓
onChange Handler
    ↓
Update formData State
    ↓
Re-render Component
    ↓
Display Updated Values in Credential Display
    ↓
Validation Runs on Submit
    ↓
Update errors State or Show Success Message
```

## Components and Interfaces

### AuthScreen Component

**Props:** None (standalone component)

**State:**
```typescript
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  passwordMatch?: string;
}

type ActiveTab = 'login' | 'signup';
```

### Sub-Components (Rendered Conditionally)

#### LoginForm
- Email input field with label
- Password input field with label (type="password")
- Login button
- Validation error display

#### SignupForm
- Email input field with label
- Password input field with label (type="password")
- Confirm Password input field with label (type="password")
- Signup button
- Validation error display

#### CredentialDisplay
- Displays entered email value
- Displays entered password value
- Updates in real-time as user types
- Clearly labeled and visually distinct

## Data Models

### FormData Model

```typescript
{
  email: string;           // User's email address
  password: string;        // User's password
  confirmPassword: string; // Confirmation password for signup
}
```

### ValidationErrors Model

```typescript
{
  email?: string;           // Error message for email field
  password?: string;        // Error message for password field
  confirmPassword?: string; // Error message for confirm password field
  passwordMatch?: string;   // Error message for password mismatch
}
```

### Tab State

```typescript
type ActiveTab = 'login' | 'signup';
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Tab Switching Updates Active Form

*For any* active tab state, clicking the corresponding tab button should update the active tab state and display the correct form (login form when "login" is active, signup form when "signup" is active).

**Validates: Requirements 2.2**

### Property 2: Tab Switching Occurs Without Page Reload

*For any* tab switch action, the component should update its internal state without triggering a page reload or navigation event.

**Validates: Requirements 2.4**

### Property 3: Password Fields Mask Input

*For any* password input field (both login password and signup password/confirm password), the input element should have `type="password"` to mask entered text.

**Validates: Requirements 3.6, 4.8**

### Property 4: Form State Updates in Real-Time

*For any* user input in a form field, the corresponding formData state value should update immediately and the credential display should reflect the new value.

**Validates: Requirements 6.3, 7.1, 7.2, 7.3**

### Property 5: Responsive Design Adapts to Viewports

*For any* viewport size (mobile 320px, tablet 768px, desktop 1024px+), the component should apply appropriate responsive Tailwind classes to adapt layout, spacing, and sizing.

**Validates: Requirements 5.2, 5.3**

### Property 6: Empty Email Field Validation

*For any* form submission (login or signup) with an empty email field, the component should display a validation error message and prevent success confirmation.

**Validates: Requirements 8.1, 8.3**

### Property 7: Empty Password Field Validation

*For any* form submission (login or signup) with an empty password field, the component should display a validation error message and prevent success confirmation.

**Validates: Requirements 8.2, 8.4**

### Property 8: Empty Confirm Password Validation

*For any* signup form submission with an empty confirm password field, the component should display a validation error message and prevent success confirmation.

**Validates: Requirements 8.5**

### Property 9: Password Mismatch Validation

*For any* signup form submission where password and confirmPassword values do not match, the component should display a validation error indicating passwords do not match and prevent success confirmation.

**Validates: Requirements 8.6**

### Property 10: Successful Validation Shows Success Message

*For any* form submission with all required fields filled and valid (matching passwords for signup), the component should display a success message and clear any error messages.

**Validates: Requirements 8.7**

## Error Handling

### Validation Error Scenarios

1. **Empty Email Field**
   - Trigger: User submits form with empty email
   - Response: Display error message "Email is required"
   - Recovery: User enters email and resubmits

2. **Empty Password Field**
   - Trigger: User submits form with empty password
   - Response: Display error message "Password is required"
   - Recovery: User enters password and resubmits

3. **Empty Confirm Password Field (Signup Only)**
   - Trigger: User submits signup form with empty confirm password
   - Response: Display error message "Please confirm your password"
   - Recovery: User enters confirm password and resubmits

4. **Password Mismatch (Signup Only)**
   - Trigger: User submits signup form with non-matching passwords
   - Response: Display error message "Passwords do not match"
   - Recovery: User corrects password or confirm password and resubmits

### Error Display Strategy

- Errors are displayed inline below the relevant form field
- Error messages use clear, user-friendly language
- Errors are cleared when the user corrects the field
- Multiple errors can be displayed simultaneously
- Error text uses a distinct color (red/error color from Tailwind)

### Success Feedback

- Upon successful validation, display a success message: "Form submitted successfully!"
- Success message appears below the form
- Success message uses a distinct color (green/success color from Tailwind)
- Success message persists until user switches tabs or modifies form

## Testing Strategy

### Unit Testing Approach

Unit tests verify specific examples, edge cases, and error conditions:

1. **Component Rendering**
   - Verify AuthScreen renders without errors
   - Verify both tab buttons are present with correct labels
   - Verify login form displays when login tab is active
   - Verify signup form displays when signup tab is active

2. **Tab Navigation**
   - Verify clicking login tab switches to login form
   - Verify clicking signup tab switches to signup form
   - Verify active tab styling is applied correctly

3. **Form Field Rendering**
   - Verify login form has email and password fields
   - Verify signup form has email, password, and confirm password fields
   - Verify all fields have correct labels
   - Verify password fields have type="password"

4. **Credential Display**
   - Verify credential display section exists and is labeled
   - Verify credential display shows entered email
   - Verify credential display shows entered password

5. **Validation Error Cases**
   - Verify empty email error on login submit
   - Verify empty password error on login submit
   - Verify empty email error on signup submit
   - Verify empty password error on signup submit
   - Verify empty confirm password error on signup submit
   - Verify password mismatch error on signup submit

6. **Styling and Responsiveness**
   - Verify Tailwind classes are applied to card
   - Verify gradient background is applied
   - Verify responsive classes are present for different breakpoints
   - Verify buttons have hover and active state classes

### Property-Based Testing Approach

Property-based tests verify universal properties across many generated inputs:

1. **Property 1: Tab Switching Updates Active Form**
   - Feature: auth-login-signup, Property 1: Tab Switching Updates Active Form
   - Generate: Random sequence of tab clicks
   - Verify: Active tab state matches clicked tab, correct form is displayed
   - Iterations: 100+

2. **Property 2: Tab Switching Occurs Without Page Reload**
   - Feature: auth-login-signup, Property 2: Tab Switching Occurs Without Page Reload
   - Generate: Random tab switch actions
   - Verify: No page reload event is triggered
   - Iterations: 100+

3. **Property 3: Password Fields Mask Input**
   - Feature: auth-login-signup, Property 3: Password Fields Mask Input
   - Generate: All password input elements
   - Verify: Each has type="password" attribute
   - Iterations: 100+

4. **Property 4: Form State Updates in Real-Time**
   - Feature: auth-login-signup, Property 4: Form State Updates in Real-Time
   - Generate: Random input values for email, password, confirmPassword
   - Verify: formData state updates immediately, credential display reflects changes
   - Iterations: 100+

5. **Property 5: Responsive Design Adapts to Viewports**
   - Feature: auth-login-signup, Property 5: Responsive Design Adapts to Viewports
   - Generate: Random viewport sizes (320px, 768px, 1024px+)
   - Verify: Appropriate responsive Tailwind classes are applied
   - Iterations: 100+

6. **Property 6: Empty Email Field Validation**
   - Feature: auth-login-signup, Property 6: Empty Email Field Validation
   - Generate: Form submissions with empty email, random password values
   - Verify: Validation error is displayed, success message is not shown
   - Iterations: 100+

7. **Property 7: Empty Password Field Validation**
   - Feature: auth-login-signup, Property 7: Empty Password Field Validation
   - Generate: Form submissions with empty password, random email values
   - Verify: Validation error is displayed, success message is not shown
   - Iterations: 100+

8. **Property 8: Empty Confirm Password Validation**
   - Feature: auth-login-signup, Property 8: Empty Confirm Password Validation
   - Generate: Signup form submissions with empty confirm password, random email/password values
   - Verify: Validation error is displayed, success message is not shown
   - Iterations: 100+

9. **Property 9: Password Mismatch Validation**
   - Feature: auth-login-signup, Property 9: Password Mismatch Validation
   - Generate: Signup form submissions with non-matching password values
   - Verify: Validation error is displayed, success message is not shown
   - Iterations: 100+

10. **Property 10: Successful Validation Shows Success Message**
    - Feature: auth-login-signup, Property 10: Successful Validation Shows Success Message
    - Generate: Form submissions with all valid fields (matching passwords for signup)
    - Verify: Success message is displayed, no error messages are shown
    - Iterations: 100+

### Testing Tools

- **Unit Testing**: Jest with React Testing Library
- **Property-Based Testing**: fast-check for JavaScript/TypeScript
- **Minimum Iterations**: 100 per property test
- **Coverage Target**: 100% of component logic

## UI/UX Design Details

### Layout and Spacing

**Card Container:**
- Centered on page using flexbox
- Maximum width: 400px on desktop
- Full width with 16px padding on mobile (320px)
- Padding: 32px (8 * 4 in Tailwind scale)
- Border radius: 12px (rounded-lg)
- Box shadow: md (medium shadow for depth)

**Form Sections:**
- Spacing between form fields: 16px (gap-4)
- Spacing between form and buttons: 24px (mt-6)
- Spacing between buttons and credential display: 24px (mt-6)

**Tab Navigation:**
- Two equal-width buttons
- Spacing between tabs: 8px (gap-2)
- Padding per tab: 12px vertical, 24px horizontal
- Border radius: 8px (rounded-md)

### Color Scheme

**Background:**
- Gradient: from-blue-500 via-purple-500 to-pink-500
- Opacity: Full (no transparency)

**Card:**
- Background: white
- Border: none (shadow provides depth)

**Text:**
- Primary text: gray-900 (dark gray)
- Labels: gray-700 (medium gray)
- Error text: red-600 (error red)
- Success text: green-600 (success green)

**Buttons:**
- Active tab: bg-blue-600, text-white
- Inactive tab: bg-gray-200, text-gray-700
- Login/Signup button: bg-blue-600, text-white
- Hover state: bg-blue-700
- Active state: bg-blue-800

**Input Fields:**
- Border: 1px solid gray-300
- Focus border: 2px solid blue-500
- Background: white
- Padding: 12px (px-3 py-2)

### Typography

- Font family: System font stack (Tailwind default)
- Heading (Card title): 24px, font-bold, gray-900
- Labels: 14px, font-medium, gray-700
- Input text: 16px, font-normal, gray-900
- Error/Success text: 14px, font-medium
- Credential display label: 14px, font-medium, gray-700
- Credential display value: 14px, font-mono, gray-600

### Responsive Design

**Mobile (320px - 767px):**
- Card: full width with 16px padding
- Font sizes: reduced by 1-2px
- Padding: reduced to 24px
- Tab buttons: full width, stacked vertically or side-by-side with reduced padding

**Tablet (768px - 1023px):**
- Card: 90% width, max 400px
- Standard padding: 28px
- Tab buttons: side-by-side with standard padding

**Desktop (1024px+):**
- Card: 400px fixed width
- Standard padding: 32px
- Tab buttons: side-by-side with standard padding

### Interactive States

**Buttons:**
- Default: bg-blue-600, text-white, cursor-pointer
- Hover: bg-blue-700, shadow-lg
- Active/Pressed: bg-blue-800, scale-95
- Disabled: bg-gray-400, cursor-not-allowed (if needed)

**Input Fields:**
- Default: border-gray-300, bg-white
- Focus: border-blue-500 (2px), ring-2, ring-blue-200
- Error: border-red-500, bg-red-50
- Filled: border-gray-300, bg-white

**Tabs:**
- Active: bg-blue-600, text-white, shadow-sm
- Inactive: bg-gray-200, text-gray-700, hover:bg-gray-300

## Code Organization and File Structure

### Single Component File Structure

The AuthScreen component is implemented in a single file with the following organization:

```
AuthScreen.tsx
├── Imports (React, hooks)
├── Type Definitions
│   ├── FormData interface
│   ├── ValidationErrors interface
│   └── ActiveTab type
├── AuthScreen Component
│   ├── State declarations (useState)
│   ├── Event handlers
│   │   ├── handleTabChange
│   │   ├── handleInputChange
│   │   └── handleSubmit
│   ├── Validation logic
│   │   ├── validateLogin
│   │   └── validateSignup
│   ├── Render logic
│   │   ├── Tab navigation
│   │   ├── Form rendering (conditional)
│   │   ├── Credential display
│   │   └── Error/Success messages
│   └── Return JSX
└── Export default AuthScreen
```

### File Location

- **Path**: `consumer-frontend/components/AuthScreen.tsx`
- **Import**: `import AuthScreen from '@/components/AuthScreen'`
- **Usage**: Can be imported and used in any page or layout

### Code Style Guidelines

- Use TypeScript for type safety
- Use functional components with hooks
- Use Tailwind CSS utility classes for all styling
- Use semantic HTML elements (form, input, button, label)
- Use descriptive variable and function names
- Include JSDoc comments for complex logic
- Keep component under 300 lines for maintainability

### Dependencies

- React (hooks: useState)
- Next.js (App Router)
- Tailwind CSS (styling)
- TypeScript (type definitions)

No external authentication libraries are required for this component—it handles UI and validation only.

## Integration Points

### Page Integration

The AuthScreen component can be integrated into a page as follows:

```typescript
import AuthScreen from '@/components/AuthScreen';

export default function AuthPage() {
  return (
    <main>
      <AuthScreen />
    </main>
  );
}
```

### Future Backend Integration

The component is designed to be easily extended for backend integration:

1. Add an `onSubmit` callback prop to handle form submission
2. Add a `loading` state to disable buttons during submission
3. Add error handling for API failures
4. Add success redirect logic after authentication

These extensions can be added without modifying the core component structure.

## Design Decisions and Rationale

1. **Single Component File**: Keeps the authentication UI self-contained and easy to maintain. All logic, state, and styling are in one place, making it simple to integrate and test.

2. **Tab-Based Navigation**: Provides a seamless user experience by allowing users to switch between login and signup without page navigation. Reduces cognitive load by showing only relevant form fields.

3. **Real-Time Credential Display**: Helps testers and developers verify that form input is being captured correctly. Provides transparency into what data the component is managing.

4. **Tailwind CSS**: Provides a utility-first approach to styling, ensuring consistency and reducing CSS file size. Makes responsive design straightforward with built-in breakpoint utilities.

5. **React Hooks (useState)**: Provides a modern, functional approach to state management. Simpler than class components and easier to test.

6. **Inline Validation**: Provides immediate feedback to users without requiring backend calls. Improves user experience by catching errors early.

7. **Gradient Background**: Creates a modern, visually appealing interface that differentiates the authentication screen from other pages.

8. **Card-Based Layout**: Provides visual hierarchy and focuses user attention on the authentication form. The centered card is a familiar pattern that users recognize.
