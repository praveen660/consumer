# Requirements Document

## Introduction

Add a profile page to the consumer frontend that displays the logged-in user's email address and provides a logout button. When the user logs out, the JWT token is cleared from localStorage and the user is redirected to the login page. The page is accessible via a "Profile" link in the navigation bar, visible only when the user is authenticated.

## Glossary

- **Profile_Page**: The `/profile` route in the Next.js App Router that displays user account information and logout controls.
- **Auth_Token**: The JWT stored in `localStorage` under the key `authToken`, issued by the backend on successful login or signup.
- **ProfilePage_Component**: The client-side React component rendered at `/profile`.
- **Nav**: The top navigation bar rendered in `app/layout.tsx`.

## Requirements

### Requirement 1: Display User Email

**User Story:** As a logged-in user, I want to see my email address on the profile page, so that I can confirm which account I am currently using.

#### Acceptance Criteria

1. WHEN the user navigates to `/profile`, THE Profile_Page SHALL display the email address decoded from the Auth_Token stored in localStorage.
2. IF no Auth_Token is present in localStorage, THEN THE Profile_Page SHALL redirect the user to `/login`.
3. IF the Auth_Token is present but cannot be decoded to extract an email, THEN THE Profile_Page SHALL redirect the user to `/login`.

### Requirement 2: Logout

**User Story:** As a logged-in user, I want a logout button on the profile page, so that I can end my session and return to the login page.

#### Acceptance Criteria

1. THE Profile_Page SHALL display a logout button.
2. WHEN the user clicks the logout button, THE ProfilePage_Component SHALL call the `logout()` function from `lib/api.ts`, which removes the Auth_Token from localStorage.
3. WHEN the `logout()` function completes, THE ProfilePage_Component SHALL redirect the user to `/login`.

### Requirement 3: Navigation Link

**User Story:** As a logged-in user, I want a profile link in the navigation bar, so that I can easily access my profile page from anywhere in the app.

#### Acceptance Criteria

1. WHILE the user is authenticated (Auth_Token is present in localStorage), THE Nav SHALL display a "Profile" link pointing to `/profile`.
2. WHILE the user is not authenticated, THE Nav SHALL display a "Login" link pointing to `/login` instead of the "Profile" link.
3. THE Nav SHALL update the displayed link without requiring a full page reload when the authentication state changes.
