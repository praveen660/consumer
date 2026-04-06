'use client';

import { useState } from 'react';
import { ServiceCardProps } from '@/types/service';
import { CreditCard, Car } from 'lucide-react';

// Icon mapping for services
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CreditCard,
  Car,
};

export default function ServiceCard({ service, onInitiate }: Readonly<ServiceCardProps>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitiate = async () => {
    setLoading(true);
    setError(null);

    try {
      await onInitiate(service.endpoint);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate service');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleInitiate();
    }
  };

  const IconComponent = iconMap[service.icon] || CreditCard;

  return (
    <article
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:border-blue-500 border-2 border-transparent transition-all duration-200 flex flex-col h-full"
      aria-label={`${service.name} service card`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <IconComponent className="w-6 h-6 text-blue-600" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {service.name}
          </h3>
          <p className="text-gray-600 text-sm">
            {service.description}
          </p>
        </div>
      </div>

      <div className="mt-auto">
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700" role="alert">
            {error}
          </div>
        )}
        
        <button
          onClick={handleInitiate}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          aria-label={`Start ${service.name}`}
          aria-busy={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              <span>Starting...</span>
            </span>
          ) : (
            'Get Started'
          )}
        </button>
      </div>
    </article>
  );
}
