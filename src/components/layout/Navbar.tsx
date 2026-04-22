import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { IconWrapper } from '../../utils/IconWrapper';
import { Container } from '../ui/Layout';
import { scrollToSection, scrollToTop } from '../../utils/navigation';

interface NavbarProps {
  transparent?: boolean;
}

const HeaderWrapper = styled.header<{ $scrolled: boolean; $transparent?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.menu};
  background: ${({ $scrolled, $transparent, theme }) =>
    $scrolled || !$transparent
      ? 'rgba(0, 0, 0, 0.8)'
      : 'transparent'};
  box-shadow: ${({ $scrolled, theme }) =>
    $scrolled ? `0 5px 20px rgba(0, 0, 0, 0.5)` : 'none'};
  height: 80px;
  display: flex;
  align-items: center;
  transition: all ${({ theme }) => theme.animations.normal} ease;
  backdrop-filter: ${({ $scrolled }) =>
    $scrolled ? 'blur(15px)' : 'none'};
  border-bottom: ${({ $scrolled, theme }) =>
    $scrolled ? `1px solid ${theme.colors.primary}30` : 'none'};
`;

const Nav = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const Logo = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 2;
  padding: ${({ theme }) => theme.spacing.xs};
  
  img {
    height: 50px;
    width: auto;
    transition: transform ${({ theme }) => theme.animations.fast} ease;
    filter: drop-shadow(0 2px 8px rgba(0, 200, 255, 0.3));
  }
  
  &:hover img {
    transform: scale(1.05);
    filter: drop-shadow(0 4px 12px rgba(0, 200, 255, 0.5));
  }
    
  h1 {
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    margin: 0;
    background: ${({ theme }) => theme.colors.gradients.primary};
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 10px ${({ theme }) => theme.colors.primary}40;
    letter-spacing: 0.5px;
  }
  
  span {
    color: ${({ theme }) => theme.colors.accent};
    margin-left: 5px;
    text-shadow: 0 0 8px ${({ theme }) => theme.colors.accent}40;
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 2;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const NavLinks = styled.nav<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    top: 0;
    right: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
    width: 100%;
    height: 100vh;
    flex-direction: column;
    justify-content: center;
    background: ${({ theme }) => theme.colors.background.primary};
    transition: all ${({ theme }) => theme.animations.normal} ease;
    z-index: 1;
  }
`;

const NavItem = styled.div<{ isActive?: boolean }>`
  margin: 0 ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: ${({ theme }) => theme.spacing.md} 0;
  }
`;

const NavLink = styled.button<{ $isActive?: boolean; $isRouterLink?: boolean }>`
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : theme.colors.text.primary};
  font-weight: ${({ $isActive, theme }) =>
    $isActive ? theme.fontWeights.bold : theme.fontWeights.medium};
  text-decoration: none;
  position: relative;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  transition: all 0.3s ease;
  border-radius: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  
  &::after {
    content: '';
    position: absolute;
    left: 10%;
    bottom: 0;
    width: 80%;
    height: 2px;
    background: ${({ theme }) => theme.colors.gradients.primary};
    transform: scaleX(${({ $isActive }) => ($isActive ? 1 : 0)});
    transform-origin: bottom right;
    transition: transform ${({ theme }) => theme.animations.fast} ease-out;
    border-radius: 2px;
    box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary}50;
  }
  
  &:hover {
    background: ${({ theme, $isActive }) => 
      $isActive ? theme.colors.primary + '20' : 'rgba(255, 255, 255, 0.05)'};
    color: ${({ theme, $isActive }) => 
      $isActive ? theme.colors.primary : theme.colors.primary};
  }
  
  &:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  }
`;

const MobileNavVariants = {
  closed: {
    x: "100%",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 40
    }
  },
  open: {
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 40
    }
  }
};

const Navbar: React.FC<NavbarProps> = ({ transparent = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  // Handle navbar background changes on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle active section detection with Intersection Observer
  useEffect(() => {
    const sections = ['about', 'achievements', 'projects', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Trigger when section is 20% from top
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setActiveLink(sectionId);
        }
      });
      
      // Check if we're at the very top (home section)
      if (window.scrollY < 100) {
        setActiveLink('home');
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const closeMenu = () => setIsOpen(false);
  
  return (
    <HeaderWrapper $scrolled={scrolled} $transparent={transparent}>
      <Nav>        <Logo onClick={() => scrollToTop()}>
          <img src={`${process.env.PUBLIC_URL}/favicon.ico`} alt="Nikhil logo" style={{ height: "40px", objectFit: "contain" }} />
        </Logo>
          <MenuToggle onClick={toggleMenu}>
          {isOpen ? <IconWrapper icon={FaTimes} /> : <IconWrapper icon={FaBars} />}
        </MenuToggle>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={MobileNavVariants}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                background: 'rgba(5, 11, 31, 0.95)',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >              <NavLinks $isOpen={isOpen}>
                <NavItem>                  <NavLink 
                    $isActive={activeLink === 'home'} 
                    onClick={() => {
                      scrollToTop();
                      closeMenu();
                    }}
                  >
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink 
                    $isActive={activeLink === 'about'} 
                    onClick={() => {
                      scrollToSection('about');
                      closeMenu();
                    }}
                  >
                    About
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink 
                    $isActive={activeLink === 'achievements'} 
                    onClick={() => {
                      scrollToSection('achievements');
                      closeMenu();
                    }}
                  >
                    Achievements
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink 
                    $isActive={activeLink === 'projects'} 
                    onClick={() => {
                      scrollToSection('projects');
                      closeMenu();
                    }}
                  >
                    Projects
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink 
                    $isActive={activeLink === 'contact'} 
                    onClick={() => {
                      scrollToSection('contact');
                      closeMenu();
                    }}
                  >
                    Contact
                  </NavLink>
                </NavItem>
              </NavLinks>
            </motion.div>
          )}
        </AnimatePresence>        <NavLinks $isOpen={isOpen}>
          <NavItem>
            <NavLink 
              $isActive={activeLink === 'home'}
              onClick={() => scrollToTop()}
            >
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              $isActive={activeLink === 'about'}
              onClick={() => scrollToSection('about')}
            >
              About
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              $isActive={activeLink === 'achievements'}
              onClick={() => scrollToSection('achievements')}
            >
              Achievements
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              $isActive={activeLink === 'projects'}
              onClick={() => scrollToSection('projects')}
            >
              Projects
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink 
              $isActive={activeLink === 'contact'}
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </NavLink>
          </NavItem>
        </NavLinks>
      </Nav>
    </HeaderWrapper>
  );
};

export default Navbar;
