import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ProgressBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 9999;
  background: transparent;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(
    90deg,
    #6B7280 0%,
    #E5E7EB 50%,
    #6B7280 100%
  );
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
  box-shadow: 0 0 8px rgba(229, 231, 235, 0.4),
              0 0 16px rgba(229, 231, 235, 0.2);
  transform-origin: left;
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const ScrollProgressBar: React.FC = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const updateScrollProgress = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY;
            const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', updateScrollProgress);
        updateScrollProgress(); // Initial call

        return () => window.removeEventListener('scroll', updateScrollProgress);
    }, []);

    return (
        <ProgressBarContainer>
            <ProgressBar
                style={{ width: `${scrollProgress}%` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
            />
        </ProgressBarContainer>
    );
};

export default ScrollProgressBar;
