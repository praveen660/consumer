# Requirements Document

## Introduction

This document specifies requirements for a minimal consumer test application that simulates how a consumer would integrate with an API gateway form service. The application demonstrates the complete flow from OAuth2 authentication through form initiation, user interaction, and transaction status checking. This is designed for R&D testing purposes only, without production-grade security or optimization features.

## Glossary

- **Consumer_Backend**: The NestJS server application that authenticates with the platform and proxies API calls
- **Consumer_Frontend**: The Next.js web application that provides the user interface
- **Platform**: The external API gateway form service being integrated with
- **Form_URL**: A URL provided by the Platform that renders a form for user completion
- **Transaction_ID**: A unique identifier for a form submission transaction
- **Access_Token**: An OAuth2 bearer token used to authenticate API requests to the Platform
- **OAuth_Endpoint**: The Platform endpoint that issues access tokens
- **Form_Initiation_Endpoint**: The Platform endpoint that creates a new form session

## Requirements

### Requirement 1: OAuth2 Authentication

**User Story:** As a consumer backend, I want to authenticate with the platform using OAuth2 client credentials, so that I can make authorized API calls.

#### Acceptance Criteria

1. THE Consumer_Backend SHALL store CLIENT_ID and CLIENT_SECRET as environment variables
2. WHEN the Consumer_Backend needs an access token, THE Consumer_Backend SHALL send a POST request to the OAuth_Endpoint with client_id, client_secret, and grant_type parameters
3. WHEN the OAuth_Endpoint responds successfully, THE Consumer_Backend SHALL extract the access_token from the response
4. THE Consumer_Backend SHALL use the access_token as a Bearer token in subsequent Platform API requests

### Requirement 2: Form Initiation

**User Story:** As a consumer backend, I want to initiate a form session with the platform, so that I can provide users with a form URL.

#### Acceptance Criteria

1. THE Consumer_Backend SHALL expose a GET endpoint at /start-form
2. WHEN the /start-form endpoint is called, THE Consumer_Backend SHALL obtain an access_token from the OAuth_Endpoint
3. WHEN the Consumer_Backend has an access_token, THE Consumer_Backend SHALL send a POST request to the Form_Initiation_Endpoint with form_id and user_reference in the payload
4. WHEN the Form_Initiation_Endpoint responds successfully, THE Consumer_Backend SHALL return the form_url and transaction_id to the caller
5. IF the OAuth_Endpoint or Form_Initiation_Endpoint returns an error, THEN THE Consumer_Backend SHALL return an appropriate error response

### Requirement 3: Transaction Status Query

**User Story:** As a consumer backend, I want to query transaction status from the platform, so that I can provide status information to users.

#### Acceptance Criteria

1. THE Consumer_Backend SHALL expose a GET endpoint at /transaction/:id
2. WHEN the /transaction/:id endpoint is called, THE Consumer_Backend SHALL obtain an access_token from the OAuth_Endpoint
3. WHEN the Consumer_Backend has an access_token, THE Consumer_Backend SHALL send a GET request to the Platform endpoint /forms/transactions/:id
4. WHEN the Platform responds successfully, THE Consumer_Backend SHALL return the transaction status to the caller
5. IF the Platform returns an error, THEN THE Consumer_Backend SHALL return an appropriate error response

### Requirement 4: Backend Configuration

**User Story:** As a developer, I want to configure the backend using environment variables, so that I can easily change platform endpoints and credentials.

#### Acceptance Criteria

1. THE Consumer_Backend SHALL read PLATFORM_BASE_URL from environment variables
2. THE Consumer_Backend SHALL read CLIENT_ID from environment variables
3. THE Consumer_Backend SHALL read CLIENT_SECRET from environment variables
4. THE Consumer_Backend SHALL construct API URLs by combining PLATFORM_BASE_URL with endpoint paths

### Requirement 5: Form Initiation UI

**User Story:** As a user, I want to start a PAN application from the consumer frontend, so that I can fill out the form.

#### Acceptance Criteria

1. THE Consumer_Frontend SHALL display a page at the root path (/)
2. THE Consumer_Frontend SHALL display a button labeled "Start PAN Application" on the root page
3. WHEN the user clicks the "Start PAN Application" button, THE Consumer_Frontend SHALL call the Consumer_Backend endpoint /api/start-form
4. WHEN the Consumer_Backend returns a form_url, THE Consumer_Frontend SHALL redirect the browser to the form_url
5. IF the Consumer_Backend returns an error, THEN THE Consumer_Frontend SHALL display an error message to the user

### Requirement 6: Transaction Status UI

**User Story:** As a user, I want to check the status of my form submission, so that I can see if it was processed successfully.

#### Acceptance Criteria

1. THE Consumer_Frontend SHALL display a page at /status
2. THE Consumer_Frontend SHALL display an input field for entering a transaction_id on the status page
3. THE Consumer_Frontend SHALL display a button to submit the transaction_id on the status page
4. WHEN the user submits a transaction_id, THE Consumer_Frontend SHALL call the Consumer_Backend endpoint /api/transaction/:id
5. WHEN the Consumer_Backend returns transaction status, THE Consumer_Frontend SHALL display the status information to the user
6. IF the Consumer_Backend returns an error, THEN THE Consumer_Frontend SHALL display an error message to the user

### Requirement 7: Backend Project Structure

**User Story:** As a developer, I want a well-organized NestJS backend structure, so that I can easily navigate and maintain the code.

#### Acceptance Criteria

1. THE Consumer_Backend SHALL organize authentication logic in src/auth/ directory
2. THE Consumer_Backend SHALL organize form-related logic in src/form/ directory
3. THE Consumer_Backend SHALL define the main application controller in src/app.controller.ts
4. THE Consumer_Backend SHALL define the main application module in src/app.module.ts

### Requirement 8: Frontend Project Structure

**User Story:** As a developer, I want a well-organized Next.js frontend structure, so that I can easily navigate and maintain the code.

#### Acceptance Criteria

1. THE Consumer_Frontend SHALL define the root page in pages/index.tsx
2. THE Consumer_Frontend SHALL define the status page in pages/status.tsx
3. THE Consumer_Frontend SHALL define API service functions in services/api.ts
4. THE Consumer_Frontend SHALL use Axios for HTTP requests to the Consumer_Backend

### Requirement 9: Minimal Implementation

**User Story:** As a developer, I want a minimal implementation without production features, so that I can focus on testing the integration flow.

#### Acceptance Criteria

1. THE Consumer_Backend SHALL NOT implement token caching mechanisms
2. THE Consumer_Backend SHALL NOT implement rate limiting
3. THE Consumer_Backend SHALL NOT implement complex error handling beyond basic HTTP error responses
4. THE Consumer_Frontend SHALL NOT implement loading states or spinners
5. THE Consumer_Frontend SHALL NOT implement form validation beyond basic required fields
6. THE application SHALL NOT implement HTTPS or certificate management
7. THE application SHALL NOT implement logging frameworks or monitoring

### Requirement 10: Local Development Setup

**User Story:** As a developer, I want clear instructions to run the application locally, so that I can quickly test the integration.

#### Acceptance Criteria

1. THE project SHALL include a README file with setup instructions
2. THE README SHALL document all required environment variables
3. THE README SHALL provide commands to install dependencies for both backend and frontend
4. THE README SHALL provide commands to start both backend and frontend in development mode
5. THE README SHALL specify the default ports for backend and frontend services
