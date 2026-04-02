// Service configuration and helper functions

import { ServiceMetadata } from '@/types/service';

export const SERVICES: ServiceMetadata[] = [
  {
    id: 1,
    name: 'PAN Application',
    description: 'Apply for a new Permanent Account Number (PAN) card',
    icon: 'CreditCard',
    endpoint: '/pan/apply',
    enabled: true,
  },
  {
    id: 2,
    name: 'Driving Licence',
    description: 'Apply for a new driving licence or renew existing one',
    icon: 'Car',
    endpoint: '/driving-licence/apply',
    enabled: true,
  },
];

/**
 * Get all enabled services
 * @returns Array of enabled services
 */
export function getEnabledServices(): ServiceMetadata[] {
  return SERVICES.filter(service => service.enabled);
}

/**
 * Get service by ID
 * @param serviceEndpoint - The unique identifier for the service
 * @returns The service metadata or undefined if not found
 */
export function getServiceById(serviceEndpoint: string): ServiceMetadata | undefined {
  return SERVICES.find(service => service.endpoint === serviceEndpoint);
}
