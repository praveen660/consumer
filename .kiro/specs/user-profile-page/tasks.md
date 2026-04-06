# Implementation Plan: User Profile Page

## Overview

Add a `/profile` page and an auth-aware `NavAuth` component to the consumer frontend. All logic is client-side: JWT is decoded from `localStorage` for display, and `logout()` from `lib/api.ts` handles token removal. `app/layout.tsx` stays a server component — auth-awareness is delegated to the new `NavAuth` client component.

## Tasks

- [x] 1. Create the NavAuth client component
  - Create `consumer-frontend/components/NavAuth.tsx` with `'use client'` directive
  - On mount, read `localStorage.getItem('authToken')` and set `isAuthenticated` state
  - Subscribe to `window` `storage` events to react to login/logout in other tabs; unsubscribe on unmount
  - Render a `<Link href="/profile">Profile</Link>` when authenticated, or `<Link href="/login">Login</Link>` when not
  - Apply the same Tailwind classes as the existing Login link in `app/layout.tsx` (`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors`)
  - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 1.1 Write unit tests for NavAuth
    - Test: renders "Profile" link when `authToken` is in localStorage
    - Test: renders "Login" link when `authToken` is absent
    - Test: updates from "Login" to "Profile" when a `storage` event adds `authToken`
    - Test: updates from "Profile" to "Login" when a `storage` event removes `authToken`
    - File: `consumer-frontend/components/NavAuth.test.tsx`
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 1.2 Write property test for NavAuth — Property 3: Nav link reflects auth state
    - **Property 3: Nav link reflects auth state**
    - Generator: `fc.boolean()` to decide whether token is present; if present, generate a non-empty string as token value
    - Verify: "Profile" link present iff token present; "Login" link present iff token absent; never both simultaneously
    - **Validates: Requirements 3.1, 3.2**
    - File: `consumer-frontend/components/NavAuth.pbt.test.tsx`

  - [ ]* 1.3 Write property test for NavAuth — Property 4: Nav updates reactively on storage change
    - **Property 4: Nav updates reactively on storage change**
    - Generator: `fc.array(fc.boolean(), { minLength: 1, maxLength: 10 })` representing a sequence of auth state toggles
    - Verify: after each simulated `storage` event, the rendered link matches the current state
    - **Validates: Requirements 3.3**
    - File: `consumer-frontend/components/NavAuth.pbt.test.tsx`

- [x] 2. Wire NavAuth into app/layout.tsx
  - Modify `consumer-frontend/app/layout.tsx` to import `NavAuth` from `@/components/NavAuth`
  - Replace the hardcoded `<Link href="/login">Login</Link>` element with `<NavAuth />`
  - Keep `app/layout.tsx` as a server component (no `'use client'` directive needed — `NavAuth` handles its own client boundary)
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 3. Create the ProfilePage component
  - Create `consumer-frontend/app/profile/page.tsx` with `'use client'` directive
  - Implement the `decodeJwtEmail(token: string): string | null` inline helper using `atob(token.split('.')[1])` with a try/catch returning `null` on failure
  - On mount (`useEffect`), read `localStorage.getItem('authToken')`; if absent or `decodeJwtEmail` returns `null`, call `router.push('/login')` immediately
  - If email is decoded successfully, set `email` state and render the profile UI
  - Render the decoded email address on screen
  - Render a logout button that calls `logout()` from `lib/api.ts` then calls `router.push('/login')`
  - Use `useRouter` from `next/navigation` for redirects
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3_

  - [ ]* 3.1 Write unit tests for ProfilePage
    - Test: renders email when a valid JWT-shaped token is in localStorage
    - Test: calls `router.push('/login')` when no token is present
    - Test: calls `router.push('/login')` when token is malformed (not valid base64 JSON)
    - Test: calls `logout()` and then `router.push('/login')` when logout button is clicked
    - Test: logout button is present in the rendered output
    - Mock `next/navigation` `useRouter`; mock `lib/api` `logout`
    - File: `consumer-frontend/components/ProfilePage.test.tsx`
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3_

  - [ ]* 3.2 Write property test for ProfilePage — Property 1: Email display round-trip
    - **Property 1: Email display round-trip**
    - Generator: `fc.emailAddress()` → encode as `btoa('{}') + '.' + btoa(JSON.stringify({ email })) + '.sig'`
    - Verify: rendered component contains exactly the generated email string
    - **Validates: Requirements 1.1**
    - File: `consumer-frontend/components/ProfilePage.pbt.test.tsx`

  - [ ]* 3.3 Write property test for ProfilePage — Property 2: Invalid or absent token causes redirect
    - **Property 2: Invalid or absent token causes redirect**
    - Generator: `fc.oneof(fc.constant(null), fc.string())` filtered to exclude valid JWT-shaped strings containing an `email` field
    - Verify: `router.push` is called with `'/login'`
    - **Validates: Requirements 1.2, 1.3**
    - File: `consumer-frontend/components/ProfilePage.pbt.test.tsx`

- [x] 4. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties; unit tests cover specific examples and edge cases
- `localStorage` access must always be inside `useEffect` to avoid SSR/hydration mismatches
- No backend changes are required — this feature is entirely client-side
