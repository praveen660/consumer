'use client';

import { useState } from 'react';
import { startForm } from '@/lib/api';

export default function FormInitiator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartForm = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await startForm();
      // Redirect to the form URL
      window.location.href = response.formUrl;
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to start form');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleStartForm}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Starting...' : 'Start PAN Application'}
      </button>

      {error && (
        <div className="px-4 py-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
