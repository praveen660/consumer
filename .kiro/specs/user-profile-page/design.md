# Design Document: User Profile Page

## Overview

This feature adds a `/profile` page to the consumer frontend that displays the authenticated user's email address and provides a logout button. It also makes the top navigation bar auth-aware: showing a "Profile" link when a valid JWT is present in `localStorage`, and a "Login" link otherwise.

The implementation is purely frontend — no backend changes are required. The JWT payload is decoded client-side (base64 decode of the middle segment) to extract the `email` field for display. The existing `logout()` function in `lib/api.ts` handles token removal.

**Key Design Goals:**
- Zero backend changes — all logic is client-side
- Auth state is read from `localStorage` (`authToken` key)
- `layout.tsx` remains a server component; auth-awareness is delegated to a `'use client'` `NavAuth` component
- Consistent Tailwind CSS 4.x styling with the existing blue-600 primary color scheme

## Architecture

### Component Structure

```
app/layout.tsx (Server Component)
└── NavAuth (Client Component — 'use client')
    ├── Reads localStorage on mount
    ├── Listens for storage events (cross-tab sync)
    └── Renders "Profile" link or "Login" link

app/profile/page.tsx (Client Component — 'use client')
├── Reads authToken from localStorage on mount
├── Decodes JWT payload (base64, no verification)
├── Redirects to /login if token absent or undecodable
└── Renders email + logout button
```

### Auth State Flow

```
Page Load
    ↓
Read localStorage('authToken')
    ↓
Token present?
  ├── No  → redirect to /login
  └── Yes → decode base64 payload
              ↓
           email present?
             ├── No  → redirect to /login
             └── Yes → render profile page with email
```

### Navigation Auth Flow

```
NavAuth mounts
    ↓
Read localStorage('authToken')
    ↓
Token present? → show "Profile" link
No token?      → show "Login" link
    ↓
window 'storage' event fires (login/logout in another tab)
    ↓
Re-read localStorage → update displayed link
```

## Components and Interfaces

### NavAuth Component

**Location:** `consumer-frontend/components/NavAuth.tsx`  
**Directive:** `'use client'`

**Responsibilities:**
- On mount, check `localStorage.getItem('authToken')`
- Subscribe to `window` `storage` events to react to login/logout in other tabs
- Render a "Profile" `<Link>` to `/profile` when authenticated, or a "Login" `<Link>` to `/login` when not

**Props:** None

**State:**
```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false);
```

### ProfilePage Component

**Location:** `consumer-frontend/app/profile/page.tsx`  
**Directive:** `'use client'`

**Responsibilities:**
- On mount, read and decode the JWT from `localStorage`
- Redirect to `/login` if token is absent or email cannot be extracted
- Display the decoded email address
- Provide a logout button that calls `logout()` then redirects to `/login`

**State:**
```typescript
const [email, setEmail] = useState<string | null>(null);
```

### JWT Decode Utility

A small inline helper (no external library needed) decodes the JWT payload:

```typescript
function decodeJwtEmail(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email ?? null;
  } catch {
    return null;
  }
}
```

This performs no signature verification — it is used only for display purposes, which is safe since the backend validates the token on protected API calls.

## Data Models

### JWT Payload (relevant fields)

```typescript
interface JwtPayload {
  sub: string;    // user ID
  email: string;  // user email — used for display
  iat?: number;
  exp?: number;
}
```

### NavAuth State

```typescript
// Internal to NavAuth component
isAuthenticated: boolean  // true when authToken exists in localStorage
```

### ProfilePage State

```typescript
// Internal to ProfilePage component
email: string | null  // null until decoded; triggers redirect if stays null after mount
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Email display round-trip

*For any* valid email string encoded into a JWT-shaped token (header.payload.signature where payload contains `{ email }`), rendering the ProfilePage component with that token in localStorage should display exactly that email string on screen.

**Validates: Requirements 1.1**

### Property 2: Invalid or absent token causes redirect

*For any* value in localStorage that is either absent, an empty string, or a string that cannot be base64-decoded into a JSON object containing an `email` field, the ProfilePage component SHALL call `router.push('/login')`.

**Validates: Requirements 1.2, 1.3**

### Property 3: Nav link reflects auth state

*For any* localStorage state (token present vs. absent), the NavAuth component should render exactly one auth link — "Profile" pointing to `/profile` when a token is present, and "Login" pointing to `/login` when no token is present.

**Validates: Requirements 3.1, 3.2**

### Property 4: Nav updates reactively on storage change

*For any* sequence of storage events that toggle `authToken` between present and absent, the NavAuth component should update its rendered link to match the new state without a page reload.

**Validates: Requirements 3.3**

## Error Handling

### Missing Token

- Trigger: `localStorage.getItem('authToken')` returns `null`
- Response: `router.push('/login')` called immediately on mount
- No error UI shown — silent redirect

### Malformed Token

- Trigger: Token present but `atob(token.split('.')[1])` throws, or parsed JSON lacks `email`
- Response: `decodeJwtEmail` returns `null` → `router.push('/login')` called on mount
- No error UI shown — silent redirect

### Logout Failure

- `logout()` in `lib/api.ts` is synchronous and only calls `localStorage.removeItem` — it cannot throw in normal operation
- After `logout()`, redirect to `/login` unconditionally

### SSR / Hydration

- Both `NavAuth` and `ProfilePage` are `'use client'` components
- `localStorage` access is guarded inside `useEffect` (runs only in browser)
- Server render shows a neutral/loading state to avoid hydration mismatch

## Testing Strategy

### Unit Testing

Unit tests cover specific examples, edge cases, and integration points:

1. **ProfilePage**
   - Renders email when a valid token is in localStorage
   - Calls `router.push('/login')` when no token is present
   - Calls `router.push('/login')` when token is malformed (not valid base64 JSON)
   - Calls `logout()` and then `router.push('/login')` when logout button is clicked
   - Logout button is present in the rendered output

2. **NavAuth**
   - Renders "Profile" link when `authToken` is in localStorage
   - Renders "Login" link when `authToken` is absent
   - Updates from "Login" to "Profile" when a `storage` event adds `authToken`
   - Updates from "Profile" to "Login" when a `storage` event removes `authToken`

3. **decodeJwtEmail utility**
   - Returns email for a well-formed token
   - Returns `null` for a token with missing email field
   - Returns `null` for a non-JWT string

### Property-Based Testing

Property tests use `fast-check` and live in `*.pbt.test.tsx` files. Each test runs a minimum of 100 iterations.

**Property 1: Email display round-trip**
- Feature: user-profile-page, Property 1: Email display round-trip
- Generator: `fc.emailAddress()` → encode as `btoa('{}')` + `.` + `btoa(JSON.stringify({ email }))` + `.sig`
- Verify: rendered component contains the generated email string
- Iterations: 100+

**Property 2: Invalid or absent token causes redirect**
- Feature: user-profile-page, Property 2: Invalid or absent token causes redirect
- Generator: `fc.oneof(fc.constant(null), fc.string())` filtered to exclude valid JWT-shaped strings with email
- Verify: `router.push` called with `'/login'`
- Iterations: 100+

**Property 3: Nav link reflects auth state**
- Feature: user-profile-page, Property 3: Nav link reflects auth state
- Generator: `fc.boolean()` to decide whether token is present; if present, generate a non-empty string as token
- Verify: "Profile" link present iff token present; "Login" link present iff token absent; never both
- Iterations: 100+

**Property 4: Nav updates reactively on storage change**
- Feature: user-profile-page, Property 4: Nav updates reactively on storage change
- Generator: `fc.array(fc.boolean(), { minLength: 1, maxLength: 10 })` representing a sequence of auth state toggles
- Verify: after each simulated `storage` event, the rendered link matches the current state
- Iterations: 100+

### Testing Tools

- **Unit Testing**: Jest 30 + React Testing Library
- **Property-Based Testing**: fast-check 4.x
- **Minimum Iterations**: 100 per property test
- **Mock Strategy**: `next/navigation` `useRouter` mocked; `localStorage` via `jest-environment-jsdom`
