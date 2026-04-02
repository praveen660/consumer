# Implementation Plan: Home Page Service Cards

## Overview

This implementation transforms the consumer frontend home page from a single-button interface into a card-based service catalog. The approach is configuration-driven, allowing easy addition of new services without modifying core components. The implementation maintains backward compatibility with the existing PAN application workflow.

## Tasks

- [ ] 1. Create type definitions and service configuration
  - [x] 1.1 Create types/service.ts with ServiceMetadata and component prop interfaces
    - Define ServiceMetadata interface with id, name, description, icon, endpoint, enabled fields
    - Define ServiceCardProps and ServiceGridProps interfaces
    - _Requirements: 5.1, 5.2_
  
  - [x] 1.2 Create lib/serviceConfig.ts with service metadata
    - Define SERVICES array with PAN and Driving Licence services
    - Implement getEnabledServices() helper function
    - Implement getServiceById() helper function
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 1.2, 1.3_

- [ ] 2. Extend API layer for generic service initiation
  - [x] 2.1 Add startService() function to lib/api.ts
    - Implement generic service initiation that accepts serviceId parameter
    - Use getServiceById() to retrieve service endpoint
    - Handle errors for unknown service IDs
    - Maintain backward compatibility by keeping existing startForm() function
    - _Requirements: 4.2, 7.1, 7.2_

- [ ] 3. Implement ServiceCard component
  - [x] 3.1 Create components/ServiceCard.tsx
    - Implement client component with service prop and onInitiate callback
    - Add state management for loading and error states
    - Render service name, description, and icon placeholder
    - Implement action button with click handler
    - Add loading state display during service initiation
    - Add error message display with retry capability
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.1, 4.4, 4.5, 4.6_
  
  - [x] 3.2 Add styling and hover effects to ServiceCard
    - Apply Tailwind classes for card container (white background, rounded corners, shadow)
    - Implement hover effect with elevation and border color change
    - Add responsive styling to maintain readability at all viewport sizes
    - _Requirements: 2.5, 2.6, 3.5_
  
  - [x] 3.3 Add accessibility features to ServiceCard
    - Add keyboard navigation support (Tab and Enter keys)
    - Add ARIA labels for screen readers
    - Implement visible focus indicator
    - Add descriptive accessible name to action button including service name
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 4. Implement ServiceGrid component
  - [x] 4.1 Create components/ServiceGrid.tsx
    - Implement client component that reads service configuration
    - Filter to show only enabled services using getEnabledServices()
    - Render ServiceCard for each service
    - Implement service initiation handler that calls startService() API
    - Handle redirect to form URL on successful initiation
    - _Requirements: 1.1, 1.5, 4.1, 4.2, 4.3, 5.3, 5.4_
  
  - [x] 4.2 Add responsive grid layout to ServiceGrid
    - Implement 3-column grid for desktop (>1024px)
    - Implement 2-column grid for tablet (768px-1024px)
    - Implement 1-column stack for mobile (<768px)
    - Add consistent gap spacing (1.5rem/24px)
    - Ensure logical tab order from left to right, top to bottom
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 6.5_

- [ ] 5. Update home page to use ServiceGrid
  - [x] 5.1 Modify app/page.tsx to render ServiceGrid
    - Replace FormInitiator component with ServiceGrid component
    - Update page heading and description to reflect multiple services
    - Keep FormInitiator component file for reference (don't delete)
    - _Requirements: 1.1, 1.5, 7.3_

- [ ] 6. Checkpoint - Verify implementation and test manually
  - Ensure all components render correctly
  - Test service initiation for PAN service
  - Test responsive layout at different viewport sizes
  - Test keyboard navigation and accessibility features
  - Ask the user if questions arise

## Notes

- All tasks reference specific requirements for traceability
- The existing FormInitiator component is retained for reference but not deleted
- PAN service maintains identical API behavior to ensure backward compatibility
- Service configuration supports easy addition of new services (up to 10+)
- Icon implementation can use any icon library (Lucide React recommended)
- Checkpoint ensures incremental validation before completion
