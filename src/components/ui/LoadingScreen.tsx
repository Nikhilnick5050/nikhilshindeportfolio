import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Keyframe animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const ringPulse = keyframes`
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.02); }
`;

const textGlow = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.95; }
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  overflow: hidden;
`;

// Animated background particles
const ParticlesContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Particle = styled.div<{ $delay: number; $duration: number; $left: number; $size: number }>`
  position: absolute;
  bottom: -10px;
  left: ${props => props.$left}%;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: linear-gradient(135deg, #E5E7EB, #6B7280);
  border-radius: 50%;
  opacity: 0.15;
  animation: rise ${props => props.$duration}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  
  @keyframes rise {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0.15;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      transform: translateY(-100vh) scale(0);
      opacity: 0;
    }
  }
`;

const LogoContainer = styled(motion.div)`
  position: relative;
  animation: ${float} 2s ease-in-out infinite;
`;

const LogoWrapper = styled.div`
  width: 170px;
  height: 170px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GlowHalo = styled.div`
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.03) 55%, transparent 100%);
  filter: blur(8px);
  animation: ${ringPulse} 2.2s ease-in-out infinite;
`;

const LogoRing = styled.div<{ $size: number; $delay: number; $duration: number }>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-top-color: rgba(229, 231, 235, 0.95);
  border-right-color: rgba(229, 231, 235, 0.35);
  border-radius: 50%;
  animation: ${rotate} ${props => props.$duration}s linear infinite, ${ringPulse} 2.8s ease-in-out infinite;
  animation-delay: ${props => props.$delay * 0.2}s;
`;

const LogoImage = styled.img`
  width: 78px;
  height: 78px;
  border-radius: 18px;
  animation: ${pulse} 1.5s ease-in-out infinite;
  filter: drop-shadow(0 0 24px rgba(229, 231, 235, 0.5));
`;

const LoadingText = styled(motion.div)`
  margin-top: 34px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #c8d0de;
  letter-spacing: 0.55rem;
  text-transform: uppercase;
  font-family: 'Orbitron', sans-serif;
  animation: ${textGlow} 2s ease-in-out infinite;
`;

const ProgressContainer = styled.div`
  margin-top: 24px;
  width: 230px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #6B7280 0%, #E5E7EB 55%, #ffffff 100%);
  border-radius: 2px;
`;

interface LoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minDuration = 1800
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Faster progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 150);

    // Minimum display duration
    const timer = setTimeout(() => {
      setIsLoading(false);
      onComplete?.();
    }, minDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [minDuration, onComplete]);

  // Generate random particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 3,
    left: Math.random() * 100,
    size: 3 + Math.random() * 5,
  }));

  return (
    <AnimatePresence>
      {isLoading && (
        <LoadingOverlay
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.4, ease: "easeOut" }
          }}
        >
          <ParticlesContainer>
            {particles.map(p => (
              <Particle
                key={p.id}
                $delay={p.delay}
                $duration={p.duration}
                $left={p.left}
                $size={p.size}
              />
            ))}
          </ParticlesContainer>

          <LogoContainer
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
          >
            <LogoWrapper>
              <GlowHalo />
              <LogoRing $size={150} $delay={0} $duration={3.2} />
              <LogoRing $size={120} $delay={1} $duration={2.8} />
              <LogoRing $size={92} $delay={2} $duration={2.4} />
              <LogoImage src={`${process.env.PUBLIC_URL}/favicon.ico`} alt="Site icon" />
            </LogoWrapper>
          </LogoContainer>

          <LoadingText
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35, ease: 'easeOut' }}
          >
            LOADING
          </LoadingText>

          <ProgressContainer>
            <ProgressFill
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            />
          </ProgressContainer>
        </LoadingOverlay>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
