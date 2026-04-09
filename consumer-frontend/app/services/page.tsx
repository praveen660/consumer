'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ServiceGrid from '@/components/ServiceGrid'

export default function ServicesPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.replace('/login?redirect=/services');
    }
  }, [router]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Government Services</h1>
        <p className="text-gray-500 mt-1">Access various government services through our unified platform</p>
      </div>
      <ServiceGrid />
    </div>
  )
}
