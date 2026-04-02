# Implementation Plan: API Gateway Consumer Test App

## Overview

This implementation plan breaks down the development of a minimal consumer test application that demonstrates integration with an API gateway form service. The application consists of a NestJS backend and Next.js 16+ frontend with App Router, implementing OAuth2 authentication, form initiation, and transaction status checking. The frontend uses Tailwind CSS for styling and native Fetch API for HTTP requests. Tasks are organized to build incrementally, with testing integrated throughout.

## Tasks

- [x] 1. Set up backend project structure
  - Initialize NestJS project with TypeScript
  - Install dependencies: @nestjs/axios, @nestjs/config, axios
  - Create directory structure: src/auth/, src/form/
  - Set up .env.example with PLATFORM_BASE_URL, CLIENT_ID, CLIENT_SECRET, PORT
  - Configure CORS to allow frontend requests
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 4.1, 4.2, 4.3_

- [x] 2. Implement backend authentication service
  - [x] 2.1 Create AuthService and AuthModule
    - Implement getAccessToken() method that calls Platform OAuth endpoint
    - Use ConfigService to read CLIENT_ID, CLIENT_SECRET, PLATFORM_BASE_URL
    - Construct OAuth request with client_credentials grant type
    - Extract access_token from response
    - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3, 4.4_
  
  - [ ]* 2.2 Write property test for OAuth request format
    - **Property 1: OAuth Request Format**
    - **Validates: Requirements 1.2**
  
  - [ ]* 2.3 Write property test for access token extraction
    - **Property 2: Access Token Extraction**
    - **Validates: Requirements 1.3**
  
  - [ ]* 2.4 Write property test for bearer token usage
    - **Property 3: Bearer Token Usage**
    - **Validates: Requirements 1.4**
  
  - [ ]* 2.5 Write unit tests for AuthService
    - Test successful token retrieval
    - Test error handling for network failures
    - Test error handling for invalid credentials
    - _Requirements: 1.2, 1.3_

- [x] 3. Implement backend form service
  - [x] 3.1 Create FormService and FormModule
    - Implement initiateForm() method that calls Platform form initiation endpoint
    - Implement getTransactionStatus() method that queries Platform transaction endpoint
    - Use AuthService to obtain access tokens before each Platform API call
    - Include access_token as Bearer token in Authorization header
    - _Requirements: 2.2, 2.3, 2.4, 3.2, 3.3, 3.4, 1.4, 4.4_
  
  - [ ]* 3.2 Write property test for authentication before platform calls
    - **Property 4: Authentication Before Platform Calls**
    - **Validates: Requirements 2.2, 3.2**
  
  - [ ]* 3.3 Write property test for form initiation request format
    - **Property 5: Form Initiation Request Format**
    - **Validates: Requirements 2.3**
  
  - [ ]* 3.4 Write property test for response proxying
    - **Property 6: Response Proxying**
    - **Validates: Requirements 2.4, 3.4**
  
  - [ ]* 3.5 Write property test for backend error handling
    - **Property 7: Backend Error Handling**
    - **Validates: Requirements 2.5, 3.5**
  
  - [ ]* 3.6 Write property test for transaction status request format
    - **Property 8: Transaction Status Request Format**
    - **Validates: Requirements 3.3**
  
  - [ ]* 3.7 Write property test for URL construction
    - **Property 9: URL Construction**
    - **Validates: Requirements 4.4**
  
  - [ ]* 3.8 Write unit tests for FormService
    - Test successful form initiation
    - Test successful transaction status query
    - Test error handling for Platform API failures
    - Test error handling for OAuth failures
    - _Requirements: 2.3, 2.4, 2.5, 3.3, 3.4, 3.5_

- [x] 4. Implement backend API controller
  - [x] 4.1 Create AppController with endpoints
    - Implement GET /api/start-form endpoint that calls FormService.initiateForm()
    - Implement GET /api/transaction/:id endpoint that calls FormService.getTransactionStatus()
    - Return appropriate HTTP status codes for errors
    - _Requirements: 2.1, 3.1, 2.5, 3.5_
  
  - [ ]* 4.2 Write unit tests for AppController
    - Test /api/start-form endpoint with mocked FormService
    - Test /api/transaction/:id endpoint with mocked FormService
    - Test error responses
    - _Requirements: 2.1, 3.1_

- [x] 5. Wire backend modules together
  - [x] 5.1 Configure AppModule
    - Import AuthModule, FormModule, ConfigModule, HttpModule
    - Register AppController
    - Configure ConfigModule to load .env file
    - _Requirements: 7.4, 4.1, 4.2, 4.3_
  
  - [x] 5.2 Configure main.ts
    - Set up NestJS application
    - Enable CORS for frontend origin
    - Configure port from environment variable (default 3001)
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 6. Checkpoint - Ensure backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Set up frontend project structure with Next.js App Router
  - Initialize Next.js 16+ project with TypeScript and App Router
  - Install dependencies: none required (use native Fetch API)
  - Create directory structure: app/, lib/, components/
  - Set up .env.example with NEXT_PUBLIC_BACKEND_URL
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 8. Set up Tailwind CSS
  - [x] 8.1 Install and configure Tailwind CSS
    - Install tailwindcss, postcss, autoprefixer
    - Create tailwind.config.ts with content paths for app/ and components/
    - Create postcss.config.js
    - _Requirements: 9.4, 9.5_
  
  - [x] 8.2 Create global styles with Tailwind
    - Create app/globals.css with Tailwind directives
    - Add minimal custom styles for layout and spacing
    - Keep styling minimal for R&D testing
    - _Requirements: 9.4, 9.5_

- [ ] 9. Implement frontend API service
  - [x] 9.1 Create API service in lib/api.ts
    - Implement startForm() function that calls GET /api/start-form using native Fetch API
    - Implement getTransactionStatus() function that calls GET /api/transaction/:id using native Fetch API
    - Use NEXT_PUBLIC_BACKEND_URL from environment variables
    - Handle response parsing and error cases
    - Export TypeScript interfaces for FormInitiationResponse and TransactionStatus
    - _Requirements: 8.3, 8.4, 5.3, 6.4_
  
  - [ ]* 9.2 Write unit tests for API service
    - Test startForm() with mocked Fetch responses
    - Test getTransactionStatus() with mocked Fetch responses
    - Test error handling for network failures and HTTP errors
    - _Requirements: 8.3, 8.4_

- [x] 9.5 Clean up obsolete directories
  - Remove consumer-frontend/pages/ directory (empty, not used with App Router)
  - Remove consumer-frontend/services/ directory (empty, using lib/ instead)
  - Remove consumer-frontend/styles/ directory (using app/globals.css instead)
  - _Requirements: 8.1, 8.2_

- [x] 10. Create root layout component
  - [x] 10.1 Update app/layout.tsx
    - Verify HTML structure with proper metadata is in place
    - Ensure globals.css is imported for Tailwind styles
    - Add navigation links between home and status pages
    - Use Tailwind classes for consistent styling
    - _Requirements: 8.1, 8.2, 9.4_

- [x] 11. Implement frontend home page
  - [x] 11.1 Create FormInitiator Client Component in components/FormInitiator.tsx
    - Mark as 'use client' for interactivity
    - Display "Start PAN Application" button with Tailwind styling
    - On button click, call API service startForm()
    - On success, redirect browser to form_url using window.location.href
    - On error, display error message with Tailwind styling
    - Show loading state during API call
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 11.2 Update home page in app/page.tsx
    - Update Server Component to render descriptive page title and introduction
    - Import and render FormInitiator Client Component
    - Use Tailwind CSS classes for layout and styling
    - Keep layout clean and minimal per R&D requirements
    - _Requirements: 5.1, 5.2_
  
  - [ ]* 11.3 Write property test for form initiation API call
    - **Property 10: Form Initiation API Call**
    - **Validates: Requirements 5.3**
  
  - [ ]* 11.4 Write property test for form URL redirect
    - **Property 11: Form URL Redirect**
    - **Validates: Requirements 5.4**
  
  - [ ]* 11.5 Write unit tests for FormInitiator component
    - Test button click handler
    - Test successful form initiation flow
    - Test error display
    - Test loading state
    - _Requirements: 5.3, 5.4, 5.5_

- [x] 12. Implement frontend status page
  - [x] 12.1 Create StatusChecker Client Component in components/StatusChecker.tsx
    - Mark as 'use client' for interactivity
    - Display transaction ID input field with Tailwind styling
    - Display submit button with Tailwind styling
    - On submit, call API service getTransactionStatus()
    - On success, display transaction status information with Tailwind styling
    - On error, display error message with Tailwind styling
    - Show loading state during API call
    - Display status data in a readable format (JSON or formatted text)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [x] 12.2 Update status page in app/status/page.tsx
    - Update Server Component to render descriptive page title
    - Import and render StatusChecker Client Component
    - Use Tailwind CSS classes for layout and styling
    - Keep layout clean and minimal per R&D requirements
    - _Requirements: 6.1, 6.2_
  
  - [ ]* 12.3 Write property test for transaction status API call
    - **Property 12: Transaction Status API Call**
    - **Validates: Requirements 6.4**
  
  - [ ]* 12.4 Write property test for status display
    - **Property 13: Status Display**
    - **Validates: Requirements 6.5**
  
  - [ ]* 12.5 Write property test for frontend error display
    - **Property 14: Frontend Error Display**
    - **Validates: Requirements 5.5, 6.6**
  
  - [ ]* 12.6 Write unit tests for StatusChecker component
    - Test form submission handler
    - Test successful status query flow
    - Test error display
    - Test loading state
    - Test status data rendering
    - _Requirements: 6.4, 6.5, 6.6_

- [ ] 13. Checkpoint - Ensure frontend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [-] 14. Update project documentation
  - [ ] 14.1 Update README.md in project root
    - Fix references to use App Router architecture (app/ directory, not pages/)
    - Update project structure diagram to show app/ directory structure
    - Verify all environment variables are documented correctly
    - Ensure installation and development commands are accurate
    - Confirm default ports are documented (backend: 3001, frontend: 3000)
    - Add note about Next.js 16+ App Router with Server and Client Components
    - Add note about using native Fetch API instead of Axios
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 15. Final checkpoint - Verify complete integration
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and error conditions
- The implementation intentionally excludes production features per Requirement 9
- Backend runs on port 3001, frontend on port 3000 by default
- All property tests should use fast-check with minimum 100 iterations
- Property test comments should follow format: `// Feature: api-gateway-consumer-test-app, Property {number}: {property_text}`
- Frontend uses Next.js 16+ App Router with app/ directory structure (NOT pages/ directory)
- Frontend uses native Fetch API instead of Axios for HTTP requests
- Frontend uses Tailwind CSS 4.x for styling
- Client Components (FormInitiator, StatusChecker) handle interactivity with 'use client' directive
- Server Components (page.tsx files) handle static rendering and layout
- The app/ directory structure is: app/page.tsx (home), app/status/page.tsx (status page), app/layout.tsx (root layout)
- Components go in components/ directory, API utilities go in lib/ directory
