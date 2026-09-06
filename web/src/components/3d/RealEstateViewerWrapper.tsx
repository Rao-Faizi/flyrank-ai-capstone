'use client';

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import BuildingScene, { FLOORS } from './BuildingScene';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// A simple CSS-based fallback to show while the 3D canvas is loading
function SkeletonFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 text-zinc-400">
      <div className="w-16 h-16 border-4 border-zinc-700 border-t-zinc-300 rounded-full animate-spin mb-4" />
      <p className="font-medium">Loading 3D Experience...</p>
    </div>
  );
}

export default function RealEstateViewerWrapper() {
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Setup Leva controls
  const { materialStyle, wireframe, isNight, autoRotate, speed } = useControls({
    materialStyle: {
      label: 'Style',
      options: ['Modern Slate', 'Emerald Eco', 'Obsidian High-Tech'],
    },
    wireframe: { value: false, label: 'Wireframe' },
    isNight: { value: false, label: 'Night Mode' },
    autoRotate: { value: !prefersReducedMotion, label: 'Auto Rotate' },
    speed: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Rotate Speed' },
  });

  const selectedFloor = FLOORS.find(f => f.id === selectedFloorId);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-zinc-950 overflow-hidden">
      {/* Leva UI - specifically bound to not pollute global space if not needed, but floating top-right */}
      <div className="absolute top-4 right-4 z-10 shadow-2xl rounded-xl overflow-hidden">
        <Leva 
          fill 
          flat 
          titleBar={{ title: 'Building Configurator' }}
          theme={{
            colors: {
              elevation1: '#18181b', // zinc-900
              elevation2: '#27272a', // zinc-800
              elevation3: '#3f3f46', // zinc-700
              accent1: '#3b82f6', // blue-500
              accent2: '#2563eb', // blue-600
              accent3: '#1d4ed8', // blue-700
            },
          }} 
        />
      </div>

      {/* Contextual HUD for Selected Floor */}
      <AnimatePresence>
        {selectedFloor && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="absolute top-4 left-4 z-10 w-80 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 rounded-xl shadow-2xl p-6 text-zinc-100"
          >
            <h2 className="text-2xl font-semibold mb-1 text-white">{selectedFloor.name}</h2>
            <div className="inline-block px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              {selectedFloor.type}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-700/50">
                <span className="text-zinc-400">Total Area</span>
                <span className="font-mono font-medium">{selectedFloor.sqft} sq ft</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-700/50">
                <span className="text-zinc-400">Market Value</span>
                <span className="font-mono font-medium text-emerald-400">{selectedFloor.price}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-zinc-400">Lead Match Score</span>
                <span className="font-mono font-medium text-amber-400">Very High (92%)</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedFloorId(null)}
              className="mt-6 w-full py-2 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-lg text-sm font-medium"
            >
              Deselect Tier
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Suspense fallback={<SkeletonFallback />}>
        <Canvas
          shadows
          camera={{ position: [15, 10, 15], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          onPointerMissed={() => setSelectedFloorId(null)}
          // Touch action optimization for mobile
          style={{ touchAction: 'none' }}
        >
          {/* Background color based on day/night mode */}
          <color attach="background" args={[isNight ? '#09090b' : '#f4f4f5']} />
          
          {/* Main 3D Scene containing procedural geometry and physics */}
          <BuildingScene 
            selectedFloorId={selectedFloorId}
            onSelectFloor={setSelectedFloorId}
            materialStyle={materialStyle as any}
            wireframe={wireframe}
            isNight={isNight}
          />
          
          <OrbitControls 
            makeDefault 
            autoRotate={autoRotate && !prefersReducedMotion} 
            autoRotateSpeed={speed}
            enableDamping 
            dampingFactor={0.05}
            // Limit polar angle to prevent looking from below the ground plane
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={10}
            maxDistance={40}
          />
        </Canvas>
      </Suspense>
      
      {/* Small UI hint overlay at bottom */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-zinc-900/80 backdrop-blur border border-zinc-700 text-zinc-300 px-4 py-2 rounded-full text-sm shadow-lg">
          Click on any floor to view details
        </div>
      </div>
    </div>
  );
}
