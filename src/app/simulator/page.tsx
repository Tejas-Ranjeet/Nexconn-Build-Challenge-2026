'use client';

import React from 'react';
import { NexconnInteractiveSimulator } from '../../components/NexconnInteractiveSimulator';
import { useRouter } from 'next/navigation';

export default function SimulatorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-900">
      <NexconnInteractiveSimulator onClose={() => router.push('/')} />
    </div>
  );
}
