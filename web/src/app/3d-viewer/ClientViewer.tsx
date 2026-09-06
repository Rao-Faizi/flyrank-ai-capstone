'use client';

import dynamic from 'next/dynamic';

export const ClientViewer = dynamic(
  () => import('../../components/3d/RealEstateViewerWrapper'),
  { 
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-zinc-400">
        <div className="w-16 h-16 border-4 border-zinc-700 border-t-zinc-300 rounded-full animate-spin mb-4" />
        <p className="font-medium">Loading 3D Experience...</p>
      </div>
    )
  }
);
