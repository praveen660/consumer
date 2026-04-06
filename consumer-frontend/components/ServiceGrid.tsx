'use client';

import { getEnabledServices } from '@/lib/serviceConfig';
import { startService } from '@/lib/api';
import ServiceCard from './ServiceCard';

export default function ServiceGrid() {
  const services = getEnabledServices();

  const handleServiceInitiate = async (endpoint: string) => {
    // Backend handles OAuth, form initiation, and RSA encryption of user profile
    const { sessionId, encryptedProfile } = await startService(endpoint);
    window.location.href = `http://localhost:3000/services/verify/${sessionId}?profile=${encryptedProfile}`;
  };

  return (
    <ul
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none"
      aria-label="Available services"
    >
      {services.map((service) => (
        <li key={service.id}>
          <ServiceCard service={service} onInitiate={handleServiceInitiate} />
        </li>
      ))}
    </ul>
  );
}
