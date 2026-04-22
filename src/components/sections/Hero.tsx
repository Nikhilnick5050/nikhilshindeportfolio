import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Container, Flex } from '../ui/Layout';
import ButtonComponent from '../ui/Button';
import { profileData, contactData } from '../../utils/portfolioData';
import { FaArrowRight, FaLinkedin, FaGithub } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { IconWrapper } from '../../utils/IconWrapper';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { scrollToSection } from '../../utils/navigation';

// Cursor styling
const Cursor = styled.span`
  opacity: 1;
  animation: blink 1s infinite;
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const statements = [
  "I'm a Problem Solver",
  "I'm a Web Developer",
  "I'm a Critical Thinker",
  "I'm a Creative Solver",
  "I'm a Logic Solver",
  "I'm a Solution Finder",
  "I'm a Fixer",
  "I'm an Achiever",
  "I'm a Learner",
  "I'm an Innovator",
  "I'm a Game Changer",
  "I'm a Dream Builder",
  "I'm a Coder",
];

// Typing Effect Component
const TypingEffect: React.FC = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseTime = 2000;

  useEffect(() => {
    const currentTitle = statements[currentIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentTitle.length) {
          setCurrentText(currentTitle.slice(0, currentText.length + 1));
        } else {
          // Finished typing, start deleting after pause
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Finished deleting, move to next title
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % statements.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting]);

  return <span>{currentText}<Cursor>|</Cursor></span>;
};

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding-top: 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, ${({ theme }) => theme.colors.primary}10 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: auto;
    padding-top: 40px;
  }
`;

const HeroContent = styled(Container)`
  position: relative;
  z-index: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-left: ${({ theme }) => theme.spacing.md};
    padding-right: ${({ theme }) => theme.spacing.md};
  }
`;

const HeroFlex = styled(Flex)`
  min-height: 80vh;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.spacing.xl};
    padding: ${({ theme }) => theme.spacing.xl} 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: auto;
    padding: 0;
    gap: 0;
  }
`;

const LeftContent = styled.div`
  flex: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    text-align: center;
    padding: ${({ theme }) => theme.spacing.md} 0;
    margin-top: -20px;
  }
`;

const RightContent = styled.div`
  flex: 1;
  height: 550px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    height: 300px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 120px;
    margin: 0;
    padding: 0;
    position: relative;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1.1;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-shadow: 0 0 15px ${({ theme }) => theme.colors.primary}50;
  letter-spacing: -0.5px;
  white-space: nowrap;
  
  span {
    color: ${({ theme }) => theme.colors.primary};
    text-shadow: 0 0 15px ${({ theme }) => theme.colors.primary}70;
    position: relative;
    display: inline;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.8rem;
    line-height: 1.1;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    white-space: normal;
    
    span {
      display: inline;
    }
  }
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(${({ theme }) => theme.fontSizes.lg}, 2vw, ${({ theme }) => theme.fontSizes.xl});
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 600px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    line-height: 1.5;
  }
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
    margin-top: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const StyledButton = styled(ButtonComponent)`
  padding-left: ${({ theme }) => theme.spacing.lg};
  padding-right: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const SocialIcons = styled(motion.div)`
  display: flex;
  margin-top: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-top: ${({ theme }) => theme.spacing.md};
    justify-content: center; /* Center social icons on mobile */
    gap: ${({ theme }) => theme.spacing.lg}; /* Increase gap between icons */
  }
`;

const SocialIconLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.2rem;
  transition: all ${({ theme }) => theme.animations.normal} ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    transform: translateY(-5px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
`;


const ProfileImageWrapper = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: visible;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  
  img {
    max-width: 500px;
    width: auto;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.7));
    margin-top: -20px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    img {
      max-width: 220px;
      margin-top: 0;
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    position: relative;
    height: 180px;
    margin: 0;
    padding: 0;
    
    img {
      max-width: 200px;
      height: 200px;
      margin: -40px 0 0 0;
      object-fit: contain;
      filter: drop-shadow(0 8px 15px rgba(0, 0, 0, 0.5));
    }
  }
`;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    transform: scale(0.6);
    opacity: 0.6;
    height: 150px;
    pointer-events: none;
  }
`;

const Hero: React.FC = () => {
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Calculate mouse position relative to the window
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <HeroSection>
      <HeroContent>
        <HeroFlex>          <LeftContent>
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Hello
          </Title>

          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            I am <span>{profileData.name}</span>
          </Title>

          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TypingEffect />
          </Title>

          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {profileData.subtitle}
          </Subtitle>
          <ButtonContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <StyledButton
              variant="primary"
              size="large"
              onClick={() => scrollToSection('projects')}
            >
              View My Work <IconWrapper icon={FaArrowRight} style={{ marginLeft: '8px' }} />
            </StyledButton>

            <StyledButton
              variant="outline"
              size="large"
              onClick={() => scrollToSection('contact')}
            >
              Contact Me
            </StyledButton>
          </ButtonContainer>

          <SocialIcons
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {contactData.socialMedia.linkedin && (
              <SocialIconLink
                href={contactData.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
              >
                <IconWrapper icon={FaLinkedin} />
              </SocialIconLink>
            )}

            {contactData.socialMedia.github && (
              <SocialIconLink
                href={contactData.socialMedia.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
              >
                <IconWrapper icon={FaGithub} />
              </SocialIconLink>
            )}

            <SocialIconLink
              href={`mailto:${profileData.email}`}
              whileHover={{ y: -5 }}
            >
              <IconWrapper icon={MdEmail} />
            </SocialIconLink>
          </SocialIcons>

        </LeftContent>

          <RightContent>
            <CanvasContainer>              <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />                <Sphere args={[2.5, 100, 200]} scale={0.9}>
                <MeshDistortMaterial
                  color="#E5E7EB"
                  attach="material"
                  distort={0.4}
                  speed={1.2}
                  roughness={0.2}
                  metalness={0.8}
                />
              </Sphere>
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
            </Canvas>            </CanvasContainer>
            <ProfileImageWrapper
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="profile-image-wrapper"
            >
              <img
                src={profileData.image}
                alt={`${profileData.name} profile`}
                loading="eager"
              />
            </ProfileImageWrapper>
          </RightContent>
        </HeroFlex>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;
