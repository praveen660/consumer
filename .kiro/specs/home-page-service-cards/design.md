# Design Document: Home Page Service Cards

## Overview

This design transforms the consumer frontend home page from a single-button interface into a card-based service catalog. The implementation leverages Next.js 16+ App Router architecture with Server and Client Components, Tailwind CSS 4.x for styling, and maintains backward compatibility with the existing PAN application workflow.

The design introduces a modular, configuration-driven approach where services are defined in a centralized metadata structure and rendered dynamically. This enables easy addition of new services without modifying core components, supporting the platform's goal of providing multiple government services through a unified interface.

Key design principles:
- **Configuration-driven**: Services defined in metadata, not hardcoded in components
- **Component reusability**: Generic ServiceCard component works for all service types
- **Responsive-first**: Mobile-to-desktop layout using Tailwind's responsive utilities
- **Accessibility-first**: Keyboard navigation, ARIA labels, and focus management built-in
- **Backward compatible**: Existing PAN workflow unchanged, only presentation layer modified

## Architecture

### Component Hierarchy

```
app/page.tsx (Server Component)
└── ServiceGrid (Client Component)
    └── ServiceCard[] (Client Component)
        ├── Service Icon/Image
        ├── Service Name
        ├── Service Description
        └── Action Button
```

### Data Flow

```
Service Configuration (serviceConfig.ts)
    ↓
ServiceGrid Component (reads config)
    ↓
ServiceCard Components (rendered dynamically)
    ↓
User Interaction (button click)
    ↓
API Call (lib/api.ts)
    ↓
Backend Service (consumer-backend)
    ↓
Platform API Gateway
```

### File Structure

```
consumer-frontend/
├── app/
│   └── page.tsx                    # Home page (Server Component)
├── components/
│   ├── ServiceGrid.tsx             # Grid container (Client Component)
│   ├── ServiceCard.tsx             # Individual card (Client Component)
│   └── FormInitiator.tsx           # Legacy component (retained for reference)
├── lib/
│   ├── api.ts                      # API functions (extended)
│   └── serviceConfig.ts            # Service metadata configuration
└── types/
    └── service.ts                  # TypeScript interfaces
```

## Components and Interfaces

### Type Definitions

```typescript
// types/service.ts

export interface ServiceMetadata {
  id: string;                    // Unique identifier for the service
  name: string;                  // Display name (e.g., "PAN Application")
  description: string;           // Brief description of the service
  icon: string;                  // Icon identifier or path
  endpoint: string;              // API endpoint path (e.g., "/api/start-form")
  enabled: boolean;              // Whether the service is currently available
}

export interface ServiceCardProps {
  service: ServiceMetadata;
  onInitiate: (serviceId: string) => Promise<void>;
}

export interface ServiceGridProps {
  services: ServiceMetadata[];
}
```

### Service Configuration

```typescript
// lib/serviceConfig.ts

import { ServiceMetadata } from '@/types/service';

export const SERVICES: ServiceMetadata[] = [
  {
    id: 'pan',
    name: 'PAN Application',
    description: 'Apply for a new Permanent Account Number (PAN) card',
    icon: 'CreditCard',
    endpoint: '/api/start-form',
    enabled: true,
  },
  {
    id: 'driving-licence',
    name: 'Driving Licence',
    description: 'Apply for or renew your driving licence',
    icon: 'Car',
    endpoint: '/api/start-driving-licence',
    enabled: true,
  },
  {
    id: 'passport',
    name: 'Passport',
    description: 'Apply for a new passport or renewal',
    icon: 'Plane',
    endpoint: '/api/start-passport',
    enabled: false,
  },
  // Additional services can be added here
];

export function getEnabledServices(): ServiceMetadata[] {
  return SERVICES.filter(service => service.enabled);
}

export function getServiceById(id: string): ServiceMetadata | undefined {
  return SERVICES.find(service => service.id === id);
}
```

### ServiceCard Component

The ServiceCard component is a client component that renders an individual service with hover effects, loading states, and error handling.

**Key Features:**
- Displays service name, description, and icon
- Handles click events to initiate service
- Shows loading state during API calls
- Displays inline error messages with retry capability
- Keyboard accessible with proper focus management
- ARIA labels for screen readers

**State Management:**
- `loading`: Boolean indicating if service initiation is in progress
- `error`: String containing error message, or null if no error

**Styling:**
- Card container: White background, rounded corners, shadow on hover
- Hover effect: Slight elevation and border color change
- Focus indicator: Visible outline for keyboard navigation
- Responsive: Maintains readability at all viewport sizes

### ServiceGrid Component

The ServiceGrid component is a client component that renders the collection of ServiceCard components in a responsive grid layout.

**Key Features:**
- Reads service configuration from serviceConfig.ts
- Filters to show only enabled services
- Renders ServiceCard for each service
- Manages service initiation logic
- Handles API calls and redirects

**Layout Behavior:**
- Desktop (>1024px): 3-column grid
- Tablet (768px-1024px): 2-column grid
- Mobile (<768px): 1-column stack
- Consistent gap spacing: 1.5rem (24px)

**Responsibilities:**
- Coordinate service initiation across all cards
- Call appropriate API endpoint based on service metadata
- Handle redirects to form URLs
- Manage error states (delegated to individual cards)

### API Extensions

```typescript
// lib/api.ts (additions)

export interface ServiceInitiationRequest {
  serviceId: string;
}

export async function startService(serviceId: string): Promise<FormInitiationResponse> {
  const service = getServiceById(serviceId);
  
  if (!service) {
    throw new Error(`Unknown service: ${serviceId}`);
  }
  
  const response = await fetch(`${BACKEND_URL}${service.endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to start ${service.name}: ${response.statusText}`);
  }

  return response.json();
}

// Maintain backward compatibility
export async function startForm(): Promise<FormInitiationResponse> {
  return startService('pan');
}
```

## Data Models

### Service Metadata Model

The ServiceMetadata interface defines the structure for service configuration:

**Fields:**
- `id` (string, required): Unique identifier used for API calls and internal references
  - Format: lowercase-kebab-case
  - Examples: "pan", "driving-licence", "passport"
  
- `name` (string, required): Human-readable service name displayed on the card
  - Format: Title Case
  - Max length: 50 characters
  - Examples: "PAN Application", "Driving Licence"
  
- `description` (string, required): Brief explanation of the service
  - Format: Sentence case
  - Max length: 150 characters
  - Should clearly communicate what the service does
  
- `icon` (string, required): Icon identifier for visual representation
  - Format: Icon name from chosen icon library (e.g., Lucide React)
  - Examples: "CreditCard", "Car", "Plane"
  
- `endpoint` (string, required): Backend API endpoint path
  - Format: Absolute path starting with /api/
  - Examples: "/api/start-form", "/api/start-driving-licence"
  
- `enabled` (boolean, required): Whether the service is currently available
  - true: Service appears in the grid
  - false: Service hidden from users (useful for gradual rollout)

### Form Initiation Response Model

The existing FormInitiationResponse interface remains unchanged:

```typescript
interface FormInitiationResponse {
  form_url: string;        // URL to redirect user to complete the form
  transaction_id: string;  // Unique identifier for tracking the transaction
}
```

This model is returned by all service initiation endpoints and maintains consistency across different service types.

### Component State Models

**ServiceCard State:**
```typescript
{
  loading: boolean;      // True when API call is in progress
  error: string | null;  // Error message or null if no error
}
```

**ServiceGrid State:**
No component-level state required. State is managed by individual ServiceCard components.

