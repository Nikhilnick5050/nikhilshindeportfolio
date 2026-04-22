import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

interface TrailDot {
    id: number;
    x: number;
    y: number;
}

const fadeOut = keyframes`
  0% {
    opacity: 0.6;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.3);
  }
`;

const TrailDotElement = styled.div<{ $x: number; $y: number; $delay: number }>`
  position: fixed;
  left: ${props => props.$x}px;
  top: ${props => props.$y}px;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #FFFFFF 0%, #A1A1AA 50%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  animation: ${fadeOut} 0.6s ease-out forwards;
  animation-delay: ${props => props.$delay}ms;
  transform: translate(-50%, -50%);
`;

const CursorTrail: React.FC = () => {
    const [trail, setTrail] = useState<TrailDot[]>([]);
    const [isVisible, setIsVisible] = useState(true);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const newDot: TrailDot = {
            id: Date.now() + Math.random(),
            x: e.clientX,
            y: e.clientY,
        };

        setTrail(prev => [...prev.slice(-12), newDot]);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsVisible(false);
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        // Throttle mouse move for performance
        let lastTime = 0;
        const throttleMs = 30;

        const throttledHandler = (e: MouseEvent) => {
            const now = Date.now();
            if (now - lastTime >= throttleMs) {
                lastTime = now;
                handleMouseMove(e);
            }
        };

        window.addEventListener('mousemove', throttledHandler);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', throttledHandler);
            document.removeEventListener('mouseleave', handleMouseLeave);
            document.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [handleMouseMove, handleMouseLeave, handleMouseEnter]);

    // Clean up old dots
    useEffect(() => {
        const cleanup = setInterval(() => {
            setTrail(prev => prev.filter(dot => Date.now() - dot.id < 600));
        }, 100);

        return () => clearInterval(cleanup);
    }, []);

    if (!isVisible) return null;

    return (
        <>
            {trail.map((dot, index) => (
                <TrailDotElement
                    key={dot.id}
                    $x={dot.x}
                    $y={dot.y}
                    $delay={index * 10}
                />
            ))}
        </>
    );
};

export default CursorTrail;
