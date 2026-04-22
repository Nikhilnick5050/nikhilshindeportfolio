import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Text, Html } from '@react-three/drei';
import { Group } from 'three';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  width: 400px;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}10, ${({ theme }) => theme.colors.accent}10);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 320px;
    height: 320px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 280px;
    height: 280px;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  &::after {
    content: '';
    width: 20px;
    height: 20px;
    margin-left: 10px;
    border: 2px solid ${({ theme }) => theme.colors.text.secondary}30;
    border-top: 2px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// 3D Loading component that works inside R3F Canvas
const LoadingFallback = () => {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <group>
      {/* 3D Loading spinner */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <torusGeometry args={[0.8, 0.2, 8, 20]} />
        <meshStandardMaterial color="#4a90e2" wireframe />
      </mesh>
      
      {/* HTML overlay for text */}
      <Html center>
        <div style={{ 
          color: '#666',
          fontSize: '14px',
          textAlign: 'center',
          fontFamily: 'Rajdhani, sans-serif',
          marginTop: '60px'
        }}>
          Loading Avatar...
        </div>
      </Html>
    </group>
  );
};

const ErrorFallback = () => (
  <Html center>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100px',
      flexDirection: 'column',
      color: '#666',
      fontFamily: 'Rajdhani, sans-serif',
      textAlign: 'center'
    }}>
      <div>Avatar Loading...</div>
      <div style={{ fontSize: '12px', marginTop: '8px' }}>
        Please wait while we load your 3D model
      </div>
    </div>
  </Html>
);

interface ReadyPlayerMeAvatarProps {
  mousePosition: { x: number; y: number };
}

// Ready Player Me Avatar Component
const ReadyPlayerMeAvatar: React.FC<ReadyPlayerMeAvatarProps> = ({ mousePosition }) => {
  const groupRef = useRef<Group>(null);
  const avatarRef = useRef<Group>(null);
  
  // Load the GLB model
  const { scene } = useGLTF('/assets/models/pratikmodel.glb');
  const { size } = useThree();
  
  // Convert mouse position to rotation values (more responsive)
  const targetRotationY = (mousePosition.x / size.width - 0.5) * 0.4;
  const targetRotationX = -(mousePosition.y / size.height - 0.5) * 0.25;

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth head/body rotation following mouse
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.08;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.08;
      
      // Subtle breathing/floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.03;
      
      // Slight head tilt for more natural movement
      if (avatarRef.current) {
        avatarRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
      }
    }
  });

  // Clone the scene to avoid modifying the original
  const clonedScene = scene.clone();
  
  return (
    <group ref={groupRef}>
      <group ref={avatarRef}>        <primitive 
          object={clonedScene}
          scale={[10,10,10]} // Current scale
          position={[0, 1.2, 0]} // Move UP to show head and upper body
          rotation={[0.05, 0, 0]} // Slight forward tilt for better angle
        />
      </group>
    </group>
  );
};

// Preload the model
useGLTF.preload('/assets/models/pratikmodel.glb');

const Avatar3D: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile for performance optimization
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    const handleMouseMove = (event: MouseEvent) => {
      // Only track mouse movement on desktop for better performance
      if (!isMobile) {
        setMousePosition({
          x: event.clientX,
          y: event.clientY,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [isMobile]);

  return (
    <CanvasContainer>      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }} // Move camera back to see more
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Optimized lighting setup for Ready Player Me models */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.2} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        {/* Key light for face illumination */}
        <directionalLight 
          position={[2, 5, 8]} 
          intensity={0.8} 
          color="#ffffff"
        />
        {/* Fill light to reduce harsh shadows */}
        <directionalLight 
          position={[-3, 2, 5]} 
          intensity={0.4} 
          color="#b8d4ff"
        />
        {/* Rim light for depth */}
        <pointLight position={[-5, 5, -5]} intensity={0.3} color="#ff9999" />
          {/* Ready Player Me Avatar with Suspense for loading */}
        <Suspense fallback={<LoadingFallback />}>
          <ReadyPlayerMeAvatar mousePosition={mousePosition} />
        </Suspense>
      </Canvas>
    </CanvasContainer>
  );
};

export default Avatar3D;
