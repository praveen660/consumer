export interface ServiceMetadata {
  id: number;                    // Unique identifier for the service
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
