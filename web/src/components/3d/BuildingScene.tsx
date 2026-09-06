'use client';

import React, { useRef, useMemo } from 'react';
import { Environment, ContactShadows } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

export interface FloorData {
  id: string;
  name: string;
  type: string;
  sqft: string;
  price: string;
  yPos: number;
  height: number;
  depth: number;
  width: number;
}

export const FLOORS: FloorData[] = [
  { id: 'ground', name: 'Ground Lobby', type: 'Retail/Lobby', sqft: '5,000', price: 'N/A', yPos: 0, height: 1.5, width: 4.5, depth: 4.5 },
  { id: 'commercial1', name: 'Commercial L1', type: 'Office', sqft: '4,500', price: '$20M', yPos: 1.6, height: 1.2, width: 4, depth: 4 },
  { id: 'commercial2', name: 'Commercial L2', type: 'Office', sqft: '4,500', price: '$22M', yPos: 2.9, height: 1.2, width: 4, depth: 4 },
  { id: 'residential1', name: 'Residences L1', type: 'Luxury Condo', sqft: '3,000', price: '$15M', yPos: 4.2, height: 1.0, width: 3.5, depth: 3.5 },
  { id: 'residential2', name: 'Residences L2', type: 'Luxury Condo', sqft: '3,000', price: '$16M', yPos: 5.3, height: 1.0, width: 3.5, depth: 3.5 },
  { id: 'penthouse', name: 'Penthouse', type: 'Ultra Luxury', sqft: '6,000', price: '$40M', yPos: 6.4, height: 1.8, width: 3.2, depth: 3.2 },
];

interface BuildingSceneProps {
  selectedFloorId: string | null;
  onSelectFloor: (id: string | null) => void;
  materialStyle: 'Modern Slate' | 'Emerald Eco' | 'Obsidian High-Tech';
  wireframe: boolean;
  isNight: boolean;
}

// Internal component to handle per-floor animation logic
function FloorGroup({ floor, isSelected, selectedFloorId, onSelectFloor, materials, isNight, prefersReducedMotion }: any) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Calculate target Y position
  const selectedIndex = FLOORS.findIndex(f => f.id === selectedFloorId);
  const currentIndex = FLOORS.findIndex(f => f.id === floor.id);
  
  let targetY = floor.yPos;
  if (selectedFloorId) {
    if (currentIndex === selectedIndex) {
      targetY += 0.5;
    } else if (currentIndex > selectedIndex) {
      targetY += 2.0;
    }
  }

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    if (prefersReducedMotion) {
      groupRef.current.position.y = targetY;
    } else {
      // Smooth lerp to target position
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        1 - Math.exp(-10 * delta)
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, floor.yPos, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectFloor(isSelected ? null : floor.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      <mesh position={[0, floor.height / 2, 0]} castShadow receiveShadow material={materials.primary}>
        <boxGeometry args={[floor.width, floor.height, floor.depth]} />
      </mesh>

      <mesh position={[0, floor.height / 2, 0]} castShadow receiveShadow material={materials.glass}>
        <boxGeometry args={[floor.width + 0.1, floor.height * 0.8, floor.depth + 0.1]} />
      </mesh>

      <mesh position={[0, floor.height - 0.05, 0]} castShadow receiveShadow material={materials.accent}>
        <boxGeometry args={[floor.width + 0.2, 0.1, floor.depth + 0.2]} />
      </mesh>
      
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.max(floor.width, floor.depth) / 2 + 0.5, Math.max(floor.width, floor.depth) / 2 + 0.8, 32]} />
          <meshBasicMaterial color={isNight ? '#00ffcc' : '#ff3366'} side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

export default function BuildingScene({
  selectedFloorId,
  onSelectFloor,
  materialStyle,
  wireframe,
  isNight
}: BuildingSceneProps) {
  const prefersReducedMotion = useReducedMotion();
  const groupRef = useRef<THREE.Group>(null);

  const materials = useMemo(() => {
    switch (materialStyle) {
      case 'Emerald Eco':
        return {
          primary: new THREE.MeshStandardMaterial({ color: '#2d4c3b', roughness: 0.8, wireframe }),
          glass: new THREE.MeshPhysicalMaterial({ color: '#88ccaa', transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, wireframe }),
          accent: new THREE.MeshStandardMaterial({ color: '#8b5a2b', roughness: 0.9, wireframe })
        };
      case 'Obsidian High-Tech':
        return {
          primary: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.2, metalness: 0.8, wireframe }),
          glass: new THREE.MeshPhysicalMaterial({ color: '#333333', transmission: 0.95, opacity: 1, transparent: true, roughness: 0, metalness: 1, wireframe }),
          accent: new THREE.MeshStandardMaterial({ color: '#00ffcc', roughness: 0.1, emissive: '#00ffcc', emissiveIntensity: isNight ? 0.5 : 0.1, wireframe })
        };
      case 'Modern Slate':
      default:
        return {
          primary: new THREE.MeshStandardMaterial({ color: '#e0e0e0', roughness: 0.7, wireframe }),
          glass: new THREE.MeshPhysicalMaterial({ color: '#aaddff', transmission: 0.8, opacity: 1, transparent: true, roughness: 0.2, wireframe }),
          accent: new THREE.MeshStandardMaterial({ color: '#333333', roughness: 0.5, wireframe })
        };
    }
  }, [materialStyle, wireframe, isNight]);

  return (
    <group ref={groupRef} position={[0, -3.5, 0]}>
      <Environment preset={isNight ? 'night' : 'city'} />
      <ambientLight intensity={isNight ? 0.2 : 0.6} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={isNight ? 0.5 : 1.5} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />

      {FLOORS.map((floor) => (
        <FloorGroup
          key={floor.id}
          floor={floor}
          isSelected={selectedFloorId === floor.id}
          selectedFloorId={selectedFloorId}
          onSelectFloor={onSelectFloor}
          materials={materials}
          isNight={isNight}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}

      <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={isNight ? '#111111' : '#f0f0f0'} roughness={1} />
      </mesh>
    </group>
  );
}
